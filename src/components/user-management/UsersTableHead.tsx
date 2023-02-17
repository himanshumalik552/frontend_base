import EditIcon from '@mui/icons-material/Edit';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, Checkbox, IconButton, TableCell, TableHead, TableRow, TableSortLabel, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Order, User } from '../../utils/types';
import PasswordIcon from '@mui/icons-material/Password';

interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
    numeric: boolean;
}

interface UsersTableHeadProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

export function UsersTableHead(props: UsersTableHeadProps) {

    const [t] = useTranslation("user-management");
    const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler =
        (property: keyof User) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };

    const headCells: readonly HeadCell[] = [
        {
            id: 'email',
            numeric: false,
            disablePadding: true,
            label: t('email.address'),
        },
        {
            id: 'firstName',
            numeric: false,
            disablePadding: true,
            label: t('first.name'),
        },
        {
            id: 'lastName',
            numeric: false,
            disablePadding: false,
            label: t('last.name'),
        },
        {
            id: 'phoneNumber',
            numeric: false,
            disablePadding: false,
            label: t('phone.number'),
        },
        {
            id: 'companyName',
            numeric: false,
            disablePadding: false,
            label: t('company.name'),
        },
        {
            id: 'roles',
            numeric: false,
            disablePadding: false,
            label: t('roles'),
        },
    ];

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        disabled
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

interface UserTableToolbarProps {
    numSelected: number;
    handleUpdateUser?: () => void;
    handleUpdateUserRole?: () => void;
    handleResetPassword?: () => void;
}

export default function UserTableToolbar(props: UserTableToolbarProps) {

    const [t] = useTranslation("user-management");
    const { numSelected, handleUpdateUser, handleUpdateUserRole, handleResetPassword } = props;

    const tooltipEditUser = t('tooltip.edit.user');
    const tooltipEditUserRoles = t('tooltip.edit.user.roles');
    const tooltipResetPassword = t('tooltip.reset.user.password');

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h2"
                    id="tableTitle"
                    component="div"
                >
                        { t('users')}
                </Typography>
            )}

            {numSelected === 1 && handleUpdateUser &&
                <Tooltip title={tooltipEditUser}>
                    <IconButton onClick={handleUpdateUser}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>}

            {numSelected === 1 && handleUpdateUserRole &&
                <Tooltip title={tooltipEditUserRoles}>
                    <IconButton onClick={handleUpdateUserRole}>
                        <ManageAccountsIcon />
                    </IconButton>
                </Tooltip>}

            {numSelected === 1 && handleResetPassword &&
                <Tooltip title={tooltipResetPassword} >
                    <IconButton onClick={handleResetPassword}>
                        <PasswordIcon />
                    </IconButton>
                </Tooltip>}
        </Toolbar>
    );
}