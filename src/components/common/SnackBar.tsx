import { Alert as MuiAlert, AlertProps } from '@mui/material';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import { styled } from '@mui/material/styles';
import React, { Fragment, useContext } from "react";
import { AppContext } from '../../App';
import { SnackBarInfo } from "../../utils/types";

const StyledSnackbar = styled(Snackbar)<SnackbarProps>(({ theme }) => ({

}));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackBarProps {
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    snackBarInfo?: SnackBarInfo;
}

const emptySnackBarInfo: SnackBarInfo = {
    message: "",
};

export default function SnackBar(props: SnackBarProps) {
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;

    const snackBarInfo = props.snackBarInfo
        ? props.snackBarInfo
        : state && state.snackBarInfo ? state.snackBarInfo : emptySnackBarInfo;
    const open = props.open || state.openSnackBar || false;

    const { setOpen } = props;
    const severity = snackBarInfo && snackBarInfo.severity ? snackBarInfo.severity : "info";
    const duration = snackBarInfo && snackBarInfo.duration ? snackBarInfo.duration : 5000;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            if (setOpen) {
                setOpen(false);
            }

            return;
        }
        else if (setOpen) {
            setOpen(false);
        }

        if (dispatch) {
            dispatch({ type: "setOpenSnackBar", value: false });
            dispatch({ type: "setSnackBarInfo", value: null });
        }
    };

    return (
        !snackBarInfo || !snackBarInfo.message ? <Fragment /> :
            <StyledSnackbar open={open} autoHideDuration={duration} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={severity}>
                        {snackBarInfo.message}
                    </Alert>
            </StyledSnackbar>
    );
}