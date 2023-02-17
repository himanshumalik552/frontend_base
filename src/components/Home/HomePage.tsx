import { Typography } from "@mui/material";
import Box, { BoxProps } from '@mui/material/Box';
import Grid, { GridProps } from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../App";
import { getData } from "../../utils/ApiRequest";
import { getLookupStatusUrl, getUserUrl } from "../../utils/apiUrls";
import { queryOptions } from "../../utils/app-configurations";
import { dataFetchKeys } from "../../utils/app-constants";
import {  Status, User } from "../../utils/types";
import SkeletonWaitingTable from "../common/WaitingSkeleton";

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    marginTop: theme.spacing(8),
    '& h1': {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-evenly',
        color: "#00567D",
    },
    '& h2': {
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-evenly',
        color: "#00567D",
    }
}));

const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
    marginTop: theme.spacing(8),
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
}));

export default function HomePage() {
    const [t] = useTranslation(["general-basin"]);
    const appContext = React.useContext(AppContext);
    const { state, dispatch } = appContext;
    const { token} = state;

    const {
        data: currentUser,
        isLoading: currentUserLoading,
    } = useQuery<User>(
        [dataFetchKeys.currentUser],
        async () => {
            const result = await getData(getUserUrl, token);
            return await result.json()
        },
        queryOptions
    );


    const {
        data: statusList,
        isLoading: statusListLoading,
    } = useQuery<Status[]>(
        [dataFetchKeys.statuses],
        async () => {
            const result = await getData(getLookupStatusUrl, token);
            return await result.json()
        },
        queryOptions
    );

    useEffect(() => {
        dispatch({ type: "setCurrentUser", value: currentUser || null });
    }, [dispatch, currentUser])

    useEffect(() => {
        dispatch({ type: "setStatuses", value: statusList || [] });
    }, [dispatch, statusList])

    const loading =
        currentUserLoading ||
        statusListLoading;

    return (
        loading ? <SkeletonWaitingTable /> :
            <React.Fragment>
             
                    <StyledBox sx={{ width: '100%' }}>
                        <Typography variant="h1">
                            {"Component 2.1"}
                        </Typography>
                        <Typography variant="h2">
                            {t('river_work_title')}
                        </Typography>
                        <StyledGrid>
                        <>Home Page</>
                        </StyledGrid>
                    </StyledBox>
            </React.Fragment>
    );
};