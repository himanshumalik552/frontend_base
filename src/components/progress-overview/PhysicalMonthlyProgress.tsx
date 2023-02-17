import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Fragment, useContext } from 'react';
import { PhysicalDetail, PhysicalProgress, ProgressColumn } from '../../utils/types';
import { styled } from '@mui/material/styles';
import { AppContext } from '../../App';

const StickyTableCell = styled(TableCell)<TableCellProps>(() => ({
    minWidth: '500px',
    position: 'sticky',
    background: "#e6e6e6",
    left: 0,
    zIndex: 1,
}));

interface PhysicalMonthlyProgressCellProps {
    column: ProgressColumn;
    progresses: PhysicalProgress[];
    rowSpan?: number;
}

function PhysicalMonthlyProgressCell(props: PhysicalMonthlyProgressCellProps) {
    const { column, progresses,rowSpan } = props;
    const relatedProgresses = progresses.filter(p => new Date(p.progressDate) >= column.minDate && new Date(p.progressDate) <= column.maxDate);
    const amounts = (relatedProgresses || []).map(p => p.workInMonth);
    const total = amounts.reduce((a, b) => a + b, 0) || 0;

    return (
        <Fragment>
            {rowSpan &&  <TableCell rowSpan={rowSpan} align="center">{total.toLocaleString('en')}</TableCell>}
        </Fragment>
       
    );
}

interface PhysicalDetailProgressRowProps {
    physicalDetail: PhysicalDetail;
    columns: ProgressColumn[];
    rowSpan?: number;
}

function PhysicalDetailProgressRow(props: PhysicalDetailProgressRowProps) {

    const { physicalDetail, columns, rowSpan } = props;

    return (
        <TableRow>
            {rowSpan &&
                <TableCell align="center" rowSpan={rowSpan}>
                    {physicalDetail.serialNo}
                </TableCell>}
            <StickyTableCell component="td" scope="row" >
                {physicalDetail.description}
            </StickyTableCell>
            <TableCell component="td" scope="row" align="center">{physicalDetail.quantity.toLocaleString('en')}</TableCell>
            <TableCell component="td" scope="row">{physicalDetail.unit}</TableCell>
            {columns.map(c =>
                <PhysicalMonthlyProgressCell  rowSpan={rowSpan} key={c.title} column={c} progresses={physicalDetail.progress} />
            )}
        </TableRow>
    );
}

interface PhysicalMonthlyProgressProps {
    physicalDetail: PhysicalDetail;
    columns: ProgressColumn[];
}

export default function PhysicalMonthlyProgress(props: PhysicalMonthlyProgressProps) {

    const appContext = useContext(AppContext);
    const { physicalDetails } = appContext.state;
    const { columns, physicalDetail } = props;
    
    if (!physicalDetail) {
        return <Fragment />
    }

    const childern = physicalDetails.filter(p => p.parentId === physicalDetail.id);
    const rowSpan = 1 + childern.length;

    return (
        <Fragment>
            <PhysicalDetailProgressRow columns={columns} physicalDetail={physicalDetail} rowSpan={rowSpan} />
            {childern && childern.length > 0 &&
                childern.map((physicalDetailChild) => {
                    return (
                        <PhysicalDetailProgressRow key={physicalDetailChild.id} columns={columns} physicalDetail={physicalDetailChild} />
                    )
                })
            }
        </Fragment>
    );
}