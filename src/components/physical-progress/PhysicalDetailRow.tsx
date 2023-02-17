import { TableRow } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { styled, useTheme } from '@mui/material/styles';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import React, { Fragment, useContext } from 'react';
import { AppContext } from '../../App';
import { getMonth, getTotal, getYear } from "../../utils/commonfunction";
import { FinancialPeriod, PhysicalDetail, PhysicalProgress, Role } from "../../utils/types";

const StyledCell = styled(TableCell)<TableCellProps>(() => ({
    borderLeft: '1px solid #e6e6e6',
}));

interface Statistics {
    workInMonth: number;
    workTillMonth: number;
    workCompleted: number;
    workDone: number;
    totalWorkRound: number;
}

interface CommonRowProps {
    physicalDetail: PhysicalDetail;
    status: string;
    rowSpan?: number;
    selectedFinancialPeriod: FinancialPeriod | null;
    selected: string[];
    setSelected: (value: React.SetStateAction<string[]>) => void;
    setSelectedProgress: (value: React.SetStateAction<PhysicalProgress | null>) => void;
    setPhysicalDetail: (value: React.SetStateAction<PhysicalDetail | null>) => void;
    statistics: Statistics;
}

function CommonRow(props: CommonRowProps) {

    const theme = useTheme();
    const appContext = useContext(AppContext);
    const { currentUser } = appContext.state;
    const { rowSpan, selectedFinancialPeriod, physicalDetail, setSelectedProgress, setPhysicalDetail, setSelected, selected, status, statistics } = props;
    const urseRoles: Role[] = currentUser ? currentUser.roles : [];
    const hasEditorRights = urseRoles.some(userRole => ['Editor', 'administrator'].includes(userRole.key));
    const workDone = statistics.workDone;
    const totalWorkRound = statistics.totalWorkRound;
    const progressFiltered = physicalDetail.progress.find(p => parseInt(getMonth(p.progressDate)) === selectedFinancialPeriod?.month && getYear(p.progressDate) === selectedFinancialPeriod?.year);

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const isItemSelected = isSelected(physicalDetail.id);

    const handleClick = () => {
        if (hasEditorRights) {
            const selectedIndex = selected.indexOf(physicalDetail.id);
            if (selectedIndex >= 0) {
                setSelectedProgress(null);
                setPhysicalDetail(null);
                return setSelected([])
            }
            setSelected([physicalDetail.id]);
            setPhysicalDetail(physicalDetail);
            setSelectedProgress(progressFiltered || null);
        }

    };

    const getColor = () => {
        if (physicalDetail.status) {
            if (physicalDetail.status.key === "completed") {
                return "#99e699";
            }
            if (physicalDetail.status.key === "in-progress") {
                return "#ffd699";
            }
        }

        return theme.palette.common.white;
    }

    const rowStyle = {
        backgroundColor: getColor()
    }

    return (
        <TableRow
            hover
            key={physicalDetail.id}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            onClick={handleClick}
            style={rowStyle}
        >
            {rowSpan &&
                <TableCell rowSpan={rowSpan}>
                    {physicalDetail.serialNo}
                </TableCell>}
            {hasEditorRights &&
                <StyledCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        disabled={!hasEditorRights}
                        checked={isItemSelected} />
                </StyledCell>
            }
            <TableCell component="th" scope="row">
                {physicalDetail.description}
            </TableCell>
            <StyledCell align="left">{physicalDetail.quantity.toLocaleString('en')}</StyledCell>
            <StyledCell align="center">{physicalDetail.unit}</StyledCell>

            {rowSpan &&
                <Fragment>
                    <StyledCell rowSpan={rowSpan} align="center">{statistics.workInMonth.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">{statistics.workTillMonth.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">{statistics.workCompleted.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">{`${workDone}%`}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">{status}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">{`${totalWorkRound}%`}</StyledCell>
                </Fragment>}
        </TableRow>
    )
}

interface physicalDetailProps {
    physicalDetail: PhysicalDetail;
    selected: string[];
    setSelected: (value: React.SetStateAction<string[]>) => void;
    setSelectedProgress: (value: React.SetStateAction<PhysicalProgress | null>) => void;
    setPhysicalDetail: (value: React.SetStateAction<PhysicalDetail | null>) => void;
}

export default function PhysicalProgressCommonRow(props: physicalDetailProps) {

    const { physicalDetail, setSelected, selected, setSelectedProgress, setPhysicalDetail } = props;
    const appContext = useContext(AppContext);
    const { state } = appContext;
    const { selectedFinancialPeriod, physicalDetails } = state
    const childDetails = physicalDetails.filter(p => p.parentId === physicalDetail.id);

    const progresses = physicalDetail.progress
        .filter(p =>
            parseInt(getMonth(p.progressDate)) === selectedFinancialPeriod?.month &&
            getYear(p.progressDate) === selectedFinancialPeriod?.year);

    const childProgresses = childDetails
        .flatMap(p => p.progress)
        .filter(p =>
            parseInt(getMonth(p.progressDate)) === selectedFinancialPeriod?.month &&
            getYear(p.progressDate) === selectedFinancialPeriod?.year);
    if (childProgresses && childProgresses.length > 0) {
        progresses.push(...childProgresses);
    }

    const workInMonths = progresses.map(f => f.workInMonth);
    const workTillMonths = progresses.map(f => f.workTillMonth);
    const workInMonth = workInMonths.length > 0 ? getTotal(workInMonths) : 0;
    const workTillMonth = workTillMonths.length > 0 ? getTotal(workTillMonths) : 0;
    const workCompleted = workInMonth + workTillMonth;
    const workDone = Math.round((workInMonth + workTillMonth) / physicalDetail.quantity * 100);
    const totalWork = workDone * physicalDetail.weightage;
    const totalWorkRound = Math.round(totalWork);
    const status = physicalDetail.status ? physicalDetail.status.description : '';
    const rowSpan = 1 + childDetails.length;

    const statistics: Statistics = {
        workInMonth: workInMonth,
        workTillMonth: workTillMonth,
        workCompleted: workCompleted,
        workDone: workDone,
        totalWorkRound: totalWorkRound,
    }

    return (
        <Fragment>
            <CommonRow
                key={physicalDetail.id}
                statistics={statistics}
                setSelected={setSelected}
                selected={selected}
                physicalDetail={physicalDetail}
                status={status}
                selectedFinancialPeriod={selectedFinancialPeriod}
                setSelectedProgress={setSelectedProgress}
                setPhysicalDetail={setPhysicalDetail}
                rowSpan={rowSpan}
            />
            {childDetails &&
                childDetails.map((childDetail) => {
                    return (
                        <CommonRow
                            rowSpan={undefined}
                            key={physicalDetail.id}
                            physicalDetail={childDetail}
                            statistics={statistics}
                            setSelected={setSelected}
                            selected={selected}
                            status={status}
                            selectedFinancialPeriod={selectedFinancialPeriod}
                            setSelectedProgress={setSelectedProgress}
                            setPhysicalDetail={setPhysicalDetail}
                        />
                    )
                })
            }

        </Fragment>
    )
}
