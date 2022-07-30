if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const calendarRoutes = require("./routes/calendar.js");
const kioskMenuRoutes = require("./routes/kioskMenu.js");

const app = express();

app.use(cors());

// parse application/json
app.use(bodyParser.json());

app.use("/calendar/api", calendarRoutes);
app.use("/kiosk/api", kioskMenuRoutes);

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`listening on ${port}`);
