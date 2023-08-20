import { AxiosError } from "axios";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { cityRequest } from "../utils/requests";
import { City } from "../types";

export const queryKeys = {
  cities: () => ["cities"] as const,
  searchCityByName: (cityName: string) => [cityName, "city_search"] as const,
  searchSingleCity: (cityQuery: string) =>
    [cityQuery, "single_city_search"] as const,
  searchCityByCoord: (cityCoord: string) =>
    [cityCoord, "city_coord_search"] as const,
};

export function useGetCities() {
  return useQuery(
    queryKeys.cities(),
    () =>
      cityRequest.get("/search", {
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
  return useQuery(
    queryKeys.searchCityByName(cityName),
    () =>
      cityRequest.get("/search", {
        params: {
          rows: 15,
          q: cityName,
        },
      }),
    {
      enabled: Boolean(cityName),
      select: (response) => {
        return response.data.records;
      },
      staleTime: 3600000,
    }
  ) as UseQueryResult<City[], AxiosError>;
};
export const useGetSingleCity = (cityQuery: string) => {
  return useQuery(
    queryKeys.searchSingleCity(cityQuery),
    () =>
      cityRequest.get("/search", {
        params: {
          q: cityQuery,
        },
      }),
    {
      enabled: Boolean(cityQuery),
      select: (response) => response.data.records,
      staleTime: 3600000,
    }
  ) as UseQueryResult<City[], AxiosError>;
};
