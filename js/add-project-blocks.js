import{ projects }from './project-list.js';

import { htmlToElement } from './util-html-to-el.js';

const urbanAnalyticsProjects = projects.urbanTech;
const analyticsSection = document.querySelector('#analytics-blocks-group');

import { createLinkButtons } from './sidebar.js';

/**
 * Makes element of each project block, including defining img, title, description, and buttons
 * @param {Object} project
 * @returns Element
 */
function makeProjectBlock(project) {
  const name = project.name;
  const description = project.description;
  const titleImageLink = project.titleImageLink;
  const mainLink = project.mainLink;
  const githubLink = project.githubLink;
  const appLink = project.appLink;

  const html = htmlToElement(`
    <div class="project-block">
      <img class="project-thumbnail" alt="${name} main page" src="${titleImageLink}">
      <h2 class="section-title project-title">
        <a class=project-title href="${mainLink}" alt="${name} main page">${name}</a>
      </h2>
      <div class="project-description regular-text">${description}</div>
    </div>
  `);

  const buttons = createLinkButtons(mainLink, githubLink, appLink);
  html.append(buttons);
  return html;
}

for (const project of urbanAnalyticsProjects) {
  analyticsSection.append(makeProjectBlock(project));
}
