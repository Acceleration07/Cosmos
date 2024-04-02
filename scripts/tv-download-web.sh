#!/bin/bash

read -p "Enter the season number: " -e seasonmp4
read -p "Enter the starting episode number: " -e start_episode
read -e -p "Enter the file path for the text file containing MP4 links: " txt_file
read -e -p "Enter the folder path to download the MP4s: " download_folder

# Set the episode number to the starting episode
episodemp4="$start_episode"

# Create a temporary directory for storing temporary files
temp_dir=$(mktemp -d)

# Read each line in the text file, create temporary files, and download the MP4
while IFS= read -r url; do
  if [ -z "$url" ]; then
    continue # Skip empty lines
  fi

  if [ "$seasonmp4" -eq "$seasonmp4" ] && [ "$episodemp4" -ge "$start_episode" ]; then
    # Pad season and episode numbers with leading zeros
    season_formatted=$(printf "%02d" "$seasonmp4")
    episode_formatted=$(printf "%02d" "$episodemp4")

    filename="${download_folder}s${season_formatted}e${episode_formatted}.mp4"
    progress_file="$temp_dir/${season_formatted}x${episode_formatted}.txt"

    # Download the MP4 using youtube-dl and use season and episode number in the filename
    ffmpeg -i "$url" -c copy -bsf:a aac_adtstoasc -y "$filename" > "$progress_file" &

    episodemp4=$((episodemp4 + 1))
  fi
done <"$txt_file"

# Wait for all background ffmpeg processes to finish
wait

# Clean up temporary directory
rm -r "$temp_dir"
