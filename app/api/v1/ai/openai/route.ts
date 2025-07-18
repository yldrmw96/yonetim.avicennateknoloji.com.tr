import { NextResponse } from 'next/server';
import { OpenAI } from "openai";
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateRequest {
  prompt: string;
  targetLang: string;
}

export async function POST(request: Request) {
  const { prompt, targetLang } = await request.json();

  try {
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: "Write a one-sentence bedtime story about a unicorn.",
    });

    return NextResponse.json({ result: "test" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}