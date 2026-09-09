import TripRepositoryImpl from "../../data/repositories/TripRepositoryImpl";

const getTripById = async (id) => {
  return await TripRepositoryImpl.getTripById(id);
};

export default getTripById;