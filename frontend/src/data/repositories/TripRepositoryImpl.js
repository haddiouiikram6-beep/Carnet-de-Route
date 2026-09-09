import TripDataSource from "../datasources/TripDataSource";

const TripRepositoryImpl = {
  getTrips: async () => {
    return await TripDataSource.getTrips();
  },

  getTripById: async (id) => {
    return await TripDataSource.getTripById(id);
  },

  createTrip: async (tripData) => {
    return await TripDataSource.createTrip(tripData);
  },
};

export default TripRepositoryImpl;