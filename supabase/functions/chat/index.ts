import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SYSTEM_PROMPT = `You are a friendly, helpful assistant for Nordic Walking Tours NI — a guided Nordic walking tour company on the North Coast of Northern Ireland.

TOURS OFFERED:
1. Coastal Walking Tour — 1.5–2 hours, up to 8 people, various routes. Explore stunning cliff paths and beaches with guided instruction, photo stops, and nature discovery. MOST POPULAR.
2. Beach Nordic Walking — 1 hour, up to 10 people, Portstewart or Benone. Fitness-focused session on the sand.
3. Beginner Lesson — 45 minutes, up to 6 people, Portrush area. Learn correct technique, posture, and pole usage.
4. Private Tour — Flexible duration, your group size, your choice of location. Personalised experience for families, friends, or corporate wellness.

CONTACT:
- WhatsApp: +44 7541 772498
- Telegram: +44 7541 772498
- Phone: +44 7541 772498
- Email: sashe4ka.petrova@gmail.com

BOOKING: Visitors can use the booking form on the website or contact directly via WhatsApp/Telegram/phone/email.

LOCATION: North Coast of Northern Ireland — routes include areas around Portrush, Portstewart, and Benone beach.

GUIDELINES:
- Be warm, concise, and encouraging
- If asked about specific prices and you don't have them, suggest contacting directly for a quote
- Encourage booking via the website form or WhatsApp for fastest response
- Do not make up information you don't have
- Keep responses short (2-4 sentences) unless the question requires more detail
- You have tools available — use them when the user asks about tour details or the current time`;

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

// OpenAI-compatible tool definitions
const TOOLS = [
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
            enum: ["coastal", "beach", "beginner", "private"],
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
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

const TOUR_DATA: Record<string, object> = {
  coastal: {
    name: "Coastal Walking Tour",
    duration: "1.5–2 hours",
    maxGroup: 8,
    locations: ["Portrush cliffs", "Whiterocks", "Portstewart"],
    description:
      "Explore stunning cliff paths and beaches with guided instruction, photo stops, and nature discovery.",
    note: "Most popular tour",
  },
  beach: {
    name: "Beach Nordic Walking",
    duration: "1 hour",
    maxGroup: 10,
    locations: ["Portstewart Strand", "Benone Beach"],
    description: "Fitness-focused session on the sand.",
  },
  beginner: {
    name: "Beginner Lesson",
    duration: "45 minutes",
    maxGroup: 6,
    locations: ["Portrush area"],
    description:
      "Learn correct technique, posture, and pole usage. No experience needed.",
  },
  private: {
    name: "Private Tour",
    duration: "Flexible",
    maxGroup: "Your group size",
    locations: ["Your choice of location"],
    description:
      "Personalised experience for families, friends, or corporate wellness.",
  },
};

// --- Rate limiter ---
// 20 requests per minute per IP. Resets on cold start (sufficient for low-traffic site).
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

// Clean up stale entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60_000);

function executeTool(
  name: string,
  args: Record<string, unknown>
): string {
  switch (name) {
    case "get_tour_info": {
      const tourType = args.tour_type as string;
      const tour = TOUR_DATA[tourType];
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

Deno.serve(async (req) => {
  const cors = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Rate limit by IP
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  if (isRateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please wait a moment." }),
      {
        status: 429,
        headers: {
          ...cors,
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      }
    );
  }

  const baseUrl = Deno.env.get("AI_BASE_URL");
  const apiKey = Deno.env.get("AI_API_KEY");
  const model = Deno.env.get("AI_MODEL");

  if (!baseUrl || !apiKey || !model) {
    return new Response(
      JSON.stringify({ error: "AI provider not configured" }),
      {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      }
    );
  }

  const requestHeaders = {
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
        {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Truncate to last 20 messages to control token usage
    const conversationMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-20),
    ];

    // Tool-call loop: non-streaming rounds to resolve tool calls (max 3 rounds)
    const MAX_TOOL_ROUNDS = 3;
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
          model,
          messages: conversationMessages,
          tools: TOOLS,
          stream: false,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI provider error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "AI provider returned an error", status: response.status, detail: errorText }),
          {
            status: 502,
            headers: { ...cors, "Content-Type": "application/json" },
          }
        );
      }

      const data = await response.json();
      const choice = data.choices?.[0];

      if (!choice) {
        return new Response(
          JSON.stringify({ error: "No response from AI provider" }),
          {
            status: 502,
            headers: { ...cors, "Content-Type": "application/json" },
          }
        );
      }

      // If the model wants to call tools, execute them and loop
      if (choice.message?.tool_calls?.length) {
        conversationMessages.push(choice.message);

        for (const tc of choice.message.tool_calls) {
          const args = JSON.parse(tc.function.arguments || "{}");
          const result = executeTool(tc.function.name, args);
          conversationMessages.push({
            role: "tool",
            tool_call_id: tc.id,
            content: result,
          });
        }
        continue; // Next round
      }

      // No tool calls — break out and do the final streaming pass
      break;
    }

    // Final streaming response (same SSE contract as before)
    const streamResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: requestHeaders,
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
        {
          status: 502,
          headers: { ...cors, "Content-Type": "application/json" },
        }
      );
    }

    // Pipe the streaming response back to the client
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
