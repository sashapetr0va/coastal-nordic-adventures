import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatMessage from "./ChatMessage";

describe("ChatMessage", () => {
  it("renders user message with correct alignment", () => {
    render(<ChatMessage role="user" content="Hello there" />);
    const bubble = screen.getByText("Hello there");
    expect(bubble).toBeInTheDocument();
    expect(bubble.closest("div.flex")).toHaveClass("justify-end");
  });

  it("renders assistant message with correct alignment", () => {
    render(<ChatMessage role="assistant" content="Hi! How can I help?" />);
    const bubble = screen.getByText("Hi! How can I help?");
    expect(bubble).toBeInTheDocument();
    expect(bubble.closest("div.flex")).toHaveClass("justify-start");
  });

  it("applies ocean styling to user messages", () => {
    render(<ChatMessage role="user" content="Test" />);
    const bubble = screen.getByText("Test");
    expect(bubble).toHaveClass("bg-ocean", "text-white");
  });

  it("applies sand styling to assistant messages", () => {
    render(<ChatMessage role="assistant" content="Test" />);
    const bubble = screen.getByText("Test");
    expect(bubble).toHaveClass("bg-sand", "text-foreground");
  });

  it("applies whitespace-pre-wrap class for multiline content", () => {
    const { container } = render(
      <ChatMessage role="assistant" content={"Line 1\nLine 2"} />
    );
    const bubble = container.querySelector(".whitespace-pre-wrap");
    expect(bubble).toBeInTheDocument();
    expect(bubble?.textContent).toBe("Line 1\nLine 2");
  });
});
