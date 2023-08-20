import { AxiosError } from "axios";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { cityRequest2 } from "../utils/requests";
import { City2 } from "../types";

export const queryKeys = {
  cities: () => ["cities"] as const,
  searchCityByName: (cityName: string) => [cityName, "city_search"] as const,
  searchSingleCity: (cityName: string) =>
    [cityName, "single_city_search"] as const,
  searchCityByCoord: (cityCoord: string) =>
    [cityCoord, "city_coord_search"] as const,
};

export function useGetCities() {
  return useQuery(
    queryKeys.cities(),
    () =>
      cityRequest2.get("/search", {
        params: {
          rows: 15,
          sort: "population",
        },
      }),
    {
      select: (response) => {
        return response.data.records;
      },
      staleTime: 3600000,
    }
  );
}

export const useSearchCityByName = (cityName: string) => {
  console.log({ cityName });
  return useQuery(
    queryKeys.searchCityByName(cityName),
    () =>
      cityRequest2.get("/search", {
        params: {
          rows: 15,
          q: cityName,
        },
      }),
    {
      enabled: Boolean(cityName),
      select: (response) => {
        console.log({ response }, "LIE");
        return response.data.records;
      },
      staleTime: 3600000,
    }
  ) as UseQueryResult<City2[], AxiosError>;
};
export const useGetSingleCity = (cityName: string) => {
  return useQuery(
    queryKeys.searchSingleCity(cityName),
    () =>
      cityRequest2.get("/search", {
        params: {
          q: cityName,
        },
      }),
    {
      enabled: Boolean(cityName),
      select: (response) => response.data.records,
      staleTime: 3600000,
    }
  ) as UseQueryResult<City2[], AxiosError>;
};
