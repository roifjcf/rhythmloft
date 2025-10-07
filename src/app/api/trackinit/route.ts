// get the list of songs from the public folder

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET() {
  // CDN
  const jsonPathLofi = path.join(process.cwd(), 'public/trackinfo/tracks-lofi.json');
  const jsonPathSynthwave = path.join(process.cwd(), 'public/trackinfo/tracks-synthwave.json');
  let tracksLofi = [];
  let tracksSynthwave = [];
  try {
    let rawData = fs.readFileSync(jsonPathLofi, 'utf-8');
    tracksLofi = JSON.parse(rawData);
    rawData = fs.readFileSync(jsonPathSynthwave, 'utf-8');
    tracksSynthwave = JSON.parse(rawData);
  } catch (error) {
    console.error("Failed to read bgm.json:", error);
  }

  return NextResponse.json({
    "tracks-lofi": tracksLofi,
    "tracks-synthwave": tracksSynthwave,
  });
}