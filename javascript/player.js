// Select elements here
const loader = document.getElementById('loader');
const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const backArrow = document.getElementById('back-arrow');
const titleText = document.getElementById('title-text');
const subtitleText = document.getElementById('subtitle-text');
const mainContainer = document.getElementById('main-container');
const playButton = document.getElementById('play');
const playbackIcons = document.querySelectorAll('.playback-icons use');
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');
const playbackAnimation = document.getElementById('playback-animation');
const fullscreenButton = document.getElementById('fullscreen-button');
const videoContainer = document.getElementById('video-container');
const fullscreenIcons = fullscreenButton.querySelectorAll('use');
const pipButton = document.getElementById('pip-button');

const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
  video.controls = false;
  videoControls.classList.remove('hidden');
  video.controls = false;
  videoControls.classList.remove('hidden');
}

// Add functions here

// togglePlay toggles the playback state of the video.
// If the video playback is paused or ended, the video is played
// otherwise, the video is paused
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
console.log("Video Playing");
  } else {
    video.pause();
console.log("Video Paused");
  }
}
  video.addEventListener('waiting', () => {
  });
  
  video.addEventListener('playing', () => {
//    loader.style.zIndex = '0';
  });
// updatePlayButton updates the playback icon and tooltip
// depending on the playback state
function updatePlayButton() {
  playbackIcons.forEach((icon) => icon.classList.toggle('hidden'));

  if (video.paused) {
    playButton.setAttribute('data-title', 'Play (k)');
  } else {
    playButton.setAttribute('data-title', 'Pause (k)');
  }
}

// formatTime takes a time length in seconds and returns the time in
// minutes and seconds
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    hours: result.substr(1, 2),
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
}


