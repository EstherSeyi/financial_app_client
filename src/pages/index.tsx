import { useReducer, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useGetCities } from "../hooks/city";
import CityItem from "../components/CityItem";
import { CityWeatherResponse2 } from "../types";
import {
  queryKeys as weatherKeys,
  useGetCitiesWeather,
} from "../hooks/weather";
import { favoriteReducer, getFavorites } from "../helpers/favorites";
import UserLocationModal from "../components/UserLocationModal";
import { getGeoLocationPermission } from "../helpers/location";

export default function Home() {
  const [favorites, dispatch] = useReducer(favoriteReducer, getFavorites());
  const [locationReqIsOpen, setLocationReqIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: cities } = useGetCities();
  const { data, isLoading, isError, error } = useGetCitiesWeather(cities);

  const handleFavorite = (city: CityWeatherResponse2) => {
    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: city,
    });
  };

  const handleDeleteCity = (city: CityWeatherResponse2) => {
    queryClient.setQueryData(
      weatherKeys.citiesWeatherDetails(),
      (oldData?: CityWeatherResponse2[]) => {
        return oldData?.filter((weather) => weather.id !== city.id);
      }
    );
    dispatch({
      type: "REMOVE_FAVORITE",
      payload: city,
    });
  };

  const permission = getGeoLocationPermission();

  useEffect(() => {
    if (!permission) {
      setLocationReqIsOpen(true);
    }
  }, [permission]);

  return (
    <>
      <UserLocationModal
        locationReqIsOpen={locationReqIsOpen}
        setLocationReqIsOpen={setLocationReqIsOpen}
      />
      {isLoading ? (
        "Loading..."
      ) : isError ? (
        <p>Errored: {error.message}</p>
      ) : (
        <>
          <section className="mt-6">
            <div>
              <h2 className="font-bold text-sm mb-2 ">FAVORITES</h2>
              {favorites.length ? (
                <div>
                  {favorites?.map((city: CityWeatherResponse2) => (
                    <CityItem
                      key={city.id}
                      city={city}
                      handleFavorite={handleFavorite}
                      handleDeleteCity={handleDeleteCity}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <span className="font-light italic text-sm">
                    No favorite city yet.
                  </span>
                </div>
              )}
            </div>
          </section>
          <section className="mt-6">
            <div>
              <h2 className="font-bold text-sm mb-2">OTHERS</h2>
              {data.length ? (
                <div>
                  {data.map((city: CityWeatherResponse2) => (
                    <CityItem
                      key={city.id}
                      city={city}
                      handleFavorite={handleFavorite}
                      handleDeleteCity={handleDeleteCity}
                    />
                  ))}
                </div>
              ) : (
                <div>
                  <span className="font-light italic text-sm">
                    No more city on your list.
                  </span>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
