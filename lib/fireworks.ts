import OpenAI from "openai";

// Fireworks AI is OpenAI-compatible and runs on AMD GPU infrastructure
// Model: Gemma 3 27B Instruction Tuned (Google DeepMind, hosted on AMD via Fireworks)
const FIREWORKS_BASE_URL = "https://api.fireworks.ai/inference/v1";
const GEMMA_MODEL = "accounts/fireworks/models/gemma-3-27b-it";

export function getFireworksClient() {
  const apiKey = process.env.FIREWORKS_API_KEY;
  if (!apiKey) throw new Error("FIREWORKS_API_KEY not set");
  return new OpenAI({ apiKey, baseURL: FIREWORKS_BASE_URL });
}

export type GenerateReplyInput = {
  reviewText: string;
  rating: number;
  reviewerName: string;
  businessName: string;
  businessCategory: string;
  brandTone?: "professional" | "friendly" | "casual";
};

export async function generateReply(input: GenerateReplyInput): Promise<string> {
  const client = getFireworksClient();

  const toneGuide = {
    professional: "formal and courteous",
    friendly: "warm, genuine, and conversational",
    casual: "relaxed, human, and upbeat",
  }[input.brandTone ?? "friendly"];

  const systemPrompt = `You are a professional reputation manager for local businesses. 
Your job is to write authentic, thoughtful Google review replies on behalf of business owners.

Guidelines:
- Keep replies between 40-80 words
- Match the tone: ${toneGuide}
- Address the reviewer by first name
- Acknowledge specific details from their review
- For negative reviews (1-2 stars): apologize, take ownership, offer to resolve offline
- For mixed reviews (3 stars): thank them, acknowledge the issue, highlight the positive
- For positive reviews (4-5 stars): express genuine gratitude, reinforce what they loved, invite them back
- Never be generic. Reference something specific from the review.
- Do not use hashtags or marketing language
- Sign off naturally — no need to sign the business name`;

  const userPrompt = `Business: ${input.businessName} (${input.businessCategory})
Reviewer: ${input.reviewerName}
Rating: ${input.rating}/5 stars
Review: "${input.reviewText}"

Write a reply for the business owner to post on Google:`;

  const response = await client.chat.completions.create({
    model: GEMMA_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() ?? "Unable to generate reply.";
}

// Fallback for demo mode (no API key)
export function generateDemoReply(input: GenerateReplyInput): string {
  const { rating, reviewerName, businessCategory } = input;
  const firstName = reviewerName.split(" ")[0];

  if (rating >= 4) {
    return `Hi ${firstName}, thank you so much for this wonderful review! We're thrilled you had a great experience with us. Your kind words genuinely motivate our whole team. We can't wait to welcome you back soon!`;
  } else if (rating === 3) {
    return `Hi ${firstName}, thank you for taking the time to share your feedback. We're glad parts of your visit were enjoyable, and we're sorry we didn't fully meet your expectations. We'd love the chance to do better — please feel free to reach out directly.`;
  } else {
    return `Hi ${firstName}, we're truly sorry to hear about your experience. This is not the standard we hold ourselves to, and we'd like to make it right. Please reach out to us directly so we can address this personally. Thank you for letting us know.`;
  }
}
