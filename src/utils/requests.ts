import axios from "axios";

const source = axios.CancelToken.source();

export const cityRequest = axios.create({
  baseURL: import.meta.env.VITE_CITY_BASE_URL,
  cancelToken: source.token,
  params: {
    dataset: "geonames-all-cities-with-a-population-500",
  },
});

export const weatherRequest = axios.create({
  baseURL: import.meta.env.VITE_OPEN_WEATHER_BASE_URL,
  cancelToken: source.token,
  params: {
    appid: import.meta.env.VITE_OPEN_WEATHER_API_KEY,
  },
});

export const geolocationRequest = axios.create({
  baseURL: import.meta.env.VITE_GEOLOCATION_BASE_URL,
  params: { token: import.meta.env.VITE_GEOLOCATION_API_KEY },
});
