import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Send } from "lucide-react";


const Chatbot: React.FC = () => {
  const location = useLocation();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getDomain = () => {
    if (location.pathname.startsWith("/healthcare")) return "healthcare";
    if (location.pathname.startsWith("/agriculture")) return "agriculture";
    if (location.pathname.startsWith("/environment")) return "environment";
    return "general";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch(`http://localhost:5000/api/chatbot/${getDomain()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMessage = { role: "bot", content: data.reply || "No response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "⚠️ Error connecting to chatbot server." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        {isOpen ? "Close Chat" : "Chat"}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-80 h-96 bg-white border border-gray-300 rounded-2xl shadow-xl flex flex-col mt-2"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white text-center p-2 rounded-t-2xl">
            AI Chatbot ({getDomain()})
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[75%] ${
                  msg.role === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-200 text-gray-900"
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex p-2 border-t border-gray-200">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 text-sm border rounded-lg outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              <Send size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Chatbot;
