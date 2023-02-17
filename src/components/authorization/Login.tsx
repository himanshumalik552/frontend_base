import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Avatar, Button, CircularProgress, Link, Typography } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { postData } from '../../utils/ApiRequest';
import { loginUrl } from '../../utils/apiUrls';
//import { postData } from '../../utils/ApiRequest';
//import { loginUrl } from '../../utils/apiUrls';
import { setToken } from '../../utils/auth-functions';
import { AuthToken } from '../../utils/types';
import Footer from '../common/Footer';

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
    wpaddingLeft: theme.spacing(2),
    marginTop: '7%',
    '& .MuiButton-root': {
        minWidth: '150px',
        marginTop: theme.spacing(2),
    },
    '& .MuiTextField-root, .MuiOutlinedInput-root': {
        marginBottom: theme.spacing(1)
    },
    '& .MuiAvatar-root': {
        backgroundColor: theme.palette.primary.main,
        margin: theme.spacing(1),
    },
    '& h1': {
        marginBottom: theme.spacing(2),
        fontSize: 40,
        color: "#00567D",
    },
    '& h2': {
        marginBottom: theme.spacing(1),
        fontSize: 40,
        color: "#0086A8"
    }
}));

interface LoginProps {
    setAuthenticated: (value: React.SetStateAction<boolean>) => void;
}

export default function Login(props: LoginProps) {

    const appContext = React.useContext(AppContext);
    const { dispatch } = appContext;

    const { setAuthenticated } = props;
    const [t] = useTranslation();

    const [email, setEmail] = useState("kaushal.sharma@rhdhv.com");
    const [password, setPassword] = useState("newUser@2023");
    const [isBusy, setIsBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setEmail(newVal);
        setEmailError(!isEmailValid(newVal));
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = event.target.value;
        setPassword(newVal);
        setPasswordError(!newVal || newVal.length <= 0);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const isEmailValid = (email: string) => {
        if (!email || email.length <= 0) { return false; }

        const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regexEmail.test(email.trim().toLowerCase());
    }

    const isFormValid = isEmailValid(email) && password && password.length > 0;

    const handleSubmit = async () => {
        try {
            setIsBusy(true);

            const data = {
                "email": email,
                "password": password
            };

            const response: any = await postData(loginUrl, data);
            const status = response.status;
            if (status === 200 || status === 201) {
                const responseData: AuthToken = await response.json();
                const grabbedToken = !responseData || !responseData.token ? "" : responseData.token;
                setToken(grabbedToken);
                dispatch({ type: "setToken", value: grabbedToken });
                dispatch({
                    type: "setSnackBarInfo", value: {
                        message: t("successLogin"),
                    }
                });
                dispatch({ type: "setOpenSnackBar", value: true });
                setAuthenticated(true);
            } else {
                dispatch({
                    type: "setSnackBarInfo", value: {
                        message: t("error_Unauthorized"),
                        severity: "error",
                        duration: 10000,
                    }
                });
                dispatch({ type: "setOpenSnackBar", value: true });
                setToken();
                setAuthenticated(false);
            }
        }
        finally {
            setIsBusy(false);
        }
    }

    return (
        <Fragment>
            <StyledGrid container direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="h1">
                        Fremaa dashboard
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="h2">
                        Login
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Avatar>
                            <LockIcon />
                        </Avatar>
                        <form>
                            <TextField
                                fullWidth
                                value={email}
                                margin="none"
                                variant="outlined"
                                required={true}
                                multiline
                                id="email"
                                name="email"
                                autoComplete="off"
                                label={"Email"}
                                placeholder={"Email"}
                                onChange={handleChangeEmail}
                                disabled={isBusy}
                                error={emailError}
                                helperText={emailError ? "Invalid email address" : ""}
                            />
                            <FormControl variant="outlined" fullWidth>
                                <InputLabel htmlFor="outlined-adornment-password">Password *</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handleChangePassword}
                                    disabled={isBusy}
                                    autoComplete="off"
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    error={passwordError}
                                />
                            </FormControl>
                        </form>
                    </Grid>
                </Grid>

                <Fragment>
                    <Typography variant="body2">
                        By clicking means you have agreed with our &nbsp;
                    </Typography>
                    <Link variant="body2">
                        terms and conditions
                    </Link>
                </Fragment>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={isBusy || !isFormValid}
                >
                    {"Login"}
                    {isBusy && <CircularProgress color="primary" size={30} />}
                </Button>
            </StyledGrid>
            <Footer />
        </Fragment>
    );
}