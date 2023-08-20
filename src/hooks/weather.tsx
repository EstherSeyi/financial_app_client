import { AxiosError } from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { weatherRequest2 } from "../utils/requests";
import {
  WeatherAPIError,
  City2,
  WeatherResponse2,
  CityWeatherResponse2,
} from "../types";

type Coord = {
  lat: string | null;
  lon: string | null;
};

export const queryKeys = {
  cityWeather: (cityCord: Coord) => [
    cityCord.lat,
    cityCord.lon,
    "weather_details",
  ],
  citiesWeatherDetails: () => ["cities_weather_details"],
};

export function useGetCityWeather(cityCord: Coord) {
  return useQuery(
    queryKeys.cityWeather(cityCord),
    async () => {
      const cityWeatherDet = await weatherRequest2.get<
        CityWeatherResponse2 | WeatherAPIError
      >("/weather", {
        params: {
          lat: cityCord?.lat,
          lon: cityCord?.lon,
        },
      });
      if ("error" in cityWeatherDet.data) {
        throw new Error(cityWeatherDet.data.error.info);
      }

      return cityWeatherDet;
    },
    {
      select: (response) => response.data as CityWeatherResponse2,
      staleTime: 3600000,
    }
  );
}

export function useGetCitiesWeather(cities: City2[]) {
  const queries = cities?.map(async (city) => {
    return weatherRequest2
      .get<WeatherResponse2 | WeatherAPIError>("/weather", {
        params: {
          lat: city?.fields?.latitude,
          lon: city?.fields?.longitude,
        },
      })
      .then((response) => {
        if ("error" in response.data) {
          throw new Error(response.data.error.info);
        }
        return response.data;
      })
      .catch((error) => {
        throw new Error(error);
      });
  });

  return useQuery(
    queryKeys.citiesWeatherDetails(),
    async () => {
      const citiesWeather = await Promise.all(queries);
      return citiesWeather.map((weather, index) => {
        const cityWeather: CityWeatherResponse2 = {
          ...weather,
          population: cities[index]?.fields.population ?? 0,
        };

        return cityWeather;
      });
    },
    {
      enabled: Boolean(cities?.length),
      select: (response) => {
        return response.sort(
          (a: CityWeatherResponse2, b: CityWeatherResponse2) =>
            a?.name < b.name ? -1 : 1
        );
      },
      staleTime: 3600000,
    }
  ) as UseQueryResult<CityWeatherResponse2[], AxiosError<WeatherAPIError>>;
}
