import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { LoginScreen } from "./pages/LoginScreen";
import { RegisterScreen } from "./pages/RegisterScreen";

export const routes = createBrowserRouter([
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
]);
