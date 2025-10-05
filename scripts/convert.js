// 

/**
 * csv files to json
 * the output will be inside the public folder
 */


import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

function toRawUrl(url) {
  return url.replace("github.com", "raw.githubusercontent.com")
            .replace("/blob/", "/");
}

function parseauthorsField(str) {
  if (!str) return [];
  return str
    .replace(/^"|"$/g, "")
    .split(/[,;]+/)
    .map(v => v.trim().replace(/^"|"$/g, ""))
}


// CSV -> JSON for tracks
function csvToTrackJson(inputFile, outputFile) {
  const csv = fs.readFileSync(inputFile, "utf-8");
  const records = parse(csv, { columns: true, skip_empty_lines: true });

  const json = records.map(track => ({
    name: track.name,
    url: track.url ? toRawUrl(track.url) : "",
    source: track.source,
    authors: parseauthorsField(track.authors),
  }));

  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
  console.log(`Generated ${outputFile} with ${json.length} tracks.`);
}

// Tracks
csvToTrackJson(
  path.join(process.cwd(), "data", "tracks-lofi.csv"),
  path.join(process.cwd(), "public/trackinfo", "tracks-lofi.json")
);
csvToTrackJson(
  path.join(process.cwd(), "data", "tracks-synthwave.csv"),
  path.join(process.cwd(), "public/trackinfo", "tracks-synthwave.json")
);