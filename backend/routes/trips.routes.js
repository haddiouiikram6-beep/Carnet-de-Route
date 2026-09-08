const express = require("express");

const {
  getTrips,
  getTripById,
  createTrip
} = require("../controllers/trips.controller");

const router = express.Router();

router.get("/", getTrips);

router.get("/:id", getTripById);

router.post("/", createTrip);

module.exports = router;