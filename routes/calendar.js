/**
 * Route for events fetched from google sheet
 */
var express = require("express");
var router = express.Router();
const getEvents = require("../getEvents");

var events = [];

router.get("/", async (req, res) => {
  if (!events.length) {
    events = await getEvents();
    res.send(events);
  } else {
    res.send(events);
    events = await getEvents();
  } //console.log(events);
});

module.exports = router;
