import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock import.meta.env before importing the client
vi.stubEnv("VITE_SUPABASE_URL", "https://test-project.supabase.co");
vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "eyJ0ZXN0IjoidHJ1ZSJ9.test-key");

// Mock createClient so we don't make real requests
const mockFrom = vi.fn().mockReturnValue({
  select: vi.fn().mockReturnValue({
    limit: vi.fn().mockResolvedValue({ data: [], error: null }),
  }),
});
const mockFunctions = {
  invoke: vi.fn().mockResolvedValue({ data: null, error: null }),
};
const mockAuth = {
  getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
};
const mockClient = { from: mockFrom, functions: mockFunctions, auth: mockAuth };

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockClient),
}));

import { createClient } from "@supabase/supabase-js";

describe("Supabase client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes createClient with env vars", async () => {
    // Re-import to trigger module execution
    await import("./client");

    expect(createClient).toHaveBeenCalledWith(
      "https://test-project.supabase.co",
      "eyJ0ZXN0IjoidHJ1ZSJ9.test-key",
      expect.objectContaining({
        auth: expect.objectContaining({
          persistSession: true,
          autoRefreshToken: true,
        }),
      })
    );
  });

  it("can query a table without error", async () => {
    const { supabase } = await import("./client");

    const { error } = await supabase.from("any_table").select("*").limit(1);

    expect(error).toBeNull();
    expect(mockFrom).toHaveBeenCalledWith("any_table");
  });

  it("can invoke an edge function without error", async () => {
    const { supabase } = await import("./client");

    const { error } = await supabase.functions.invoke("chat", {
      body: { messages: [{ role: "user", content: "hello" }] },
    });

    expect(error).toBeNull();
    expect(mockFunctions.invoke).toHaveBeenCalledWith("chat", {
      body: { messages: [{ role: "user", content: "hello" }] },
    });
  });

  it("can check auth session without error", async () => {
    const { supabase } = await import("./client");

    const { error } = await supabase.auth.getSession();

    expect(error).toBeNull();
    expect(mockAuth.getSession).toHaveBeenCalled();
  });

  it("handles connection error gracefully", async () => {
    mockFrom.mockReturnValueOnce({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Failed to fetch", code: "NETWORK_ERROR" },
        }),
      }),
    });

    const { supabase } = await import("./client");
    const { data, error } = await supabase.from("test").select("*").limit(1);

    expect(data).toBeNull();
    expect(error).toEqual(
      expect.objectContaining({ message: "Failed to fetch" })
    );
  });
});
