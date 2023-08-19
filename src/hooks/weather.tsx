import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { weatherRequest } from "../utils/requests";
import {
  City,
  WeatherResponse,
  CityWeatherResponse,
  WeatherAPIError,
} from "../types";

export const queryKeys = {
  cityWeather: (cityName: string) => [cityName, "weather_details"],
  citiesWeatherDetails: () => ["cities_weather_details"],
};

export function useGetCityWeather(cityName: string) {
  return useQuery(
    queryKeys.cityWeather(cityName),
    async () => {
      const cityWeatherDet = await weatherRequest.get<
        CityWeatherResponse | WeatherAPIError
      >("/current", {
        params: {
          query: cityName,
        },
      });
      if ("error" in cityWeatherDet.data) {
        throw new Error(cityWeatherDet.data.error.info);
      }
      const coords = `${cityWeatherDet?.data?.location?.lat},${cityWeatherDet?.data?.location?.lon}`;
      cityWeatherDet.data.coordinates = coords;
      return cityWeatherDet;
    },
    {
      select: (response) => response.data as CityWeatherResponse,
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

      return citiesWeather.map((weather, index) => {
        const coords = weather.location.lat + "," + weather.location.lon;

        const cityWeather: CityWeatherResponse = {
          ...weather,
          coordinates: coords,
          population: cities[index]?.population ?? 0,
        };

        return cityWeather;
      });
    },
    {
      enabled: Boolean(cities?.length),
      select: (response) => {
        return response.sort((a: CityWeatherResponse, b: CityWeatherResponse) =>
          a.location.name < b.location.name ? -1 : 1
        );
      },
      staleTime: 3600000,
    }
  ) as UseQueryResult<CityWeatherResponse[], AxiosError<WeatherAPIError>>;
}
