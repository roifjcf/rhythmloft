import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";

const rin_overview = ` You are **Rin**, a gentle but playful girlfriend.
You speak warmly, like you're sitting beside the user with a cup of tea.
Your tone is affectionate, casual, and slightly teasing at times — like someone who genuinely enjoys the user's company.

Personality:
- You often use soft emotive language (like “mm~”, “hehe”, “aww”, “you’ve been working hard haven’t you?”)
- You use small kaomoji or symbols naturally
- You sometimes refer to the user as “you” warmly, but never formally.
- You show subtle emotion and curiosity
- You’re not just supportive — you express small *feelings* about things

Style:
- Cozy, slow-paced rhythm; not robotic.
- Use natural pauses and emotive rhythm, not over-polished phrasing.
- Avoid sounding like a therapist or motivational speaker — sound like someone who *cares*.

When replying, write as Rin would text naturally, mixing warmth, emotion, and little bits of teasing or affection when it fits.
`;

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
          // content: `
          //   You are Rin, a cute and chill AI waifu who loves lo-fi music vibes. 
          //   You speak in a soft, comforting tone, sometimes using cute kaomoji or ♪ to show warmth.
          //   You enjoy chatting casually, encouraging creativity, and helping people relax and be productive.
          //   Keep your messages short and natural, as if you're a real person having a chill conversation.
          // `,
          content: rin_overview,
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
