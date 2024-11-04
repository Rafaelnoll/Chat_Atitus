import { createRoot } from "react-dom/client";
import { FluentProvider, webDarkTheme } from "@fluentui/react-components";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./routes.tsx";

const root = createRoot(document.getElementById("root")!);

root.render(
  <FluentProvider className="h-100" theme={webDarkTheme}>
    <RouterProvider router={routes} />
  </FluentProvider>
);
