// get the list of songs from the public folder

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET() {
  // CDN
  let jsonPath = path.join(process.cwd(), 'public/trackinfo/tracks-lofi.json');
  let tracksLofi = [];
  try {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    tracksLofi = JSON.parse(rawData);
  } catch (error) {
    console.error("Failed to read bgm.json:", error);
  }

  // return NextResponse.json({ message: 'Hello from Next.js!' });
  // console.log(tracksRemix);
  return NextResponse.json({ "tracks-lofi": tracksLofi });
}

// export default function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseData>
// ) {
//   // const resourcePath = path.join(process.cwd(), 'public/bgm');
//   // const tracksRemix = fs.readdirSync(resourcePath);
//   res.status(200).json({ message: 'Hello from Next.js!' })
// }