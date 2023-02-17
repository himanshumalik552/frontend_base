import jwt_decode from "jwt-decode";
import { appKeyConfigurations } from "./app-configurations";

export const getToken = () => {
    if (!appKeyConfigurations.keyToken) { return undefined }

    const token = localStorage.getItem(appKeyConfigurations.keyToken);
    if (!token || token === null)
        return undefined;

    return token;
}

export const setToken = (token?: string) => {
    if (!appKeyConfigurations.keyToken)
        return;

    if (token)
        localStorage.setItem(appKeyConfigurations.keyToken, token);
    else
        localStorage.removeItem(appKeyConfigurations.keyToken);
}

export const hasValidToken = () => {
    const token = getToken();
    
    if (!token) { return false; }

    const decodedJwt: any = jwt_decode(token);
    if (!decodedJwt) { return false; }

    const tokenExpired = decodedJwt.exp * 1000 < Date.now();
    return !tokenExpired;
}

export const roleConfigurations = {
    admin: "admin",
    editor: "editor",
    viewer: "viewer",
}