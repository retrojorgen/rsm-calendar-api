/**
 * Route for events fetched from google sheet
 */
var express = require("express");
var router = express.Router();
const getKioskMenu = require("../getKioskMenu");

var kioskMenu = [];

router.get("/", async (req, res) => {
  if (!kioskMenu.length) {
    kioskMenu = await getKioskMenu();
    res.send(kioskMenu);
  } else {
    res.send(kioskMenu);
    kioskMenu = await getKioskMenu();
  }
});

module.exports = router;
