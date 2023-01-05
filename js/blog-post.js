import { htmlToElement } from "./util-html-to-el.js";
import { projects } from "./project-list.js";
import { createLinkButtons } from "./sidebar.js";

const mainSection = document.querySelector('.main');
const blogSection = document.querySelector('.title-block');
const projectName = mainSection.title;

const useGifAsTitleImg = ['mobile philly'];

/**
 * Makes title image HTML
 * @param {String} projectName
 * @returns Element
 */
function makeTitleImage(projectName) {
  const titlePicFile = useGifAsTitleImg.includes(projectName) ? `title-img.gif` : `title-img.png`;
  const titleImageHtml = htmlToElement(`
    <section class="title-img-container">
      <img class="title-img" alt="${projectName} title image" src="../assets/projects/${projectName}/${titlePicFile}">
    </section>
  `);
  return titleImageHtml;
}

/**
 * Makes title block HTML
 * @param {String} projectName
 * @returns Element
 */
function makeTitleBlock(projectName) {
  // Info for this project
  const thisProject = (projects.filter(item => item.name === projectName))[0];
  const titleBlockHtml = htmlToElement(`
    <div class="title-block">
      <h1 class="blog-title">${projectName}</h1>
      <div class="info">
        <div class="info-item">
          <span class="info-item-title strong italic">year</span>
          <span class="info-item-content">${thisProject.year}</span>
        </div>
        <div class="info-item">
          <span class="info-item-title strong italic">by</span>
          <span class="info-item-content">${thisProject.by}</span>
        </div>
        <div class="info-item">
          <span class="info-item-title strong italic">role</span>
          <span class="info-item-content">${thisProject.role}</span>
        </div>
      </div>
    </div>
  `);

  const buttons = createLinkButtons(thisProject.mainLink, thisProject.githubLink, thisProject.appLink);
  titleBlockHtml.append(buttons);
  return titleBlockHtml;
}

/**
 * Makes title image and title block and appends to main
 * @param {String} projectName
 */
function createHead(projectName) {
  blogSection.prepend(makeTitleBlock(projectName));
  mainSection.prepend(makeTitleImage(projectName));
}

createHead(projectName);