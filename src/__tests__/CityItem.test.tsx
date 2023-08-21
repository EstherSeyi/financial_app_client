import userEvent from "@testing-library/user-event";

import { City } from "../types";
import { render, screen } from "../utils/test-utils";
import CityItem from "../components/CityItem";
import { formatNumber } from "../utils/format";
import dummyCity from "./setup/mock-city-data.json";

const handleDeleteCity = vi.fn();
const handleFavorite = vi.fn();

beforeEach(() => {
  render(
    <CityItem
      city={dummyCity as City}
      handleFavorite={handleFavorite}
      handleDeleteCity={handleDeleteCity}
    />
  );
});
describe("<CityItem/>", () => {
  test("city name and link render properly", async () => {
    const cityNameLink = screen.getByRole("link");
    expect(cityNameLink).toHaveTextContent(/beijing/i);
    expect(cityNameLink).toHaveAttribute(
      "href",
      `/beijing?lat=39.9075&lon=116.39723&geoname_id=1816670`
    );
  });

  test("renders other elements correctly", async () => {
    const population = screen.getByText(/population est.:/i);
    const [deleteBtn, addToFaveBtn] = screen.getAllByRole("button");
    const trashIcon = screen.getByTestId("trash-icon");
    const starIcon = screen.getByTestId("star-icon");

    expect(population).toHaveTextContent(
      `Population est.: ${formatNumber(dummyCity?.fields?.population)}`
    );
    expect(deleteBtn).toContainElement(trashIcon);
    expect(addToFaveBtn).toContainElement(starIcon);
    await userEvent.click(addToFaveBtn as Element);
    expect(handleFavorite).toHaveBeenCalledTimes(1);
    await userEvent.click(deleteBtn as Element);
    expect(handleDeleteCity).toHaveBeenCalledTimes(1);
  });
});
