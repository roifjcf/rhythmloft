"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import "./characterchat.scss";
import TextInputWithSound from "../textInputWithSound";
import { useLanguage } from "@/contexts/languageContext";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { chatMessage } from "@/common/type";

export default function CharacterChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<chatMessage[] | null>(null);
  

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
    const stored = localStorage.getItem("characterChatMessages");
    if (stored) setMessages(JSON.parse(stored));
    else setMessages([]);
  }, []);

  // save to localStorage on messages change
  useEffect(() => {
    if (messages === null) return; // don't save until loaded
    const last20 = messages.filter(m => !m.isAuto).slice(-20);
    localStorage.setItem("characterChatMessages", JSON.stringify(last20));
  }, [messages]);

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      setLoading(true);

      const stored = localStorage.getItem("characterChatMessages");
      const recentMessages = stored ? JSON.parse(stored).slice(-20) : [];

      if (recentMessages.length > 0) {
        setLoading(false);
        return;
      }

      const contextString = recentMessages
        .map((m: chatMessage) => `${m.role}: ${m.content}`)
        .join("\n");

      try {
        const res = await fetch("/api/ollamaChat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `
            As Rin, write a short and cozy greeting to the user in ${language}.
            Based on the recent conversation:
            ${contextString}
            Encourage them gently for the rest of the day, keeping a relaxed vibe.
          `,
          }),
        });

        const data = await res.json();
        setMessages(prev => [...(prev ?? []), { role: "assistant", content: data.content || "(No welcome message)" }]);
      } catch (err) {
        console.error(err);
        setMessages([{ role: "assistant", content: "(Failed to load welcome message)" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchWelcomeMessage();
  }, []);

  useEffect(() => {
    const scheduleEncouragement = () => {
      const recentMessages = (messages ?? []).slice(-20);
      const contextString = recentMessages.map(m => `${m.role}: ${m.content}`).join("\n");
      // const delay = 5000;
      function getRandomMinutes(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      const minutes = getRandomMinutes(60, 90);
      const delay = minutes * 60 * 1000;

      const hour = new Date().getHours();
      const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

      const prompt = `
      You are Rin, a friendly virtual assistant girlfriend in a cozy chat app.
      Based on the recent conversation:
      ${contextString}
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

          setMessages((prev) => [...(prev ?? []), { role: "assistant", content, isAuto: true }]);
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

    const newMessages = [...(messages ?? []), { role: "user", content: input }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    // Keep only the last 20 messages for context
    const recentMessages = newMessages.slice(-20);
    const contextString = recentMessages
      .map(m => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
    You are Rin, a cute and cozy AI girlfriend who loves relaxing music vibes.
    Based on the recent conversation:
    ${contextString}

    Write an affectionate reply in ${language}.
    Keep it warm, playful, and natural, like a girlfriend texting you. Use Markdown where appropriate.
    `;

    try {
      const res = await fetch("/api/ollamaChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json();
      const content = data.content || "(No response)";

      // typing effect
      let i = 0;
      const animate = () => {
        if (i <= content.length) {
          setMessages((prev) => {
            const updated = [...(prev ?? [])];
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
        const updated = [...(prev ?? [])];
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
        {(messages ?? []).map((m, i) => (
          <div
            key={i}
            className={
              m.role === "assistant"
                ? m.isAuto
                  ? "characterchat-message characterchat-auto-message"
                  : ""
                : "characterchat-message"
            }
          >
            <div className="message-role">{m.role === "assistant" ? "Rin" : "You"}</div>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {m.content}
            </ReactMarkdown>
          </div>
        ))}
        {loading && <p>Rin is thinking…</p>}
        {/* scroll to bottom */}
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
