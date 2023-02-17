import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { postData } from '../../utils/ApiRequest';
import { updateUserRoleUrl } from '../../utils/apiUrls';
import { Role, User } from '../../utils/types';
import CancelButton from '../common/CancelButton';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogUpdateUserRoleProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    user: User
}

export default function DialogUpdateUserRole(props: DialogUpdateUserRoleProps) {

    const [t] = useTranslation(["user-management", "general"]);
    const { user, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, users, roles } = state;

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const userRoleIds = (user.roles || []).map(r => r.id);
    const userRoles = roles.filter(r => userRoleIds.includes(r.id));
    const [selectedRoles, setSelectedRoles] = useState<Role[]>(userRoles);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
    }, [user])

    const isFormValid = selectedRoles.length > 0;

    const handleClose = () => {
        setOpen(false);
    };

    const handleRoleChange = (event: React.ChangeEvent<{}>, values: Role[]) => {
        setSelectedRoles(values);
    };

    async function handleSubmit () {

        try {
            setIsBusy(true);

            const data = {
                "userId": user.id,
                "roleIds": selectedRoles.map(r => r.id)
            };

            const response: any = await postData(updateUserRoleUrl, data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {

                const arr = [...users];
                const selectedUser = arr.find(u => u.id === user.id);
                if (selectedUser) {
                    const newRoles = await response.json();
                    selectedUser.roles = newRoles;
                    dispatch({ type: "setUsers", value: arr });
                }
                dispatch({ type: "setSnackBarInfo", value: { message: t('user.role.update.success') } });
                setOpen(false);

            } else {
                dispatch({
                    type: "setSnackBarInfo", value: {
                        message: t(response.status === 401 ? "error_Unauthorized" : "error_DataSave"),
                        severity: "error",
                        duration: 10000,
                    }
                });
            }
        }
        finally {
            setIsBusy(false);
            dispatch({ type: "setOpenSnackBar", value: true });
        }
    }

    return (
        <StyledDialog
            fullScreen={fullScreen}
            open={open}
            aria-labelledby="draggable-dialog-title"
            maxWidth={"sm"}
            fullWidth={true}
        >
            <DialogTitle id="draggable-dialog-title" color="primary" variant="h2">
                <ManageAccountsIcon sx={{ fontSize: 36, mb: -1, mr: 1 }} />
                {t('user.role.update.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('user.role.update.form.title')}
                </DialogContentText>
                <form>
                    <TextField
                        disabled
                        value={email}
                        label={t('email.address')}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        disabled
                        value={firstName}
                        label={t('first.name')}
                        variant="outlined"
                        fullWidth
                    />
                    <TextField
                        disabled
                        value={lastName}
                        label={t('last.name')}
                        variant="outlined"
                        fullWidth
                    />

                    <Autocomplete
                        multiple
                        value={selectedRoles}
                        disabled={false}
                        id="tags-outlined"
                        options={roles}
                        getOptionLabel={(option) => option.description}
                        onChange={(event, values) => handleRoleChange(event, values)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t("roles.assigned")}
                                placeholder={t("select.role") || ""}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />

                </form>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="outlined" autoFocus disabled={isBusy} onClick={handleClose}>
                    {t('cancel', { ns: "general" })}
                </CancelButton>
                <Button variant="contained" color="primary" disabled={isBusy || !isFormValid} onClick={handleSubmit} autoFocus>
                    {t('update', { ns: "general" })}
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ml: 1}} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
