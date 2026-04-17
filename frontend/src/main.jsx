import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "@asgardeo/auth-react";

// connecting local app to asgardeo cloud
const config = {
  signInRedirectURL: "https://choreo-football-proxy.vercel.app/",
  signOutRedirectURL: "https://choreo-football-proxy.vercel.app/",
  clientID: "vCXbs7NuCuAD9Lnc1QoiEAxeydUa",
  baseUrl: "https://api.asgardeo.io/t/qaaed",
  scope: ["openid", "profile"],
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider config={config}>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);
