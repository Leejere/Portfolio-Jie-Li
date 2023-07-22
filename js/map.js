// Make a FeatureCollection of cities
// Lng different from actual, as to show map centered on Pacific
export const cities = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Beijing, CN",
        description:
          'I majored in Urban Planning in <a alt="Peking University" href="https://english.pku.edu.cn/">Peking University</a> (2016 to 2021) and minored in Sociology.',
      },
      geometry: {
        type: "Point",
        coordinates: [116.4 - 360, 39.9],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Guangzhou, CN",
        description: `My first internship job was in <a alt="GZPI" href="https://www.bloomberg.com/profile/company/8099846Z:CH">GZPI</a>. I worked with a quantitative method to evaluate historic preservation.`,
      },
      geometry: {
        type: "Point",
        coordinates: [113.26 - 360, 23.12],
      },
    },
    {
      type: "Feature",
      properties: {
        name: `Yong'an, CN`,
        description: "I was born here.",
      },
      geometry: {
        type: "Point",
        coordinates: [117.36 - 360, 25.94],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Dallas, TX",
        description:
          "I spent three months here doing my first internship in the US. I worked with procedural design and planning visualization.",
      },
      geometry: {
        type: "Point",
        coordinates: [-96.8, 32.78],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Philadelphia, PA",
        description:
          "At Penn, I got to know how to make planning work techy and how tech makes it better.",
      },
      geometry: {
        type: "Point",
        coordinates: [-75.16, 39.95],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Washington, DC / Arlington, VA",
        description: `I work at <a alt="AECOM" style="font-weight: 800; color: #038768" href="aecom.com" >AECOM</a> as a geospatial data scientist, designer, and developer.`,
      },
      geometry: {
        type: "Point",
        coordinates: [-77.09, 38.88],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Jimani, Dominican Republic",
        description:
          "We spent two weeks along the border doing a studio in October 2022, setting up planning frameworks for three border towns, supported by Penn and the Dominican government.",
      },
      geometry: {
        type: "Point",
        coordinates: [-71.85, 18.49],
      },
    },
  ],
};

/**
 * Init map base
 * @param {Number} viewportWidth
 * @param {Number} markerRadius
 * @returns map mapbox://styles/li-jie-fj/clcbeyrmt005015qsz4ikai6a
 */
function initMapBase(viewportWidth) {
  let zoomLevel; // Also the min zoom
  let markerRadius;

  // Setting max bounds
  const bottomLeftCorner = L.latLng(-70, 60 - 360);
  const topRightCorner = L.latLng(80, -50);
  const maxBounds = L.latLngBounds(bottomLeftCorner, topRightCorner);

  // Setting zoom level and marker radius
  if (viewportWidth <= 530) {
    zoomLevel = 1;
    markerRadius = 4;
  } else if (viewportWidth <= 1400) {
    zoomLevel = 2;
    markerRadius = 6;
  } else {
    zoomLevel = 3;
    markerRadius = 7;
  }

  const map = L.map("map", {
    maxZoom: 15,
    preferCanvas: true,
    minZoom: zoomLevel,
    zoomControl: false,
    tap: false, // Prevent firing two onclick events at once
  })
    .setView([0, 0], zoomLevel)
    .setMaxBounds(maxBounds);

  // MapBox credentials
  const mapboxAccount = "li-jie-fj";
  const mapboxStyle = "clcbf1ia0000014o7hfgx4adf";
  const mapboxToken =
    "pk.eyJ1IjoibGktamllLWZqIiwiYSI6ImNsYWU2dWtqbzByZHYzb3F5dndrZm9vbXoifQ.RhKDjT-7I5oWlzeDbfrI9g";

  const attributionHTML =
    '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';
  const tileLayerUrl = `https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`;

  // Add tile layer
  L.tileLayer(tileLayerUrl, {
    maxZoom: 15,
    minZoom: zoomLevel,
    attribution: attributionHTML,
  }).addTo(map);

  // Add an empty layer of cities
  map.citiesLayer = L.geoJSON(null, {
    pointToLayer: (point, latLng) => L.circleMarker(latLng),
    style: {
      fillOpacity: 0.3,
      fillColor: "#353795",
      color: "#353795",
      weight: 2,
      radius: markerRadius,
      stroke: true,
    },
  }).addTo(map);

  return map;
}

