// Make a FeatureCollection of cities
// Lng different from actual, as to show map centered on Pacific
export const cities = {
  'type': 'FeatureCollection',
  'features': [
    {
      'type': 'Feature',
      'properties': {
        'name': 'Beijing, CN',
        'description': 'I majored in Urban Planning in <a alt="Peking University" href="https://english.pku.edu.cn/">Peking University</a> (2016 to 2021) and minored in Sociology.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [116.4 - 360, 39.9],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': 'Guangzhou, CN',
        'description': `My first internship job was in <a alt="GZPI" href="https://www.bloomberg.com/profile/company/8099846Z:CH">GZPI</a>. I worked with a quantitative method to evaluate historic preservation.`,
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [113.26 - 360, 23.12],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': `Yong'an, CN`,
        'description': 'I was born here.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [117.36 - 360, 25.94],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': 'Dallas, TX',
        'description': 'I spent three months here doing my first internship in the US. I worked with procedural design and planning visualization.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-96.80, 32.78],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': 'Philadelphia, PA',
        'description': 'I am currently studying as a grad student at Penn and have really delved into the world of urban technology.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-75.16, 39.95],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': 'Arlington, VA',
        'description': 'This is where I have launched my first internship job in data-oriented city planning.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-77.09, 38.88],
      },
    },
    {
      'type': 'Feature',
      'properties': {
        'name': 'Jimani, Dominican Republic',
        'description': 'We spent two weeks along the border doing a studio in October 2022, setting up planning frameworks for three border towns, supported by Penn and the Dominican government.',
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [-71.85, 18.49],
      },
    },
  ],
};

/**
 * Init map given center lat and long and zoom level, called in `initMapOnLoad`
 * @param {Number} centerLat
 * @param {Number} centerLng
 * @param {Number} zoomLevel
 * @param {Number} markerRadius
 * @returns map mapbox://styles/li-jie-fj/clcbeyrmt005015qsz4ikai6a
 */
function initMap(centerLat, centerLng, zoomLevel, markerRadius) {
  const map = L.map('map', {
    maxZoom: 10, preferCanvas: true,
    zoomControl: false,
    tap: false, // Prevent firing two onclick events at once
  }).setView([centerLat, centerLng], zoomLevel);

  // MapBox credentials
  const mapboxAccount = 'li-jie-fj';
  const mapboxStyle = 'clcbf1ia0000014o7hfgx4adf';
  const mapboxToken = 'pk.eyJ1IjoibGktamllLWZqIiwiYSI6ImNsYWU2dWtqbzByZHYzb3F5dndrZm9vbXoifQ.RhKDjT-7I5oWlzeDbfrI9g';

  const attributionHTML = '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  const tileLayerUrl = `https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`;

  // Add tile layer
  L.tileLayer(tileLayerUrl, {
      maxZoom: 10,
      attribution: attributionHTML,
  }).addTo(map);

  // Add an empty layer of cities
  map.citiesLayer = L.geoJSON(null, {
    pointToLayer: (point, latLng) => L.circleMarker(latLng),
    style: {
      'fillOpacity': 0.3,
      'fillColor': '#353795',
      'color': '#353795',
      'weight': 2,
      'radius': markerRadius,
      'stroke': true,
    },
  })
  .addTo(map);

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
      L.popup({ autoClose: false }).setLatLng(coordinates).setContent(content).openOn(map);
    }
  }
}

/**
 * Calls `initMap` given viewport width, called in `main.js`
 * @param {Number} viewportWidth
 * @returns map
 */
function initMapOnLoad(viewportWidth) {
  let map;
  if (viewportWidth <= 530) {
    map = initMap(13, -115, 1, 4);
  } else if (viewportWidth <= 1400) {
    map = initMap(8, -130, 2, 6);
  } else {
    map = initMap(20, -135, 3, 7);
  }
  // Add cities onto map
  map.citiesLayer.addData(cities);
  map.citiesLayer.bindPopup(layer => makePopupContent(layer.feature)).addTo(map);

  // Open two popups on load
  // On smaller screens, only show Philadelphia
  const citiesToShow = document.documentElement.clientWidth <= 530 ?
  [`Philadelphia, PA`] :
  document.documentElement.clientWidth > 1400 ?
  [`Yong'an, CN`, `Philadelphia, PA`, `Beijing, CN`] :
  [`Yong'an, CN`, `Philadelphia, PA`];
  citiesToShow.forEach(item => {
    openPopupsOnLoad(item, cities, map);
  });

  return map;
}

function adjustMapOnViewportResize(map) {
  const mapContainer = document.querySelector('.map');
  visualViewport.addEventListener('resize', ( ) => {
    const currentViewportWidth = document.documentElement.clientWidth;
    if (currentViewportWidth <= 530) {
      mapContainer.style.height = '40vh';
      map.setView([13, -115], 1);

    } else if (currentViewportWidth <= 1400) {
      mapContainer.style.height = '70vh';
      map.setView([8, -135], 2);
      setTimeout(() => {map.invalidateSize()}, 400);
    } else {
      mapContainer.style.height = '70vh';
      map.setView([20, -135], 3);
    }
  });
}

export {
  initMapOnLoad,
  adjustMapOnViewportResize,
};
