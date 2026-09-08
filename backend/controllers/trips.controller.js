const trips = require("../Data/trips");

const getTrips = (req, res) => {
  res.status(200).json(trips);
};

const getTripById = (req, res) => {
  const id = Number(req.params.id);

  const trip = trips.find((trip) => trip.id === id);

  if (!trip) {
    return res.status(404).json({
      message: "Voyage introuvable"
    });
  }

  res.status(200).json(trip);
};

const createTrip = (req, res) => {
  const {
    title,
    destination,
    startDate,
    endDate,
    notes
  } = req.body;

  if (!title || !destination || !startDate || !endDate) {
    return res.status(400).json({
      message: "title, destination, startDate et endDate sont obligatoires"
    });
  }

  const newTrip = {
    id: trips.length > 0 ? trips[trips.length - 1].id + 1 : 1,
    title,
    destination,
    startDate,
    endDate,
    notes: notes || ""
  };

  trips.push(newTrip);

  res.status(201).json(newTrip);
};

module.exports = {
  getTrips,
  getTripById,
  createTrip
};