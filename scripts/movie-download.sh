#!/bin/bash


cd
cd $filepath
read -p "IMDb Code or link: " response
read -p "Enter M3U8 Link: " file_link
imdb_code=""
if [[ $response =~ ^https?://www.imdb.com/title/.* ]]; then
    imdb_code=$(echo "$response" | grep -oP '(?<=\/title\/)[^\/]+')
fi

if [[ -z $imdb_code ]]; then
    imdb_code=$response
fi

movie_info=$(curl -s "http://www.omdbapi.com/?i=${imdb_code}&apikey=${API_KEY}")
movie_title=$(echo "${movie_info}" | grep -oP '(?<="Title":")[^"]+')
movie_main_title=("${movie_title}")
movie_info=$(curl -s "http://www.omdbapi.com/?i=${imdb_code}&apikey=${API_KEY}")
imdb_rating=$(echo "${movie_info}" | grep -oP '(?<="imdbRating":")[^"]+')
release_year=$(echo "${movie_info}" | grep -oP '(?<="Released":")[^"]+' | grep -oP '[0-9]{4}')
release_date=$(echo "${movie_info}" | grep -oP '(?<="Released":")[^"]+')
rated=$(echo "${movie_info}" | grep -oP '(?<="Rated":")[^"]+')
director=$(echo "${movie_info}" | grep -oP '(?<="Director":")[^"]+')
actors=$(echo "${movie_info}" | grep -oP '(?<="Actors":")[^"]+')
genre=$(echo "${movie_info}" | grep -oP '(?<="Genre":")[^"]+')
poster=$(echo "${movie_info}" | grep -oP '(?<="Poster":")[^"]+')
plot=$(echo "${movie_info}" | grep -oP '(?<="Plot":")[^"]+')
movie_description=$(printf "%s" "${plot[@]}")
main_title=$(echo "$movie_main_title" | tr '[:upper:]' '[:lower:]' | tr -d "?:&'" | sed "s/&/and/g" | tr ' ' '-')
search_main_title=$(echo "$movie_main_title" | tr -d "?:&'" | sed "s/&/and/g")
echo ""
echo "IMDB Code: $imdb_code"
echo ""
echo "Title: $movie_main_title"
echo ""
echo "Movie Description: $movie_description"
echo ""
echo "Making Movie Directory"
mkdir $main_title
cd $main_title
echo "Making Content Directory"
mkdir content
if [ "$imdb_rating" = "N/A" ]; then
	    # Set IMDb rating using the curl command
	    echo "OMDB Rating Is Nul Extracting Rating From: https://www.imdb.com/title/${imdb_code}/ratings"
	        imdb_rating=$(curl -s -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" "https://www.imdb.com/title/${imdb_code}/ratings/" | grep -o '<span class="sc-5931bdee-1 gVydpF"[^>]*>.*<\/span>' | cut -c 36-38)
fi

download_poster_from_omdb() {
    local omdb_api_url="https://img.omdbapi.com/?i=$imdb_code&h=900&apikey=36971aec"
    
    # Attempt to download the poster using the API
    echo "Downloading Poster from Poster API ($omdb_api_url)"
    wget -q --show-progress "$omdb_api_url" -O content/poster.webp
    # Check if the download was unsuccessful
    if [ $? -ne 0 ]; then
        # Extract poster URL from movie_info using grep
        local poster=$(echo "${movie_info}" | grep -oP '(?<="Poster":")[^"]+')
        
        # Download the poster using the fallback URL
	echo "Poster API Failed, Downloading Poster from OMDB Profile ($poster)"
	wget -q --show-progress "$poster" -O content/poster.webp
    fi
}
echo ""
download_poster_from_omdb
search="$filepath/javascript/search-offline.js"
cd
cd $filepath
echo ""
echo "Copying Template Splash File"
cp $filepath/os-files/movie-viewer-template.html $filepath/movies/$main_title/splash.html
echo "Copying Template Video Player File"
cp $filepath/os-files/movie-template.html $filepath/movies/$main_title/content/main.html
cd $filepath/movies/$main_title/
echo "Copying Movie Description to Splash File"
sed -i '86s/.*/'"$movie_description"'/' "splash.html"
echo "Copying Tab Title to Splash File"
sed -i '14s/.*/'"$movie_main_title"'/' "splash.html"
echo "Copying Title to Splash File"
sed -i '70s/.*/'"$movie_main_title"'/' "splash.html"
echo "Copying Actors to Splash File"
sed -i '73s/.*/'"$actors"'/' "splash.html"
echo "Copying Director to Splash File"
sed -i '75s/.*/'"$director"'/' "splash.html"
echo "Copying Release Date to Splash File"
sed -i '77s/.*/'"$release_date"'/' "splash.html"
echo "Copying Genere to Splash File"
sed -i '79s/.*/'"$genre"'/' "splash.html"
echo "Copying IMDB Rating to Splash File"
sed -i '80s|.*|<br> IMDb Rating: <a class="imdb-link" style="text-decoration:none; color:white;" href="https://www.imdb.com/title/'"${imdb_code}"'" target="_blank" rel="noopener noreferrer">|' "splash.html"
sed -i '81s/.*/'"$imdb_rating"'/' "splash.html"
echo "Copying MPA Rating to Splash File"
sed -i '83s/.*/'"$rated"'/' "splash.html"
echo "Copying Video Filename into Video Player"
sed -i '26s/.*/        <source src="'"${main_title%.*}.mp4"'" type="video\/mp4"><\/source>/' content/main.html
echo "Copying Movie Title into Video Player"
sed -i '42s/.*/'"$movie_main_title"'/' content/main.html
formatted_date=$(date -d "$release_date" "+\"%Y-%m-%d\"")
echo "Appending code for search to $search..."
sed -i '4i\
{\
  title: "'"$search_main_title"'",\
  releaseDate: '"$formatted_date"',\
  rating: '"$imdb_rating"',\
  banner: "movies/'"$main_title"'/content/poster.webp",\
  link: "movies/'"$main_title"'/splash.html"\
},\
' "$search"
echo "Downloading Movie File..."
ffmpeg -loglevel quiet -user_agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36" -i "$file_link" -c copy -bsf:a aac_adtstoasc "$filepath/movies/$main_title/content/$main_title.mp4"

echo "Sucsess $movie_main_title has been imported to Cosmos+"
