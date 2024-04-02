window.addEventListener('load', () => console.log("Search Javascript Loaded"));

const movies = [

{
  title: "aaaaaaaainvnqeriqeijnidakj cwqd9-134-iuf13-iu13n-ifu13n4f-iun13i4nf1i3nf",
  releaseDate: "2030-10-11",
  rating: 10.1,
  banner: "images/show-more.webp",
  link: "#*"
}
];

let moviesPerPage = 36; // Number of movies to display per page
let currentPage = 1; // Current page number
const movieGrid = document.querySelector(".movie-grid");
const searchInput = document.querySelector("input[type='text']");
const sortSelect = document.querySelector("#sort");


// Sort movies alphabetically with numbers at the end
function sortMoviesAlphabetically() {
  movies.sort((a, b) => {
    if (isNumberStart(a.title) && !isNumberStart(b.title)) {
      return 1; // b comes before a
    } else if (!isNumberStart(a.title) && isNumberStart(b.title)) {
      return -1; // a comes before b
    } else {
      return a.title.localeCompare(b.title); // Sort alphabetically
    }
  });
}

// Check if a string starts with a number
function isNumberStart(title) {
  return /^\d/.test(title);
}

function displayMovies(movies, page) {
  movieGrid.innerHTML = "";
  const startIndex = (page - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;

  // Find the movie you want to display last
  const movieToDisplayLast = movies.find(movie => movie.title === "aaaaaaaainvnqeriqeijnidakj cwqd9-134-iuf13-iu13n-ifu13n4f-iun13i4nf1i3nf");

  // Create a new array without the movie to be displayed last
  const moviesWithoutLast = movies.filter(movie => movie !== movieToDisplayLast);

  const modifiedMovies = moviesWithoutLast.slice(startIndex, endIndex - 1); // Display all but the last movie
  modifiedMovies.push(movieToDisplayLast); // Add the chosen movie as the last one

  modifiedMovies.forEach(movie => {
    const movieBanner = document.createElement("a");
    movieBanner.href = movie.link;
    movieBanner.classList.add("movie-banner");
    movieBanner.style.backgroundImage = `url(${movie.banner})`;

    if (movie === movieToDisplayLast) {
      movieBanner.id = "loadMore"; // Set the id for the chosen movie
      movieBanner.addEventListener("click", () => {
        // Handle the "loadMore" click event here
        moviesPerPage += 18;
        console.log("18 more movies loaded");
        displayMovies(movies, currentPage);
      });
    }

    movieGrid.appendChild(movieBanner);
  });
}



function sortMovies(sortBy) {
  switch (sortBy) {
    case "title":
      sortMoviesAlphabetically();
      break;
    case "year":
      movies.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);

        if (dateA.getTime() === dateB.getTime()) {
          return a.title.localeCompare(b.title);
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
      break;
    case "release_date":
      movies.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);

        if (dateA.getTime() === dateB.getTime()) {
          return a.title.localeCompare(b.title);
        } else {
          return dateB.getTime() - dateA.getTime();
        }
      });
      break;
    case "rating":
      movies.sort((a, b) => {
        if (a.rating === b.rating) {
          return a.title.localeCompare(b.title);
        } else {
          return b.rating - a.rating;
        }
      });
      break;
    default:
      break;
  }
  displayMovies(movies, currentPage);
}


sortSelect.addEventListener("change", (event) => {
  const selectedSortOption = event.target.value;
  sortMovies(selectedSortOption); // Call the sorting function with the selected option
  filterMovies(searchInput.value); // Reapply the filter based on the current search term
});

function filterMovies(searchTerm) {
  const filteredMovies = movies.filter(movie => {
    return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  });
  displayMovies(filteredMovies, currentPage); // Display filtered movies on the current page
}

function initializePage() {
  sortMovies("release_date");
  displayMovies(movies, currentPage);
  filterMovies("");
}

window.addEventListener('load', initializePage);

searchInput.addEventListener("input", () => {
  filterMovies(searchInput.value);
});

sortSelect.addEventListener("change", () => {
  sortMovies(sortSelect.value);
});


