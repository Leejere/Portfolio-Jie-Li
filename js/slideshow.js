import { htmlToElement } from "./util-html-to-el.js";

// First add in the images
const leftSlideContainer = document.querySelector('#slide-pic-container-left');
const thisSlideContainer = document.querySelector('#slide-pic-container-this');
const rightSlideContainer = document.querySelector('#slide-pic-container-right');
const slideContainer = document.querySelector('.slide-container');
const numSlides = Number(slideContainer.classList[0].substring(4));

const mainSection = document.querySelector('.main');
const projectName = mainSection.title;

/**
 * Gets paths of an image
 * @param {String} projectName
 * @param {Number} number
 * @returns
 */
function getImagePath(projectName, number) {
  const numberString = number < 10 ? '0' + String(number) : String(number);
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
 *
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
    slideNumberContainer.innerHTML = thisSlideIndex;

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
  slideLeftOrRight('left');
});

rightArrow.addEventListener('click', () => {
  slideLeftOrRight('right');
});
