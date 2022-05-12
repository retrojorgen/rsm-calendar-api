/**
 * Route for events fetched from google sheet
 */
var express = require("express");
var router = express.Router();
const getEvents = require("../getEvents");

router.get("/", async (req, res) => {
  const events = await getEvents();
  //console.log(events);
  res.send(events);
});

module.exports = router;
