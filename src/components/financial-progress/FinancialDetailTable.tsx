import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { BoxProps } from '@mui/system';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { FinancialProgress, FinancialDetail, Role } from '../../utils/types';
import FinancialProgressTableToolbar, { FinancialDetailTableHead } from './FinancialDetailTableHead';
import FinancialDetailRow from './FinancialDetailRow';
import DialogAddFinancialProgress from './DialogAddFinancialProgress';
import DialogUpdateFinancialProgress from './DialogUpdateFinancialProgress';
import FinancialMonthAndYearSelection from '../common/FinancialMonthAndYearSelection';
import { getFilteredYearAndMonth, getTotal, getTotalPercentageFinancialAmount } from '../../utils/commonfunction';
// import { useTranslation } from 'react-i18next';
const StyledComboBox = styled(Box)<BoxProps>((theme) => ({
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'end'
}));
const StyledBox = styled(Box)<BoxProps>((theme) => ({
    display: 'flex',
    justifyContent: 'space-between',

}));
export default function FinancialDetailTable() {
    // const [t] = useTranslation(["table-management"]);
    const [selected, setSelected] = useState<string[]>([]);
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const {currentUser} =state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedProgress, setSelectedProgress] = useState<FinancialProgress | null>(null)
    const [financialDetail, setFinancialDetail] = useState<FinancialDetail | null>(null)
    const [openUpdateFinancialDetailDialog, setOpenUpdateFinancialDetailDialog] = useState(false);
    const [openAddFinancialDetailDialog, setOpenAddFinancialDetailDialog] = useState(false);
    const financialDetails = state.financialDetails.filter(p => !p.parentId);
    const urseRoles: Role[] = currentUser ? currentUser.roles : [];
    const hasEditorRights = urseRoles.some(userRole => ['Editor' , 'administrator'].includes(userRole.key));
    const financialDate = getFilteredYearAndMonth(financialDetails);
    const completePaidAmounts = financialDetails?.map(p => getTotalPercentageFinancialAmount(p));
    const totalOfCompletePaidAmount = getTotal(completePaidAmounts);
    const percentageOfAmountPaid = Math.round(totalOfCompletePaidAmount)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleUpdateFinancialDetail = () => {
        setOpenUpdateFinancialDetailDialog(true);
    }

    const handleAddFinancialDetail = () => {
        setOpenAddFinancialDetailDialog(true);
    }
    financialDetails.forEach((p, index) => {
        p.serialNo = index + 1;
    })


    const handleGoBack = () => {
        dispatch({ type: "setSelectedPage", value: "basin_package_details" });
    }
   
    return (
        <React.Fragment>
            <StyledBox>
                <StyledComboBox>
                    <FinancialMonthAndYearSelection setSelected={setSelected} distinctPeriods={financialDate} />
                </StyledComboBox>
            </StyledBox>
            <StyledComboBox>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <FinancialProgressTableToolbar
                            handleGoBack={handleGoBack}
                            selectedProgress={selectedProgress}
                            percentageOfAmountPaid={percentageOfAmountPaid} 
                            handleAddFinancialDetail={!hasEditorRights? undefined: handleAddFinancialDetail}
                            handleUpdateFinancialDetail={!hasEditorRights ? undefined : handleUpdateFinancialDetail}
                            numSelected={selected.length} />
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }}aria-labelledby="tableTitle" >
                                <FinancialDetailTableHead
                                hasEditorRights={hasEditorRights}
                                    numSelected={selected.length} />
                                <TableBody>
                                    {financialDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((financialDetail, index) => {
                                            return (
                                                <FinancialDetailRow
                                                    key={financialDetail.id}
                                                    selected={selected}
                                                    setSelected={setSelected}
                                                    financialDetail={financialDetail}
                                                    setSelectedProgress={setSelectedProgress}
                                                    setFinancialDetail={setFinancialDetail}
                                                />
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={financialDetails.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </StyledComboBox>

            {financialDetail && selectedProgress &&
                <DialogUpdateFinancialProgress
                    open={openUpdateFinancialDetailDialog}
                    setOpen={setOpenUpdateFinancialDetailDialog}
                    financialDetail={financialDetail}
                    selectedProgress={selectedProgress}
                />}
            {financialDetail &&
                <DialogAddFinancialProgress
                    open={openAddFinancialDetailDialog}
                    setOpen={setOpenAddFinancialDetailDialog}
                    financialDetail={financialDetail}

                />}
        </React.Fragment>
    );
}