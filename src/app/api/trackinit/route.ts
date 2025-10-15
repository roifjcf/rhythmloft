// get the list of songs from the public folder

import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { TRACK_CATEGORIES } from "@/utils/constant";

export async function GET() {
  const result: Record<string, any[]> = {};

  for (const category of TRACK_CATEGORIES) {
    const jsonPath = path.join(process.cwd(), `public/trackinfo/tracks-${category}.json`);
    try {
      const rawData = fs.readFileSync(jsonPath, "utf-8");
      result[`tracks-${category}`] = JSON.parse(rawData);
    } catch (err) {
      console.error(`Failed to read tracks-${category}.json:`, err);
      result[`tracks-${category}`] = [];
    }
  }

  return NextResponse.json(result);
}
