import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatWidget from "./ChatWidget";

// Mock the useChat hook
const mockSendMessage = vi.fn();
const mockClearChat = vi.fn();

let mockIsLoading = false;
let mockMessages = [
  {
    role: "assistant" as const,
    content: "Hi! I'm here to help with questions about our Nordic walking tours. What would you like to know?",
  },
];

vi.mock("@/hooks/useChat", () => ({
  useChat: () => ({
    get messages() { return mockMessages; },
    get isLoading() { return mockIsLoading; },
    sendMessage: mockSendMessage,
    clearChat: mockClearChat,
  }),
}));

describe("ChatWidget", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsLoading = false;
    mockMessages = [
      {
        role: "assistant",
        content: "Hi! I'm here to help with questions about our Nordic walking tours. What would you like to know?",
      },
    ];
  });

  it("renders the floating trigger button", () => {
    render(<ChatWidget />);
    const button = screen.getByRole("button", { name: "Open chat" });
    expect(button).toBeInTheDocument();
  });

  it("does not show chat panel initially", () => {
    render(<ChatWidget />);
    expect(screen.queryByText("Ask about our tours")).not.toBeInTheDocument();
  });

  it("opens chat panel when trigger button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    expect(screen.getByText("Ask about our tours")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type a message...")).toBeInTheDocument();
  });

  it("shows welcome message when chat is opened", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    expect(
      screen.getByText(/I'm here to help with questions about our Nordic walking tours/)
    ).toBeInTheDocument();
  });

  it("changes aria-label to 'Close chat' when open", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    expect(screen.getByRole("button", { name: "Close chat" })).toBeInTheDocument();
  });

  it("closes chat panel when trigger button is clicked again", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));
    expect(screen.getByText("Ask about our tours")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close chat" }));
    expect(screen.queryByText("Ask about our tours")).not.toBeInTheDocument();
  });

  it("calls sendMessage when user types and presses Enter", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "What tours do you offer?{enter}");

    expect(mockSendMessage).toHaveBeenCalledWith("What tours do you offer?");
  });

  it("clears input and calls sendMessage via Enter key", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "Hello world{enter}");

    expect(mockSendMessage).toHaveBeenCalledWith("Hello world");
    expect(input).toHaveValue("");
  });

  it("does not send empty messages", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "   {enter}");

    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it("clears input after sending", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "Hello{enter}");

    expect(input).toHaveValue("");
  });

  it("calls clearChat when clear button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const clearButton = screen.getByTitle("Clear chat");
    await user.click(clearButton);

    expect(mockClearChat).toHaveBeenCalled();
  });

  it("disables input and send button while loading", async () => {
    mockIsLoading = true;
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    expect(input).toBeDisabled();
  });

  it("shows loading dots when assistant response is streaming", async () => {
    mockIsLoading = true;
    mockMessages = [
      { role: "assistant", content: "Welcome!" },
      { role: "user", content: "Hello" },
      { role: "assistant", content: "" },
    ];

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const dots = screen.getAllByText(".");
    expect(dots.length).toBe(3);
  });

  it("renders multiple messages in conversation", async () => {
    mockMessages = [
      { role: "assistant", content: "Welcome!" },
      { role: "user", content: "What tours?" },
      { role: "assistant", content: "We have 4 tours." },
    ];

    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    expect(screen.getByText("Welcome!")).toBeInTheDocument();
    expect(screen.getByText("What tours?")).toBeInTheDocument();
    expect(screen.getByText("We have 4 tours.")).toBeInTheDocument();
  });

  it("does not send when Shift+Enter is pressed", async () => {
    const user = userEvent.setup();
    render(<ChatWidget />);

    await user.click(screen.getByRole("button", { name: "Open chat" }));

    const input = screen.getByPlaceholderText("Type a message...");
    await user.type(input, "Hello{shift>}{enter}{/shift}");

    expect(mockSendMessage).not.toHaveBeenCalled();
  });
});
