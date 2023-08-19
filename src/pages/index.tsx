import { useReducer, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useGetCities } from "../hooks/city";
import CityItem from "../components/CityItem";
import { CityWeatherResponse } from "../types";
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
  const { data, isLoading, isError } = useGetCitiesWeather(cities);

  const handleFavorite = (city: CityWeatherResponse) => {
    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: city,
    });
  };

  const handleDeleteCity = (city: CityWeatherResponse) => {
    queryClient.setQueryData(
      weatherKeys.citiesWeatherDetails(),
      (oldData?: CityWeatherResponse[]) => {
        return oldData?.filter(
          (weather) => weather.coordinates !== city.coordinates
        );
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
        "errored"
      ) : (
        <>
          <section className="mt-6">
            <div>
              <h2 className="font-bold text-sm mb-2 ">FAVORITES</h2>
              {favorites.length ? (
                <div>
                  {favorites?.map((city: CityWeatherResponse) => (
                    <CityItem
                      key={city.coordinates}
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
                  {data.map((city: CityWeatherResponse) => (
                    <CityItem
                      key={city.coordinates}
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
