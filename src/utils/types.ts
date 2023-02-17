export interface AppState {
    snackBarInfo: SnackBarInfo | null;
    openSnackBar: boolean;
    token: string;
    currentUser: User | null;
    selectedPage: AppTab | null,
    basins: Basin[],
    selectedBasin: Basin | null,
    users: User[],
    roles: Role[],
    statuses: Status[],
    selectedProgressDate: Date | null,
    imageScale: number,
}
export type appStateAction =
    {
        type: "setSnackBarInfo";
        value: SnackBarInfo | null;
    } |
    {
        type: "setOpenSnackBar";
        value: boolean;
    } |
    {
        type: "setToken";
        value: string;
    } |
    {
        type: "setCurrentUser";
        value: User | null;
    } |
    {
        type: 'setSelectedPage',
        value: AppTab | null
    } |
    {
        type: 'setBasins',
        value: Basin[]
    } |

    {
        type: 'setSelectedBasin',
        value: Basin | null;
    } |

    {
        type: 'setUsers',
        value: User[];
    } |
    {
        type: 'setRoles',
        value: Role[];
    }|
    {
        type: 'setStatuses',
        value: Status[]
    }|

    {
        type: 'setSelectedProgressDate',
        value: Date | null;
    } |
    {
        type: 'setImageScale',
        value: number;
    }
    ;

export type AppContextType = {
    state: AppState;
    dispatch: React.Dispatch<appStateAction>;
};

export type Order = 'asc' | 'desc';
export type AppTab =
    | "user-management"
    | "river_basin"
    | "basin_packages"
    | "physical_progress_details"
    | "physical_progress_report"
    | "financial_progress_details"
    | "financial_progress_report"
    | "basin_package_details"
    | "dashboard";

export type UserSettting =
    'Profile' | 'Account' | 'Dashboard' | 'Logout'
    ;

    export type UserRole =
    'Editor' | 'administrator' | 'Viewer'
    ;
export interface SnackBarInfo {
    message: string;
    severity?: "error" | "warning" | "info" | "success";
    duration?: number;
}

export type AuthToken = {
    status: number;
    token: string | undefined;
};

export interface Status {
    id: string;
    key: string;
    description: string;
}

export interface Role {
    id: string;
    key: UserRole;
    description: string;
}
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    companyName: string;
    createdOn: Date;
    modifiedOn: Date;
    status: Status;
    roles: Role[];
}

export interface Basin {
    id: string;
    name: string;
    remark: string;
}
