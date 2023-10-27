import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./config/store";
import setupAxiosInterceptors from "./config/axios-interceptor";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
setupAxiosInterceptors();
root.render(
  <BrowserRouter>
    <React.StrictMode>
      <React.Suspense fallback={<span>Loading...</span>}>
        <Provider store={store}>
          <DndProvider backend={HTML5Backend}>
            <App />
          </DndProvider>
        </Provider>
      </React.Suspense>
    </React.StrictMode>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
