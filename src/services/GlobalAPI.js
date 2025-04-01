import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": import.meta.env.VITE_GOOGLE_PLACE_APIKEY,
    "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
  },
};

export const GetPlaceDetails = async (data) => {
  try {
    return await axios.post(BASE_URL, data, config);
  } catch (error) {
    console.error("Places API error:", error.response?.data || error.message);
    // Return default data so the app doesn't crash
    return { data: { places: [{ photos: [{ name: "" }] }] } };
  }
};
