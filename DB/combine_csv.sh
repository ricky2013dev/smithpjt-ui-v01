#!/bin/bash

# Output file
output_file="HIPAA_Transactions_Master.csv"

# Write header
echo "Table Name,Field,Type,Definition" > "$output_file"

# Process each CSV file in order
for file in [0-9]*.csv; do
  if [ -f "$file" ]; then
    # Extract table name from first line
    table_name=$(head -1 "$file" | sed 's/^Table Name: //')

    # Skip first 2 lines (table name and header) and process data rows
    tail -n +3 "$file" | while IFS= read -r line; do
      # Only process non-empty lines
      if [ -n "$line" ]; then
        echo "\"$table_name\",$line"
      fi
    done >> "$output_file"
  fi
done

echo "Master CSV created successfully: $output_file"
