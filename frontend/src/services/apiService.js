import { Platform } from 'react-native';

/**
 * Base URL for the Carnet de Route backend API.
 *
 * - Android Emulator : needs 10.0.2.2 (maps to host's localhost)
 * - iOS Simulator    : localhost works fine
 * - Physical device  : replace with your machine's LAN IP,
 *                      e.g. 'http://192.168.1.42:3000'
 */
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://192.168.1.173:3000'
    : 'http://localhost:3000';

// ─── helpers ────────────────────────────────────────────────────────────────

const handleResponse = async (response) => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

// ─── service ────────────────────────────────────────────────────────────────

const apiService = {
  /**
   * GET /trips → array of all trip objects
   */
  async getTrips() {
    const response = await fetch(`${BASE_URL}/trips`);
    return handleResponse(response);
  },

  /**
   * GET /trips/:id → single trip object
   */
  async getTripById(id) {
    const response = await fetch(`${BASE_URL}/trips/${id}`);
    return handleResponse(response);
  },

  /**
   * POST /trips → created trip object
   * @param {{ title, destination, startDate, endDate, notes }} tripData
   */
  async createTrip(tripData) {
    const response = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },

  async updateTrip(id, tripData) {
    const response = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
    });
    return handleResponse(response);
  },

  async deleteTrip(id) {
    const response = await fetch(`${BASE_URL}/trips/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

export default apiService;
