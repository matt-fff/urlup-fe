import React from "react";
import ReactDOM from "react-dom/client";
import {
    ChakraProvider,
    extendTheme,
    type ThemeConfig,
} from "@chakra-ui/react";
import App from "./App.tsx";
import "./index.css";

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: true,
};

const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
