import UserLocationModal from "../components/UserLocationModal";
import { act, fireEvent, render, screen, waitFor } from "../utils/test-utils";

const setLocationReqIsOpen = vi.fn();
describe("<UserLocationModal/>", () => {
  test("renders component properly", async () => {
    act(() => {
      render(
        <UserLocationModal
          locationReqIsOpen={true}
          setLocationReqIsOpen={setLocationReqIsOpen}
        />
      );
    });
    expect(screen.getByText(/No, thanks!/i)).toBeTruthy();
    expect(screen.getByText(/Location Permission Request/i)).toBeTruthy();
    await waitFor(() => {
      fireEvent.click(screen.getByText(/No, thanks!/i));
    });
    expect(setLocationReqIsOpen).toHaveBeenCalled();
  });
});
