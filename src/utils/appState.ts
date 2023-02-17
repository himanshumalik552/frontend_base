
import { AppState, appStateAction } from "./types";

export const initialAppState: AppState = {
    snackBarInfo: null,
    openSnackBar: false,
    token: "",
    currentUser: null,
    selectedPage: "dashboard",
    basins: [],
    selectedBasin: null,
    users: [],
    roles: [],
    statuses: [],
    selectedProgressDate: null,
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
        case "setSelectedBasin": {
            const newState: AppState = { ...state, selectedBasin: action.value };
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