import { FavoriteAction, City } from "../types";

export const getFavorites = () => {
  const favString = localStorage.getItem("favorites");
  return favString ? JSON.parse(favString) : [];
};

export const getGroupedFavoriteCityWeather = (favoriteCitiesWeather: City[]) =>
  favoriteCitiesWeather.reduce((acca, city) => {
    const coords = city?.fields?.latitude + "," + city?.fields?.longitude;
    acca[coords] = city;
    return acca;
  }, {} as Record<string, City>);

const sortFavorites = (favorites: City[]) => {
  return favorites.sort((a: City, b: City) =>
    a?.fields?.name < b?.fields?.name ? -1 : 1
  );
};

export const isAFavorite = (favorites: City[], city: City) => {
  const groupedFavorites = getGroupedFavoriteCityWeather(favorites);
  const cityCoord = city?.fields?.latitude + "," + city?.fields?.longitude;
  return Boolean(groupedFavorites[cityCoord]);
};

const toggleFavorite = (state: City[], payload: City) => {
  let favorites;
  if (!isAFavorite(state, payload)) {
    favorites = [...state, payload];
  } else {
    favorites = state.filter(
      (city) => city?.fields?.geoname_id !== payload?.fields?.geoname_id
    );
  }

  localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
  return sortFavorites(favorites);
};

const removeFavorite = (state: City[], payload: City) => {
  if (isAFavorite(state, payload)) {
    const favorites = state.filter(
      (city) => city?.fields?.geoname_id !== payload?.fields?.geoname_id
    );
    localStorage.setItem("favorites", JSON.stringify(sortFavorites(favorites)));
    return sortFavorites(favorites);
  }

  return state;
};

export const favoriteReducer = (
  state: City[],
  { type, payload }: FavoriteAction
) => {
  switch (type) {
    case "TOGGLE_FAVORITE":
      return toggleFavorite(state, payload as City);
    case "REMOVE_FAVORITE":
      return removeFavorite(state, payload as City);
    default:
      return state;
  }
};
