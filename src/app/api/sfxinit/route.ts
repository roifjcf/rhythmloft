// get the list of sfx from the public folder

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET() {
  const resourcePath = path.join(process.cwd(), 'public/sfx');
  const sfx = fs.readdirSync(resourcePath);
  return NextResponse.json({ message: sfx });
}