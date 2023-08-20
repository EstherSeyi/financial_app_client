import { Dispatch, createContext, useReducer } from "react";
import { favoriteReducer, getFavorites } from "../helpers/favorites";
import { CityWeatherResponse2, FavoriteAction } from "../types";

export const FavoritesContext = createContext<{
  favorites: CityWeatherResponse2[];
  dispatch: Dispatch<FavoriteAction>;
} | null>(null);

const FavoritesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [favorites, dispatch] = useReducer(favoriteReducer, getFavorites());
  return (
    <FavoritesContext.Provider value={{ dispatch, favorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