// initializeVideo sets the video duration, and maximum value of the
// progressBar
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.hours}${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.hours}${time.minutes}m ${time.seconds}s`);

  // Iterate over the episodes
  for (let i = 1; i <= 10; i++) { // Assuming you have a maximum of 10 episodes
    const epilink = localStorage.getItem(`episode-link${i}`);
    // Check if the link matches the current window location
    if (epilink && epilink === window.location.href) {
      const epitime = localStorage.getItem(`episode-playtime${i}`);
      if (epitime) {
        const [hours, minutes, seconds] = epitime.split(':').map(parseFloat);
        const playbackTimeInSeconds = hours * 3600 + minutes * 60 + seconds - 3;
        if (playbackTimeInSeconds > 0 && playbackTimeInSeconds <= videoDuration) {
          video.currentTime = playbackTimeInSeconds;
          // Break the loop if playback time is set
          break;
        }
      }
    }
  }
}
function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));
    timeElapsed.innerText = `${time.hours}${time.minutes}:${time.seconds}`;
    timeElapsed.setAttribute('datetime', `${time.hours}:${time.minutes}m ${time.seconds}s`);

    const currentEpilink = window.location.href;
    const currentEpitime = `${time.hours}${time.minutes}:${time.seconds}`;

    let posterPath;

    if (currentEpilink.includes('/movies/')) {
        posterPath = currentEpilink.substring(0, currentEpilink.length - 9) + "poster.webp";
    } else if (currentEpilink.includes('/tv-shows/') && currentEpilink.includes("episode-")) {
        // Extracting the episode number from the URL
        let episodeNumber = currentEpilink.match(/episode-(\d+)/)[1];

        // Checking if episode number is single digit or not
        if (episodeNumber.length === 1) {
            posterPath = currentEpilink.substring(0, currentEpilink.length - 23) + "poster.webp";
        } else {
            posterPath = currentEpilink.substring(0, currentEpilink.length - 24) + "poster.webp";
        }
    } else {
        // Default poster path if it doesn't match either case
        posterPath = currentEpilink.substring(0, currentEpilink.length - 9) + "poster.webp";
    }

    // Check if the current link is already in local storage
    let linkExists = false;
    for (let i = 1; i <= 10; i++) {
        const epilink = localStorage.getItem(`episode-link${i}`);
        if (epilink && epilink === currentEpilink) {
            linkExists = true;
            // Move the current link to the front
            for (let j = i; j > 1; j--) {
                localStorage.setItem(`episode-link${j}`, localStorage.getItem(`episode-link${j - 1}`));
                localStorage.setItem(`episode-playtime${j}`, localStorage.getItem(`episode-playtime${j - 1}`));
                localStorage.setItem(`movie-poster${j}`, localStorage.getItem(`movie-poster${j - 1}`));
            }
            // Set the current values to the first set
                localStorage.setItem('episode-link1', currentEpilink);
                localStorage.setItem('episode-playtime1', currentEpitime);
                localStorage.setItem('movie-poster1', posterPath);
            break;
        } else if (epilink && epilink.substring(0, epilink.length - 23) === currentEpilink.substring(0, currentEpilink.length - 23)) {
            // Replace the link if it matches minus the last 23 characters
            localStorage.setItem(`episode-link${i}`, currentEpilink);
            localStorage.setItem(`episode-playtime${i}`, currentEpitime);
            localStorage.setItem(`movie-poster${i}`, posterPath);
            linkExists = true;
            break;
        }
    }

    // If the current link doesn't exist, add it to local storage
    if (!linkExists) {
        for (let i = 9; i >= 2; i--) {
            const prevEpilink = localStorage.getItem(`episode-link${i - 1}`);
            const prevEpitime = localStorage.getItem(`episode-playtime${i - 1}`);
            const prevEpiposter = localStorage.getItem(`movie-poster${i - 1}`);

            localStorage.setItem(`episode-link${i}`, prevEpilink);
            localStorage.setItem(`episode-playtime${i}`, prevEpitime);
            localStorage.setItem(`movie-poster${i}`, prevEpiposter);
        }
        localStorage.setItem('episode-link1', currentEpilink);
        localStorage.setItem('episode-playtime1', currentEpitime);
        localStorage.setItem('movie-poster1', posterPath);
    }

    // Update the displayed poster, link, and playtime for all sets
    for (let i = 1; i <= 10; i++) {
        const epilink = localStorage.getItem(`episode-link${i}`);
        const epitime = localStorage.getItem(`episode-playtime${i}`);
        const epiposter = localStorage.getItem(`movie-poster${i}`);

        document.getElementById(`episode-link${i}`).setAttribute('href', epilink);
        document.getElementById(`episode-playtime${i}`).innerText = epitime;
        document.getElementById(`movie-poster${i}`).setAttribute('src', epiposter);
    }
}

function timeplayback() {
    const epitime = localStorage.getItem('episode-playtime');
    const epilink = localStorage.getItem('episode-link');
    const epiposter = localStorage.getItem('movie-poster');
    console.log(epitime, epilink, epiposter);
}
// updateProgress indicates how far through the video
// the current playback is by updating the progress bar
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}

// updateSeekTooltip uses the position of the mouse on the progress bar to
// roughly work out what point in the video the user will skip to if
// the progress bar is clicked at that point
function updateSeekTooltip(event) {
  const skipTo = Math.round(
    (event.offsetX / event.target.clientWidth) *
      parseInt(event.target.getAttribute('max'), 10)
  );
  seek.setAttribute('data-seek', skipTo);
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.hours}${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;
}

// skipAhead jumps to a different point in the video when the progress bar
// is clicked
function skipAhead(event) {
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}

// updateVolume updates the video's volume
// and disables the muted state if active
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }

  video.volume = volume.value;
}

// updateVolumeIcon updates the volume icon so that it correctly reflects
// the volume of the video
function updateVolumeIcon() {
  volumeIcons.forEach((icon) => {
    icon.classList.add('hidden');
  });

  volumeButton.setAttribute('data-title', 'Mute (m)');

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove('hidden');
    volumeButton.setAttribute('data-title', 'Unmute (m)');
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove('hidden');
  } else {
    volumeHigh.classList.remove('hidden');
  }
}

// toggleMute mutes or unmutes the video when executed
// When the video is unmuted, the volume is returned to the value
// it was set to before the video was muted
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute('data-volume', volume.value);
    volume.value = 0;
console.log("Video Muted");

  } else {
    volume.value = volume.dataset.volume;
console.log("Video Un-Muted");
  }
}


// animatePlayback displays an animation when
// the video is played or paused
function animatePlayback() {
  playbackAnimation.animate(
    [
      {
        opacity: 1,
        transform: 'scale(1)',
      },
      {
        opacity: 0,
        transform: 'scale(1.3)',
      },
    ],
    {
      duration: 500,
    }
  );
}
function skipAhead10() {
console.log("Skipping 10 Ahead");
  video.currentTime +=10;
  progressBar.value +=10;
}
function skipBack10() {
console.log("Skipping 10 Back");
  video.currentTime -=10;
  progressBar.value -=10;
}
function skipAhead5() {

  video.currentTime +=5;
  progressBar.value +=5;
}
function skipBack5() {

  video.currentTime -=5;
  progressBar.value -=5;
}
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
function back() {
 document.getElementById('back').click();
   
}
document.onkeyup = function(e) {
  if (e.which == 70) {
    toggleFullScreen()
  } else if (e.which == 32) {
    togglePlay()
  } else if (e.which == 75) {
    togglePlay()
  } else if (e.which == 77) {
    toggleMute()
  } else if (e.which == 76) {
    skipAhead10()
  } else if (e.which == 74) {
    skipBack10()
  } else if (e.which == 80) {
    video.requestPictureInPicture();
  }
};


        if (document.addEventListener) {
            document.addEventListener('webkitfullscreenchange', exitHandler, false);
            document.addEventListener('mozfullscreenchange', exitHandler, false);
            document.addEventListener('fullscreenchange', exitHandler, false);
            document.addEventListener('MSFullscreenChange', exitHandler, false);
        }
    function exitHandler() {
        if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
    backArrow.classList.remove('back-arrow-fullscreen');
    backArrow.classList.add('back-arrow');
    console.log("Normal Screen");
    titleText.classList.remove('title-text-fullscreen');
    titleText.classList.add('title-text');
    subtitleText.classList.remove('subtitle-text-fullscreen');
    subtitleText.classList.add('subtitle-text');
}
    }

// toggleFullScreen toggles the full screen state of the video
// If the browser is currently in fullscreen mode,
// then it should exit and vice versa.
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    backArrow.classList.remove('back-arrow-fullscreen');
    backArrow.classList.add('back-arrow');
    console.log("Normal Screen");
    titleText.classList.remove('title-text-fullscreen');
    titleText.classList.add('title-text');
    subtitleText.classList.remove('subtitle-text-fullscreen');
    subtitleText.classList.add('subtitle-text');
showControlsonMouseMove();
  } else if (document.webkitFullscreenElement) {
    // Need this to support Safari
    document.webkitExitFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    // Need this to support Safari
    videoContainer.webkitRequestFullscreen();
    titleText.classList.add('title-text-fullscreen');
    titleText.classList.remove('title-text');
    console.log("Fullscreen");
    backArrow.classList.remove('back-arrow');
    backArrow.classList.add('back-arrow-fullscreen');
    subtitleText.classList.remove('subtitle-text');
    subtitleText.classList.add('subtitle-text-fullscreen');
  } else {
    videoContainer.requestFullscreen();
  }
}

videoContainer.addEventListener('dblclick', toggleFullScreen);


// updateFullscreenButton changes the icon of the full screen button
// and tooltip to reflect the current full screen state of the video
function updateFullscreenButton() {
  fullscreenIcons.forEach((icon) => icon.classList.toggle('hidden'));

  if (document.fullscreenElement) {
    fullscreenButton.setAttribute('data-title', 'Exit full screen (f)');
  } else {
    fullscreenButton.setAttribute('data-title', 'Full screen (f)');
  }
}


// hideControls hides the video controls when not in use
// if the video is paused, the controls must remain visible
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add('hide');
   backArrow.classList.add('hide');

}

// showControls displays the video controls
function showControls() {
  videoControls.classList.remove('hide');
  backArrow.classList.remove('hide');
}

function showControlsonMouseMove() {
     videoControls.classList.remove('hide');
     backArrow.classList.remove('hide');
     mainContainer.classList.remove('hide');

}

function hideControlsonMouseMove() {
     videoControls.classList.add('hide');
     backArrow.classList.add('hide');
     mainContainer.classList.add('hide');

}

function concealCursor() {
 console.log(status);   
}
// keyboardShortcuts executes the relevant functions for
// each supported shortcut key
var timeout;
document.onmousemove = function(){
  clearTimeout(timeout);
  timeout = setTimeout(function(){
      hideControlsonMouseMove();
 
  }, 2000);
}
// Add eventlisteners here
playButton.addEventListener('click', togglePlay);
video.addEventListener('play', updatePlayButton);
video.addEventListener('pause', updatePlayButton);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
video.addEventListener('mousemove', showControls);
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);
fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);

document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});


