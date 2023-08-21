import userEvent from "@testing-library/user-event";

import { CityWeatherResponse } from "../types";
import { render, screen } from "../utils/test-utils";
import CityItem from "../components/CityItem";
import { formatNumber } from "../utils/format";
import dummyCity from "./setup/mock-city-data.json";

const handleDeleteCity = vi.fn();
const handleFavorite = vi.fn();

beforeEach(() => {
  render(
    <CityItem
      city={dummyCity as CityWeatherResponse}
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
