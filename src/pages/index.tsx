import { useState, useEffect, useReducer } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useGetCities, queryKeys as cityKeys } from "../hooks/city";
import CityItem from "../components/CityItem";
import { City } from "../types";
import UserLocationModal from "../components/UserLocationModal";
import { getGeoLocationPermission } from "../helpers/location";
import { useUnit } from "../hooks/unit";
import { favoriteReducer, getFavorites } from "../helpers/favorites";

export default function Home() {
  const [favorites, dispatch] = useReducer(favoriteReducer, getFavorites());
  const [locationReqIsOpen, setLocationReqIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { unit } = useUnit();
  const { data: cities, isLoading, isError } = useGetCities(unit);

  const handleFavorite = (city: City) => {
    dispatch({
      type: "TOGGLE_FAVORITE",
      payload: city,
    });
  };

  const handleDeleteCity = (city: City) => {
    queryClient.setQueryData(cityKeys.cities(unit), (oldData?: City[]) => {
      return oldData?.filter(
        (item: City) => item?.fields?.geoname_id !== city?.fields?.geoname_id
      );
    });
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
        <p>Errored: Couldn't fetch Data, Please try refreshing page!</p>
      ) : (
        <>
          <section className="mt-6" data-cy="cities-container">
            <div>
              <h2 className="font-bold text-sm mb-2 ">FAVORITES</h2>
              {favorites.length ? (
                <div>
                  {favorites?.map((city: City) => (
                    <CityItem
                      key={city.fields.geoname_id}
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
              {cities.length ? (
                <div data-cy="cities-list">
                  {cities?.map((city: City) => (
                    <CityItem
                      data-cy={`city-${city?.fields?.name}`}
                      key={city.fields.geoname_id}
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
