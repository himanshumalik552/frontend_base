import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Fragment, useContext } from 'react';
import { FinancialDetail, FinancialProgress, ProgressColumn } from '../../utils/types';
import { AppContext } from '../../App';
import { StickyTableHeadCell } from './StyledTableContainer';



interface FinancialDetailProgressRowProps {
    financialDetail: FinancialDetail;
    columns: ProgressColumn[];
    rowSpan?: number;
}

function FinancialDetailProgressRow(props: FinancialDetailProgressRowProps) {

    const { financialDetail, columns, rowSpan } = props;

    return (
        <TableRow>
            {rowSpan &&
                <TableCell align="center" rowSpan={rowSpan}>
                    {financialDetail.serialNo}
                </TableCell>}
            <StickyTableHeadCell component="td" scope="row" >
                {financialDetail.description}
            </StickyTableHeadCell>
            <TableCell component="td" scope="row" align="center">&#x20B9;{financialDetail.totalAmount.toLocaleString('en')}</TableCell>
            {columns.map(c =>
                <FinancialMonthlyProgressCell  rowSpan={rowSpan} key={c.title} column={c} progresses={financialDetail.progress} />
            )}
        </TableRow>
    );
}

interface FinancialMonthlyProgressCellProps {
    column: ProgressColumn;
    progresses: FinancialProgress[];
    rowSpan?: number;
}

function FinancialMonthlyProgressCell(props: FinancialMonthlyProgressCellProps) {
    const { column, progresses,rowSpan } = props;
    const relatedProgresses = progresses.filter(p => new Date(p.progressDate) >= column.minDate && new Date(p.progressDate) <= column.maxDate);
    const amounts = (relatedProgresses || []).map(p => p.amountPaidInMonth);
    const total = amounts.reduce((a, b) => a + b, 0) || 0;

    return (
        <Fragment>
            {rowSpan &&  <TableCell rowSpan={rowSpan} align="center"> &#x20B9;&nbsp;{total.toLocaleString('en')}</TableCell>}
        </Fragment>
      
    );
}

interface FinancialMonthlyProgressProps {
    financialDetail: FinancialDetail;
    columns: ProgressColumn[];
}

export default function FinancialMonthlyProgress(props: FinancialMonthlyProgressProps) {
    const appContext = useContext(AppContext);
    const { financialDetails } = appContext.state;
    const { columns, financialDetail } = props;
    
    if (!financialDetail) {
        return <Fragment />
    }
    const childern = financialDetails.filter(p => p.parentId === financialDetail.id);
    const rowSpan = 1 + childern.length;

    return (
        <Fragment>
            <FinancialDetailProgressRow columns={columns} financialDetail={financialDetail} rowSpan={rowSpan} />
            {childern && childern.length > 0 &&
                childern.map((financialDetailChild) => {
                    return (
                        <FinancialDetailProgressRow key={financialDetailChild.id} columns={columns} financialDetail={financialDetailChild} />
                    )
                })
            }
        </Fragment>
    );
}