import { NextResponse } from "next/server";
import capitalGainsData from "@/data/capital-gains-api.json";

export async function GET() {
  // Simulate minor server/network delay to showcase a premium skeleton loader
  await new Promise((resolve) => setTimeout(resolve, 600));
  return NextResponse.json(capitalGainsData);
}
