
export const defaultPassword = "newUser@2023";
const appConfigs = () => {
    return {
        title: process.env.REACT_APP_TITLE,
        backendUrl: process.env.REACT_APP_BACKEND_URL,
    }
}
export const appConfigurations = appConfigs();

const appKeyConfigs = () => {
    return {
        keyToken: process.env.REACT_APP_KEY_TOKEN,
        keyUserInfo: process.env.REACT_APP_KEY_USER_INFO,
    }
}

export const appKeyConfigurations = appKeyConfigs();

export const queryOptions = {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
};

export const queryOptionsRefetchOnMount = {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
}

export const queryOptionsDisabled = {
    enabled: false
}