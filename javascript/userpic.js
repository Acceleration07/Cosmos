window.addEventListener('load',   console.log ("User Icon Javascript Loaded"));


// get the user icon element and icon options element
const userIcon = document.getElementById('user-icon');
const iconOptions = document.getElementById('icon-options');

// get the user icon from local storage, if available
const savedIcon = localStorage.getItem('user-icon');
if (savedIcon) {
  userIcon.src = savedIcon;
}

// add click event listener to each icon option
const iconOptionList = document.querySelectorAll('.icon-option');
iconOptionList.forEach((iconOption) => {
  iconOption.addEventListener('click', (event) => {
    // set the user icon to the selected icon
    userIcon.src = event.target.src;
    // save the selected icon to local storage
    localStorage.setItem('user-icon', event.target.src);
    // hide the icon options
    iconOptions.style.display = 'none';
  });
});

// add click event listener to the user icon
userIcon.addEventListener('click', () => {
  // toggle the display of the icon options
  if (iconOptions.style.display === 'none') {
    iconOptions.style.display = 'block';
  } else {
    iconOptions.style.display = 'none';
  }
});
