/**
 * First, main section shares viewport width with sidebar on big screens
 * but not so on smaller screens
 */

import { htmlToElement } from './util-html-to-el.js';
import { projects } from './project-list.js';

/**
 * Makes buttons: linking to more info, github, or web app
 * @param {String} mainLink
 * @param {String} githubLink
 * @param {String} appLink
 * @returns Element
 */
function createLinkButtons(mainLink, githubLink, appLink) {
  const mainButton = `<button><a class="button-link" href="${mainLink}"><i class="fas fa-eye"></i> view</a></button>`;
  let githubButton = ``;
  let appButton = ``;
  if (githubLink) {
    githubButton = `<button><a class="button-link" href="${githubLink}"><i class="fab fa-github"></i> GitHub</a></button>`;
  }
  if (appLink) {
    appButton = `<button><a class="button-link" href="${appLink}"><i class="fas fa-desktop"></i> product</a></button>`;
  }

  return htmlToElement(`
    <div class="project-buttons-group">
      ${mainButton}
      ${githubButton}
      ${appButton}
    </div>
  `);
}

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
    <div class="sidebar-menu">
      <h1 class="sidebar-menu-title">
        <a class="sidebar-menu-title" href="../">home</a>
      </h1>
    </div>
  </div>
`);

function makeSidebarMenuCollapsible(project) {
  const sidebarProjectCollapsible = htmlToElement(`
    <div class="sidebar-menu-collapsible">
      <div class="project-description small-text">
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
 * @param {String} category to be shown
 * @param {*} dictionary Object from `projects`
 * @returns Element
 */
function addSidebarMenuGroup(category, dictionary, hrefId) {
  const subDictionary = dictionary.filter(item => item.type === category);
  const sidebarMenuContent = htmlToElement(`
    <div class="sidebar-menu">
      <h1 class="sidebar-menu-title">
        <a class="sidebar-menu-title" href="../index.html#${hrefId}">${category}</a>
      </h1>
    </div>
  `);
  for (const project of subDictionary) {
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

// Add content of projects in the two categories
const techMenuContent = addSidebarMenuGroup('urban technology', projects, 'technology-group');
sidebarContent.append(techMenuContent);

const designMenuContent = addSidebarMenuGroup('planning & design', projects, 'design-group');
sidebarContent.append(designMenuContent);

// Add 'about me'
const aboutMeContent = htmlToElement(`
  <div class="sidebar-menu">
    <h1 class="sidebar-menu-title">
      <a class="sidebar-menu-title" href="../blog-posts/resume.html">about me</a>
    </h1>
  </div>
`);
sidebarContent.append(aboutMeContent);

// Add contacts
const contactsContent = htmlToElement(`
  <div class="contacts-group">
    <button><a class="button-link" href="https://github.com/Leejere"><i class="fab fa-github"></i> GitHub</a></button>
    <button><a class="button-link" href="https://www.linkedin.com/in/jielifj/"><i class="fab fa-linkedin"></i> LinkedIn</a></button>
    <button><a class="button-link" href="mailto: li.jie.urban@gmail.com"><i class="fas fa-envelope"></i> li.jie.urban@gmail.com</a></button>
  </div>
`);
sidebarContent.append(contactsContent);

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
    if (isSmallScreen) {
      closeSidebar(sidebarSection);
    }
  });
}

/**
 * Add footer
 */

const footer = document.querySelector('footer');
footer.innerHTML = `
  <span>website by Jie Li</span>
  <span>Philadelphia, 2023</span>
`;

export {
  createLinkButtons,
};