import React ,{useEffect} from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { getData } from '../../utils/ApiRequest';
import { getRiverWorkUrl } from '../../utils/apiUrls';
import { queryOptions } from '../../utils/app-configurations';
import { dataFetchKeys } from '../../utils/app-constants';
import { BasinPackage, RiverWork } from '../../utils/types';
import SkeletonWaitingTable from '../common/WaitingSkeleton';
import RiverWorkDetails from './RiverWorkDetails';
import { styled } from '@mui/material/styles';

const StyledHeading = styled(Typography)<TypographyProps>(({ theme }) => ({
    margin: theme.spacing(1),
    marginLeft: theme.spacing(2),
    color: "#a5c100",
}));

interface RiverWorkDetailTableProps {
    packageData?: BasinPackage;
    dense?: boolean;
    showImage?: boolean;
}

export default function RiverWorkDetailTable(props: RiverWorkDetailTableProps) {
    const [t] = useTranslation(["table-management"]);
    const appContext = React.useContext(AppContext);
    const { state ,dispatch } = appContext;
    const { token } = state

    const packageData = props.packageData || state.selectedBasinPackage;
    const packageDataid = packageData?.id || "";
    const dense = props.dense || false;
    const showImage = props.showImage || false;

    if (!packageData) {
        <React.Fragment />
    }
    const {
        data: riverWorkList,
        isLoading: riverWorkDataLoading,
    } = useQuery<RiverWork[]>(
        [`${dataFetchKeys.riverWorks}${packageDataid}`, packageData],
        async () => {
            const result = await getData(getRiverWorkUrl(packageDataid), token);
            return await result.json();
        },
        queryOptions
    );
    
    useEffect(() => {
        dispatch({ type: "setRiverWork", value: riverWorkList || [] });
    }, [dispatch, riverWorkList])

    const riverWorkListData = riverWorkList || [];
    const antiErosionWorks = riverWorkListData.filter(r => r.workType === "Anti-erosion");
    const embankmentWorks = riverWorkListData.filter(r => r.workType === "Embankment");
    const loading = riverWorkDataLoading;
   
    return (
        loading ? <SkeletonWaitingTable/> :
            <React.Fragment>
                <StyledHeading variant="h3">
                    River works
                </StyledHeading>
            <TableContainer >
                <Table size={dense ? "small" : "medium"} aria-label="package detail">
                    <TableHead style={{ background: "#eaecc2" }}>
                        <TableRow>
                            <TableCell>
                                {"Code"}
                            </TableCell>
                            <TableCell>{t('name_of_work')}</TableCell>
                            <TableCell>{t('latitude')}</TableCell>
                            <TableCell>{t('longitude')}</TableCell>
                            <TableCell align="center">{t('reach_length')}</TableCell>
                            <TableCell align="center">{t('total_length')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ background: "#fff" }}>
                        <RiverWorkDetails showImage={showImage} riverWorks={antiErosionWorks} />
                        <RiverWorkDetails showImage={showImage} riverWorks={embankmentWorks} />
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    );
}