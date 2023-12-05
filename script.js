window.LRM = {
  tileLayerURL: "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  tomtomAccessToken: "jkf8G4nkI5HAHsFkJAom3KtGONAyLeuU",
};

const defaultLatitude = 26.8467,
  defaultLongitude = 80.9462;
const defaultCoordinate = L.latLng(defaultLatitude, defaultLongitude);
let waypoints = [];
let markers = [];
let polylines = [];
let effectiveLengthOfWaypoints = 0;

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

function giveLatsLngs(_waypoints) {
  let latsLngs = "";
  for (const coordinate of _waypoints) {
    if (coordinate !== null) {
      latsLngs += coordinate.lat + "," + coordinate.lng + ":";
    }
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
    if (key !== "routePlanningLocations" && options.hasOwnProperty(key)) {
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
  const countOfRoutes = routeArray.length;
  const countOfDestinations = routeArray[0].route.length;
  const colors = ["green", "orange", "red"];

  for (let j = 0; j < countOfDestinations; j++) {
    let routes = [];
    for (let i = 0; i < countOfRoutes; i++) {
      routes.push({
        travelTimeInSeconds: routeArray[i].travelTimeInSeconds[j],
        lengthInMeters: routeArray[i].lengthInMeters[j],
        route: routeArray[i].route[j],
      });
    }
    routes.sort((object1, object2) => {
      return object1.travelTimeInSeconds - object2.travelTimeInSeconds;
    });

    for (let i = Math.min(2, countOfRoutes - 1); i >= 0; i--) {
      const content =
        `<b>Distance:</b> ${routes[i].lengthInMeters} meter` +
        `<br><b>Travel Time:</b> ${routes[i].travelTimeInSeconds} seconds`;
      polylines.push(
        L.polyline(routes[i].route, {
          color: colors[i],
        })
          .bindTooltip(content)
          .addTo(map)
      );
    }
  }
}

function clearPolylines() {
  for (let polyline of polylines) {
    polyline.remove();
  }
  polylines = [];
}

function showInstructions(routeArray) {
  const countOfRoutes = routeArray.length;
  const routes = [];

  for (let i = 0; i < countOfRoutes; i++) {
    let totalTravelTimeInSeconds = routeArray[i].travelTimeInSeconds.reduce(
      (x, y) => {
        return x + y;
      },
      0
    );
    routes.push({
      totalTravelTimeInSeconds: totalTravelTimeInSeconds,
      instructions: routeArray[i].instructions.messages,
    });
  }
  routes.sort((object1, object2) => {
    return object1.totalTravelTimeInSeconds - object2.totalTravelTimeInSeconds;
  });

  let instructions = "";

  for (let i = 0; i < routes[0].instructions.length; i++) {
    const instruction =
      (1 + i).toString(10) + ": " + routes[0].instructions[i] + ". <br>";
    instructions += instruction;
  }

  outputTextBox = document.getElementsByClassName("output-text-box")[0];
  outputTextBox.style.visibility = "visible";
  outputTextBox.innerHTML = instructions;
}

function doRouting(options) {
  fetchJSON(options).then((json) => {
    const countOfRoutes = json.routes.length;
    const routeArray = [];
    for (let i = 0; i < countOfRoutes; i++) {
      const legs = json.routes[i].legs;
      const guidance = json.routes[i].guidance;
      const countOfDestinations = legs.length;
      const countOfInstructions = guidance.instructions.length;
      let route = [];
      let instructions = { messages: [] };
      let travelTimeInSeconds = [];
      let lengthInMeters = [];
      for (let j = 0; j < countOfDestinations; j++) {
        const points = legs[j].points.map((object) => {
          return [object.latitude, object.longitude];
        });
        route.push(points);
        travelTimeInSeconds.push(legs[j].summary.travelTimeInSeconds);
        lengthInMeters.push(legs[j].summary.lengthInMeters);
      }
      for (let j = 0; j < countOfInstructions; j++) {
        const message = guidance.instructions[j].message;
        instructions.messages.push(message);
      }
      routeArray[i] = {
        index: i,
        travelTimeInSeconds: travelTimeInSeconds,
        lengthInMeters: lengthInMeters,
        route: route,
        instructions: instructions,
      };
    }
    showInstructions(routeArray);
    showTrafficCongestion(routeArray);
  });
}

function routing() {
  clearPolylines();
  clearOutputTextBox();
  if (effectiveLengthOfWaypoints > 1) {
    doRouting({
      maxAlternatives: 2,
      instructionsType: "tagged",
    });
  }
}

async function geocode(coordinate) {
  const latitude = coordinate.lat;
  const longitude = coordinate.lng;
  const URL = `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}`;
  const object = await fetch(URL);
  const json = await object.json();
  return json;
}

function getTextInputByNumber(number) {
  return document.getElementById("input" + number);
}

function findParentByClass(element, className) {
  while (element && !element.classList.contains(className)) {
    element = element.parentNode;
  }
  return element;
}

function clearTextBox(id) {
  let inputElement = document.getElementById(`input${id}`);
  let formParent = findParentByClass(inputElement, "form");
  if (formParent) {
    formParent.remove();
  }
  waypoints[id - 1] = null;
  effectiveLengthOfWaypoints--; // keep these two statements above remove()
  const temporary = markers[id - 1];
  markers[id - 1] = null;
  temporary.remove();
}

function clearOutputTextBox() {
  outputTextBox = document.getElementsByClassName("output-text-box")[0];
  outputTextBox.style.visibility = "hidden";
  outputTextBox.innerHTML = "";
}

function fillTextInput() {
  const lengthOfWaypoints = waypoints.length;
  const inputContainer = document.getElementsByClassName("input-container")[0];
  geocode(waypoints[lengthOfWaypoints - 1]).then((json) => {
    const address = json.display_name;
    let newTextInput = `<div class="form"> <input type="text" class="text-input" value="${address}" id="input${lengthOfWaypoints}" />`;
    let clearButton = `<div class="clear-button" onclick="clearTextBox('${lengthOfWaypoints}')">x</div>`;
    newTextInput += clearButton + `</div>`;
    inputContainer.innerHTML += newTextInput;
  });
}

function addMarker(coordinate) {
  const lengthOfWaypoints = waypoints.length;
  const marker = L.marker(coordinate, {
    draggable: true,
    icon: L.icon.glyph({ glyph: effectiveLengthOfWaypoints }),
  });

  let moveEventObject = null;
  marker.on("move", (e) => {
    moveEventObject = e;
  });
  marker.on("moveend", () => {
    let textInputNumber = null;
    const coordinate = moveEventObject.oldLatLng;
    for (let i = 0; i < waypoints.length; i++) {
      if (waypoints[i] !== null && coordinate === waypoints[i]) {
        textInputNumber = i + 1;
        break;
      }
    }
    const textInput = getTextInputByNumber(textInputNumber);
    geocode(moveEventObject.latlng).then((json) => {
      const address = json.display_name;
      textInput.value = address;
    });
    waypoints[textInputNumber - 1] = moveEventObject.latlng;
    routing();
  });

  marker.on("remove", (e) => {
    let counter = 1;
    for (let marker of markers) {
      if (marker !== null) {
        marker.setIcon(L.icon.glyph({ glyph: counter }));
        counter++;
      }
    }

    routing();
  });

  marker.addTo(map);
  markers[lengthOfWaypoints - 1] = marker;
}

map
  .locate()
  .on("locationfound", (e) => {
    const currentCoordinate = e.latlng;
    waypoints.push(currentCoordinate);
    effectiveLengthOfWaypoints++;
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
  effectiveLengthOfWaypoints++;
  fillTextInput();
  addMarker(coordinate);

  routing();
});

document.getElementById("add_label_button").addEventListener("click", () => {
  window.location.href = "/BTP/add_label.html";
});

document.getElementById("recenter_button").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const coordinate = L.latLng(
        position.coords.latitude,
        position.coords.longitude
      );
      map.panTo(coordinate, {
        duration: 0.25,
        animate: true,
      });
      map.flyTo(coordinate, 15, {
        animate: true,
        duration: 1,
      });
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

document.getElementById("speak_button").addEventListener("click", () => {
  const text = document.getElementsByClassName("output-text-box")[0].innerHTML;

  function speak(text, rate, pitch, volume) {
    let speakData = new SpeechSynthesisUtterance();
    speakData.volume = volume;
    speakData.rate = rate;
    speakData.pitch = pitch;
    speakData.text = text;
    speakData.lang = "en";
    speechSynthesis.speak(speakData);
  }

  if ("speechSynthesis" in window) {
    let rate = 1;
    let pitch = 2;
    let volume = 1;
    speak(text, rate, pitch, volume);
  } else {
    console.log("Your browser doesn't support Speech Synthesis feature!");
  }
});

function addLabel() {
  if (sessionStorage.length > 1) {
    for (let key in sessionStorage) {
      if (key.startsWith('{"latitude":')) {
        const description = sessionStorage[key];
        let coordinate = JSON.parse(key);
        coordinate = L.latLng(coordinate.latitude, coordinate.longitude);
        console.log(description);
        console.log(coordinate);
        L.marker(coordinate, {
          title: description,
        }).addTo(map);
      }
    }
  }
}

addLabel();
