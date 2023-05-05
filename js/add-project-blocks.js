import { projects } from "./project-list.js";
import { htmlToElement } from "./util-html-to-el.js";
import { createLinkButtons } from "./sidebar.js";

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
  const markdownLink = project.markdownLink;

  let titleImageHtml;

  if (titleImageLink) {
    titleImageHtml = `<img class="project-thumbnail" alt="${name} main page" src="${titleImageLink}">`;
  } else {
    titleImageHtml = ``;
  }

  const html = htmlToElement(`
    <div class="project-block">
      ${titleImageHtml}
      <h2 class="section-title project-title">
        <a class=project-title href="${mainLink}" alt="${name} main page">${name}</a>
      </h2>
      <div class="project-description regular-text">${description}</div>
    </div>
  `);

  const buttons = createLinkButtons(
    mainLink,
    githubLink,
    appLink,
    markdownLink
  );
  html.append(buttons);
  return html;
}

function addProjectBlocks(sectionType, sectionId) {
  const section = document.querySelector(`#${sectionId}`);
  const sectionProjects = projects.filter((item) => item.type === sectionType);

  for (const project of sectionProjects) {
    section.append(makeProjectBlock(project));
  }
}

addProjectBlocks("urban technology", "technology-blocks-group");
addProjectBlocks("planning & design", "design-blocks-group");
