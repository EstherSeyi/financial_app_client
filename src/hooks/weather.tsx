import { useQuery } from "@tanstack/react-query";

import { weatherRequest } from "../utils/requests";
import { WeatherAPIError, CityWeatherResponse, Coord } from "../types";

export const queryKeys = {
  cityWeather: (cityCord: Coord, unit: string) => [
    cityCord.lat,
    cityCord.lon,
    unit,
    "weather_details",
  ],
  citiesWeatherDetails: (unit: string) => ["cities_weather_details", unit],
};

export function useGetCityWeather(
  cityCord: Coord,
  unit: string,
  geonameId: string | null
) {
  return useQuery(
    queryKeys.cityWeather(cityCord, unit),
    async () => {
      const cityWeatherDet = await weatherRequest.get<
        CityWeatherResponse | WeatherAPIError
      >("/weather", {
        params: {
          lat: cityCord?.lat,
          lon: cityCord?.lon,
          units: unit,
        },
      });
      if ("error" in cityWeatherDet.data) {
        throw new Error(cityWeatherDet.data.error.info);
      }

      if (geonameId) {
        cityWeatherDet.data.geoname_id = geonameId;
      }
      return cityWeatherDet;
    },
    {
      enabled: Boolean(geonameId) && Boolean(cityCord.lat),
      select: (response) => response.data as CityWeatherResponse,
      staleTime: 3600000,
    }
  );
}
