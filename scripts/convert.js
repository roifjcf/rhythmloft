// 

/**
 * csv files to json
 * the output will be inside the public folder
 */


import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { TRACK_CATEGORIES } from "../src/utils/constant.js";


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

  const json = records
    .filter(track => track.url && track.url.trim() !== "") // filter out empty URLs
    .map(track => ({
      name: track.name,
      url: toRawUrl(track.url),
      source: track.source,
      authors: parseauthorsField(track.authors),
    }));

  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2));
  console.log(`Generated ${outputFile} with ${json.length} tracks.`);
}

// Convert each CSV to JSON
TRACK_CATEGORIES.forEach((name) => {
  csvToTrackJson(
    path.join(process.cwd(), "data", `tracks-${name}.csv`),
    path.join(process.cwd(), "public/trackinfo", `tracks-${name}.json`)
  );
});