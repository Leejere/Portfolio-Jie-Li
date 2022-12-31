/**
 * First, main section shares viewport width with sidebar on big screens
 * but not so on smaller screens
 */

let isSmallScreen = false;
const mainSection = document.querySelector('#main');

function makeMainFullWidth(mainSection) {
  if (!mainSection.classList.contains('main-full-width')) {
    mainSection.classList.add('main-full-width');
  }
}

function makeMainNotFullWidth(mainSection) {
  if (mainSection.classList.contains('main-full-width')) {
    mainSection.classList.remove('main-full-width');
  }
}

/**
 * Then, add function to sidebar toggle
 */

let sidebarIsOpen = true;

const sidebarToggle = document.querySelector('#sidebar-toggle');
const sidebarSection = document.querySelector('#sidebar');

function closeSidebar(sidebarSection) {
  if (!sidebarSection.classList.contains('sidebar-hidden')) {
    sidebarSection.classList.add('sidebar-hidden');
  }
  sidebarIsOpen = false;
  // Also adjust main full width
  makeMainFullWidth(mainSection);
}

function openSidebar(sidebarSection) {
  if (sidebarSection.classList.contains('sidebar-hidden')) {
    sidebarSection.classList.remove('sidebar-hidden');
  }
  sidebarIsOpen = true;
  // Adjust main full width if on big screen
  if (!isSmallScreen) {
    makeMainNotFullWidth(mainSection);
  }
}

// Open or close sidebar on toggle click
sidebarToggle.addEventListener('click', () => {
  if (sidebarIsOpen) {
    closeSidebar(sidebarSection);
  } else {
    openSidebar(sidebarSection);
  }
});

// Adjusts main width and decides whether to hide sidebar on page load
function adjustLayoutOnLoad(threshold) {
  const viewportWidth = document.documentElement.clientWidth;
  console.log(viewportWidth);
  if (viewportWidth < threshold) { // If on smaller screen
    isSmallScreen = true;
    makeMainFullWidth(mainSection);
    // Hide sidebar
    closeSidebar(sidebarSection);
  }
}

function adjustLayoutOnResize(threshold) {
  visualViewport.addEventListener('resize', ( ) => {
    const currentViewportWidth = document.documentElement.clientWidth;
    if (currentViewportWidth < threshold) {
      isSmallScreen = true;
      makeMainFullWidth(mainSection);
      // Also close sidebar
      closeSidebar(sidebarSection);
    } else {
      isSmallScreen = false;
      makeMainNotFullWidth(mainSection);
      // Open sidebar
      openSidebar(sidebarSection);
    }
  });
}

const threshold = 1250;
adjustLayoutOnResize(threshold);
adjustLayoutOnLoad(threshold);