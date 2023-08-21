import { AxiosError } from "axios";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { cityRequest } from "../utils/requests";
import { City } from "../types";

export const queryKeys = {
  cities: (unit: string) => ["cities", unit] as const,
  searchCityByName: (cityName: string) => [cityName, "city_search"] as const,
  searchSingleCity: (cityQuery: string) =>
    [cityQuery, "single_city_search"] as const,
  searchCityByCoord: (cityCoord: string) =>
    [cityCoord, "city_coord_search"] as const,
};

export function useGetCities(unit: string) {
  return useQuery(
    queryKeys.cities(unit),
    async () => {
      const citiesRes = await cityRequest.get("/search", {
        params: {
          rows: 15,
          sort: "population",
        },
      });

      return citiesRes.data.records;
    },
    {
      select: (response) => {
        return response.sort((a: City, b: City) =>
          a?.fields?.name < b?.fields?.name ? -1 : 1
        );
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

// https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-500&q=lagos&lang=d210ab247bc1dca4dfdfd54196ed4d2a63f73bb9&rows=1&sort=population&facet=longitude&facet=latitude&refine.latitude=41.45102&refine.longitude=26.46067

export const useGetSingleCity = (cityQuery: string, code?: string | null) => {
  return useQuery(
    queryKeys.searchSingleCity(cityQuery),
    async () => {
      const parameters = code
        ? {
            q: cityQuery,
            rows: 1,
            facet: "country_code",
            "refine.country_code": code,
          }
        : { q: cityQuery, rows: 1 };
      const resp = await cityRequest.get("/search", {
        params: parameters,
      });

      return resp.data.records;
    },
    {
      enabled: Boolean(cityQuery),
      select: (response) => (response?.length ? response[0] : response),
      staleTime: 3600000,
    }
  ) as UseQueryResult<City, AxiosError>;
};
