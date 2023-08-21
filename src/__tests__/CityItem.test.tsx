import userEvent from "@testing-library/user-event";

import { CityWeatherResponse } from "../types";
import { render, screen } from "../utils/test-utils";
import CityItem from "../components/CityItem";
import { formatNumber } from "../utils/format";

const dummyCity = {
  coord: {
    lon: 3.3947,
    lat: 6.4541,
  },
  weather: [
    {
      id: 500,
      main: "Rain",
      description: "light rain",
      icon: "10d",
    },
  ],
  base: "stations",
  main: {
    temp: 300.06,
    feels_like: 302.6,
    temp_min: 300.06,
    temp_max: 300.06,
    pressure: 1011,
    humidity: 79,
  },
  visibility: 10000,
  wind: {
    speed: 5.51,
    deg: 199,
  },
  clouds: {
    all: 24,
  },
  dt: 1692531820,
  sys: {
    country: "NG",
    sunrise: 1692510053,
    sunset: 1692554357,
  },
  timezone: 3600,
  id: 2332459,
  name: "Lagos",
  cod: 200,
  population: 11624219,
  geoname_id: "11624219",
} as CityWeatherResponse;

const handleDeleteCity = vi.fn();
const handleFavorite = vi.fn();

beforeEach(() => {
  render(
    <CityItem
      city={dummyCity}
      handleFavorite={handleFavorite}
      handleDeleteCity={handleDeleteCity}
    />
  );
});
describe("<CityItem/>", () => {
  test("renders weather icon correctly", () => {
    const weatherIcon = screen.queryByRole("img");
    expect(weatherIcon).toHaveAttribute("src");
    expect(weatherIcon).toHaveAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dummyCity?.weather[0]?.icon}.png`
    );
    expect(weatherIcon).toHaveAttribute(
      "alt",
      dummyCity?.weather[0]?.description
    );
  });

  test("city name and link render properly", async () => {
    const cityNameLink = screen.getByRole("link");
    expect(cityNameLink).toHaveTextContent(/lagos/i);
    expect(cityNameLink).toHaveAttribute(
      "href",
      `/lagos?lat=6.4541&lon=3.3947&geoname_id=11624219`
    );
  });

  test("renders other elements correctly", async () => {
    const population = screen.getByText(/population est.:/i);
    const [deleteBtn, addToFaveBtn] = screen.getAllByRole("button");
    const trashIcon = screen.getByTestId("trash-icon");
    const starIcon = screen.getByTestId("star-icon");

    expect(population).toHaveTextContent(
      `Population est.: ${formatNumber(dummyCity.population)}`
    );
    expect(deleteBtn).toContainElement(trashIcon);
    expect(addToFaveBtn).toContainElement(starIcon);
    await userEvent.click(addToFaveBtn as Element);
    expect(handleFavorite).toHaveBeenCalledTimes(1);
    await userEvent.click(deleteBtn as Element);
    expect(handleDeleteCity).toHaveBeenCalledTimes(1);
  });
});
