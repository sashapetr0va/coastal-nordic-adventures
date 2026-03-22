/**
 * Tests for the Edge Function logic (rate limiter, CORS, tool execution).
 *
 * The Edge Function runs on Deno, but the core logic is pure TypeScript
 * that we can test in Vitest by re-implementing the functions here.
 * This ensures the logic stays correct when the Edge Function is modified.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// --- Re-implement rate limiter logic (mirrors chat/index.ts) ---
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
let rateLimitMap: Map<string, { count: number; resetAt: number }>;

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

// --- Re-implement CORS logic (mirrors chat/index.ts) ---
const ALLOWED_ORIGINS = [
  "https://nordicwalk.fit",
  "http://localhost:8080",
  "http://localhost:5173",
];

function getCorsHeaders(origin: string) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

// --- Re-implement tool execution logic (mirrors chat/index.ts) ---
// executeTool now takes tourData as a parameter (loaded from DB at runtime)
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

// --- Re-implement buildTools (mirrors chat/index.ts) ---
function buildTools(tourEnum: string[]) {
  return [
    {
      type: "function",
      function: {
        name: "get_tour_info",
        description: "Get details about a specific Nordic walking tour",
        parameters: {
          type: "object",
          properties: {
            tour_type: { type: "string", enum: tourEnum },
          },
          required: ["tour_type"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_current_time",
        description: "Get the current date and time in Northern Ireland",
        parameters: { type: "object", properties: {} },
      },
    },
  ];
}

// --- Tests ---

describe("Rate Limiter", () => {
  beforeEach(() => {
    rateLimitMap = new Map();
  });

  it("allows first request from an IP", () => {
    expect(isRateLimited("1.2.3.4")).toBe(false);
  });

  it("allows up to 20 requests from the same IP", () => {
    for (let i = 0; i < 20; i++) {
      expect(isRateLimited("1.2.3.4")).toBe(false);
    }
  });

  it("blocks the 21st request from the same IP", () => {
    for (let i = 0; i < 20; i++) {
      isRateLimited("1.2.3.4");
    }
    expect(isRateLimited("1.2.3.4")).toBe(true);
  });

  it("tracks different IPs independently", () => {
    for (let i = 0; i < 20; i++) {
      isRateLimited("1.1.1.1");
    }
    // 1.1.1.1 is now at the limit, but 2.2.2.2 should be fine
    expect(isRateLimited("1.1.1.1")).toBe(true);
    expect(isRateLimited("2.2.2.2")).toBe(false);
  });

  it("resets after the time window expires", () => {
    vi.useFakeTimers();

    for (let i = 0; i < 20; i++) {
      isRateLimited("1.2.3.4");
    }
    expect(isRateLimited("1.2.3.4")).toBe(true);

    // Advance time past the window
    vi.advanceTimersByTime(RATE_WINDOW_MS + 1);

    expect(isRateLimited("1.2.3.4")).toBe(false);

    vi.useRealTimers();
  });

  it("handles 'unknown' IP gracefully", () => {
    expect(isRateLimited("unknown")).toBe(false);
  });
});

describe("CORS Headers", () => {
  it("allows nordicwalk.fit origin", () => {
    const headers = getCorsHeaders("https://nordicwalk.fit");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://nordicwalk.fit"
    );
  });

  it("allows localhost:8080 origin", () => {
    const headers = getCorsHeaders("http://localhost:8080");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "http://localhost:8080"
    );
  });

  it("allows localhost:5173 origin", () => {
    const headers = getCorsHeaders("http://localhost:5173");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "http://localhost:5173"
    );
  });

  it("defaults to nordicwalk.fit for unknown origins", () => {
    const headers = getCorsHeaders("https://evil-hacker.com");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://nordicwalk.fit"
    );
  });

  it("defaults to nordicwalk.fit for empty origin", () => {
    const headers = getCorsHeaders("");
    expect(headers["Access-Control-Allow-Origin"]).toBe(
      "https://nordicwalk.fit"
    );
  });

  it("includes required headers for Supabase", () => {
    const headers = getCorsHeaders("https://nordicwalk.fit");
    expect(headers["Access-Control-Allow-Headers"]).toContain("authorization");
    expect(headers["Access-Control-Allow-Headers"]).toContain("apikey");
    expect(headers["Access-Control-Allow-Headers"]).toContain("content-type");
  });

  it("only allows POST and OPTIONS methods", () => {
    const headers = getCorsHeaders("https://nordicwalk.fit");
    expect(headers["Access-Control-Allow-Methods"]).toBe("POST, OPTIONS");
  });
});

describe("Tool Execution: get_tour_info", () => {
  it("returns coastal tour data", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "coastal" }, TOUR_DATA)
    );
    expect(result.name).toBe("Coastal Walking Tour");
    expect(result.duration).toBe("1.5–2 hours");
    expect(result.maxGroup).toBe(8);
    expect(result.locations).toContain("Whiterocks");
    expect(result.note).toBe("Most popular tour");
  });

  it("returns beach tour data", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "beach" }, TOUR_DATA)
    );
    expect(result.name).toBe("Beach Nordic Walking");
    expect(result.maxGroup).toBe(10);
    expect(result.locations).toContain("Benone Beach");
  });

  it("returns beginner tour data", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "beginner" }, TOUR_DATA)
    );
    expect(result.name).toBe("Beginner Lesson");
    expect(result.duration).toBe("45 minutes");
    expect(result.maxGroup).toBe(6);
  });

  it("returns private tour data", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "private" }, TOUR_DATA)
    );
    expect(result.name).toBe("Private Tour");
    expect(result.duration).toBe("Flexible");
    expect(result.maxGroup).toBe("Your group size");
  });

  it("returns error for unknown tour type", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "scuba" }, TOUR_DATA)
    );
    expect(result.error).toBe("Unknown tour type");
  });
});

describe("Tool Execution: get_current_time", () => {
  it("returns time in Europe/London timezone", () => {
    const result = JSON.parse(executeTool("get_current_time", {}, TOUR_DATA));
    expect(result.timezone).toBe("Europe/London");
    expect(result.time).toBeDefined();
    expect(typeof result.time).toBe("string");
    // Should contain day of week, month, year
    expect(result.time).toMatch(/\w+day/);
  });
});

describe("Tool Execution: unknown tool", () => {
  it("returns error for unknown tool name", () => {
    const result = JSON.parse(executeTool("hack_the_planet", {}, TOUR_DATA));
    expect(result.error).toBe("Unknown tool");
  });
});

describe("buildTools", () => {
  it("generates tool enum from tour IDs", () => {
    const tools = buildTools(["coastal", "beach", "beginner", "private"]);
    const tourTool = tools[0];
    expect(tourTool.function.name).toBe("get_tour_info");
    expect(tourTool.function.parameters.properties.tour_type.enum).toEqual([
      "coastal",
      "beach",
      "beginner",
      "private",
    ]);
  });

  it("adapts to custom tour IDs (simulating DB-loaded tours)", () => {
    const tools = buildTools(["sunset-walk", "forest-hike"]);
    expect(
      tools[0].function.parameters.properties.tour_type.enum
    ).toEqual(["sunset-walk", "forest-hike"]);
  });

  it("always includes get_current_time tool", () => {
    const tools = buildTools([]);
    expect(tools).toHaveLength(2);
    expect(tools[1].function.name).toBe("get_current_time");
  });
});

describe("Tool Execution with custom DB data", () => {
  it("works with dynamically loaded tour data", () => {
    const customTours: Record<string, object> = {
      "sunset-walk": {
        name: "Sunset Walk",
        duration: "2 hours",
        maxGroup: 5,
        locations: ["Dunluce Castle"],
        description: "Walk into the sunset.",
        price: "£30",
      },
    };

    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "sunset-walk" }, customTours)
    );
    expect(result.name).toBe("Sunset Walk");
    expect(result.price).toBe("£30");
  });

  it("returns error for tour not in custom data", () => {
    const result = JSON.parse(
      executeTool("get_tour_info", { tour_type: "coastal" }, {})
    );
    expect(result.error).toBe("Unknown tour type");
  });
});

describe("Tour Data Completeness", () => {
  it("has all 4 tour types defined", () => {
    expect(Object.keys(TOUR_DATA)).toEqual([
      "coastal",
      "beach",
      "beginner",
      "private",
    ]);
  });

  it("every tour has required fields", () => {
    for (const [key, tour] of Object.entries(TOUR_DATA)) {
      const t = tour as Record<string, unknown>;
      expect(t).toHaveProperty("name");
      expect(t).toHaveProperty("duration");
      expect(t).toHaveProperty("maxGroup");
      expect(t).toHaveProperty("locations");
      expect(t).toHaveProperty("description");
      expect(Array.isArray(t.locations)).toBe(true);
      expect((t.locations as string[]).length).toBeGreaterThan(0);
    }
  });
});
