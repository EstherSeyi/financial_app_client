import { createBrowserRouter } from "react-router-dom";
import Home from "./pages";
import CityDetails from "./pages/city";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ":cityId",
        element: <CityDetails />,
      },
    ],
  },
]);

export default router;
