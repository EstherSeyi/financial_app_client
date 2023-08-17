export type City = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  population: number;
  is_capital: boolean;
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
  favourite: boolean;
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