/**
 * Makes the HTML content of the popups
 * @param {Feature} layer.feature
 * @returns String
 */
function makePopupContent(feature) {
  return `
    <div class="section-title">${feature.properties.name}</div>
    <div class="regular-text">${feature.properties.description}</div>
  `;
}

/**
 * Open popups for Yong'an and Philadelphia on load
 * @param {String} cityName, same as in `cities`
 * @param {Leaflet.Map} map
 */
function openPopupsOnLoad(cityName, cities, map) {
  for (const item of cities.features) {
    if (item.properties.name === cityName) {
      const content = makePopupContent(item);
      const coordinates = item.geometry.coordinates.slice().reverse();
      L.popup({ autoClose: false })
        .setLatLng(coordinates)
        .setContent(content)
        .openOn(map);
      return;
    }
  }
}

/**
 * Centers map on load or on resize
 * @param {L.Map} map
 * @param {Number} viewportWidth
 */
function centerMap(map, viewportWidth) {
  if (viewportWidth <= 530) {
    map.setView([13, -115], 1);
  } else if (viewportWidth <= 1400) {
    map.setView([8, -145], 2);
  } else {
    map.setView([30, -165], 3);
  }
}

/**
 * Auto opens one to three popups depending on screen size on load or resize
 * @param {L.Map} map
 * @param {Number} viewportWidth
 */
function autoOpenPopups(map, viewportWidth) {
  map.closePopup();

  const citiesToShow =
    viewportWidth <= 530
      ? [`Washington, DC / Arlington, VA`]
      : viewportWidth > 1400
      ? [`Yong'an, CN`, `Washington, DC / Arlington, VA`, `Beijing, CN`]
      : [`Yong'an, CN`, `Washington, DC / Arlington, VA`];

  for (let i = 0; i < citiesToShow.length; i++) {
    setTimeout(() => {
      openPopupsOnLoad(citiesToShow[i], cities, map);
    }, 50 * i);
  }
}

/**
 * Calls `initMapBase` given viewport width, called in `main.js`
 * @param {Number} viewportWidth
 * @returns map
 */
function initMapOnLoad(viewportWidth) {
  let map = initMapBase(viewportWidth);
  // Add cities onto map
  map.citiesLayer.addData(cities);
  map.citiesLayer
    .bindPopup((layer) => makePopupContent(layer.feature))
    .addTo(map);

  // Open 1 - 3 popups on load
  autoOpenPopups(map, viewportWidth);

  // Recenter map
  setTimeout(() => {
    centerMap(map, viewportWidth);
  }, 200);

  return map;
}

/**
 * Listens for resize, and adjust map: recenter, reopen popups, etc., on resize
 * @param {L.Map} map
 */

let currentTime = 0;
function adjustMapOnViewportResize(map) {
  const mapContainer = document.querySelector(".map");
  visualViewport.addEventListener("resize", () => {
    // Only do once at a time
    if (Number(Date.now()) - currentTime < 2000) {
      return;
    }
    currentTime = Number(Date.now());
    setTimeout(() => {
      setTimeout(() => {
        map.closePopup();
      }, 50);
      const currentViewportWidth = document.documentElement.clientWidth;
      // Resize container
      if (currentViewportWidth <= 530) {
        mapContainer.style.height = "40vh";
      } else if (currentViewportWidth <= 1400) {
        mapContainer.style.height = "70vh";
        setTimeout(() => {
          map.invalidateSize();
        }, 400);
      } else {
        mapContainer.style.height = "70vh";
      }
      // Recenter map
      centerMap(map, currentViewportWidth);

      // Reload tiles
      map.invalidateSize();

      // Reopen or close popups
      autoOpenPopups(map, currentViewportWidth);
    }, 1000);
  });
}

export { initMapOnLoad, adjustMapOnViewportResize };
