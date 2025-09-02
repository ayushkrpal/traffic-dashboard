const socket = io();   // connects to same origin http://localhost:3000

socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

// Initialize the map
const map = L.map("map").setView([22.31727438951292, 87.30717698096359], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SIH PROJECT",
}).addTo(map);

const markers = {};
let myMarker;  // store your own marker

// geolocation tracking
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // emit to server
      socket.emit("send-location", { latitude, longitude });

      // center map on my location
      map.setView([latitude, longitude], 16);

      // add/update my own marker
      if (myMarker) {
        myMarker.setLatLng([latitude, longitude]);
      } else {
        myMarker = L.marker([latitude, longitude]).addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();
      }
    },
    (err) => {
      console.error(err);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// handle other users
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;

  // don't duplicate my own marker from the server
  if (id === socket.id) return;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map)
      .bindPopup(`User: ${id}`);
  }
});

// =============================
// STATIC INTERSECTIONS
// =============================
const intersections = [
  { lat: 22.31727438951292, lng: 87.30717698096359, name: "Intersection A", info: "🚦 Heavy Traffic" },
  { lat: 22.319809049371347, lng: 87.30861504797637, name: "Intersection B", info: "✅ Smooth Flow" },
  { lat: 22.316756, lng: 87.304559, name: "Intersection C", info: "⚠️ Moderate Traffic" }
];

intersections.forEach(loc => {
  const popupContent = `
    <div style="min-width:220px; text-align:center;">
      <h6 class="fw-bold mb-1">${loc.name}</h6>
      <p class="text-muted mb-2">${loc.info}</p>
      <div class="d-grid gap-2">
        <button class="btn btn-success btn-sm rounded-pill shadow-sm" onclick="changeSignal('${loc.name}')">
          <i class="bi bi-traffic-light"></i> Change to Green
        </button>
        <button class="btn btn-danger btn-sm rounded-pill shadow-sm" onclick="reportIssue('${loc.name}')">
          <i class="bi bi-exclamation-triangle"></i> Report Issue
        </button>
        <button class="btn btn-primary btn-sm rounded-pill shadow-sm" onclick="viewDetails('${loc.name}')">
          <i class="bi bi-bar-chart-line"></i> View Details
        </button>
      </div>
    </div>
  `;

  L.marker([loc.lat, loc.lng])
    .addTo(map)
    .bindPopup(popupContent);
});

// =============================
// Button Handlers
// =============================
function changeSignal(name) {
  alert(`🚦 Signal changed to GREEN at ${name}`);
}

function reportIssue(name) {
  alert(`⚠️ Issue reported at ${name}`);
}

function viewDetails(name) {
  alert(`📊 Viewing detailed stats for ${name}`);
}
