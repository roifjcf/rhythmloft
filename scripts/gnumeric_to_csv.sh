#!/bin/bash
# Convert multiple .gnumeric files to .csv using ssconvert, with error handling

# Define base directory
DATA_DIR="../data"

# List of base filenames (without extension)
FILES=("tracks-lofi" "tracks-synthwave" "tracks-fantasy" "tracks-acoustic")

# Loop through the files and convert
for FILE in "${FILES[@]}"; do
    INPUT="$DATA_DIR/$FILE.gnumeric"
    OUTPUT="$DATA_DIR/$FILE.csv"

    if [[ -f "$INPUT" ]]; then
        echo "🔄 Converting $INPUT → $OUTPUT"
        if ssconvert "$INPUT" "$OUTPUT"; then
            echo "✅ Success: $OUTPUT created."
        else
            echo "❌ Error: Failed to convert $INPUT"
        fi
    else
        echo "⚠️ Warning: File not found → $INPUT"
    fi
done
