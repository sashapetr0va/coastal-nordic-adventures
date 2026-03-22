import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChat } from "./useChat";

// Mock import.meta.env
vi.stubGlobal("import.meta", {
  env: {
    VITE_SUPABASE_URL: "https://test.supabase.co",
    VITE_SUPABASE_PUBLISHABLE_KEY: "test-key",
  },
});

describe("useChat", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("initializes with a welcome message", () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("assistant");
    expect(result.current.messages[0].content).toContain("Nordic walking tours");
    expect(result.current.isLoading).toBe(false);
  });

  it("adds user message when sendMessage is called", async () => {
    // Mock a streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"Hello!"}}]}\n\n')
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("What tours?");
    });

    // Should have welcome + user + assistant messages
    expect(result.current.messages).toHaveLength(3);
    expect(result.current.messages[1]).toEqual({
      role: "user",
      content: "What tours?",
    });
  });

  it("streams assistant response from SSE", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"We offer "}}]}\n\n')
        );
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"4 tours!"}}]}\n\n')
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("What tours?");
    });

    expect(result.current.messages[2].role).toBe("assistant");
    expect(result.current.messages[2].content).toBe("We offer 4 tours!");
    expect(result.current.isLoading).toBe(false);
  });

  it("sends correct request to Supabase Edge Function", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });
    globalThis.fetch = mockFetch;

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/functions/v1/chat"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
        body: expect.any(String),
      })
    );

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.messages).toEqual([{ role: "user", content: "Hello" }]);
  });

  it("handles fetch error gracefully", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    // Last message should be an error
    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.role).toBe("assistant");
    expect(lastMsg.content).toContain("trouble connecting");
    expect(result.current.isLoading).toBe(false);
  });

  it("handles network error gracefully", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.role).toBe("assistant");
    expect(lastMsg.content).toContain("trouble connecting");
  });

  it("clears chat and resets to welcome message", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"Hi!"}}]}\n\n')
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Hello");
    });

    expect(result.current.messages.length).toBeGreaterThan(1);

    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].role).toBe("assistant");
    expect(result.current.messages[0].content).toContain("Nordic walking tours");
    expect(result.current.isLoading).toBe(false);
  });

  it("trims whitespace from user input", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });
    globalThis.fetch = mockFetch;

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("  Hello world  ");
    });

    expect(result.current.messages[1].content).toBe("Hello world");
  });

  it("skips malformed SSE chunks without crashing", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("data: {not valid json}\n\n"));
        controller.enqueue(
          encoder.encode('data: {"choices":[{"delta":{"content":"OK"}}]}\n\n')
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: stream,
    });

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage("Test");
    });

    expect(result.current.messages[2].content).toBe("OK");
  });
});
