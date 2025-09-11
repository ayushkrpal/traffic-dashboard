
//We are making the map here for our index page
const map = L.map("map").setView([22.3175, 87.3072], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SIH PROJECT",
}).addTo(map);

//We have added 10 demo markers or possible traffic intersections in our map
const intersections = [
  { lat: 22.319797, lng: 87.308679, name: "Intersection C", info: "Moderate Traffic" },
  { lat: 22.319221, lng: 87.303504, name: "Intersection D", info: "Construction Zone" },
  { lat: 22.318636, lng:  87.301205, name: "Intersection E", info: "Busy Crossroad" },
  { lat: 22.317333, lng: 87.300851, name: "Intersection G", info: "Traffic Jam" },
  { lat: 22.316705, lng: 87.301278, name: "Intersection H", info: "Signalized" },
  { lat:22.317121, lng:87.307145, name:"Intersection M",info:"Light traffic"},
  { lat: 22.3158056, lng: 87.3008333, name: "Intersection A", info: "Light traffic" },
  { lat: 22.3172222, lng: 87.2995,    name: "Intersection B", info: "Light traffic" },
  { lat: 22.3210833, lng: 87.3071389, name: "Intersection C", info: "Light traffic" },
  { lat: 22.3195278, lng: 87.3056667, name: "Intersection D", info: "Light traffic" },
];




intersections.forEach(loc => {
  const popupContent = `
    <div style="min-width:220px; text-align:center;">
      <h6 class="fw-bold mb-1">${loc.name}</h6>
      <p class="text-muted mb-2">${loc.info}</p>
      <div class="d-grid gap-2">
        <button class="btn btn-danger btn-sm rounded-pill shadow-sm" onclick="reportIssue('${loc.name}')">
          <i class="bi bi-exclamation-triangle"></i> Details
        </button>
        <button class="btn btn-primary btn-sm rounded-pill shadow-sm" onclick="viewGraph('${loc.name}')">
          <i class="bi bi-bar-chart-line"></i> View Graph
        </button>
      </div>
    </div>
  `;
  L.marker([loc.lat, loc.lng])
    .addTo(map)
    .bindPopup(popupContent);
});

//button functions 
function changeSignal(name) {
  window.location.href = `/intersections`;
}

function reportIssue(name) {
  window.location.href = `/intersections`;
}

function viewGraph(name) {
 window.location.href = `/historical`;
}
