import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import "./App.css";
import Login from './components/authorization/Login';
import Footer from "./components/common/Footer";
import SnackBar from './components/common/SnackBar';
import NavBar from "./components/navigation/NavBar";
import UsersPage from "./components/user-management/UsersPage";
import { appReducer, initialAppState } from './utils/appState';
import { getToken, hasValidToken } from "./utils/auth-functions";
import { AppContextType } from "./utils/types";
import HomePage from "./components/Home/HomePage";

// Creating context for app state management
export const AppContext = React.createContext<AppContextType>({
    state: initialAppState,
    dispatch: () => { },
});
export const queryClient = new QueryClient();

export default function App() {

    const [state, dispatch] = useReducer(appReducer, initialAppState);
    const { token, selectedPage } = state;

    const accessToken = getToken();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const isTokenValid = hasValidToken();
        setAuthenticated(isTokenValid);
        dispatch({ type: "setToken", value: accessToken || "" })
    }, [accessToken])

    const isAuthenticated = authenticated && token !== "";
    function getPageLoggedIn() {

        switch (selectedPage) {
            case 'user-management':
                return <UsersPage />
            case 'dashboard':
            default:
                return <HomePage />
        }
    }
    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <AppContext.Provider value={{ state, dispatch }}>
                    {!isAuthenticated ?
                        <Login setAuthenticated={setAuthenticated} /> :
                        <Box>
                            <NavBar />
                            {getPageLoggedIn()}
                            <Footer />
                        </Box>}
                    <SnackBar />
                </AppContext.Provider>
            </QueryClientProvider>
        </Fragment>
    );
}
