import { NextResponse } from "next/server";
import { MOCK_REVIEWS, BUSINESSES } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({ reviews: MOCK_REVIEWS, businesses: BUSINESSES });
}
