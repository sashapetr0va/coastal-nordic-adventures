interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-ocean text-white rounded-2xl rounded-br-sm"
            : "bg-sand text-foreground rounded-2xl rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
