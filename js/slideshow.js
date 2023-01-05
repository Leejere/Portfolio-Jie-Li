import { htmlToElement } from "./util-html-to-el.js";

// First add a framework
const slideshowContainer = document.querySelector('.slideshow-container');
const numSlides = Number(slideshowContainer.classList[0].substring(4));

const mainSection = document.querySelector('.main');
const projectName = mainSection.title;

const slidesFramework = htmlToElement(`
  <div class="slide-container">
    <div class="slide-pic-container slide-pic-container-this" id="slide-pic-container-this"></div>
    <div class="slide-pic-container slide-pic-container-left" id="slide-pic-container-left"></div>
    <div class="slide-pic-container slide-pic-container-right" id="slide-pic-container-right"></div>
  </div>
`);
const controlPanelFramework = htmlToElement(`
  <div class="slide-control-panel">
    <span class="material-symbols-outlined" id="left-arrow">arrow_back_ios</span>
    <span class="slide-number" id="slide-number">1</span>
    <span>/ ${numSlides}</span>
    <span class="material-symbols-outlined" id="right-arrow">arrow_forward_ios</span>
  </div>
`);

// Add the control panel
slideshowContainer.append(controlPanelFramework);

// Add the slideshow container
slideshowContainer.append(slidesFramework);


/**
 * Three slide containers:
 * "this": central, showing currently
 * "left" and "right": alongside "this" in the overflow of `slideshowContainer`
 */
const leftSlideContainer = document.querySelector('#slide-pic-container-left');
const thisSlideContainer = document.querySelector('#slide-pic-container-this');
const rightSlideContainer = document.querySelector('#slide-pic-container-right');


/**
 * Gets paths of an image
 * @param {String} projectName
 * @param {Number} number
 * @returns
 */
function getImagePath(projectName, number) {
  let numberString;
  if (numSlides >= 10) {
    numberString = number < 10 ? '0' + String(number) : String(number);
  } else {
    numberString = String(number);
  }
  return `../assets/projects/${projectName}/slides/slideshow_Page_${numberString}.jpg`;
}

// store images on load
const images = [];
for (let i = 1; i <= numSlides; i++) {
  const imgPath = getImagePath(projectName, i);
  const imgHtml = htmlToElement(`
    <img class="slide-pic" src="${imgPath}" alt="slide-${String(i)}" id="slide-${String(i)}"/>
  `);
  images.push(imgHtml);
}

// Initialize: place the initial images
// The left and right images are placed around the first image
// But they are outside the container so hidden
leftSlideContainer.append(images[numSlides - 1]);
thisSlideContainer.append(images[0]);
rightSlideContainer.append(images[1]);

// Show one slide while preparing two other slides left and right
let thisSlideIndex = 0;

function findLeftSlideIndex(thisSlideIndex) {
  return thisSlideIndex === 0 ? numSlides - 1 : thisSlideIndex - 1;
}

function findRightSlideIndex(thisSlideIndex) {
  return thisSlideIndex === numSlides - 1 ? 0 : thisSlideIndex + 1;
}

function resetSlidesPosition(thisSlideIndex, leftSlideIndex, rightSlideIndex) {
  // Clear and temporarily remove transition CSS property
  const containers = [leftSlideContainer, thisSlideContainer, rightSlideContainer];
  containers.forEach(item => {
    item.style.transition = 'none 1s';
    item.innerHTML = '';
  });
  // Swap slides
  leftSlideContainer.append(images[leftSlideIndex]);
  thisSlideContainer.append(images[thisSlideIndex]);
  rightSlideContainer.append(images[rightSlideIndex]);
  thisSlideContainer.style.transform = 'translateX(0)';
  rightSlideContainer.style.left = '100%';
  leftSlideContainer.style.left = '-100%';

  // Change transition property back
  setTimeout(() => {
    containers.forEach(item => {
      item.style.transition = 'all 1s ease-in-out';
    });
  }, 100);
}

const slideNumberContainer = document.querySelector('#slide-number');

/**
 * Slide to the left or right while changing the number
 * Two steps:
 * 1. do a sliding: "this" container to left/right, while "right" or "left" container to middle
 * 2. swap: renew slides to fit the three containers. Temporarily disable transition properties here
 * @param {String} direction either left or right
 */
function slideLeftOrRight(direction) {
  if (direction === 'left') {
    // First do the sliding
    thisSlideContainer.style.transform = 'translateX(-100%)';
    rightSlideContainer.style.left = '0';

    // Update current slide index
    // if sliding to the left then go to the right, vice versa
    thisSlideIndex = findRightSlideIndex(thisSlideIndex);

  } else {
    thisSlideContainer.style.transform = 'translateX(100%)';
    leftSlideContainer.style.left = '0';
    thisSlideIndex = findLeftSlideIndex(thisSlideIndex);
  }

    // Update number
    slideNumberContainer.innerHTML = thisSlideIndex + 1;

  // Then do a reset, prepare for the next sliding
  const leftSlideIndex = findLeftSlideIndex(thisSlideIndex);
  const rightSlideIndex = findRightSlideIndex(thisSlideIndex);

  setTimeout(() => {
    resetSlidesPosition(thisSlideIndex, leftSlideIndex, rightSlideIndex);
  }, 1000);
}

// Get DOM elements of the widgets
const leftArrow = document.querySelector('#left-arrow');
const rightArrow = document.querySelector('#right-arrow');


leftArrow.addEventListener('click', () => {
  slideLeftOrRight('right');
});

rightArrow.addEventListener('click', () => {
  slideLeftOrRight('left');
});
