import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Paper, Tooltip, Typography, TypographyProps } from "@mui/material";
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box, { BoxProps } from "@mui/system/Box";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../App";
import { getData } from "../../utils/ApiRequest";
import { getFinancialProgressUrl, getPhysicalProgressUrl } from "../../utils/apiUrls";
import { queryOptions } from "../../utils/app-configurations";
import { dataFetchKeys } from "../../utils/app-constants";
import { getTotal, getTotalPercentageFinancialAmount, getTotalPercentagePhysicalDetailWork } from "../../utils/commonfunction";
import { FinancialDetail, PhysicalDetail } from "../../utils/types";
import ProgressCard from "../physical-progress/ProgressCard";
import RiverWorkDetailTable from "../river-work/RiverWorkDetailTable";

const StyledTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-evenly',
}));
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: theme.spacing(2)
}));

export default function PackageProgressDetail() {
    const [t] = useTranslation(["general-basin"]);
    const appContext = React.useContext(AppContext);
    const { state, dispatch } = appContext;
    const { selectedBasinPackage, physicalDetails, financialDetails, token } = state

    if (!selectedBasinPackage) {
        <React.Fragment />
    }

    const selectedBasinPackageId = selectedBasinPackage ? selectedBasinPackage.id : "";
    const selectedBasinPackageData = selectedBasinPackage ? selectedBasinPackage : undefined;

    const {
        data: physicalDetail,
        isLoading: physicalDetailDataLoading,
    } = useQuery<PhysicalDetail[]>(
        [`${dataFetchKeys.physicalProgressDetail}${selectedBasinPackageId}`, selectedBasinPackage],
        async () => {
            const result = await getData(getPhysicalProgressUrl(selectedBasinPackageId), token);
            return await result.json();
        },
        queryOptions
    );
    useEffect(() => {
        dispatch({ type: "setPhysicalDetails", value: physicalDetail || [] });
    }, [dispatch, physicalDetail])

    const works = physicalDetail?.map(p => getTotalPercentagePhysicalDetailWork(p));
    const totalWork = getTotal(works);
    const totalWorkPercentage = Math.round(totalWork);
    const leftWork = 100-totalWorkPercentage;

    const {
        data: financialDetail,
        isLoading: financialDetailDataLoading,
    } = useQuery<FinancialDetail[]>(
        [`${dataFetchKeys.financialProgressDetail}${selectedBasinPackageId}`, selectedBasinPackage],
        async () => {
            const result = await getData(getFinancialProgressUrl(selectedBasinPackageId), token);
            return await result.json();
        },
        queryOptions
    );
    const paidAmounts = financialDetail?.map(p => getTotalPercentageFinancialAmount(p));
    const totalAmount = getTotal(paidAmounts);
    const totalAmountPercentage = Math.round(totalAmount);
    const leftAmount = 100-totalAmountPercentage;

    
    useEffect(() => {
        dispatch({ type: "setFinancialDetails", value: financialDetail || [] });
    }, [dispatch, financialDetail])

    const loading = physicalDetailDataLoading || financialDetailDataLoading;

    const handleFinancialDetail = () => {
        dispatch({ "type": "setFinancialDetails", value: financialDetails });
        dispatch({ "type": "setSelectedPage", value: 'financial_progress_details' });
    }

    const handlePhysicalDetail = () => {
        dispatch({ "type": "setPhysicalDetails", value: physicalDetails });
        dispatch({ "type": "setSelectedPage", value: 'physical_progress_details' });
    }

    const handlePhysicalProgressReport = () => {
        dispatch({ type: "setPhysicalDetails", value: physicalDetails });
        dispatch({ type: "setSelectedPage", value: 'physical_progress_report' });
    }

    const handleFinancialProgressReport = () => {
        dispatch({ type: "setFinancialDetails", value: financialDetails });
        dispatch({ type: "setSelectedPage", value: 'financial_progress_report' });
    }

    const physicalCardTitle = t('physical_progress');
    const financialCardTitle = t('financial_progress');
    const physicalProgressData = [totalWorkPercentage, leftWork];
    const financialProgressData = [totalAmountPercentage, leftAmount];

    const handleGoBack = () => {
        dispatch({ type: "setSelectedBasinPackage", value: null });
        dispatch({ type: "setSelectedPage", value: "basin_packages" });
    }

    return (
        <React.Fragment>
            {loading}
            <Grid container justifyContent="center" alignContent="center">
                <Tooltip title="Go back to previous page">
                    <IconButton color="primary" style={{ marginTop: '20px', marginRight: '5px' }} onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <StyledTypography variant="h1">
                    {t('package.river.works', { package_name: selectedBasinPackage?.name || "" })}
                </StyledTypography>
            </Grid>
            <StyledBox>
                <Grid item xs={8} md={6} lg={6}  >
                    <ProgressCard
                        title={physicalCardTitle}
                        data={physicalProgressData}
                        handleDetailClick={handlePhysicalDetail}
                        handleReportClick={handlePhysicalProgressReport}
                    />
                </Grid>
                <Grid item xs={8} md={6} lg={6}  >
                    <ProgressCard title={financialCardTitle} data={financialProgressData}
                        handleDetailClick={handleFinancialDetail}
                        handleReportClick={handleFinancialProgressReport}
                    />
                </Grid>
            </StyledBox>
            <StyledBox>
                <Paper>
                    <RiverWorkDetailTable dense packageData={selectedBasinPackageData} />
                </Paper>
            </StyledBox>
        </React.Fragment>
    );
};