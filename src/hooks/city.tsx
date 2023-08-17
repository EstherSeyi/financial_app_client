import { useQuery } from "@tanstack/react-query";
// import { AxiosError, AxiosResponse } from "axios";

import { cityRequest } from "../utils/requests";
import { City } from "../types";

export const queryKeys = {
  cities: () => ["cities"] as const,
};

export function useGetCities() {
  // return { data: resp.data.sort((a, b) =>  a.name < b.name ? -1 : 1) };
  return useQuery(
    queryKeys.cities(),
    async () => {
      return cityRequest.get("/city", {
        params: {
          min_population: 5000,
          limit: 15,
        },
      });
    },
    {
      select: (response) =>
        response.data.sort((a: City, b: City) => (a.name < b.name ? -1 : 1)),
      staleTime: 3600000,
    }
  );
}
