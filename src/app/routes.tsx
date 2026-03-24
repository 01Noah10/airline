import { createBrowserRouter } from "react-router";
import { Root } from "./views/Root";
import { Home } from "./views/Home";
import { FlightSelection } from "./views/FlightSelection";
import { Addons } from "./views/Addons";
import { Payment } from "./views/Payment";
import { Confirmation } from "./views/Confirmation";
import { Manage } from "./views/Manage";
import { CheckIn } from "./views/CheckIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "flights", element: <FlightSelection /> },
      { path: "addons", element: <Addons /> },
      { path: "payment", element: <Payment /> },
      { path: "confirmation", element: <Confirmation /> },
      { path: "manage", element: <Manage /> },
      { path: "checkin", element: <CheckIn /> },
    ],
  },
]);
