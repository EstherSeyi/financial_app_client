import { useMutation } from "@tanstack/react-query";
import { geolocationRequest } from "../utils/requests";
import { IPResponse } from "../types";

export const queryKeys = {
  userLocation: () => ["user_location"] as const,
};

export function useGetGeolocation() {
  return useMutation(async () => {
    const ipResponse = await geolocationRequest.get<IPResponse>("/json");
    return ipResponse.data;
  });
}
