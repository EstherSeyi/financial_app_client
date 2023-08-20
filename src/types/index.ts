import { LucideIcon } from "lucide-react";

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  population: number;
  is_capital: boolean;
};

export type City2 = {
  datasetid: string;
  recordid: "d210ab247bc1dca4dfdfd54196ed4d2a63f73bb9";
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
  request: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
  };
};

export type CityWeatherResponse = WeatherResponse & {
  population: number;
  coordinates: string;
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
  payload: CityWeatherResponse;
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
