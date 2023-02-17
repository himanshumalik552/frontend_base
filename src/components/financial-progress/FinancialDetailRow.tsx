import React, { Fragment, useContext } from 'react';
import { TableCell, TableRow } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { AppContext } from '../../App';
import { FinancialDetail, FinancialPeriod, FinancialProgress, Role} from "../../utils/types";
import { getMonth, getTotal, getYear } from "../../utils/commonfunction";
import styled from '@emotion/styled';
import { TableCellProps } from '@mui/material/TableCell';

const StyledCell = styled(TableCell)<TableCellProps>(() => ({
    borderLeft: '1px solid #e6e6e6',
}));

interface Statistics {
    amountPaidInMonth: number,
    amountPaidTillMonth: number,
    totalPaidAmount:number,
    paidAmountPercentage:number,
    totalAmountPercentage: number,
}
interface CommonRowProps {
    financialDetail: FinancialDetail;
    rowSpan?: number;
    selectedFinancialPeriod: FinancialPeriod | null;
    selected: string[];
    setSelected: (value: React.SetStateAction<string[]>) => void;
    setSelectedProgress: (value: React.SetStateAction<FinancialProgress | null>) => void;
    setFinancialDetail: (value: React.SetStateAction<FinancialDetail | null>) => void;
    statistics: Statistics;
}
function CommonRow(props: CommonRowProps) {

    const appContext = useContext(AppContext);
    const { currentUser } = appContext.state;
    const { rowSpan, selectedFinancialPeriod, financialDetail, setSelectedProgress, setFinancialDetail, setSelected, selected, statistics } = props;
    const urseRoles: Role[] = currentUser ? currentUser.roles : [];
    const hasEditorRights = urseRoles.some(userRole => ['Editor' , 'administrator'].includes(userRole.key));
    const paidAmountPercentage = statistics.paidAmountPercentage;
    const totalAmountPercentage = statistics.totalAmountPercentage
    const progressFiltered = financialDetail.progress.find(p => parseInt(getMonth(p.progressDate)) === selectedFinancialPeriod?.month && getYear(p.progressDate) === selectedFinancialPeriod?.year);

    const isSelected = (name: string) => selected.indexOf(name) !== -1;
    const isItemSelected = isSelected(financialDetail.id);

    const handleClick = () => {
        if(hasEditorRights){
            const selectedIndex = selected.indexOf(financialDetail.id);
            if (selectedIndex >= 0) {
                setSelectedProgress(null);
                setFinancialDetail(null);
                return setSelected([])
            }
            setSelected([financialDetail.id]);
            setFinancialDetail(financialDetail);
            setSelectedProgress(progressFiltered || null);
        }
    };


    return (
        <TableRow
            hover
            key={financialDetail.id}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            onClick={handleClick}
        >
            {rowSpan &&
                <TableCell rowSpan={rowSpan}>
                    {financialDetail.serialNo}
                </TableCell>}
                {hasEditorRights &&      
                <StyledCell padding="checkbox">
                <Checkbox
                    color="primary"
                    disabled={!hasEditorRights}
                    checked={isItemSelected} />
            </StyledCell>}
      
            <TableCell component="th" scope="row">
                {financialDetail.description}
            </TableCell>
            <StyledCell align="left">&#x20B9;{financialDetail.totalAmount.toLocaleString('en')}</StyledCell>
        
            {rowSpan &&
                <React.Fragment>
                    <StyledCell rowSpan={rowSpan} align="center">&#x20B9;{statistics.amountPaidInMonth.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">&#x20B9;{statistics.amountPaidTillMonth.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">&#x20B9;{statistics.totalPaidAmount.toLocaleString('en')}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">&#x20B9;{`${paidAmountPercentage}%`}</StyledCell>
                    <StyledCell rowSpan={rowSpan} align="center">&#x20B9;{`${totalAmountPercentage}%`}</StyledCell>
                </React.Fragment>}
        </TableRow>
    )
}



interface FinancialDetailRowProps {
    financialDetail: FinancialDetail;
    selected: string[];
    setSelected: (value: React.SetStateAction<string[]>) => void;
    setSelectedProgress: (value: React.SetStateAction<FinancialProgress | null>) => void;
    setFinancialDetail: (value: React.SetStateAction<FinancialDetail | null>) => void;
}

export default function FinancialDetailRow(props: FinancialDetailRowProps) {

    const {financialDetail, setSelected,  selected, setSelectedProgress, setFinancialDetail } = props;
    const appContext = useContext(AppContext);
    const { state } = appContext;
    const { selectedFinancialPeriod ,financialDetails } = state
    const childDetails = financialDetails.filter(p => p.parentId === financialDetail.id);

    const progresses = financialDetail.progress
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
    const amountPaidInMonths = progresses.map(f => f.amountPaidInMonth);
    const amountPaidInMonth = amountPaidInMonths.length > 0 ? getTotal(amountPaidInMonths) : 0;
    const amountPaidTillMonths = progresses.map(f => f.amountPaidTillMonth);
    const amountPaidTillMonth = amountPaidTillMonths.length > 0 ? getTotal(amountPaidTillMonths) : 0;
    const totalPaidAmount = amountPaidInMonth + amountPaidInMonth;
    const paidAmountPercentage = Math.round((amountPaidInMonth + amountPaidTillMonth) / financialDetail.totalAmount * 100);
    const totalAmountPercentage = paidAmountPercentage * financialDetail.weightage;
    const rowSpan = 1 + childDetails.length;

    const statistics: Statistics = {
        amountPaidInMonth: amountPaidInMonth,
        amountPaidTillMonth: amountPaidTillMonth,
        totalPaidAmount:totalPaidAmount,
        paidAmountPercentage:paidAmountPercentage,
        totalAmountPercentage: totalAmountPercentage,
    }

    return (
        <Fragment>
        <CommonRow
            key={financialDetail.id}
            statistics={statistics}
            setSelected={setSelected}
            selected={selected}
            financialDetail={financialDetail}
            selectedFinancialPeriod={selectedFinancialPeriod}
            setSelectedProgress={setSelectedProgress}
            setFinancialDetail={setFinancialDetail}
            rowSpan={rowSpan}
        />
        {childDetails &&
            childDetails.map((childDetail) => {
                return (
                    <CommonRow
                        rowSpan={undefined}
                        key={financialDetail.id}
                        financialDetail={childDetail}
                        statistics={statistics}
                        setSelected={setSelected}
                        selected={selected}
                        selectedFinancialPeriod={selectedFinancialPeriod}
                        setSelectedProgress={setSelectedProgress}
                        setFinancialDetail={setFinancialDetail}
                    />
                )
            })
        }

    </Fragment>
    )
}