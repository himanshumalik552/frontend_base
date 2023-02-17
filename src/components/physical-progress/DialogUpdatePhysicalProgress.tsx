/* eslint-disable react-hooks/exhaustive-deps */
import ListAltIcon from '@mui/icons-material/ListAlt';
import { Autocomplete, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery } from '@mui/material';
import { DialogProps } from '@mui/material/Dialog';
import { styled, useTheme } from '@mui/material/styles';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { patchData } from '../../utils/ApiRequest';
import { updatePhysicalProgressUrl } from '../../utils/apiUrls';
import { PhysicalDetail, PhysicalProgress, Status } from '../../utils/types';
import CancelButton from '../common/CancelButton';
import { formatDateToStringUpdateDialogBox } from '../../utils/commonfunction';

const StyledDialog = styled(Dialog)<DialogProps>(({ theme }) => ({
    '& .MuiTextField-root, .MuiTypography-root': {
        margin: theme.spacing(1),
    }
}));

interface DialogUpdatePhysicalDetailProps {
    open: boolean;
    setOpen: (value: React.SetStateAction<boolean>) => void;
    physicalDetail: PhysicalDetail;
    selectedProgress: PhysicalProgress;
}
interface SelectedDate {
    id: string,
    date: string
}

export default function DialogUpdatePhysicalDetail(props: DialogUpdatePhysicalDetailProps) {

    const [t] = useTranslation(["physical-progress"]);
    const { physicalDetail, open, setOpen } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, physicalDetails, statuses } = state;
    const [description, setDescription] = useState(physicalDetail.description);
    const [quantity, setQuantity] = useState(physicalDetail.quantity);
    const [workStatus, setWorkStatus] = useState<Status | null>(physicalDetail.status);
    const [selectedProgress, setSelectedProgress] = useState<PhysicalProgress | null>();

    const [progressDate, setProgressDate] = useState<SelectedDate | null>();
    const [workInMonth, setWorkInMonth] = useState<number | undefined>();
    const [workTillMonth, setWorkTillMonth] = useState<number | undefined>();
    const applicableStatuses = (statuses || []).filter(s => ["not-started", "completed", "in-progress"].includes(s.key));
    const [isBusy, setIsBusy] = useState(false);
    const statusId = workStatus?.id;
    const isFormValid = workStatus && progressDate ;
    useEffect(() => {
        setQuantity(physicalDetail.quantity);
        setDescription(physicalDetail.description);
        setWorkStatus(physicalDetail.status)
    }, [physicalDetail, selectedProgress])
    const datesObject = physicalDetail.progress.map(d => ({ id: d.id, date: formatDateToStringUpdateDialogBox(d.progressDate) }));
    const handleWorkInMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValueInString = event.target.value;
        const newValue = parseInt(newValueInString)
        if (newValue >= 0) {
            setWorkInMonth(newValue);
        }

    };

    const handleWorkTillMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValueInString = event.target.value;
        const newValue = parseInt(newValueInString)
        if (newValue >= 0) {
            setWorkTillMonth(newValue);
        }
    };
    const handleSelectDate = (event: React.ChangeEvent<{}>, value: SelectedDate | null) => {
        setProgressDate(value)
        if (value) {

            const progerss = physicalDetail.progress.find(f => f.id === value.id);
            setSelectedProgress(progerss)
            setWorkInMonth(progerss?.workInMonth);
            setWorkTillMonth(progerss?.workTillMonth);
            setWorkStatus(physicalDetail.status)
        }
        else {
            setWorkInMonth(0);
            setWorkTillMonth(0);
            setWorkStatus(null)
        }
    }
    const handleSelectStatus = (event: React.ChangeEvent<{}>, status: Status | null) => {
        setWorkStatus(status)
    }

    const ClearValue = () => {
        setWorkInMonth(0);
        setWorkTillMonth(0);
        setWorkStatus(null);
        setSelectedProgress(null);
        setProgressDate(null);
    }

    const handleClose = () => {
        setOpen(false);
        ClearValue()
    };

    async function handleSubmit() {
        if (selectedProgress) {
            try {
                setIsBusy(true);
                const data = {
                    "statusId": statusId,
                    "workInMonth": workInMonth,
                    "workTillMonth": workTillMonth
                };

                const response: any = await patchData(updatePhysicalProgressUrl(selectedProgress.id), data, token);
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
                      const index = progresses.findIndex(p => p.id === selectedProgress.id);
                        if (index >= -1) {
                            
                            progresses.splice(index, 1, newInformation);
                            dispatch({ type: "setPhysicalDetails", value: arr });
                            dispatch({ type: "setPhysicalDetail", value: currentPhysicalDetail });
                        }
                    }
                    dispatch({ type: "setSnackBarInfo", value: { message: t('physical_progress_update_success') } });
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
                {t('physical_progress_update_box_title')}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('physical_progress_update_title')}
                </DialogContentText>
                <form>
                    <TextField
                        required
                        disabled
                        value={description}
                        label={t('physical_progress_update_itemwork')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />

                    <TextField
                        required
                        disabled
                        value={quantity}
                        label={t('physical_progress_update_quantity')}
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
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(event, values) => handleSelectDate(event, values)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={t('physical_progress_create_currentDate')}
                                placeholder={t('physical_progress_create_currentDate') || ""}
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
                        value={workInMonth}
                        label={t('physical_progress_update_workInMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleWorkInMonthChange}
                    />
                    <TextField
                        required
                        focused
                        type={'number'}
                        disabled={isBusy || !progressDate}
                        value={workTillMonth}
                        label={t('physical_progress_update_workTillMonth')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        onChange={handleWorkTillMonthChange}
                    />

                    <Autocomplete
                        value={workStatus}
                        disabled={!progressDate}
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
