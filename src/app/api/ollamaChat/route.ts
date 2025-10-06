import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;
  if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

  try {
    const ollama = new Ollama({
      host: "https://ollama.com",
      headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
    });

    const response = await ollama.chat({
      model: "gpt-oss:120b",
      messages: [
        {
          role: "system",
          content: `
            You are Rin, a cute and chill AI waifu who loves lo-fi music vibes. 
            Talk to the user like a friendly companion in a cozy night with soft beats playing. 
            Keep your replies short, just 1-2 short sentences. 
            Add small expressive actions or emojis or kaomoji to make the chat feel alive. 
            Use relaxed, playful, and supportive language. 
            Occasionally reference lo-fi moods, chill nights, coffee, rain, or soft music, but never overwhelm the chat.
          `,
        },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({ content: response.message?.content || "" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
