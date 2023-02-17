import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { putData } from '../../utils/ApiRequest';
import { updateUserUrl } from '../../utils/apiUrls';
import { User } from '../../utils/types';
import CancelButton from '../common/CancelButton';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogUpdateUserProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    user: User
}

export default function DialogUpdateUser(props: DialogUpdateUserProps) {

    const [t] = useTranslation(["user-management", "general"]);
    const { user, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, users } = state;

    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [companyName, setCompanyName] = useState(user.companyName);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);

    const [isBusy, setIsBusy] = useState(false);

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setCompanyName(user.companyName);
    }, [user])

    const clearValues = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setCompanyName("");
        setFirstNameError(false);
        setLastNameError(false);
        setPhoneNumberError(false);
        setCompanyNameError(false);
    }

    const isFormValid = firstName && lastName &&
        phoneNumber && companyName;

    const handleClose = () => {
        setOpen(false);
        clearValues();
    };

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setFirstName(newVal);
        setFirstNameError(newVal === undefined || newVal.length < 3 || newVal.length > 100);
    };
    
    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setLastName(newVal);
        setLastNameError(newVal === undefined || newVal.length < 3 || newVal.length > 100);
    };

    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setPhoneNumber(newVal);
        setPhoneNumberError(newVal === undefined || newVal.length < 6 || newVal.length > 20);
    };

    const handleCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setCompanyName(newVal);
        setCompanyNameError(newVal === undefined || newVal.length < 3 || newVal.length > 100);
    };

    async function handleSubmit () {

        try {
            setIsBusy(true);

            const data = {
                "firstName": firstName,
                "lastName": lastName,
                "phoneNumber": phoneNumber,
                "companyName": companyName,
            };

            const response: any = await putData(updateUserUrl(user.id), data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {

                const arr = [...users];
                const addedUser = await response.json();
                const index = arr.findIndex(f=>f.id===user.id)
                if(index>=-1){
                    arr.splice(index,1,addedUser)
                }
                dispatch({ type: "setUsers", value: arr });
                dispatch({ type: "setSnackBarInfo", value: { message: t('user.list.update.success') } });
                setOpen(false);
                clearValues();
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
                <PersonAddIcon sx={{ fontSize: 36, mb: -1, mr: 1 }} />
                {t('user.list.update.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('user.list.update.form.title')}
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
                    <TextField
                        required
                        disabled={isBusy}
                        value={firstName}
                        label={t('first.name')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleFirstNameChange}
                        error={firstNameError}
                        helperText={firstNameError ? t('error.first.name', {range: "3-50"}) : ""}
                    />
                    <TextField
                        required
                        disabled={isBusy}
                        value={lastName}
                        label={t('last.name')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleLastNameChange}
                        error={lastNameError}
                        helperText={lastNameError ? t('error.last.name', { range: "3-50" }) : ""}
                    />
                    <TextField
                        required
                        disabled={isBusy}
                        value={phoneNumber}
                        label={t('phone.number')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handlePhoneNumberChange}
                        error={phoneNumberError}
                        helperText={phoneNumberError ? t('error.phone.number', { range: "6-20" }) : ""}
                    />
                    <TextField
                        required
                        disabled={isBusy}
                        value={companyName}
                        label={t('company.name')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleCompanyChange}
                        error={companyNameError}
                        helperText={companyNameError ? t('error.company.name', { range: "3-50" }) : ""}
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
