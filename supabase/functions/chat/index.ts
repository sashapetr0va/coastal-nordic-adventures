import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

// --- CORS ---
const ALLOWED_ORIGINS = [
  "https://nordicwalk.fit",
  "http://localhost:8080",
  "http://localhost:5173",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// --- Rate limiter ---
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT) {
    return true;
  }

  return false;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

// --- Knowledge cache (5-minute TTL) ---
interface KnowledgeCache {
  systemPrompt: string;
  tourData: Record<string, object>;
  toolEnum: string[];
  loadedAt: number;
}

let cache: KnowledgeCache | null = null;
const CACHE_TTL_MS = 5 * 60_000;

const SECTION_HEADINGS: Record<string, string> = {
  contact: "CONTACT",
  booking: "BOOKING",
  location: "LOCATION",
  guidelines: "GUIDELINES",
  faq: "FREQUENTLY ASKED QUESTIONS",
  policy: "POLICIES",
  what_to_bring: "WHAT TO BRING",
  about: "ABOUT THE INSTRUCTOR",
  pricing: "PRICING",
};

async function getKnowledge(): Promise<KnowledgeCache> {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) {
    return cache;
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const [toursRes, kbRes] = await Promise.all([
    supabase.from("tours").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("knowledge_base").select("*").eq("is_active", true).order("sort_order"),
  ]);

  if (toursRes.error) throw new Error(`Failed to load tours: ${toursRes.error.message}`);
  if (kbRes.error) throw new Error(`Failed to load knowledge: ${kbRes.error.message}`);

  const tours = toursRes.data;
  const kb = kbRes.data;

  // Build tour data map
  const tourData: Record<string, object> = {};
  const toolEnum: string[] = [];
  for (const t of tours) {
    tourData[t.id] = {
      name: t.name,
      duration: t.duration,
      maxGroup: t.max_group,
      locations: t.locations,
      description: t.description,
      ...(t.price ? { price: t.price } : {}),
      ...(t.note ? { note: t.note } : {}),
    };
    toolEnum.push(t.id);
  }

  // Build tours section of the prompt
  const tourLines = tours
    .map(
      (t, i) =>
        `${i + 1}. ${t.name} — ${t.duration}, up to ${t.max_group} people${t.locations?.length ? ", " + t.locations.join(", ") : ""}. ${t.description}${t.price ? " Price: " + t.price + "." : ""}${t.note ? " " + t.note.toUpperCase() + "." : ""}`
    )
    .join("\n");

  // Group knowledge base rows by category
  const grouped: Record<string, typeof kb> = {};
  for (const row of kb) {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push(row);
  }

  // Assemble the full system prompt
  let prompt = `You are a friendly, helpful assistant for Nordic Walking Tours NI — a guided Nordic walking tour company on the North Coast of Northern Ireland.\n\nTOURS OFFERED:\n${tourLines}`;

  for (const [category, rows] of Object.entries(grouped)) {
    const heading = SECTION_HEADINGS[category] || category.toUpperCase();
    const lines = rows.map((r) => `- ${r.title}: ${r.content}`).join("\n");
    prompt += `\n\n${heading}:\n${lines}`;
  }

  cache = { systemPrompt: prompt, tourData, toolEnum, loadedAt: Date.now() };
  return cache;
}

// --- Tool execution ---
function executeTool(
  name: string,
  args: Record<string, unknown>,
  tourData: Record<string, object>
): string {
  switch (name) {
    case "get_tour_info": {
      const tour = tourData[args.tour_type as string];
      if (!tour) return JSON.stringify({ error: "Unknown tour type" });
      return JSON.stringify(tour);
    }
    case "get_current_time": {
      return JSON.stringify({
        time: new Date().toLocaleString("en-GB", {
          timeZone: "Europe/London",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        timezone: "Europe/London",
      });
    }
    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

function buildTools(tourEnum: string[]) {
  return [
    {
      type: "function",
      function: {
        name: "get_tour_info",
        description:
          "Get details about a specific Nordic walking tour including duration, group size, and location",
        parameters: {
          type: "object",
          properties: {
            tour_type: {
              type: "string",
              enum: tourEnum,
              description: "The type of tour to look up",
            },
          },
          required: ["tour_type"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_current_time",
        description:
          "Get the current date and time in Northern Ireland (Europe/London timezone)",
        parameters: { type: "object", properties: {} },
      },
    },
  ];
}

// --- Main handler ---
Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Rate limit
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment." }),
      {
        status: 429,
        headers: { ...cors, "Content-Type": "application/json", "Retry-After": "60" },
      }
    );
  }

  const baseUrl = Deno.env.get("AI_BASE_URL");
  const apiKey = Deno.env.get("AI_API_KEY");
  const model = Deno.env.get("AI_MODEL");

  if (!baseUrl || !apiKey || !model) {
    return new Response(
      JSON.stringify({ error: "AI provider not configured" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }

  const aiHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://nordicwalk.fit",
    "X-Title": "Nordic Walking Tours NI",
  };

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    // Load knowledge from DB (cached 5 min)
    const knowledge = await getKnowledge();

    const conversationMessages = [
      { role: "system", content: knowledge.systemPrompt },
      ...messages.slice(-20),
    ];

    const tools = buildTools(knowledge.toolEnum);

    // Tool-call loop (max 3 rounds)
    const MAX_TOOL_ROUNDS = 3;
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: aiHeaders,
        body: JSON.stringify({
          model,
          messages: conversationMessages,
          tools,
          stream: false,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI provider error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "AI provider returned an error", status: response.status, detail: errorText }),
          { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];

      if (!choice) {
        return new Response(
          JSON.stringify({ error: "No response from AI provider" }),
          { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
        );
      }

      if (choice.message?.tool_calls?.length) {
        conversationMessages.push(choice.message);
        for (const tc of choice.message.tool_calls) {
          const args = JSON.parse(tc.function.arguments || "{}");
          const result = executeTool(tc.function.name, args, knowledge.tourData);
          conversationMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          });
        }
        continue;
      }

      break;
    }

    // Final streaming response
    const streamResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: aiHeaders,
      body: JSON.stringify({
        model,
        messages: conversationMessages,
        stream: true,
        max_tokens: 500,
      }),
    });

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error("AI provider error:", streamResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI provider returned an error" }),
        { status: 502, headers: { ...cors, "Content-Type": "application/json" } }
      );
    }

    return new Response(streamResponse.body, {
      headers: {
        ...cors,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
