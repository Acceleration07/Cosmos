      // Get the viewport width
      const viewportWidth = window.innerWidth;
      
      // Find the nav elements in the DOM
      const sidenav = document.getElementById('sidenav');
      const topnav = document.getElementById('topnav');
      const burger = document.getElementById('burger');

      // Set the appropriate class on the nav elements based on the viewport width
      if (viewportWidth < 600) {
        sidenav.className = 'sidenav';
        topnav.className = 'topnav hidden';
      } else {
        sidenav.className = 'sidenav hidden';
        topnav.className = 'topnav';
      }

function handleResize() {
  if (window.innerWidth > 600) {
    sidenav.style.display = 'none';
    sidenav.style.width = '0px';
    sidenav.style.left = '0px';
  }
}
function openNav() {
    sidenav.style.width = '250px';
    sidenav.style.display = 'block';
    console.log ("Sidenav Shown")
    
}

function closeNav() {
    sidenav.style.width = '0px';
    sidenav.style.display = 'none';
    console.log ("Sidenav Hidden")

}

window.addEventListener('scroll', function() {
  var topnavs = document.getElementsByClassName('topnav');

  for (var i = 0; i < topnavs.length; i++) {
    var topnav = topnavs[i];
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;

    if (scrolled > 0) {
      topnav.classList.add('scrolled');
    } else {
      topnav.classList.remove('scrolled');
    }
  }
});


// call handleResize on page load and on window resize
window.addEventListener('load', handleResize);
window.addEventListener('resize', handleResize);
window.addEventListener('load',   console.log ("Topnav Javascript Loaded"));
