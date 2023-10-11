import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { UseInkProvider } from "useink";
import { AlephTestnet, Aleph } from "useink/chains";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UseInkProvider
      config={{
        dappName: "AzeroMessage",
        chains: [AlephTestnet, Aleph],
      }}
    >
      <App />
    </UseInkProvider>
  </React.StrictMode>
);
