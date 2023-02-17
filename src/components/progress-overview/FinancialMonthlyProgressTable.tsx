import { Grid, IconButton, TablePagination, Tooltip, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { ProgressColumn, reportTypes } from '../../utils/types';
import FinancialMonthlyProgress from './FinancialMonthlyProgress';
import MonthlyProgressColumns from './MonthlyProgressColumns';
import { getColumns } from './progressTableColumns';
import { StickyTableHeadCell, StyledBox, StyledTableContainer } from './StyledTableContainer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function FinancialMonthlyProgressTable() {
    const [t] = useTranslation(["physical-progress"]);
    const [reportType, setReportType] = useState<reportTypes>('daily');
    const [columns, setColumns] = useState<ProgressColumn[]>([]);
    const appContext = React.useContext(AppContext);
    const { state, dispatch } = appContext;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    if (!state.financialDetails) {
        <React.Fragment />
    }
    const financialDetails = state.financialDetails.filter(p => !p.parentId);
    const availableDates = financialDetails
        .flatMap(f => f.progress)
        .map(p => p.progressDate);
    const distinctDateStrings = availableDates.length <= 0 ? [] : [...new Set(availableDates)];
    const distinctDates = distinctDateStrings
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    useEffect(() => {
        setColumns(getColumns(distinctDates, reportType));
    }, [reportType,distinctDates])

    const handleChange = (event: React.MouseEvent<HTMLElement>, value: reportTypes) => {
        setReportType(value);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleGoBack = () => {
        dispatch({ type: "setSelectedPage", value: "basin_package_details" });
    }

    financialDetails.forEach((p, index) => {
        p.serialNo = index + 1;
    })
    return (
        <React.Fragment>
            <StyledBox>
                <Tooltip title="Go back to previous page">
                    <IconButton color="primary" style={{ marginBottom: '-5px', marginRight: '5px' }} onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h2" color="primary">
                    Financial progress overview
                </Typography>
            </StyledBox>
            <StyledBox>
                <Grid container justifyContent="flex-start" alignItems="center">
                    <Typography variant="h4" style={{ marginRight: '10px' }}>
                        Report type:
                    </Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={reportType}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="daily">Daily</ToggleButton>
                        <ToggleButton value="weekly">Weekly</ToggleButton>
                        <ToggleButton value="fortnightly">Fortnightly</ToggleButton>
                        <ToggleButton value="monthly">Monthly</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            </StyledBox>
            <div style={{ overflow: "visible" }}>
                <StyledTableContainer >
                    <Table aria-label="package detail">
                        <TableHead style={{ backgroundColor: "#eaecc2" }}>
                            <TableRow>
                            <TableCell width="50px" align="center">S.No</TableCell>
                                <StickyTableHeadCell>{t('physical_progress_header_item_work')}</StickyTableHeadCell>
                                <TableCell align="center">{t('physical_progress_header_quantity')}</TableCell>
                                {columns && columns.length > 0 &&
                                    <MonthlyProgressColumns columns={columns}/> }
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ background: "#eaecc2" }}>
                            {financialDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((financialDetail) =>
                                <FinancialMonthlyProgress key={financialDetail.id} financialDetail={financialDetail} columns={columns} />
                            )}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={financialDetails.length}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    );
}