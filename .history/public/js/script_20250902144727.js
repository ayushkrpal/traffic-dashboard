const socket = io();   // Connect to same origin http://localhost:3000

socket.on("connect", () => {
  console.log("✅ Connected with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

// Initialize map (center near your intersections)
const map = L.map("map").setView([22.3175, 87.3065], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SIH PROJECT",
}).addTo(map);

const markers = {};
let myMarker;

// === 📍 Fixed Intersection Markers with Interactive Popups ===
const intersections = [
  { lat: 22.31727438951292, lng: 87.30717698096359, name: "Intersection A", info: "🚦 Heavy Traffic" },
  { lat: 22.319809049371347, lng: 87.30861504797637, name: "Intersection B", info: "✅ Smooth Flow" },
  { lat: 22.316756, lng: 87.304559, name: "Intersection C", info: "⚠️ Moderate Traffic" }
];

intersections.forEach(loc => {
  const popupContent = `
    <div style="min-width:180px;">
      <h6 class="fw-bold">${loc.name}</h6>
      <p>${loc.info}</p>
      <button class="btn btn-sm btn-success w-100 mb-1" onclick="changeSignal('${loc.name}')">Change to Green</button>
      <button class="btn btn-sm btn-danger w-100 mb-1" onclick="reportIssue('${loc.name}')">Report Issue</button>
      <button class="btn btn-sm btn-primary w-100" onclick="viewDetails('${loc.name}')">View Details</button>
    </div>
  `;

  L.marker([loc.lat, loc.lng])
    .addTo(map)
    .bindPopup(popupContent);
});

// === 📡 Geolocation tracking ===
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      socket.emit("send-location", { latitude, longitude });

      map.flyTo([latitude, longitude], 16, { animate: true });

      if (myMarker) {
        myMarker.setLatLng([latitude, longitude]);
      } else {
        myMarker = L.marker([latitude, longitude], { draggable: false })
          .addTo(map)
          .bindPopup("🟢 You are here")
          .openPopup();
      }
    },
    (err) => {
      console.error("⚠️ Geolocation error:", err.message);
    },
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  );
}

// === 👥 Handle other users ===
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  if (id === socket.id) return;

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`👤 User: ${id}`);
  }
});

socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});

// === Popup Button Handlers ===
function changeSignal(name) {
  alert(`✅ Signal at ${name} changed to GREEN!`);
}

function reportIssue(name) {
  alert(`⚠️ Issue reported at ${name}`);
}

function viewDetails(name) {
  alert(`📊 Viewing details for ${name}`);
}
