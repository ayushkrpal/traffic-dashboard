const express = require("express");
const app = express();

const path = require("path");

//sokcket io runs only on http server 
//SOCKET-IO

const http=require('http');

const socketio=require('socket.io');

const server  = http.createServer(app);

const io = socketio(server);



//mongoose setup
const mongoose = require("mongoose");

// Import model
const IntersectionModel = require("./models/intersection");

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// Static files
app.use(express.static(path.join(__dirname, "public")));




io.on("connection", (socket) => {
  console.log("Client connected");

  // Client asks for data of a clicked intersection
  socket.on("getIntersectionData", (id) => {
    const fakeData = {
      id,
      name: id === 1 ? "Park Street" : id === 2 ? "Howrah Bridge" : "Salt Lake",
      currentVehicles: Math.floor(Math.random() * 50),
      predictedVehicles: Math.floor(Math.random() * 60),
      currentPhase: ["RED", "GREEN", "YELLOW"][Math.floor(Math.random() * 3)],
      duration: Math.floor(Math.random() * 60)
    };
    socket.emit("intersectionData", fakeData);
  });

  // Manual signal control
    socket.on("changeSignal", ({ id, color }) => {
    console.log(`Intersection ${id} changed to ${color}`);
    // TODO: later update database/ML/device here
  });
});


// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/traffic")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));


// ---------------- Routes ----------------

// Dashboard (Map)
app.get("/", async (req, res) => {
    res.render("index");
 
});

// Seed test data
app.get("/seed", async (req, res) => {
  try {
    await IntersectionModel.create([
      { id: 1, name: "Intersection A", lat: 28.61, lng: 77.21, status: "normal", volume: 1200, avgDelay: 30 },
      { id: 2, name: "Intersection B", lat: 28.62, lng: 77.22, status: "congested", volume: 2500, avgDelay: 90 }
    ]);
    res.send("Seeded sample data!");
  } catch (err) {
    console.error("Error seeding data:", err);
    res.status(500).send("Error seeding data");
  }
});

// Historical chart page
app.get("/historical", (req, res) => {
  res.render("historical", {
    labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM"],
    data: [50, 120, 90, 200, 150, 180],
    averageVehicles: 360,
    avgTime: "03:15"
  });
});

app.get()

// Intersection details (example page)
app.get("/intersections", (req, res) => {
  res.render("intersections", {
    currentVehicles: 35,
    predictedVehicles: 50,
    currentPhase: "Green",
    duration: 30
  });
});

// ---------------- Start Server ----------------
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
