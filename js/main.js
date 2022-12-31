import { initMapOnLoad, adjustMapOnViewportResize } from "./map.js";

/** =========================================
 * First we want to initialize the map based on media query
 */

// Get current viewport width
const viewportWidth = document.documentElement.clientWidth;

// Change map dimensions based on viewport width
const map = initMapOnLoad(viewportWidth);
adjustMapOnViewportResize(map); // Adjust map on any event-triggered changes


