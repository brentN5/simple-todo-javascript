import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Auth from "./Signup";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import "@fontsource/roboto";
import "bootstrap/dist/css/bootstrap.min.css";

// import { ChakraProvider } from "@chakra-ui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
