import React, { useState } from "react";
import { Input } from "@/shadcn/ui/input";
import { Button } from "@/shadcn/ui/button";
import { ScrollArea } from "@/shadcn/ui/scroll-area";
import ChatMessage from "./ChatMessage";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
};

export function ChatSection({messages, setMessages, onCopy }: {messages:any,setMessages:any, onCopy: (text: string) => void }) {
  //const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input

    setLoading(true);

    try {
      //Send user message to the API
      const response = await fetch(
        "https://ikoncloud-dev.keross.com/aiagent/webhook/8c90dc69-2e60-4022-95dd-9bb8ecb72645",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chatinput: input }),
        }
      );

      const data = await response.json();
      console.log("chat response", data);

      // Mock API response
      // const data : any[] = [{
      //     output: "Hello! How can I help you?",
      // }];

      const botMessage: Message = {
        id: Date.now().toString(),
        role: "bot",
        content: data[0].output, // Use the API response
      };

      // Add bot response to the chat
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full">
      {/* Chat Messages */}
      <ScrollArea className="h-[750px] border rounded-lg p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.content}
              isBot={msg.role === "bot"}
              onCopy={onCopy}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={loading || !input.trim()}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
