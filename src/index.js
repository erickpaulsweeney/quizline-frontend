import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css"
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </BrowserRouter>
);
