import axios from "axios";

const source = axios.CancelToken.source();

export const cityRequest = axios.create({
  baseURL: import.meta.env.VITE_NINJAS_BASE_URL,
  cancelToken: source.token,
  headers: {
    "X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY,
  },
});
export const cityRequest2 = axios.create({
  baseURL: import.meta.env.VITE_CITY_BASE_URL,
  cancelToken: source.token,
  params: {
    dataset: "geonames-all-cities-with-a-population-500",
  },
});

export const weatherRequest = axios.create({
  baseURL: import.meta.env.VITE_WEATHERSTACK_BASE_URL,
  cancelToken: source.token,
  params: {
    access_key: import.meta.env.VITE_WEATHERSTACK_API_KEY,
  },
});

export const geolocationRequest = axios.create({
  baseURL: import.meta.env.VITE_GEOLOCATION_BASE_URL,
  params: { token: import.meta.env.VITE_GEOLOCATION_API_KEY },
});
