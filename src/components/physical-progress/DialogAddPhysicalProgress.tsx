import ListAltIcon from '@mui/icons-material/ListAlt';
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { postData } from '../../utils/ApiRequest';
import { postPhysicalProgressUrl } from '../../utils/apiUrls';
import { PhysicalDetail, Status } from '../../utils/types';
import CancelButton from '../common/CancelButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { formatDateForAddDialogBox } from '../../utils/commonfunction';
const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogAddPhysicalProgressProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    physicalDetail: PhysicalDetail;
}

export default function DialogAddPhysicalProgress(props: DialogAddPhysicalProgressProps) {

    const [t] = useTranslation(["physical-progress"]);
    const { physicalDetail, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, statuses, physicalDetails } = state;
    const [description, setDescription] = useState(physicalDetail.description);
    const [quantity, setQuantity] = useState(physicalDetail.quantity);
    const [workStatus, setWorkStatus] = useState<Status | null>();
    const [workInMonth, setWorkInMonth] = useState<number | undefined>();
    const [workTillMonth, setWorkTillMonth] = useState<number | undefined>();
    const applicableStatuses = (statuses || []).filter(s => ["not-started", "completed", "in-progress"].includes(s.key));
    const currentDate = new Date();
    const currentDateToformated = formatDateForAddDialogBox(currentDate);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs(currentDateToformated));
    const [isBusy, setIsBusy] = useState(false)

    useEffect(() => {
        setQuantity(physicalDetail.quantity)
        setDescription(physicalDetail.description)
    }, [physicalDetail])

    const handleWorkInMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const newValueInNumber = parseInt(newValue);
        if (newValueInNumber >= 0) {
            setWorkInMonth(newValueInNumber)
        }
    };
    const handleWorkTillMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        const newValueInNumber = parseInt(newValue);
        if (newValueInNumber >= 0) {
            setWorkTillMonth(newValueInNumber)
        }
    };
    const handleSelectStatus = (event: React.ChangeEvent<{}>, status: Status | null) => {
        setWorkStatus(status)
    }
    const statusId = workStatus?.id;
    const ClearValue = () => {
        setWorkInMonth(0);
        setWorkTillMonth(0);
        setWorkStatus(null)
    }
    const isFormValid = workStatus;
    const handleClose = () => {
        setOpen(false);
        ClearValue();
    };

    async function handleSubmit() {
        try {
            setIsBusy(true);
            const data = {
                "workInMonth": workInMonth,
                "workTillMonth": workTillMonth,
                "statusId": statusId,
                "progressDate": selectedDate,
            };
            const response: any = await postData(postPhysicalProgressUrl(physicalDetail.id), data, token);
            const status = response.status;
            if (status >= 200 && status < 300) {
                const newInformation = await response.json();
                const arr = [...physicalDetails];
                const currentPhysicalDetail = arr.find(a => a.id === physicalDetail.id);
                if (currentPhysicalDetail) {
                    const progresses = currentPhysicalDetail.progress;
                    if(workStatus){
                        currentPhysicalDetail.status = workStatus;
                    }
                    progresses.push(newInformation);
                    dispatch({ type: "setPhysicalDetails", value: arr });
                    dispatch({ type: "setPhysicalDetail", value: currentPhysicalDetail });
                }
                dispatch({ type: "setSnackBarInfo", value: { message: t('physical_progress_create_success') } });
                setOpen(false);
                ClearValue()
            }
            else if (status === 406) {
                dispatch({ type: "setSnackBarInfo", value: { severity: "error", message: t('physical_progress_create_date_error_decription') } });
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
                {t('physical_progress_create_box_title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('physical_progress_create_description')}
                </DialogContentText>
                <form>
                    <TextField
                        required
                        disabled
                        value={description}
                        label={t('physical_progress_create_itemwork')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />

                    <TextField
                        required
                        disabled
                        value={quantity}
                        label={t('physical_progress_create_quantity')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label={t('physical_progress_create_currentDate')}
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
                        disabled={isBusy || !selectedDate}
                        value={workInMonth}
                        label={t('physical_progress_create_workInMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleWorkInMonthChange}
                    />
                    <TextField
                        required
                        type={'number'}
                        disabled={isBusy || !selectedDate}
                        value={workTillMonth}
                        label={t('physical_progress_create_workTillMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleWorkTillMonthChange}
                    />

                    <Autocomplete
                        value={workStatus}
                        disabled={isBusy || !selectedDate}
                        id="base-map"
                        options={applicableStatuses}
                        getOptionLabel={(option) => option.description}
                        isOptionEqualToValue={(option, value) => option.key === value.key}
                        onChange={(event, values) => handleSelectStatus(event, values)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('physical_progress_update_workStatus')}
                                placeholder={t('physical_progress_update_workStatus') || ""}
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
                    {isBusy && <CircularProgress color="primary" size={30} sx={{ ml: 1 }} />}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}
