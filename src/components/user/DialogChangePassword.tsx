import PasswordIcon from '@mui/icons-material/Password';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { Fragment, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { patchData } from '../../utils/ApiRequest';
import { changePasswordUrl } from '../../utils/apiUrls';
import CancelButton from '../common/CancelButton';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTypography-root, .MuiOutlinedInput-root': {
        marginBottom: theme.spacing(1.5),
    }
}));

interface DialogChangePasswordProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
}

export default function DialogChangePassword(props: DialogChangePasswordProps) {

    const [t] = useTranslation(["user-management", "general"]);
    const { open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, currentUser } = state;

    const email = currentUser?.email || "";
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [oldPasswordError, setOldPasswordError] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    
    const [isBusy, setIsBusy] = useState(false);

    if (!currentUser) {
        return <Fragment />;
    }

    const isFormValid = newPasswordError && oldPasswordError;

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setNewPassword(newVal);
        setNewPasswordError(newVal === undefined || newVal.length < 3 || newVal.length > 100 || newVal !== oldPassword);
    };

    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    }

    const handleConfirmNewPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setConfirmNewPassword(newVal);
        setConfirmNewPasswordError(newVal === undefined || newVal.length < 3 || newVal.length > 100 || newVal !== oldPassword);
    };

    const handleShowConfirmNewPassword = () => {
        setShowConfirmNewPassword(!showConfirmNewPassword);
    }
    
    const handleOldPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setOldPassword(newVal);
        setOldPasswordError(newVal === undefined || newVal.length < 3 || newVal.length > 100 || newVal !== newPassword);
    };

    const handleShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    }

    async function handleSubmit () {

        if (!currentUser) { return; }

        try {
            setIsBusy(true);
            
            const data = {
                "oldPassword": oldPassword,
                "newPassword": newPassword
            };

            const response: any = await patchData(changePasswordUrl, data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {
                dispatch({ type: "setSnackBarInfo", value: { message: t('user.password.update.success') } });
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
                <PasswordIcon sx={{ fontSize: 36, mb: -1, mr: 1 }} />
                {t('user.password.update.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('user.password.update.form.title')}
                </DialogContentText>
                <form>
                    <TextField
                        required
                        disabled
                        value={email}
                        label={t('email.address')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="current-password">{t('user.password.current')}</InputLabel>
                        <OutlinedInput
                            id="current-password"
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                            disabled={isBusy}
                            autoComplete="off"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowOldPassword}
                                        edge="end"
                                    >
                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            error={oldPasswordError}
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="new-password">{t('user.password.new')}</InputLabel>
                        <OutlinedInput
                            id="new-password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            disabled={isBusy}
                            autoComplete="off"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowNewPassword}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            error={newPasswordError}
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="confirm-new-password">{t('user.password.new.confirm')}</InputLabel>
                        <OutlinedInput
                            id="confirm-new-password"
                            type={showConfirmNewPassword ? 'text' : 'password'}
                            value={confirmNewPassword}
                            onChange={handleConfirmNewPasswordChange}
                            disabled={isBusy}
                            autoComplete="off"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowConfirmNewPassword}
                                        edge="end"
                                    >
                                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            error={confirmNewPasswordError}
                        />
                    </FormControl>
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
