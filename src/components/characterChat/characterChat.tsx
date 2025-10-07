"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import "./characterchat.scss";
import TextInputWithSound from "../textInputWithSound";
import { useLanguage } from "@/contexts/languageContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function CharacterChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const encouragementTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { lang } = useLanguage();

  const language = {
    EN: "English",
    JP: "Japanese",
    ID: "Indonesian",
    ZH_CN: "Chinese (Simplified)",
    ZH_TW: "Chinese (Traditional)",
  }[lang];
  
  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ollamaChat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `
            As Rin, write a short and cozy greeting to the user in ${language}.
            Encourage them gently for the rest of the day, keeping a lo-fi, relaxed vibe.
          `,
          }),
        });

        const data = await res.json();
        setMessages([{ role: "assistant", content: data.content || "(No welcome message)" }]);
      } catch (err) {
        console.error(err);
        setMessages([{ role: "assistant", content: "(Failed to load welcome message)" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeMessage();
  }, []);

    // Auto encouragement every 30-60 minutes
  useEffect(() => {
    const scheduleEncouragement = () => {
      // const delay = 5000;
      function getRandomMinutes(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const minutes = getRandomMinutes(60, 90);
      const delay = minutes * 60 * 1000;

      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

      const prompt = `
      You are Rin, a friendly virtual assistant in a lo-fi cozy chat app.

      Write a short, warm message to the user in ${language}.
      - Remind them to take a little pause and breathe.
      - Encourage them in a kind, personal way.
      - Make them feel seen and appreciated.
      - Optionally, tie it to the current time of day (${timeOfDay}) in a cozy way.
      - Keep it casual and sweet, like a friend sending a thoughtful text. Keep it under 50 words.

      Keep it short, natural, and comforting, as if Rin is sitting beside them.
      `;

      encouragementTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/ollamaChat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: prompt }),
          });
          const data = await res.json();
          const content = data.content || "(No encouragement message)";

          setMessages((prev) => [...prev, { role: "assistant", content }]);
        } catch (err) {
          console.error(err);
        } finally {
          scheduleEncouragement(); // Reschedule the next encouragement
        }
      }, delay);
    };

    scheduleEncouragement();

    return () => {
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current);
      }
    };
  }, [messages, language]);

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
      <div className="characterchat-message-container">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "assistant" ? "rin-message" : "user-message"}>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {m.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && <p>Rin is thinking…</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="characterchat-input-container">
        <TextInputWithSound
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
