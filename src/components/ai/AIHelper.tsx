"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Send, Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIHelperProps {
  className?: string;
}

export function AIHelper({ className }: AIHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiName, setAiName] = useState("EduAssistant");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch AI name from settings
  useEffect(() => {
    fetch("/api/settings/ai-name")
      .then((r) => r.json())
      .then((data) => setAiName(data.aiName || "EduAssistant"))
      .catch(() => setAiName("EduAssistant"));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const error = await response.json();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: error.error || "Sorry, I encountered an error. Please try again.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button (Floating) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all",
            className
          )}
          title={`Open ${aiName}`}
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-full max-w-md h-96 flex flex-col shadow-2xl bg-white rounded-lg z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{aiName}</h3>
              <p className="text-sm text-blue-100">AI Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-700 rounded transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-2">
                  <p className="text-gray-600 font-medium">Welcome to {aiName}!</p>
                  <p className="text-sm text-gray-500">
                    I'm your intelligent assistant for EduManage. I can help you with:
                    <br />• 💬 <strong>Basic conversation</strong> - Just chat with me!
                    <br />• 💻 <strong>Programming</strong> - JavaScript, Python, Java, React
                    <br />• 🌐 <strong>Web Development</strong> - HTML, CSS, forms, buttons
                    <br />• 📊 <strong>Office Tools</strong> - Word, Excel, PowerPoint
                    <br />• 🏫 <strong>EduManage System</strong> - Complete platform guidance
                    <br />• 📚 <strong>Enrollment, grades, attendance, fees</strong>
                    <br />• 👥 <strong>User accounts, courses, programs</strong>
                    <br />• 📅 <strong>Timetables, projects, certificates</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Ask me anything about the system or say hello to start a conversation!
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs px-3 py-2 rounded-lg text-sm",
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
