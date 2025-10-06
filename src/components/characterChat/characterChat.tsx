"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import "./characterchat.scss";

export default function CharacterChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ollamaChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const content = data.content || "(No response)";

      // typing effect
      let i = 0;
      const animate = () => {
        if (i <= content.length) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: content.slice(0, i) };
            return updated;
          });
          i++;
          requestAnimationFrame(animate);
        }
      };
      animate();
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "(An error occurred)" };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    e.stopPropagation();
  };

  return (
    <div className="container-bg characterchat-container">
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i}>
            <span>{m.content}</span>
          </div>
        ))}
        {loading && <p>Rin is thinking…</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="characterchat-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Say something to Rin..."
          className="user-input"
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
