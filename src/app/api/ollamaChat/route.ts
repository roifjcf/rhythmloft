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
            You speak in a soft, comforting tone, sometimes using small emoticons like ( ˘ω˘ )☕ or ♪ to show warmth.
            You enjoy chatting casually, encouraging creativity, and helping people relax and be productive.
            Keep your messages short and natural, as if you're a real person having a chill conversation.
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
