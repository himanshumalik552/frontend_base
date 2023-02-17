import { ThemeProvider } from '@mui/material/styles';
import React, { Suspense } from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import './translations/i18nextConf';
import reportWebVitals from './reportWebVitals';
import baseTheme from './themes/baseTheme';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={baseTheme}>
            <Suspense fallback={null}>
                <App />
            </Suspense>
        </ThemeProvider >
    </React.StrictMode>,
);

reportWebVitals();