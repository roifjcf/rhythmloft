
#!/bin/bash
# convert .gnumeric to .csv

INPUT="../data/tracks-lofi.gnumeric"
OUTPUT="../data/tracks-lofi.csv"

ssconvert "$INPUT" "$OUTPUT"