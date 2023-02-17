import PasswordIcon from '@mui/icons-material/Password';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { patchData } from '../../utils/ApiRequest';
import { resetPasswordUrl } from '../../utils/apiUrls';
import { defaultPassword } from '../../utils/app-configurations';
import { User } from '../../utils/types';
import CancelButton from '../common/CancelButton';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogResetPasswordProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    user: User
}

export default function DialogResetPassword(props: DialogResetPasswordProps) {

    const [t] = useTranslation(["user-management", "general"]);
    const { user, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token } = state;

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
    }, [user])

    const handleClose = () => {
        setOpen(false);
    };

    async function handleSubmit () {

        try {
            setIsBusy(true);

            const response: any = await patchData(resetPasswordUrl(user.id), {}, token);
            const status = response.status;
            if (status >= 200 && status < 300) {
                dispatch({ type: "setSnackBarInfo", value: { message: t('reset.user.password.success') } });
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
                {t('reset.user.password.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('reset.user.password.form.title')}
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
                    <Typography variant="h5" color="secondary">
                        {t('reset.user.password.confirmation', { password: defaultPassword })}
                    </Typography>
                </form>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="outlined" autoFocus disabled={isBusy} onClick={handleClose}>
                    {t('cancel', { ns: "general" })}
                </CancelButton>
                <Button variant="contained" color="primary" disabled={isBusy} onClick={handleSubmit} autoFocus>
                    {t('reset', { ns: "general" })}
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ml: 1}} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
