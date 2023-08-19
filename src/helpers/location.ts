type LocationPermission = "granted" | "denied";

export const getGeoLocationPermission = () => {
  const locationPermission = localStorage.getItem("location_permission");
  return locationPermission ? (locationPermission as LocationPermission) : null;
};

export const storeGeoLocationPermission = (permission: LocationPermission) => {
  localStorage.setItem("location_permission", permission);
};
