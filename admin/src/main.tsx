import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { appStore } from "./store/store.ts";
import { useLoadAdminQuery } from "./store/api/adminApi.ts";

const Custom = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadAdminQuery();
  return <>{isLoading ? <h1>Loading...</h1> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Custom>
    </Provider>
  </StrictMode>
);
