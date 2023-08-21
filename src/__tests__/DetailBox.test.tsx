import { render, screen } from "../utils/test-utils";
import DetailBox from "../components/WeatherItemDetail";
import { WindIcon } from "lucide-react";

describe("<DetailBox/>", () => {
  test("renders component correctly", () => {
    render(
      <DetailBox label="Feels Like" value={40} icon={WindIcon} unit="°" />
    );
    const label = screen.getByText(/feels like/i);
    const value = screen.getByText(/40/i);
    expect(label).toBeInTheDocument();
    expect(value).toHaveTextContent("40°");
  });
});
