import ListAltIcon from '@mui/icons-material/ListAlt';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { postData } from '../../utils/ApiRequest';
import { FinancialDetail } from '../../utils/types';
import CancelButton from '../common/CancelButton';
import { formatDateForAddDialogBox } from '../../utils/commonfunction';
import { postFinancialProgressUrl } from '../../utils/apiUrls';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogAddFinancialProgressProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    financialDetail: FinancialDetail;
}

export default function DialogAddFinancialProgress(props: DialogAddFinancialProgressProps) {

    const [t] = useTranslation(["financial-progress"]);
    const { financialDetail,open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, financialDetails } = state;
    const [description, setDescription] = useState(financialDetail.description);
    const [totalAmount, setTotalAmount] = useState(financialDetail.totalAmount);
    const currentDate = new Date();
    const currentDateToformated = formatDateForAddDialogBox(currentDate);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(currentDateToformated));
    const [amountPaidInMonth, setAmountPaidInMonth] = useState<number | undefined>(0);
    const [amountPaidTillMonth, setAmountPaidTillMonth] = useState<number | undefined>(0);
    const [isBusy, setIsBusy] = useState(false)
    useEffect(() => {
        setTotalAmount(financialDetail.totalAmount)
        setDescription(financialDetail.description)
    }, [ financialDetail])

    const handleAmountPaidInMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const newValueInNumber =  parseInt(newValue)
        if(newValueInNumber>=0){
            setAmountPaidInMonth(newValueInNumber)
        }
    
    };
    const handleAmountPaidTillMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const newValueInNumber =  parseInt(newValue)
        if(newValueInNumber>=0){
            setAmountPaidTillMonth(newValueInNumber)
        }
    };
    const isFormValid = true;
    const clearValues = () => {

    }
    const handleClose = () => {
        setOpen(false);
        clearValues()
    };
    async function handleSubmit() {
        try {
            setIsBusy(true);
            const data = {
                "amountPaidInMonth": amountPaidInMonth,
                "amountPaidTillMonth": amountPaidTillMonth,
                "progressDate": selectedDate
            };
            const response: any = await postData(postFinancialProgressUrl(financialDetail.id), data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {
                const newInformation = await response.json();
                const arr = [...financialDetails];
                const currentFinancialDetail = arr.find(a => a.id === financialDetail.id);
                if(currentFinancialDetail){
                    const progresses = currentFinancialDetail.progress;
                        progresses.push(newInformation);
                        dispatch({ type: "setFinancialDetails", value: arr});
                        dispatch({ type: "setFinancialDetail", value: currentFinancialDetail});
                }
                dispatch({ type: "setSnackBarInfo", value: { message: t('financial_progress_create_success') } });
                setOpen(false);
            } 
            else if(status===406){
                dispatch({ type: "setSnackBarInfo",  value: {  severity: "error", message: t('financial_progress_create_date_error_decription') } });
            } 
            else {
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
                <ListAltIcon sx={{ fontSize: 36, mb: -1, mr: 1 }} />
                {t('financial_progress_create_box_title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('financial_progress_create_description')}
                </DialogContentText>
                <form>
                    <TextField
                        required
                        disabled
                        value={description}
                        label={t('financial_progress_create_itemwork')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />

                    <TextField
                        required
                        disabled
                        value={totalAmount}
                        label={t('financial_progress_create_total_amount')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('financial_progress_create_date')}
                            value={selectedDate}
                            views={["year", "month", "day"]}
                            minDate={dayjs('2022-11-30')} 
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                            }}
                            renderInput={(params) => <TextField required fullWidth {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        required
                        type={'number'}
                        disabled={isBusy}
                        value={amountPaidInMonth}
                        label={t('financial_progress_create_amountPaidInMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleAmountPaidInMonthChange}
                    />
                    <TextField
                        required
                        type={'number'}
                        disabled={isBusy}
                        value={amountPaidTillMonth}
                        label={t('financial_progress_create_amountPaidTillMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleAmountPaidTillMonthChange}
                    />

                </form>
            </DialogContent>
            <DialogActions>
                <CancelButton variant="outlined" autoFocus disabled={isBusy} onClick={handleClose}>
                    {t('cancel', { ns: "general" })}
                </CancelButton>
                <Button variant="contained" color="primary" disabled={isBusy || !isFormValid} onClick={handleSubmit} autoFocus>
                    {t('save', { ns: "general" })}
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ ml: 1 }} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
