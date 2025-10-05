import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { OpenAI } from "openai";
import "./characterchat.scss";

export default function CharacterChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: "You are Rin — a gentle, clever AI who responds in a relaxed and natural tone.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [assistantFull, setAssistantFull] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const client = new OpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.NEXT_PUBLIC_HF_TOKEN,
    dangerouslyAllowBrowser: true,
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    setAssistantFull("");

    try {
      const stream = await client.chat.completions.stream({
        model: "meta-llama/Llama-3.2-1B-Instruct:novita",
        messages: [...newMessages, { role: "assistant", content: "" }].map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        temperature: 0.8,
        max_tokens: 200,
      });

      let fullText = "";

      for await (const event of stream) {
        const delta = event.choices?.[0]?.delta?.content;
        if (delta) {
          fullText += delta;
          setAssistantFull(fullText);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "(An error occurred, please try again later.)",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!assistantFull) return;
    let i = 0;

    const animate = () => {
      if (i <= assistantFull.length) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantFull.slice(0, i) };
          return updated;
        });
        i++;
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [assistantFull]);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container-bg characterchat-container">
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        {messages
          .filter((m) => m.role !== "system")
          .map((m, i) => (
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
