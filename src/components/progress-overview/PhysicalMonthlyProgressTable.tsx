import { Grid, IconButton, TablePagination, Tooltip, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React, { Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { ProgressColumn, reportTypes } from '../../utils/types';
import MonthlyProgressColumns from './MonthlyProgressColumns';
import PhysicalMonthlyProgress from './PhysicalMonthlyProgress';
import { getColumns } from './progressTableColumns';
import { StickyTableHeadCell, StyledBox, StyledTableContainer } from './StyledTableContainer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PhysicalMonthlyProgressTable() {
    const [t] = useTranslation(["physical-progress"]);
    const [reportType, setReportType] = useState<reportTypes>('daily');
    const [columns, setColumns] = useState<ProgressColumn[]>([]);
    const appContext = React.useContext(AppContext);
    const { state, dispatch } = appContext;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    if (!state.physicalDetails) {
        <React.Fragment />
    }

    const physicalDetails = state.physicalDetails.filter(p => !p.parentId);
    const availableDates = physicalDetails
        .flatMap(f => f.progress)
        .map(p => p.progressDate);
    const distinctDateStrings = availableDates.length <= 0 ? [] : [...new Set(availableDates)];
    const distinctDates = distinctDateStrings
        .map(d => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());

    useEffect(() => {
        setColumns(getColumns(distinctDates, reportType));
    }, [distinctDates, reportType])

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

    physicalDetails.forEach((p, index) => {
        p.serialNo = index + 1;
    })

    return (
        <Fragment>
            <StyledBox>
                <Tooltip title="Go back to previous page">
                    <IconButton color="primary" style={{ marginBottom: '-5px', marginRight: '5px' }} onClick={handleGoBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h2" color="primary">
                    Physical progress overview
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
            <div style={{ overflow: "visible"}}>
                <StyledTableContainer>
                    <Table aria-label="package detail">
                        <TableHead>
                            <TableRow>
                                <TableCell width="50px" align="center">S.No</TableCell>
                                <StickyTableHeadCell>{t('physical_progress_header_item_work')}</StickyTableHeadCell>
                                <TableCell align="center">{t('physical_progress_header_quantity')}</TableCell>
                                <TableCell>{t('physical_progress_header_unit')}</TableCell>
                                {columns && columns.length > 0 &&
                                    <MonthlyProgressColumns columns={columns} />}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {physicalDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((physicalDetail) =>
                                    <PhysicalMonthlyProgress key={physicalDetail.id} physicalDetail={physicalDetail} columns={columns} />)}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={physicalDetails.length}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Fragment>
    );
}