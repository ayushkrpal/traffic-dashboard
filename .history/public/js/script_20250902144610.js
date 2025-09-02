const socket = io();   // Connect to same origin http://localhost:3000

socket.on("connect", () => {
  console.log("✅ Connected with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected");
});

// Initialize map
const map = L.map("map").setView([20.5937, 78.9629], 5); // Default India view

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "SIH PROJECT",
}).addTo(map);

const markers = {};
let myMarker;

// === 📍 Fixed campus markers ===
const campusLocations = [
  { name: "Main Gate", coords: [28.5449, 77.2722] },
  { name: "Library", coords: [28.5458, 77.2745] },
  { name: "Canteen", coords: [28.5465, 77.2738] },
  { name: "Admin Block", coords: [28.5442, 77.2731] },
  { name: "Hostel", coords: [28.5471, 77.2727] },
];

campusLocations.forEach(loc => {
  L.marker(loc.coords)
    .addTo(map)
    .bindPopup(`📍 ${loc.name}`);
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
