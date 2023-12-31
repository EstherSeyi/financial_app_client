import { Link, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SearchCity from "./SearchCity";
import UnitToggle from "./UnitToggle";
import UnitProvider from "../context/unit";
import ErrorBoundary from "./ErrorBoundary";

const Layout = () => {
  const location = useLocation();

  return (
    <main className="py-8 min-h-screen bg-bgBlue text-primary">
      <div
        className={`w-11/12 mx-auto ${
          location.pathname === "/" ? "max-w-2xl" : ""
        }`}
      >
        <Link className="underline" to="/">
          Home
        </Link>
        <UnitProvider>
          <UnitToggle />
          <SearchCity />
          <ErrorBoundary>
            <Toaster />
            <Outlet />
          </ErrorBoundary>
        </UnitProvider>
      </div>
    </main>
  );
};

export default Layout;
