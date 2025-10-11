import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";
import { roles } from "@/common/roles";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const message = body.message;
  const roleName = body.role || "rin";

  const role = roles[roleName];
  if (!role) return NextResponse.json({ error: "Invalid role" }, { status: 400 });

  try {
    const ollama = new Ollama({
      host: "https://ollama.com",
      headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
    });

    const response = await ollama.chat({
      model: "gpt-oss:120b",
      messages: [
        { role: "system", content: role.overview },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({ content: response.message?.content || "" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
