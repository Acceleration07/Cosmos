window.addEventListener('load', () => console.log("Continue Watching Javascript Loaded"));

const movies = [
    {
        banner: localStorage.getItem('movie-poster1'),
        link: localStorage.getItem('episode-link1')
    },
    {
        banner: localStorage.getItem('movie-poster2'),
        link: localStorage.getItem('episode-link2')
    },
    {
        banner: localStorage.getItem('movie-poster3'),
        link: localStorage.getItem('episode-link3')
    },
    {
        banner: localStorage.getItem('movie-poster4'),
        link: localStorage.getItem('episode-link4')
    },
    {
        banner: localStorage.getItem('movie-poster5'),
        link: localStorage.getItem('episode-link5')
    },
    {
        banner: localStorage.getItem('movie-poster6'),
        link: localStorage.getItem('episode-link6')
    },
    {
        banner: localStorage.getItem('movie-poster7'),
        link: localStorage.getItem('episode-link7')
    },
    {
        banner: localStorage.getItem('movie-poster8'),
        link: localStorage.getItem('episode-link8')
    },
    {
        banner: localStorage.getItem('movie-poster9'),
        link: localStorage.getItem('episode-link9')
    },
];

const movieGrid = document.getElementById('movie-grid');

function displayBanners() {
    console.log("Updating Banners");
    movieGrid.innerHTML = "";
    movies.forEach((movie, index) => {
        if (movie.banner !== null && movie.link !== null) {
            const movieBanner = document.createElement("a");
            movieBanner.classList.add("movie-banner");
            movieBanner.style.backgroundImage = `url(${movie.banner})`;
            if (movie.link.includes("null")) {
                movieBanner.style.display = "none";
            } else {
                movieBanner.href = movie.link;
            }
            const closeButton = document.createElement("a");
            closeButton.innerHTML = "X";
            closeButton.classList.add("close-button");
            closeButton.href = '#'
            closeButton.addEventListener('click', () => removeBanner(index));
            movieBanner.appendChild(closeButton);
            movieGrid.appendChild(movieBanner);
        }
    });
}


function removeBanner(index) {
    movies.splice(index, 1);
    movies.push({ banner: null, link: null });
    movies.forEach((movie, i) => {
        localStorage.setItem(`episode-link${i + 1}`, movie.link);
        localStorage.setItem(`movie-poster${i + 1}`, movie.banner);
    });

    // Remove data for the last banner
    localStorage.removeItem(`episode-link${movies.length}`);
    localStorage.removeItem(`movie-poster${movies.length}`);

    // Update the displayed banners
    displayBanners();
}




function initializePage() {
    displayBanners();
}

window.addEventListener('load', initializePage);