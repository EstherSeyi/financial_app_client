import {
  FavoriteAction,
  CityWeatherResponse2,
  WeatherResponse2,
} from "../types";

export const getFavorites = () => {
  const favString = localStorage.getItem("favorites");
  return favString ? JSON.parse(favString) : [];
};

export const getGroupedFavoriteCityWeather = (
  favoriteCitiesWeather: WeatherResponse2[]
) =>
  favoriteCitiesWeather.reduce((acca, city) => {
    const coords = city?.coord.lat + "," + city.coord.lon;
    acca[coords] = city;
    return acca;
  }, {} as Record<string, WeatherResponse2>);

const sortFavorites = (favorites: CityWeatherResponse2[]) => {
  return favorites.sort((a: CityWeatherResponse2, b: CityWeatherResponse2) =>
    a?.name < b?.name ? -1 : 1
  );
};

export const isAFavorite = (
  favorites: CityWeatherResponse2[],
  city: CityWeatherResponse2
) => {
  const groupedFavorites = getGroupedFavoriteCityWeather(favorites);
  const cityCoord = city?.coord.lat + "," + city.coord.lon;
  return Boolean(groupedFavorites[cityCoord]);
};

const toggleFavorite = (
  state: CityWeatherResponse2[],
  payload: CityWeatherResponse2
) => {
  let favorites;
  if (!isAFavorite(state, payload)) {
    favorites = [...state, payload];
  } else {
    favorites = state.filter((city) => city.id !== payload.id);
  }

  localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
  return sortFavorites(favorites);
};

const removeFavorite = (
  state: CityWeatherResponse2[],
  payload: CityWeatherResponse2
) => {
  if (isAFavorite(state, payload)) {
    const favorites = state.filter((city) => city.id !== payload.id);
    localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
    return sortFavorites(favorites);
  }

  return state;
};

export const favoriteReducer = (
  state: CityWeatherResponse2[],
  { type, payload }: FavoriteAction
) => {
  switch (type) {
    case "TOGGLE_FAVORITE":
      return toggleFavorite(state, payload as CityWeatherResponse2);
    case "REMOVE_FAVORITE":
      return removeFavorite(state, payload as CityWeatherResponse2);
    default:
      return state;
  }
};
