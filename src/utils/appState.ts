
import { AppState, appStateAction } from "./types";

export const initialAppState: AppState = {
    snackBarInfo: null,
    openSnackBar: false,
    token: "",
    currentUser: null,
    selectedPage: "dashboard",
    basins: [],
    basinPackages: [],
    riverWorks: [],
    selectedBasin: null,
    selectedBasinPackage: null,
    physicalDetail: null,
    financialDetail: null,
    physicalDetails: [],
    financialDetails: [],
    physicalProgresses: [],
    financialProgresses: [],
    users: [],
    roles: [],
    statuses: [],
    selectedProgressDate: null,
    selectedFinancialPeriod: null,
    imageScale: 50,
};

export function appReducer(state: AppState, action: appStateAction): AppState {
    switch (action.type) {
        case "setSnackBarInfo": {
            const newState: AppState = { ...state, snackBarInfo: action.value };
            return newState;
        }
        case "setOpenSnackBar": {
            const newState: AppState = { ...state, openSnackBar: action.value };
            return newState;
        }
        case "setToken": {
            const newState: AppState = { ...state, token: action.value };
            return newState;
        }
        case "setCurrentUser": {
            const newState: AppState = { ...state, currentUser: action.value };
            return newState;
        }
        case "setSelectedPage": {
            const newState: AppState = { ...state, selectedPage: action.value };
            return newState
        }
        case "setBasins": {
            const newState: AppState = { ...state, basins: action.value };
            return newState
        }
        case "setBasinPackages": {
            const newState: AppState = { ...state, basinPackages: action.value };
            return newState
        }
        case "setSelectedBasin": {
            const newState: AppState = { ...state, selectedBasin: action.value };
            return newState
        }
        case "setSelectedBasinPackage": {
            const newState: AppState = { ...state, selectedBasinPackage: action.value };
            return newState
        }
        case "setRiverWork": {
            const newState: AppState = { ...state, riverWorks: action.value };
            return newState
        }
        case "setPhysicalDetails": {
            const newState: AppState = { ...state, physicalDetails: action.value };
            return newState
        }
        case "setPhysicalDetail": {
            const newState: AppState = { ...state, physicalDetail: action.value };
            return newState
        }
        case "setPhysicalProgress": {
            const newState: AppState = { ...state, physicalProgresses: action.value };
            return newState
        }
        case "setFinancialDetails": {
            const newState: AppState = { ...state, financialDetails: action.value };
            return newState
        }
        case "setFinancialDetail": {
            const newState: AppState = { ...state, financialDetail: action.value };
            return newState
        }
        case "setFinancialProgress": {
            const newState: AppState = { ...state, financialProgresses: action.value };
            return newState
        }
        case "setUsers": {
            const newState: AppState = { ...state, users: action.value };
            return newState
        }
        case "setRoles": {
            const newState: AppState = { ...state, roles: action.value };
            return newState
        }
        case "setStatuses": {
            const newState: AppState = { ...state, statuses: action.value };
            return newState
        }
        case "setFinancialPeriod": {
            const newState: AppState = { ...state, selectedFinancialPeriod: action.value };
            return newState
        }
        case "setSelectedProgressDate": {
            const newState: AppState = { ...state, selectedProgressDate: action.value };
            return newState
        }
        case "setImageScale": {
            const newState: AppState = { ...state, imageScale: action.value };
            return newState
        }
        default:
            return state;
    }
}