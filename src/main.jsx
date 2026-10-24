import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App.jsx";
import { DataContextProvider } from "./context/dataContext.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <DataContextProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </DataContextProvider>
  </Provider>,
);
