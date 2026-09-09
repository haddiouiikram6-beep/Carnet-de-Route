import TripRepositoryImpl from "../../data/repositories/TripRepositoryImpl";

const createTrip = async (tripData) => {
  return await TripRepositoryImpl.createTrip(tripData);
};

export default createTrip;