import { FavoriteAction, CityWeatherResponse } from "../types";

export const getFavorites = () => {
  const favString = localStorage.getItem("favorites");
  return favString ? JSON.parse(favString) : [];
};

const sortFavorites = (favorites: CityWeatherResponse[]) => {
  return favorites.sort((a: CityWeatherResponse, b: CityWeatherResponse) =>
    a.location.name.localeCompare(b.location.name)
  );
};

export const isAFavorite = (
  favorites: CityWeatherResponse[],
  city: CityWeatherResponse
) => {
  return favorites.findIndex((item) => item.coordinates === city.coordinates);
};

export const toggleFavorite = (
  state: CityWeatherResponse[],
  payload: CityWeatherResponse
) => {
  let favorites;
  if (isAFavorite(state, payload) === -1) {
    favorites = [...state, payload];
  } else {
    favorites = state.filter(
      (city) => city.coordinates !== payload.coordinates
    );
  }
  localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
  return sortFavorites(favorites);
};

export const favoriteReducer = (
  state: CityWeatherResponse[],
  { type, payload }: FavoriteAction
) => {
  switch (type) {
    case "TOGGLE_FAVORITE":
      return toggleFavorite(state, payload);
    default:
      return state;
  }
};
