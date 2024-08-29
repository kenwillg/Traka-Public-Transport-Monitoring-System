const express = require("express");
const path = require("path");
const { getCurrentTime } = require("./dateUtils");
const multer = require("multer");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const fs = require("fs");
const { google } = require("googleapis");

const PORT = 8080;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "driversdb",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});

// // Load client secrets from a local file.
// const credentials = JSON.parse(
//   fs.readFileSync("traka-management-app-b28c9a0eb21a.json")
// );
// const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// const auth = new google.auth.JWT(
//   credentials.client_email,
//   null,
//   credentials.private_key,
//   SCOPES
// );

// app.get("/google-sheet-data", async (req, res) => {
//   const spreadsheetId = "150KrjP7x6TY7m0ZJDoRQkI8N3fsEoDqOkwLRGDZLl-k"; // Replace with your Google Sheet ID
//   const range = "kotakSaranTraka!A1:F"; // Adjust the range as needed

//   const sheets = google.sheets({ version: "v4", auth });

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     const rows = response.data.values;
//     if (rows.length) {
//       res.json(rows);
//     } else {
//       res.send("No data found.");
//     }
//   } catch (error) {
//     console.error("Error fetching data from Google Sheets:", error);
//     res.status(500).send(`Failed to fetch data: ${error}`);
//   }
// });

// Date utils
app.get("/current-time", (req, res) => {
  const currentTime = getCurrentTime();
  res.send(`${currentTime}`);
});

// Views Routes
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.get("/live-view", (req, res) =>
  res.sendFile(__dirname + "/views/live-view.html")
);
app.get("/analytics-weekly", (req, res) =>
  res.sendFile(__dirname + "/views/analytics-weekly.html")
);
app.get("/analytics-monthly", (req, res) =>
  res.sendFile(__dirname + "/views/analytics-monthly.html")
);
app.get("/analytics-yearly", (req, res) =>
  res.sendFile(__dirname + "/views/analytics-yearly.html")
);
app.get("/drivers", (req, res) =>
  res.sendFile(__dirname + "/views/drivers.html")
);
app.get("/settings", (req, res) =>
  res.sendFile(__dirname + "/views/settings.html")
);
app.get("/reports", (req, res) =>
  res.sendFile(__dirname + "/views/reports.html")
);

// Fetch drivers
app.get("/drivers-list", (req, res) => {
  db.query("SELECT * FROM drivers", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Posting python backend:
let personCount = 0; // Variable to store the person count

app.post("/get-person-count", (req, res) => {
  const { count } = req.body;
  personCount = count; // Store the received count
  console.log(`Received object count from Python: ${count}`);
  res.json({ count }); // Echo back the received count
});

app.get("/get-person-count", (req, res) => {
  res.json({ count: personCount }); // Return the stored count
});

// Add driver
app.post("/add-driver", upload.single("driverImage"), (req, res) => {
  const { name, age, address } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const sql =
    "INSERT INTO drivers (name, age, address, imageUrl) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, age, address, imageUrl], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Error saving to database" });
    } else {
      res.json({
        id: result.insertId,
        name,
        age,
        address,
        imageUrl,
        message: "Driver added successfully!",
      });
    }
  });
});

app.listen(PORT, () =>
  console.log("[SERVER] Server has successfully running on PORT " + PORT)
);
