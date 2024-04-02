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
            movieBanner.href = movie.link;
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
    for (let i = index; i < movies.length - 1; i++) {
        movies[i] = movies[i + 1];
        localStorage.setItem(`episode-link${i + 1}`, localStorage.getItem(`episode-link${i + 2}`));
        localStorage.setItem(`episode-playtime${i + 1}`, localStorage.getItem(`episode-playtime${i + 2}`));
        localStorage.setItem(`movie-poster${i + 1}`, localStorage.getItem(`movie-poster${i + 2}`));
    }
    localStorage.removeItem(`episode-link${movies.length + 1}`);
    localStorage.removeItem(`episode-playtime${movies.length + 1}`);
    localStorage.removeItem(`movie-poster${movies.length + 1}`);
    displayBanners();
}

function initializePage() {
    displayBanners();
}

window.addEventListener('load', initializePage);