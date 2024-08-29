var map = L.map("map");
map.setView([-6.26187, 106.613], 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Define marker locations for all stations
var markerLocations = [
  {
    name: "Halte Pradita",
    latlng: [-6.259438, 106.617486],
    popupContent:
      "Persons in bus stop: <span id='praditaCount'>Loading...</span>",
  },
  {
    name: "Halte SDC/UMN",
    latlng: [-6.257707, 106.616806],
    popupContent: "Static content for Halte SDC/UMN",
  },
  {
    name: "Halte Alloggio",
    latlng: [-6.266966, 106.605201],
    popupContent: "Static content for Halte Alloggio",
  },
];

// Add markers to the map for each station
markerLocations.forEach(function (location) {
  var marker = L.marker(location.latlng).addTo(map);
  marker.bindPopup(
    "<h3>" + location.name + "</h3><p>" + location.popupContent + "</p>"
  );
});

// Update marker content for Pradita dynamically
function updateMarkerContent() {
  fetch("http://localhost:8080/get-person-count")
    .then((response) => response.json())
    .then((data) => {
      var count = data.count;
      document.getElementById("praditaCount").textContent = count;
    })
    .catch((error) => {
      console.error("Error fetching person count:", error);
    });
}

// Call updateMarkerContent function every 2 seconds
setInterval(function () {
  updateMarkerContent();
}, 2000);
