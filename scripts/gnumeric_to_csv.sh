
#!/bin/bash
# convert .gnumeric to .csv

INPUT="../data/tracks-lofi.gnumeric"
OUTPUT="../data/tracks-lofi.csv"

ssconvert "$INPUT" "$OUTPUT"

INPUT="../data/tracks-synthwave.gnumeric"
OUTPUT="../data/tracks-synthwave.csv"

ssconvert "$INPUT" "$OUTPUT"


cd ..
npm run convert