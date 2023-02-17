/* eslint-disable react-hooks/exhaustive-deps */
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { patchData } from '../../utils/ApiRequest';
import { updateFinancialProgressUrl } from '../../utils/apiUrls';
import { FinancialDetail, FinancialProgress } from '../../utils/types';
import CancelButton from '../common/CancelButton';
import { formatDateToStringUpdateDialogBox } from '../../utils/commonfunction';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogUpdateFinancialDetailProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    financialDetail: FinancialDetail;
    selectedProgress: FinancialProgress;
}
interface SelectedDate {
    id: string,
    date: string
}

export default function DialogUpdateFinancialDetail(props: DialogUpdateFinancialDetailProps) {

    const [t] = useTranslation(["financial-progress"]);
    const { financialDetail, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, financialDetails } = state;
    const [description, setDescription] = useState(financialDetail.description);
    const [quantity, setQuantity] = useState(financialDetail.totalAmount);
    const [selectedProgress, setSelectedProgress] = useState<FinancialProgress | null>();
    const [progressDate, setProgressDate] = useState<SelectedDate | null>();
    const [amountPaidInMonth, setAmountPaidInMonth] = useState<number | undefined>();
    const [amountPaidTillMonth, setAmountPaidTillMonth] = useState<number | undefined>();
    const [isBusy, setIsBusy] = useState(false);
    const isFormValid = progressDate;
    const datePlaceholder = t('financial_progress_create_date');
    useEffect(() => {
        setQuantity(financialDetail.totalAmount);
        setDescription(financialDetail.description);
    }, [financialDetail, selectedProgress])

    const datesObject = financialDetail.progress.map(d => ({ id: d.id, date: formatDateToStringUpdateDialogBox(d.progressDate) }));
    const handleAmountPaidInMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setAmountPaidInMonth(newValue ? parseFloat(newValue) : 0);
    };

    const handleAmountPaidTillMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setAmountPaidTillMonth(newValue ? parseFloat(newValue) : 0);
    };

    const handleSelectDate = (event: React.ChangeEvent<{}>, value: SelectedDate | null) => {
        setProgressDate(value)
        if (value) {
            const progerss = financialDetail.progress.find(f => f.id === value.id);
            setSelectedProgress(progerss)
            setAmountPaidInMonth(progerss?.amountPaidInMonth);
            setAmountPaidTillMonth(progerss?.amountPaidTillMonth);
        }
    }

    const ClearValue = () => {
        setAmountPaidInMonth(0)
        setAmountPaidTillMonth(0)
        setProgressDate(null)
    }

    const handleClose = () => {
        setOpen(false);
        ClearValue();
    };

    async function handleSubmit() {
        if (selectedProgress) {
            try {
                setIsBusy(true);
                const data = {
                    "amountPaidInMonth": amountPaidInMonth,
                    "amountPaidTillMonth": amountPaidTillMonth,
                };
                const response: any = await patchData(updateFinancialProgressUrl(selectedProgress.id), data, token);
                const status = response.status;
                if (status >= 200 && status < 300) {

                    const newInformation = await response.json();
                    const arr = [...financialDetails];
                    const currentfinancialDetail = arr.find(a => a.id === financialDetail.id);
                    if (currentfinancialDetail) {
                        const progresses = currentfinancialDetail.progress;
                        const index = progresses.findIndex(p => p.id === selectedProgress.id);
                        if (index >= -1) {
                            progresses.splice(index, 1, newInformation);
                            dispatch({ type: "setFinancialDetails", value: arr });
                        }
                    }

                    dispatch({ type: "setSnackBarInfo", value: { message: t('financial_progress_update_success') } });
                    setOpen(false);
                    ClearValue()
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
                {t('financial_progress_update_box_title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('financial_progress_update_title')}
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
                        value={quantity}
                        label={t('financial_progress_create_total_amount')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Autocomplete

                        value={progressDate}
                        disabled={false}
                        id="base-map"
                        options={datesObject}
                        getOptionLabel={(option) => option.date}
                        onChange={(event, values) => handleSelectDate(event, values)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('financial_progress_create_date')}
                                placeholder={datePlaceholder}
                                variant="outlined"
                                fullWidth

                            />
                        )}
                    />
                    <TextField
                        required
                        focused
                        type={'number'}
                        disabled={isBusy || !progressDate}
                        value={amountPaidInMonth}
                        label={t('financial_progress_update_amountPaidInMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleAmountPaidInMonthChange}
                    />
                    <TextField
                        required
                        focused
                        type={'number'}
                        disabled={isBusy || !progressDate}
                        value={amountPaidTillMonth}
                        label={t('financial_progress_update_amountPaidTillMonth')}
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
                    {t('update', { ns: "general" })}
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ ml: 1 }} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
