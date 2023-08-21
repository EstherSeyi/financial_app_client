import { LucideIcon } from "lucide-react";

export type City = {
  datasetid: string;
  recordid: string;
  fields: {
    coordinates: number[];
    latitude: string;
    timezone: string;
    ascii_name: string;
    longitude: string;
    dem: number;
    feature_code: string;
    geoname_id: string;
    population: number;
    modification_date: string;
    alternate_names: string;
    country_code: string;
    admin2_code: string;
    name: string;
    country: string;
    feature_class: string;
    admin1_code: string;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
  record_timestamp: string;
};

export type WeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type CityWeatherResponse = WeatherResponse & {
  population: number;
  geoname_id: string;
};

export type WeatherAPIError = {
  success: boolean;
  error: {
    code: number;
    type: string;
    info: string;
  };
};

export type CityListItemType = {
  name: string;
  temperature: number;
  icons: string[];
};

export type FavoriteAction = {
  type: string;
  payload: CityWeatherResponse | string;
};

export type Note = {
  text: string;
  createdAt: string;
  coord: string;
};

export type CityNotes = {
  [coord: string]: Note[];
};

export type NoteAction = {
  type: string;
  payload: Note | DeleteNotePayload;
};

export type DeleteNotePayload = {
  notes: Note[];
  coord: string;
};

export type DetailType = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  unit: string;
};

export type IPResponse = {
  city: string;
  country: string;
  ip: string;
  loc: string;
  org: string;
  region: string;
  timezone: string;
};
