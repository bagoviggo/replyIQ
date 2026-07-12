import { NextRequest, NextResponse } from "next/server";
import { generateReply, generateDemoReply, GenerateReplyInput } from "@/lib/fireworks";

export async function POST(req: NextRequest) {
  const body: GenerateReplyInput = await req.json();

  // Use real Fireworks AI if key is set, otherwise demo mode
  const isDemoMode = !process.env.FIREWORKS_API_KEY;

  try {
    let reply: string;

    if (isDemoMode) {
      // Simulate a short delay for demo realism
      await new Promise((r) => setTimeout(r, 800));
      reply = generateDemoReply(body);
    } else {
      reply = await generateReply(body);
    }

    return NextResponse.json({
      reply,
      model: isDemoMode ? "demo-mode" : "gemma3-27b-it",
      amdPowered: !isDemoMode,
      provider: isDemoMode ? "demo" : "fireworks-ai",
    });
  } catch (err) {
    console.error("Generate reply error:", err);
    // Graceful fallback to demo mode if API fails
    const reply = generateDemoReply(body);
    return NextResponse.json({ reply, model: "fallback", amdPowered: false, provider: "fallback" });
  }
}
