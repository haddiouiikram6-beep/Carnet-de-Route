import apiClient from "../api/apiClient";

const TripDataSource = {
  getTrips: async () => {
    const response = await apiClient.get("/trips");

    return response.data;
  },

  getTripById: async (id) => {
    const response = await apiClient.get(`/trips/${id}`);

    return response.data;
  },

  createTrip: async (tripData) => {
    const response = await apiClient.post("/trips", tripData);

    return response.data;
  },
};

export default TripDataSource;