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
import { getFilteredYearAndMonth, getTotal, getTotalPercentagePhysicalDetailWork } from '../../utils/commonfunction';
import { PhysicalDetail, PhysicalProgress, Role } from '../../utils/types';
import FinancialMonthAndYearSelection from '../common/FinancialMonthAndYearSelection';
import DialogAddPhysicalProgress from './DialogAddPhysicalProgress';
import DialogUpdatePhysicalProgress from './DialogUpdatePhysicalProgress';
import PhysicalDetailRow from './PhysicalDetailRow';
import PhysicalProgressTableToolbar, { PhysicalDetailTableHead } from './PhysicalDetailTableHead';


const StyledComboBox = styled(Box)<BoxProps>(() => ({
    paddingLeft: '20px',
    paddingRight: '20px',
    display: 'flex',
    alignItems: 'end'
}));
const StyledBox = styled(Box)<BoxProps>(() => ({
    display: 'flex',
    justifyContent: 'space-between',

}));

export default function PhysicalDetailTable() {
    const [selected, setSelected] = useState<string[]>([]);
    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedProgress, setSelectedProgress] = useState<PhysicalProgress | null>(null)
    const [physicalDetail, setPhysicalDetail] = useState<PhysicalDetail | null>(null)
    const [openUpdatePhysicalDetailDialog, setOpenUpdatePhysicalDetailDialog] = useState(false);
    const [openAddPhysicalDetailDialog, setOpenAddPhysicalDetailDialog] = useState(false);
    const { currentUser } = state;
    const physicalDetails = state.physicalDetails.filter(p => !p.parentId);
    const urseRoles: Role[] = currentUser ? currentUser.roles : [];
    const hasEditorRights = urseRoles.some(userRole => ['Editor', 'administrator'].includes(userRole.key));
    const physicalDate = getFilteredYearAndMonth(physicalDetails);
    const completeWorks = physicalDetails?.map(p => getTotalPercentagePhysicalDetailWork(p));
    const totalOfcompleteWork = getTotal(completeWorks)
    const percentageOfWorkCompleted = Math.round(totalOfcompleteWork);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleUpdatePhysicalDetail = () => {

        setOpenUpdatePhysicalDetailDialog(true);
    }

    const handleAddPhysicalDetail = () => {
        setOpenAddPhysicalDetailDialog(true);
    }

    const handleGoBack = () => {
        dispatch({ type: "setSelectedPage", value: "basin_package_details" });
    }

    physicalDetails.forEach((p, index) => {
        p.serialNo = index + 1;
    })

    return (
        <React.Fragment>
            <StyledBox>
                <StyledComboBox>
                    <FinancialMonthAndYearSelection setSelected={setSelected} distinctPeriods={physicalDate} />
                </StyledComboBox>
            </StyledBox>

            <StyledComboBox>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>

                        <PhysicalProgressTableToolbar
                            selectedProgress={selectedProgress}
                            percentageOfWorkCompleted={percentageOfWorkCompleted}
                            handleAddPhysicalDetail={!hasEditorRights ? undefined : handleAddPhysicalDetail}
                            handleUpdatePhysicalDetail={!hasEditorRights ? undefined : handleUpdatePhysicalDetail}
                            handleGoBack={handleGoBack}
                            numSelected={selected.length} />
                        <TableContainer>
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                                <PhysicalDetailTableHead hasEditorRights={hasEditorRights} numSelected={selected.length} />
                                <TableBody>
                                    {physicalDetails.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((physicalDetail) => {
                                            return (
                                                <PhysicalDetailRow
                                                    key={physicalDetail.id}
                                                    selected={selected}
                                                    setSelected={setSelected}
                                                    physicalDetail={physicalDetail}
                                                    setSelectedProgress={setSelectedProgress}
                                                    setPhysicalDetail={setPhysicalDetail}
                                                />
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={physicalDetails.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
            </StyledComboBox>
            {physicalDetail && selectedProgress &&
                <DialogUpdatePhysicalProgress
                    open={openUpdatePhysicalDetailDialog}
                    setOpen={setOpenUpdatePhysicalDetailDialog}
                    physicalDetail={physicalDetail}
                    selectedProgress={selectedProgress}
                />}
            {physicalDetail &&
                <DialogAddPhysicalProgress
                    open={openAddPhysicalDetailDialog}
                    setOpen={setOpenAddPhysicalDetailDialog}
                    physicalDetail={physicalDetail}
                />}
        </React.Fragment>
    );
}