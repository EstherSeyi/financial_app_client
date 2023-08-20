import { Link, Outlet, useLocation } from "react-router-dom";
import SearchCity from "./SearchCity";
import ThemeToggle from "./ThemeToggle";

const Layout = () => {
  const location = useLocation();

  return (
    <main className="py-8 min-h-screen bg-bgBlue text-[#9399a2]">
      <div
        className={`w-11/12 mx-auto ${
          location.pathname === "/" ? "max-w-2xl" : ""
        }`}
      >
        <Link className="underline" to="/">
          Home
        </Link>
        <ThemeToggle />
        <SearchCity />
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
