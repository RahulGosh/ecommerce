import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { SearchContextProvider } from "./context/searchContext.tsx";
import { Provider } from "react-redux";
import { appStore } from "./store/store.ts";
import { useLoadUserQuery } from "./store/api/authApi.tsx";

const Custom = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadUserQuery();
  return <>{isLoading ? <h1>Loading...</h1> : <>{children}</>}</>;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <SearchContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchContextProvider>
      </Custom>
    </Provider>
  </StrictMode>
);
