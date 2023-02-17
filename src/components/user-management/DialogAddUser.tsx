import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { postData } from '../../utils/ApiRequest';
import { createUserUrl } from '../../utils/apiUrls';
import { defaultPassword } from '../../utils/app-configurations';
import { regexEmail } from '../../utils/app-constants';
import CancelButton from '../common/CancelButton';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(0.5),
    }
}));

interface DialogAddUserProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
}

export default function DialogAddUser(props: DialogAddUserProps) {

    const [t] = useTranslation(["user-management", "general"]);
    const { open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, users } = state;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [companyName, setCompanyName] = useState("");

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneNumberError, setPhoneNumberError] = useState(false);
    const [companyNameError, setCompanyNameError] = useState(false);

    const [isBusy, setIsBusy] = useState(false);

    const clearValues = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setCompanyName("");
        setFirstNameError(false);
        setLastNameError(false);
        setEmailError(false);
        setPhoneNumberError(false);
        setCompanyNameError(false);
    }

    const isFormValid = firstName && lastName &&
        email && regexEmail.test(String(email).toLowerCase()) &&
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

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setEmail(newVal);
        setEmailError(newVal === undefined || !regexEmail.test(String(newVal).toLowerCase()));
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
                "email": email,
                "password": defaultPassword
            };

            const response: any = await postData(createUserUrl, data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {

                const arr = [...users];
                const addedUser = await response.json();
                arr.push(addedUser);

                dispatch({ type: "setUsers", value: arr });
                dispatch({ type: "setSnackBarInfo", value: { message: t('user.list.create.success') } });
                setOpen(false);
                clearValues();

            } else if (status === 409) {
                dispatch({
                    type: "setSnackBarInfo", value: {
                        message: t('user.list.create.conflict'),
                        severity: "error",
                        duration: 10000,
                    }
                });
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
                {t('user.list.create.title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('user.list.create.form.title')}
                </DialogContentText>
                <form>
                    <TextField
                        required
                        disabled={isBusy}
                        value={email}
                        label={t('email.address')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleEmailChange}
                        error={emailError}
                        helperText={emailError ? t('error.email.address'): ""}
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
                    <Typography variant="h5" color="secondary">
                        {t('defaul.password', { password: defaultPassword })}
                    </Typography>
                </form>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="outlined" autoFocus disabled={isBusy} onClick={handleClose}>
                    {t('cancel', { ns: "general" })}
                </CancelButton>
                <Button variant="contained" color="primary" disabled={isBusy || !isFormValid} onClick={handleSubmit} autoFocus>
                    {t('save', { ns: "general" })}
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ml: 1}} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
