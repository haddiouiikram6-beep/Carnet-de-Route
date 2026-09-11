const express = require("express");

const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip
} = require("../controllers/trips.controller");

const router = express.Router();

router.get("/", getTrips);

router.get("/:id", getTripById);

router.post("/", createTrip);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

module.exports = router;