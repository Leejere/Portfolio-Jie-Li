/**
 * First, main section shares viewport width with sidebar on big screens
 * but not so on smaller screens
 */

import { map } from './main.js';
import { htmlToElement } from './util-html-to-el.js';
import { projects } from './project-list.js';
import { createLinkButtons } from './add-project-blocks.js';

let isSmallScreen = false;
const mainSection = document.querySelector('#main');

function makeMainFullWidth(mainSection) {
  if (!mainSection.classList.contains('main-full-width')) {
    mainSection.classList.add('main-full-width');
  }

  // Inform map of the resize
  setTimeout(() => {
    map.invalidateSize();
  }, 400);
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

const toggleToOpenHTML = `<span class="material-symbols-outlined" title="Open sidebar">menu</span>`;
const toggleToCloseHTML = `<span class="material-symbols-outlined" title="Collapse sidebar">menu_open</span>`;

function closeSidebar(sidebarSection) {
  if (!sidebarSection.classList.contains('sidebar-hidden')) {
    sidebarSection.classList.add('sidebar-hidden');
  }
  sidebarIsOpen = false;

  // Change toggle icon
  sidebarToggle.innerHTML = toggleToOpenHTML;

  // Also adjust main full width
  makeMainFullWidth(mainSection);
}

function openSidebar(sidebarSection) {
  if (sidebarSection.classList.contains('sidebar-hidden')) {
    sidebarSection.classList.remove('sidebar-hidden');
  }
  sidebarIsOpen = true;
  // Change toggle icon
  sidebarToggle.innerHTML = toggleToCloseHTML;

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

/**
 * Add html to sidebar
 */

// Initiates sidebar content, having the initial text
const sidebarContent = htmlToElement(`
  <div class="sidebar-main" id="sidebar-main">
    <div class="sidebar-title">
      I'm an urban planner and designer gearing into the world of urban technologists.
      I'm a coffee addict and I always want to study linguistics after urban technology.
    </div>
  </div>
`);

function makeSidebarMenuCollapsible(project) {
  const sidebarProjectCollapsible = htmlToElement(`
    <div class="sidebar-menu-collapsible">
      <div class="project-description small-centered-text">
        ${project.description}
      </div>
    </div>
  `);
  // Button links to places
  const buttons = createLinkButtons(project.mainLink, project.githubLink, project.appLink);
  sidebarProjectCollapsible.append(buttons);
  return sidebarProjectCollapsible;
}

/**
 * Adds menu content on the sidebar
 * @param {String} title to be shown
 * @param {*} dictionary Object from `projects`
 * @returns Element
 */
function addSidebarMenuGroup(title, dictionary) {
  const sidebarMenuContent = htmlToElement(`
    <div class="sidebar-menu">
      <h1 class="sidebar-menu-title">
        <a class="sidebar-menu-title" href="#analytics-group">${title}</a>
      </h1>
    </div>
  `);
  for (const project of dictionary) {
    const sidebarProjectName = htmlToElement(`
      <div class="sidebar-menu-item">
        ${project.name}
      </div>
    `);
    const sidebarProjectCollapsible = makeSidebarMenuCollapsible(project);
    sidebarMenuContent.append(sidebarProjectName);
    sidebarMenuContent.append(sidebarProjectCollapsible);
  }
  return sidebarMenuContent;
}
const sidebarMenuContent = addSidebarMenuGroup('urban technology', projects.urbanTech);
sidebarContent.append(sidebarMenuContent);

sidebarSection.prepend(sidebarContent);

/**
 * Deal with collapsibles
 */

function closeAllCollapsibles() {
  const allCollapsibles = document.querySelectorAll('.sidebar-menu-collapsible');
  for (const collapsible of allCollapsibles) {
    collapsible.style.display = 'none';

    collapsible.previousElementSibling.classList.remove('sidebar-menu-item-selected');
  }
}

const collapsibleTitlesEls = document.querySelectorAll('.sidebar-menu-item');
// Add event listners to each collapsible set
for (const collapisbleTitleEl of collapsibleTitlesEls) {
  collapisbleTitleEl.isOpen = false;

  const collapsibleEl = collapisbleTitleEl.nextElementSibling;
  collapisbleTitleEl.addEventListener('click', () => {
    // Close all collapsibles no matter what
    closeAllCollapsibles();
    // Open this one if currently not open, and make font bigger
    if (collapisbleTitleEl.isOpen === false) {
      collapsibleEl.style.display = 'flex';
      collapisbleTitleEl.isOpen = true;
      collapisbleTitleEl.classList.add('sidebar-menu-item-selected');
    } else {
      collapisbleTitleEl.isOpen = false;
    }
  });
}

// Close sidebar when clicked on title links
const sidebarGroupTitlesEls = document.querySelectorAll('.sidebar-menu-title');

for (const sidebarGroupTitle of sidebarGroupTitlesEls) {
  sidebarGroupTitle.addEventListener('click', () => {
    closeSidebar(sidebarSection);
  });
}