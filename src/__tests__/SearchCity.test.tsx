import { fireEvent, render, screen, waitFor } from "../utils/test-utils";
import SearchCity from "../components/SearchCity";

describe("<SearchCity/>", () => {
  test("renders component correctly", async () => {
    render(<SearchCity />);

    const searchInput = screen.getByPlaceholderText(/Search By City Name.../i);
    expect(searchInput).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.change(searchInput, {
        target: {
          value: "lagos",
        },
      });
    });
    expect(searchInput).toHaveValue("lagos");
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
