import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

// ─────────────────────────────────────────────────────────────────────────────
// useTrips — manages the full list of trips
// ─────────────────────────────────────────────────────────────────────────────

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTrips();
      setTrips(data);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const addTrip = async (tripData) => {
    const newTrip = await apiService.createTrip(tripData);
    setTrips((prev) => [...prev, newTrip]);
    return newTrip;
  };

  return { trips, loading, error, refetch: fetchTrips, addTrip };
};

// ─────────────────────────────────────────────────────────────────────────────
// useTripById — fetches a single trip by its id
// ─────────────────────────────────────────────────────────────────────────────

export const useTripById = (id) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchTrip = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTripById(id);
        setTrip(data);
      } catch (err) {
        setError(err.message || 'Voyage introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  return { trip, loading, error };
};

export default useTrips;
