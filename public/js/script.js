const socket = io();   // connects to same origin http://localhost:3000

socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});

const map = L.map("map").setView([22.3175, 87.3072], 15);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SIH PROJECT",
}).addTo(map);

// const markers = {};
// let myMarker;  // store your own marker

// // =============================
// // Geolocation tracking
// // =============================
// if (navigator.geolocation) {
//   navigator.geolocation.watchPosition(
//     (position) => {
//       const { latitude, longitude } = position.coords;

//       // emit to server
//       socket.emit("send-location", { latitude, longitude });

//       // center map on my location
//       map.setView([latitude, longitude], 16);

//       // add/update my own marker
//       if (myMarker) {
//         myMarker.setLatLng([latitude, longitude]);
//       } else {
//         myMarker = L.marker([latitude, longitude]).addTo(map)
//           .bindPopup("I am here")
//           .openPopup();
//       }
//     },
//     (err) => {
//       console.error(err);
//     },
//     {
//       enableHighAccuracy: true,
//       timeout: 5000,
//       maximumAge: 0,
//     }
//   );
// }

// // =============================
// // Handle other users
// // =============================
// socket.on("receive-location", (data) => {
//   const { id, latitude, longitude } = data;
//   if (id === socket.id) return; // skip own marker

//   if (markers[id]) {
//     markers[id].setLatLng([latitude, longitude]);
//   } else {
//     markers[id] = L.marker([latitude, longitude]).addTo(map)
//       .bindPopup(`User: ${id}`);
//   }
// });

const intersections = [
  { lat: 22.317274, lng: 87.307176, name: "Intersection A", info: "Heavy Traffic" },
  { lat: 22.319809, lng: 87.308615, name: "Intersection B", info: "Smooth Flow" },
  { lat: 22.316756, lng: 87.304559, name: "Intersection C", info: "Moderate Traffic" },
  { lat: 22.320900, lng: 87.305800, name: "Intersection D", info: "Construction Zone" },
  { lat: 22.322400, lng: 87.310200, name: "Intersection E", info: "Busy Crossroad" },
  { lat: 22.318200, lng: 87.311500, name: "Intersection F", info: "Clear Road" },
  { lat: 22.314800, lng: 87.309200, name: "Intersection G", info: "Traffic Jam" },
  { lat: 22.315900, lng: 87.306000, name: "Intersection H", info: "Signalized" }
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
