import { fireEvent, render, screen, waitFor } from "../utils/test-utils";
import UnitToggle from "../components/UnitToggle";

describe("<UnitToggle/>", () => {
  test("renders component correctly", async () => {
    render(<UnitToggle />);
    const unitSelect = screen.getByTestId("unit_select");
    const [metricOption, imperialOption] = screen.getAllByRole("option");
    expect(unitSelect).toContainElement(metricOption as HTMLElement);
    expect(unitSelect).toContainElement(imperialOption as HTMLElement);
    expect(metricOption).toHaveTextContent(/celsius/i);
    expect(imperialOption).toHaveTextContent(/fahrenheit/i);
    await waitFor(() => {
      fireEvent.change(unitSelect, {
        target: {
          value: "imperial",
        },
      });
    });
    expect(unitSelect).toHaveValue("imperial");
    await waitFor(() => {
      fireEvent.change(unitSelect, {
        target: {
          value: "metric",
        },
      });
    });
    expect(unitSelect).toHaveValue("metric");
  });
});
