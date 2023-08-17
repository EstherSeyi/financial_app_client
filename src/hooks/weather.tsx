import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { weatherRequest } from "../utils/requests";
import {
  City,
  WeatherResponse,
  CityWeatherResponse,
  WeatherAPIError,
} from "../types";
import { getFavorites } from "../helpers/favorites";

export const queryKeys = {
  cityWeather: (cityName: string) => [cityName, "weather_details"],
  citiesWeatherDetails: () => ["cities_weather_details"],
};

export function useGetCityWeather(cityName: string) {
  return useQuery(
    queryKeys.cityWeather(cityName),
    () =>
      weatherRequest.get("/current", {
        params: {
          query: cityName,
        },
      }),
    {
      select: (response) => response.data,
      staleTime: 3600000,
    }
  );
}

export function useGetCitiesWeather(cities: City[]) {
  const queries = cities?.map(async (city) => {
    return weatherRequest
      .get<WeatherResponse>("/current", {
        params: {
          query: `${city.latitude},${city.longitude}`,
        },
      })
      .then((response) => response.data);
  });

  return useQuery(
    queryKeys.citiesWeatherDetails(),
    async () => {
      const citiesWeather = await Promise.all(queries);

      const favouriteCitiesWeather = getFavorites() as WeatherResponse[];

      const groupedFavouriteCityWeather = favouriteCitiesWeather.reduce(
        (acca, city) => {
          const coords = city.location.lat + "," + city.location.lon;
          acca[coords] = city;
          return acca;
        },
        {} as Record<string, WeatherResponse>
      );

      return citiesWeather.map((weather, index) => {
        const coords = weather.location.lat + "," + weather.location.lon;
        const isFavourite = groupedFavouriteCityWeather[coords];

        const cityWeather: CityWeatherResponse = {
          ...weather,
          coordinates: coords,
          favourite: Boolean(isFavourite),
          population: cities[index]?.population ?? 0,
        };

        return cityWeather;
      });
    },
    {
      enabled: Boolean(cities?.length),
      staleTime: 3600000,
    }
  ) as UseQueryResult<CityWeatherResponse[], AxiosError<WeatherAPIError>>;
}
