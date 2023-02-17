/* eslint-disable react-hooks/rules-of-hooks */
import { Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { getData } from '../../utils/ApiRequest';
import { getBasinPackagesUrl } from '../../utils/apiUrls';
import { dataFetchKeys } from '../../utils/app-constants';
import { BasinPackage } from '../../utils/types';
import SkeletonWaitingTable from '../common/WaitingSkeleton';
import PackageDetailCollapseTable from './PackageDetailCollapseTable';
import Slider from '@mui/material/Slider';
import ImageIcon from '@mui/icons-material/Image';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    padding: '20px',
    '& .MuiSlider-root': {
        width: '200px',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(3),
    }
}));

export default function BasinPackagesList() {
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token, basinPackages, selectedBasin } = state;
    const [t] = useTranslation(["general-basin"]);
    const [sliderValue, setSliderValue] = React.useState<number>(state.imageScale);

    if (!selectedBasin) {
        return <React.Fragment />;
    }

    const fetchOptions = {
        enabled: selectedBasin !== null && selectedBasin.id !== "",
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    };

    const {
        fetchStatus: basinPackagesFetchStatus,
        data: basinPackageList,
    } = useQuery<BasinPackage[]>(
        [`${dataFetchKeys.basinPackages}${selectedBasin.id}`, selectedBasin],
        async () => {
            const result = await getData(getBasinPackagesUrl(selectedBasin.id), token);
            return await result.json();
        }, fetchOptions);

    useEffect(() => {
        dispatch({ type: "setBasinPackages", value: basinPackageList || [] });
    }, [dispatch, basinPackageList])

    const loading = [basinPackagesFetchStatus].includes("fetching");

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const val = newValue as number;
        setSliderValue(val);
        dispatch({ type: "setImageScale", value: val });
    };

    const handleGoBack = () => {
        dispatch({ type: "setSelectedBasin", value: null });
        dispatch({ type: "setSelectedBasinPackage", value: null });
        dispatch({ type: "setSelectedPage", value: "dashboard" });
    }

    return (
        loading ? <SkeletonWaitingTable /> :
            <StyledBox>
                
                <TableContainer component={Paper}  >
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Grid container>
                                        <Tooltip title="Go back to previous page">
                                            <IconButton color="primary" style={{ marginTop: '-5px', marginRight: '5px' }} onClick={handleGoBack}>
                                                <ArrowBackIcon />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Typography variant="h2" color="primary">
                                            {t('package_detail')}
                                        </Typography>
                                        <Grid item xs>
                                            <Grid container justifyContent="flex-end" alignItems="center">
                                                <ImageIcon color="primary" style={{fontSize: 32}} />
                                                <Slider
                                                    value={sliderValue}
                                                    marks={true}
                                                    step={10}
                                                    min={10}
                                                    max={100}
                                                    onChange={handleSliderChange} />
                                                <Typography variant="h5">
                                                    {`Image scale ${sliderValue}%`}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {basinPackages.map((packageitem) => (
                                <PackageDetailCollapseTable key={packageitem.id} selectedBasinPackage={packageitem} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </StyledBox>
    );
}