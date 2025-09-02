const socket = io();   // connects to same origin http://localhost:3000

socket.on("connect", () => {
  console.log("✅ Connected to server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

const map = L.map("map").setView([0, 0], 10);

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
