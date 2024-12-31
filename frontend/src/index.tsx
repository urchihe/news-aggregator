import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";
import { MantineProvider } from "@mantine/core";

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <Provider store={store}>
                <MantineProvider withGlobalStyles withNormalizeCSS>
                    <App />
                </MantineProvider>
            </Provider>
        </React.StrictMode>
    );
}
