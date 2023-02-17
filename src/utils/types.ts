export interface AppState {
    snackBarInfo: SnackBarInfo | null;
    openSnackBar: boolean;
    token: string;
    currentUser: User | null;
    selectedPage: AppTab | null,
    basins: Basin[],
    basinPackages: BasinPackage[],
    riverWorks: RiverWork[],
    selectedBasin: Basin | null,
    selectedBasinPackage: BasinPackage | null,
    physicalDetail: PhysicalDetail | null,
    financialDetail: FinancialDetail | null,
    financialDetails: FinancialDetail[],
    physicalDetails: PhysicalDetail[],
    physicalProgresses: PhysicalProgress[],
    financialProgresses: FinancialProgress[],
    users: User[],
    roles: Role[],
    statuses: Status[],
    selectedFinancialPeriod : FinancialPeriod | null,
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
        type: 'setBasinPackages',
        value: BasinPackage[];
    } |
    {
        type: 'setSelectedBasinPackage',
        value: BasinPackage | null;
    } |
    {
        type: 'setSelectedBasin',
        value: Basin | null;
    } |
    {
        type: 'setRiverWork',
        value: RiverWork[];
    } |
    {
        type: 'setPhysicalDetails',
        value: PhysicalDetail[];
    } |
    {
        type: 'setPhysicalDetail',
        value: PhysicalDetail | null;
    } |
    {
        type: 'setFinancialDetails',
        value: FinancialDetail[];
    } |
    {
        type: 'setFinancialDetail',
        value: FinancialDetail | null;
    } |
    {
        type: 'setPhysicalProgress',
        value: PhysicalProgress[];
    } |
    {
        type: 'setFinancialProgress',
        value: FinancialProgress[];
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
        type: 'setFinancialPeriod',
        value: FinancialPeriod | null;
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
    basinPackages: BasinPackage[];
}
export interface BasinPackage {
    id: string;
    name: string;
    remark: string;
    riverWork: RiverWork[];
    physicalDetail: PhysicalDetail[];
    financialDetail: FinancialDetail[];
}
export interface RiverWork {
    id: string;
    name: string;
    code: string;
    basinCode: string;
    workType: WorkType;
    lat: string;
    lon: string;
    reachLength: number;
    remark: string;
}

export type WorkType = "Anti-erosion" | "Embankment";
export type reportTypes = "monthly" | "fortnightly"| "weekly"| "daily";

export interface PhysicalDetail {
    id: string;
    description: string;
    quantity: number;
    unit: string;
    status: Status;
    weightage: number,
    parentId: string;
    order_number:number;
    progress: PhysicalProgress[];
    serialNo: number;
}
export interface PhysicalProgressCalculateHeader{
    workCompleted :number;
    workDone:number;
    percentageOfTotalWork: number;
    percentageOfWorkCompleted: number;
}
export interface PhysicalDetailProgress extends PhysicalDetail , PhysicalProgressCalculateHeader {
    progressDate: Date;
    workInMonth: number;
    workTillMonth: number;
}

export interface PhysicalProgress {
    id: string;
    progressDate: Date;
    workInMonth: number;
    workTillMonth: number;
}
export interface FinancialDetail {
    id: string;
    description: string;
    totalAmount: number;
    parentId: string;
    serialNo: number;
    weightage: number,
    progress: FinancialProgress[];
}
export interface FinancialProgressCalculateHeader{
    totalAmomuntPaid :number;
    percentageofPaymentPaid: number;
    percentageOfTotalCost: number;
    percentageOfTotalPayment: number;
}
export interface FinancialDetailProgress extends FinancialDetail,FinancialProgressCalculateHeader {
    progressDate: Date;
    amountPaidInMonth: number;
    amountPaidTillMonth: number;
}

export interface FinancialProgress {
    id: string;
    progressDate: Date;
    amountPaidInMonth: number;
    amountPaidTillMonth: number;
}
export interface RiverWorkImage {
    code: string;
    basinCode: string;
    path: string;
}

export interface FinancialPeriod {
    year: number;
    month: number;
    title: string;
}

export interface ProgressColumn {
    title: string;
    minDate: Date;
    maxDate: Date;
}
