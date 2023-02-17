let backendUrl = process.env.REACT_APP_BACKENDURI;

export const loginUrl = `${backendUrl}auth/login`;
export const getUserDetailsUrl = `${backendUrl}user/logged-in`;
export const getUserUrl = `${backendUrl}user`;
export const getStatusLookUpUrl = `${backendUrl}lookup/status`;
export const updateUserProfileUrl = `${backendUrl}user`;
export const changePasswordUrl = `${backendUrl}user`;

export const getUsersUrl = `${backendUrl}user-management`;
export const createUserUrl = `${backendUrl}user-management`;
export const updateUserUrl = (userId: string) => {
    return `${backendUrl}user-management/${userId}`;
}
export const resetPasswordUrl = (userId: string) => {
    return `${backendUrl}user-management/${userId}`;
}
export const deleteUserUrl = (userId: string) => {
    return `${backendUrl}user/${userId}`;
}
export const getUserRoleUrl = `${backendUrl}user-role`;
export const updateUserRoleUrl = `${backendUrl}user-role`;
export const getBasinsUrl = `${backendUrl}basin`;
export const getBasinPackagesUrl = (basinId: string) => {
    return `${backendUrl}basin-package/${basinId}`;
}
export const getRiverWorkUrl = (basinPackageId: string) => {
    return `${backendUrl}river-work/${basinPackageId}`;
}
export const getPhysicalProgressUrl = (basinPackageId: string) => {
    return `${backendUrl}physical-progress/${basinPackageId}`;
}
export const postPhysicalProgressUrl = (basinPackageId: string) => {
    return `${backendUrl}physical-progress/${basinPackageId}`;
}
export const updatePhysicalProgressUrl = (Id: string) => {
    return `${backendUrl}physical-progress/${Id}`;
}
export const getFinancialProgressUrl = (basinPackageId: string) => {
    return `${backendUrl}financial-progress/${basinPackageId}`;
}
export const postFinancialProgressUrl = (basinPackageId: string) => {
    return `${backendUrl}financial-progress/${basinPackageId}`;
}
export const updateFinancialProgressUrl = (Id: string) => {
    return `${backendUrl}financial-progress/${Id}`;
}
export const getLookupRolesUrl = `${backendUrl}lookup/roles`;
export const getLookupStatusUrl = `${backendUrl}lookup/status`;