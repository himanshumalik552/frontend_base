import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { Fragment, useEffect, useReducer, useState } from 'react';
import "./App.css";
import Login from './components/authorization/Login';
import BasinPackagesList from "./components/basin-package/BasinPackagesList";
import PackageProgressDetail from "./components/basin-package/PackageProgressDetail";
import BasinsPage from "./components/basin/BasinsPage";
import Footer from "./components/common/Footer";
import SnackBar from './components/common/SnackBar';
import FinancialDetailTable from "./components/financial-progress/FinancialDetailTable";
import NavBar from "./components/navigation/NavBar";
import PhysicalDetailTable from "./components/physical-progress/PhysicalDetailTable";
import FinancialMonthlyProgressTable from "./components/progress-overview/FinancialMonthlyProgressTable";
import PhysicalMonthlyProgressTable from "./components/progress-overview/PhysicalMonthlyProgressTable";
import UsersPage from "./components/user-management/UsersPage";
import { appReducer, initialAppState } from './utils/appState';
import { getToken, hasValidToken } from "./utils/auth-functions";
import { AppContextType } from "./utils/types";

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
            case 'basin_packages':
                return <BasinPackagesList />
            case 'basin_package_details':
                return <PackageProgressDetail />
            case 'physical_progress_details':
                return <PhysicalDetailTable />
            case 'financial_progress_details':
                return <FinancialDetailTable />
            case 'physical_progress_report':
                return <PhysicalMonthlyProgressTable />
            case 'financial_progress_report':
                return <FinancialMonthlyProgressTable />
            case 'user-management':
                return <UsersPage />
            case 'dashboard':
            default:
                return <BasinsPage />
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
