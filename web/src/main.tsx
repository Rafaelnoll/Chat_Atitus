import { createRoot } from "react-dom/client";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./contexts/UserContext.tsx";
import RoutesComponents from "./Routes.tsx";

const root = createRoot(document.getElementById("root")!);

root.render(
  <FluentProvider className="h-100" theme={webDarkTheme}>
    <BrowserRouter>
      <UserProvider>
        <RoutesComponents />
      </UserProvider>
    </BrowserRouter>
  </FluentProvider>
);
