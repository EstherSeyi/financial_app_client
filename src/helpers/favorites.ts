import { FavoriteAction, CityWeatherResponse, WeatherResponse } from "../types";

export const getFavorites = () => {
  const favString = localStorage.getItem("favorites");
  return favString ? JSON.parse(favString) : [];
};

export const getGroupedFavouriteCityWeather = (
  favouriteCitiesWeather: WeatherResponse[]
) =>
  favouriteCitiesWeather.reduce((acca, city) => {
    const coords = city.location.lat + "," + city.location.lon;
    acca[coords] = city;
    return acca;
  }, {} as Record<string, WeatherResponse>);

const sortFavorites = (favorites: CityWeatherResponse[]) => {
  return favorites.sort((a: CityWeatherResponse, b: CityWeatherResponse) =>
    a.location.name < b.location.name ? -1 : 1
  );
};

export const isAFavorite = (
  favorites: CityWeatherResponse[],
  city: CityWeatherResponse
) => {
  return (
    favorites.findIndex((item) => item.coordinates === city.coordinates) !== -1
  );
};

const toggleFavorite = (
  state: CityWeatherResponse[],
  payload: CityWeatherResponse
) => {
  let favorites;
  if (!isAFavorite(state, payload)) {
    favorites = [...state, payload];
  } else {
    favorites = state.filter(
      (city) => city.coordinates !== payload.coordinates
    );
  }

  localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
  return sortFavorites(favorites);
};

const removeFavorite = (
  state: CityWeatherResponse[],
  payload: CityWeatherResponse
) => {
  if (isAFavorite(state, payload)) {
    const favorites = state.filter(
      (city) => city.coordinates !== payload.coordinates
    );
    localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
    return sortFavorites(favorites);
  }

  return state;
};

export const favoriteReducer = (
  state: CityWeatherResponse[],
  { type, payload }: FavoriteAction
) => {
  switch (type) {
    case "TOGGLE_FAVORITE":
      return toggleFavorite(state, payload);
    case "REMOVE_FAVORITE":
      return removeFavorite(state, payload);
    default:
      return state;
  }
};
