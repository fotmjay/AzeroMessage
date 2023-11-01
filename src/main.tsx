import "@fontsource/karla/300.css";
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/700.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/700.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@polkadot/api-augment";
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Aleph } from "useink/chains";
import { UseInkProvider } from "useink";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UseInkProvider
      config={{
        dappName: "AzeroMessage",
        chains: [Aleph],
      }}
    >
      <App />
    </UseInkProvider>
  </React.StrictMode>
);
