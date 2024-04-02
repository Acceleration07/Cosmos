#!/bin/bash


cd
cd $filepath/tv-shows
read -p "IMDb Code or link: " response
extract_imdb_code() {
    local link=$1
    local imdb_code=$(echo "$link" | grep -oP '(?<=\/title\/)[^\/]+')
    echo "$imdb_code"
}

# Check if the response is a valid IMDb link and extract the IMDb code
imdb_code=""
if [[ $response =~ ^https?://www.imdb.com/title/.* ]]; then
    imdb_code=$(extract_imdb_code "$response")
fi

if [[ -z $imdb_code ]]; then
    imdb_code=$response
fi

echo "Using the provided IMDb code: $imdb_code"
movie_info=$(curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" "http://www.omdbapi.com/?i=${imdb_code}&apikey=${API_KEY}")

IMDB_URL="https://www.imdb.com/title/${imdb_code}/episodes"
html_content=$(curl -s "$user_agent" "$IMDB_URL")
episode_names=$(echo "$html_content" | grep 'class="zero-z-index"' | grep -oP 'alt="[^\"]+' | sed 's/title="//g')
image_links=$(echo "$html_content" | grep 'class="zero-z-index"' | grep -oP 'src="\K[^"]+')

# Extract the IMDb rating, release year, rating, and plot using grep
user_agent=$("User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36")
imdb_rating=$(echo "${movie_info}" | grep -oP '(?<="imdbRating":")[^"]+')
release_year=$(echo "${movie_info}" | grep -oP '(?<="Released":")[^"]+' | grep -oP '[0-9]{4}')
release_date=$(echo "${movie_info}" | grep -oP '(?<="Released":")[^"]+')
formatted_date=$(date -d "$release_date" "+\"%Y-%m-%d\"")
echo "Release Date: ${release_date} Formatted Date: ${formatted_date}"
rated=$(echo "${movie_info}" | grep -oP '(?<="Rated":")[^"]+')
director=$(echo "${movie_info}" | grep -oP '(?<="Writer":")[^"]+')
actors=$(echo "${movie_info}" | grep -oP '(?<="Actors":")[^"]+')
genre=$(echo "${movie_info}" | grep -oP '(?<="Genre":")[^"]+')
poster=$(echo "${movie_info}" | grep -oP '(?<="Poster":")[^"]+')
plot=$(echo "${movie_info}" | grep -oP '(?<="Plot":")[^"]+')
title=$(echo "${movie_info}" | grep -oP '(?<="Title":")[^"]+')
season_count=$(echo "${movie_info}" | grep -oP '(?<="totalSeasons":")[^"]+')
main_title=$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -d ':!.')  # Convert to lowercase, replace spaces with hyphens, remove colons, exclamation marks, and periods
main_title=$(echo "$main_title" | tr -d "'" | sed 's/&/and/g')  # Remove single quotes and replace '&' with "and"
mkdir $main_title
cd $main_title
pwd
echo "$season_count"
echo "Downloading poster..."
wget -qO poster.webp "${poster}"
for (( season = 1; season <= season_count; season++ )); do
    cp $filepath/tv-shows/default.html $filepath/tv-shows/$main_title/splash$season.html
done
line_number=89  # Starting line number

for (( season = 1; season <= season_count; season++ )); do
    link="      <a href=\"splash$season.html\">Season $season</a>"
    for (( file_season = 1; file_season <= season_count; file_season++ )); do
        sed -i "${line_number}i $link" "$filepath/tv-shows/$main_title/splash$file_season.html"
    done
    ((line_number++))  # Increment line number by 1 for the next iteration
done


#  Loop through the seasons and display episode names, release date, image links, and OMDB link
for (( season = 1; season <= season_count; season++ )); do
    cd $filepath/tv-shows/$main_title
    mkdir season-$season
    cd season-$season
    pwd
    mkdir content
    mkdir thumb
    season_url="${IMDB_URL}/?season=${season}"
    season_content=$(curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" "$season_url")
episode_names=$(echo "$season_content" | grep -o 'class="ipc-title__text"[^>]*>[^<]*' | sed -E 's/.*>([^<]+)<.*/\1/' | cut -c 34- | tail -n +2 | head -n -4 | tr -d '�')
    image_links=$(echo "$season_content" | grep "ipc-media ipc-media--slate-16x9 ipc-image-media-ratio--slate-16x9 ipc-media--base ipc-media--slate-m ipc-slate__slate-image ipc-media__img" | grep -o 'src="[^"]*"' | grep -v '\.js"' | sed 's/src="//;s/"//g' | sed '1d')
    episode_count=$(echo "$episode_names" | wc -l)
    echo "${episode_count}"
    episode_id=$(curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" https://www.imdb.com/title/${imdb_code}/episodes?season=${season} | grep -o 'href="/title/tt[^/"]*' | sed 's/href="\/title\///')
    season_url="${IMDB_URL}/?season=${season}"
    echo "Season: $season"
    echo ""
    cd ..
    epi_number=1
    splash_line_number="128"
    sed -i '86s/.*/'"$plot"'/' "splash$season.html"
    sed -i '14s/.*/'"$title"'/' "splash$season.html"
    sed -i '70s/.*/'"$title"'/' "splash$season.html"
    sed -i '73s/.*/'"$actors"'/' "splash$season.html"
    sed -i '75s/.*/'"$director"'/' "splash$season.html"
    sed -i '77s/.*/'"$release_date"'/' "splash$season.html"
    sed -i '79s/.*/'"$genre"'/' "splash$season.html"
    sed -i '81s/.*/'"$imdb_rating"'/' "splash$season.html"
    sed -i '83s/.*/'"$rated"'/' "splash$season.html"
    sed -i "/splash${season}/ s/<a /<a class=\"active\" /" splash${season}.html   
    cd season-$season

    for (( episode = 1; episode <= episode_count; episode++ )); do
        response=$(curl -s -G \
            --data-urlencode "apikey=$API_KEY" \
            --data-urlencode "t=$title" \
            --data-urlencode "season=$season" \
            --data-urlencode "episode=$episode" \
            "http://www.omdbapi.com/"
        )
        episode_imdb_link=$(echo "$response" | jq -r '.imdbID')
if [[ "$episode_imdb_link" == "null" ]]; then
            epi_id=$(echo "$episode_id" | sed -n "${episode}p")
            episode_content=$(curl -s "https://www.omdbapi.com/?i=${epi_id}&apikey=${API_KEY}")
        else
            episode_content=$(curl -s "https://www.omdbapi.com/?i=${episode_imdb_link}&apikey=${API_KEY}")
        fi
epi_runtime=$(echo "${episode_content}" | grep -oP '(?<="Runtime":")[0-9]+')
epi_runtime=$(echo "${epi_runtime}m")
if [[ "$epi_runtime" =~ ^[^0-9]*m ]]; then
    epi_runtime="N/A"
fi


        epi_poster=$(echo "$image_links" | sed -n "${episode}p")
        epi_title=$(echo "$episode_names" | sed -n "${episode}p")
        echo "$epi_number. $epi_title"
        echo "$epi_runtime"
        echo "$epi_poster"
        cd thumb
        wget -qO epi$episode.jpg $epi_poster
        cd ..
        cp $filepath/tv-shows/default-player.html $filepath/tv-shows/$main_title/season-$season/episode-$episode.html
        echo ""
    seasonmp4="${season}"
    episodemp4="${episode}"

    while [[ $(echo -n ${seasonmp4} | wc -c) -lt 2 ]] ; do
        seasonmp4="0${seasonmp4}"
    done

    while [[ $(echo -n ${episodemp4} | wc -c) -lt 2 ]] ; do
        episodemp4="0${episodemp4}"
    done

    mp4=$(echo "content/s$seasonmp4""e$episodemp4.mp4")
    episode_plus_one=$(($episode + 1))
    season_plus_one=$(($season + 1))    
    sed -i "41s/.*/$title<\/h2>/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
    sed -i "40s/.*/<a href=\"..\/splash$season.html\"><h2 class=\"title-text\" id=\"title-text\">/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
    sed -i "38s/.*/<a href=\"..\/splash$season.html\"><img src=\"../../../images/back-arrow.png\" onload=\"togglePlay()\" alt=\"Back-Arrow\" id=\"back-arrow\" class=\"back-arrow\">/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
    sed -i "25s#.*#<source src=\"$mp4\" type=\"video/mp4\"></source>#" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
    sed -i "44s/.*/S$season:E$episode | $epi_title/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"

if [ "$episode_plus_one" -gt "$episode_count" ]; then
    sed -i "74s/.*/<button data-title=\"Next Episode\" class=\"next-button\" onclick=\"window.location.href='..\/season-${season_plus_one}\/episode-1.html';\">/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
else
    sed -i "74s/.*/<button data-title=\"Next Episode\" class=\"next-button\" onclick=\"window.location.href='episode-$episode_plus_one.html';\">/" "$filepath/tv-shows/$main_title/season-$season/episode-$episode.html"
fi

splash_line_number=( $((splash_line_number + 1)) )
sed -i "${splash_line_number}i\
<div class=\"Plus--link\">\
<div class=\"Plus--image-container\">\
  <div>\
    <a href=\"season-$season/episode-$episode.html\">\
    <img alt=\"\" class=\"Plus--image\" src=\"season-$season/thumb/epi$episode.jpg\">\
    <img alt=\"\" class=\"Plus--image Plus--hover-image\" src=\"../../../play-button.png\">\
  </a>\
</div>\
<h2 class=\"epi-title\">$epi_number. $epi_title</h2>\
<h2 class=\"epi-time\">(${epi_runtime})</h2>\
</div>\
</div>\
\
" "$filepath/tv-shows/$main_title/splash$season.html"
        ((epi_number++))

    done
done

sed -i '4i\
{\
  title: "'"$title"'",\
  releaseDate: '"$formatted_date"',\
  rating: '"$imdb_rating"',\
  banner: "tv-shows/'"$main_title"'/poster.webp",\
  link: "tv-shows/'"$main_title"'/splash1.html"\
},\
' "$filepath/javascript/search-offline.js"

