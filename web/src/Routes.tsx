import { Routes, Route } from "react-router-dom";
import { LoginScreen } from "./pages/LoginScreen";
import { RegisterScreen } from "./pages/RegisterScreen";
import App from "./App";
import useUser from "./hooks/useUser";
import Page404 from "./components/404";

export default function RoutesComponents() {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      {user && <Route path="/chat" element={<App />} />}{" "}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
