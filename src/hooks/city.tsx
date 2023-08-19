import { UseQueryResult, useQuery } from "@tanstack/react-query";
// import { AxiosError, AxiosResponse } from "axios";

import { cityRequest } from "../utils/requests";
import { City } from "../types";
import { AxiosError } from "axios";

export const queryKeys = {
  cities: () => ["cities"] as const,
  searchCityByName: (cityName: string) => [cityName, "city_search"] as const,
  searchCityByCoord: (cityCoord: string) =>
    [cityCoord, "city_coord_search"] as const,
};

export function useGetCities() {
  // return { data: resp.data.sort((a, b) =>  a.name < b.name ? -1 : 1) };
  return useQuery(
    queryKeys.cities(),
    () =>
      cityRequest.get("/city", {
        params: {
          min_population: 5000,
          limit: 15,
        },
      }),
    {
      select: (response) =>
        response.data.sort((a: City, b: City) => (a.name < b.name ? -1 : 1)),
      staleTime: 3600000,
    }
  );
}

export const useSearchCityByName = (cityName: string) => {
  return useQuery(
    queryKeys.searchCityByName(cityName),
    () =>
      cityRequest.get("/city", {
        params: {
          name: cityName,
          limit: 15,
        },
      }),
    {
      enabled: Boolean(cityName),
      select: (response) => response.data,
      staleTime: 3600000,
    }
  ) as UseQueryResult<City[], AxiosError>;
};
