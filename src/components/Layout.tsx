import { Outlet } from "react-router-dom";
import SearchCity from "./SearchCity";
import ThemeToggle from "./ThemeToggle";

const Layout = () => {
  return (
    <main className="py-8 min-h-screen bg-bgBlue text-[#9399a2]">
      <div className="w-11/12 max-w-2xl mx-auto">
        <ThemeToggle />
        <SearchCity />
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
