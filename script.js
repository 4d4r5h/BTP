window.LRM = {
  tileLayerURL: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  tomtomAccessToken: "jkf8G4nkI5HAHsFkJAom3KtGONAyLeuU",
};

const defaultLatitude = 26.8467,
  defaultLongitude = 80.9462;
const defaultCoordinate = L.latLng(defaultLatitude, defaultLongitude);
let waypoints = [];

const attribution =
  '&copy; <a href="https://about.google/brand-resource-center' +
  '/products-and-services/geo-guidelines/">Google Maps</a>';

const map = L.map("map", {
  inertia: true,
  dragging: true,
  center: defaultCoordinate,
  zoom: 15,
  zoomControl: false,
  attributionControl: true,
});

L.control
  .zoom({
    zoomInTitle: "Zoom In",
    zoomOutTitle: "Zoom Out",
  })
  .addTo(map);

L.tileLayer(LRM.tileLayerURL, {
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
  opacity: 1.0,
  attribution: attribution,
}).addTo(map);

const maximumCountOfRoutes = 6;
const polylines = [];
for (let i = 0; i < maximumCountOfRoutes; i++) {
  polylines.push(L.polyline([], {}).addTo(map));
}

function giveLatsLngs(_waypoints) {
  let latsLngs = "";
  for (const coordinate of _waypoints) {
    latsLngs += coordinate.lat + "," + coordinate.lng + ":";
  }
  return latsLngs;
}

function giveURL(options) {
  const baseURL = "api.tomtom.com";
  const versionNumber = 1;
  const contentType = "json";
  const API_KEY = LRM.tomtomAccessToken;
  let routePlanningLocations = null;

  if (options.routePlanningLocations !== undefined) {
    routePlanningLocations = giveLatsLngs(options.routePlanningLocations);
  } else {
    routePlanningLocations = giveLatsLngs(waypoints);
  }

  let URL =
    `https://${baseURL}/routing/${versionNumber}/calculateRoute/` +
    `${routePlanningLocations}/${contentType}?key=${API_KEY}`;

  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      URL += `&${key}=${options[key]}`;
    }
  }

  return URL;
}

async function fetchJSON(options) {
  let URL = giveURL(options);
  console.log(URL);
  const object = await fetch(URL);
  const json = await object.json();
  return json;
}

function showTrafficCongestion(routeArray) {
  routeArray.sort((object1, object2) => {
    return object1.travelTimeInSeconds - object2.travelTimeInSeconds;
  });
  const colors = ["green", "orange", "red"];
  for (let i = 0; i < routeArray.length && i < 3; i++) {
    const index = routeArray[i].index;
    const route = routeArray[i].route;
    polylines[index].setLatLngs(route);
    polylines[index].setStyle({
      color: colors[i],
    });
  }
}

function doRouting(options) {
  fetchJSON(options).then((json) => {
    const countOfRoutes = json.routes.length;
    const routeArray = [];
    for (let i = 0; i < countOfRoutes; i++) {
      const legs = json.routes[i].legs;
      let route = [];
      const countOfDestinations = legs.length;
      for (let j = 0; j < countOfDestinations; j++) {
        const points = legs[j].points.map((object) => {
          return [object.latitude, object.longitude];
        });
        route.push(points);

        const travelTimeInSeconds = json.routes[i].summary.travelTimeInSeconds;

        routeArray[i] = {
          index: i,
          travelTimeInSeconds: travelTimeInSeconds,
          route: route,
        };
      }
    }
    showTrafficCongestion(routeArray);
  });
}

function getTextInputByNumber(number) {
  return document.getElementById("input" + number);
}

function fillTextInput() {
  const lengthOfWaypoints = waypoints.length;
  const inputContainer = document.getElementsByClassName("input-container")[0];
  const newTextInput = `<input type="text" class="text-input" value="${
    waypoints[lengthOfWaypoints - 1]
  }" id="input${lengthOfWaypoints}" />`;
  inputContainer.innerHTML += newTextInput;
}

function addMarker(coordinate) {
  const lengthOfWaypoints = waypoints.length;
  const marker = L.marker(coordinate, {
    draggable: true,
    icon: L.icon.glyph({ glyph: lengthOfWaypoints }),
  });
  marker.on("moveend", (e) => {
    const textInputNumber = e.sourceTarget.options.icon.options.glyph;
    const textInput = getTextInputByNumber(textInputNumber);
    textInput.value = e.target._latlng;
    waypoints[textInputNumber - 1] = e.target._latlng;
    doRouting({});
  });
  marker.addTo(map);
}

map
  .locate()
  .on("locationfound", (e) => {
    const currentCoordinate = e.latlng;
    waypoints.push(currentCoordinate);
    map.setView(currentCoordinate);
    addMarker(currentCoordinate);
    const circle = L.circle(currentCoordinate, { radius: e.accuracy });
    circle.addTo(map);
    fillTextInput();
  })
  .on("locationerror", (e) => {
    alert(e.message);
  });

map.on("click", (e) => {
  const coordinate = e.latlng;
  waypoints.push(coordinate);
  fillTextInput();
  addMarker(coordinate);

  if (waypoints.length > 1) {
    doRouting({
      maxAlternatives: 5,
    });
  }
});

// maxAlternatives: 5
