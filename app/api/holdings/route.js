import { NextResponse } from "next/server";
import holdingsData from "@/data/holdings-api.json";

export async function GET() {
  // Simulate minor server/network delay to showcase a premium skeleton loader
  await new Promise((resolve) => setTimeout(resolve, 800));
  return NextResponse.json(holdingsData);
}
