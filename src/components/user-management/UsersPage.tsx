import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Checkbox, Fab, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TableRowProps } from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../App';
import { getData } from '../../utils/ApiRequest';
import { getLookupRolesUrl, getUsersUrl } from '../../utils/apiUrls';
import { queryOptions } from '../../utils/app-configurations';
import { dataFetchKeys } from '../../utils/app-constants';
import { getComparator, stableSort } from '../../utils/tableFunctions';
import { Order, Role, User } from '../../utils/types';
import SkeletonWaitingTable from '../common/WaitingSkeleton';
import DialogAddUser from './DialogAddUser';
import DialogResetPassword from './DialogResetPassword';
import DialogUpdateUser from './DialogUpdateUser';
import DialogUpdateUserRole from './DialogUpdateUserRole';
import UserTableToolbar, { UsersTableHead } from './UsersTableHead';

const StyledTableRow = styled(TableRow)<TableRowProps>(({ theme }) => ({
    '& :hover': {
        cursor: "pointer",
    }
}));

export default function UsersPage() {

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token } = state;
    const users = state.users;

    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('firstName');
    const [selected, setSelected] = React.useState<readonly string[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
    const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);
    const [openUpdateUserRoleDialog, setOpenUpdateUserRoleDialog] = useState(false);
    const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        setFilteredUsers(users);
    }, [users])

    const {
        data: userList,
        isLoading: userListLoading,
    } = useQuery<User[]>(
        [dataFetchKeys.users],
        async () => {
            const result = await getData(getUsersUrl, token);
            return await result.json()
        },
        queryOptions
    );

    const {
        data: roleList,
        isLoading: roleListLoading,
    } = useQuery<Role[]>(
        [dataFetchKeys.roles],
        async () => {
            const result = await getData(getLookupRolesUrl, token);
            return await result.json()
        },
        queryOptions
    );

    useEffect(() => {
        dispatch({ type: "setUsers", value: userList || [] });
    }, [dispatch, userList])

    useEffect(() => {
        dispatch({ type: "setRoles", value: roleList || [] });
    }, [dispatch, roleList])

    const loading = userListLoading || roleListLoading;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof User,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: string) => {

        if (id) {
            const index = selected.findIndex(s => s === id);
            if (index >= 0) {
                setSelected([]);
                return setSelectedUser(null);
            }

            setSelected([id]);
            const user = users.find(u => u.id === id);
            setSelectedUser(user || null);
        }
        else {
            setSelected([]);
            setSelectedUser(null);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: string) => selected.indexOf(id) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredUsers.length) : 0;

    const handleAddUser = () => {
        setOpenAddUserDialog(true);
    }

    const handleUpdateUser = () => {
        setOpenUpdateUserDialog(true);
    }

    const handleUpdateUserRole = () => {
        setOpenUpdateUserRoleDialog(true);
    }

    const handleResetPassword = () => {
        setOpenResetPasswordDialog(true);
    }

    return (
        loading ? <SkeletonWaitingTable /> :
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <UserTableToolbar
                        numSelected={selected.length}
                        handleUpdateUserRole={handleUpdateUserRole}
                        handleResetPassword={handleResetPassword}
                        handleUpdateUser={handleUpdateUser} />
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size={'medium'}
                        >
                            <UsersTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={filteredUsers.length}
                            />
                            <TableBody>
                                {stableSort(filteredUsers, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user, index) => {
                                        const isItemSelected = isSelected(user.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <StyledTableRow
                                                hover
                                                onClick={(event: any) => handleClick(event, user.id)}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={user.id}
                                                selected={isItemSelected}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="user"
                                                    padding="none"
                                                >
                                                    {user.email}
                                                </TableCell>
                                                <TableCell align="left">{user.firstName}</TableCell>
                                                <TableCell align="left">{user.lastName}</TableCell>
                                                <TableCell align="left">{user.phoneNumber}</TableCell>
                                                <TableCell align="left">{user.companyName}</TableCell>
                                                <TableCell align="left">{user.roles && user.roles.length > 0 ? user.roles.map(r => r.description).join(", ") : "Not defined"}</TableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                {emptyRows > 0 &&
                                    <TableRow style={{ height: (53) * emptyRows }}>
                                        <TableCell colSpan={6} />
                                    </TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredUsers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>

                <Fab
                    variant="extended"
                    color="primary"
                    sx={{ position: "fixed", bottom: 70, right: 10 }}
                    onClick={handleAddUser}>
                    <PersonAddIcon sx={{ mr: 1 }} />
                    Add new user
                </Fab>
                <DialogAddUser open={openAddUserDialog} setOpen={setOpenAddUserDialog} />
                {selectedUser &&
                    <DialogUpdateUser open={openUpdateUserDialog} setOpen={setOpenUpdateUserDialog} user={selectedUser} />}
                {selectedUser &&
                    <DialogUpdateUserRole open={openUpdateUserRoleDialog} setOpen={setOpenUpdateUserRoleDialog} user={selectedUser} />}
                {selectedUser &&
                    <DialogResetPassword open={openResetPasswordDialog} setOpen={setOpenResetPasswordDialog} user={selectedUser} />}
            </Box>
    );
}