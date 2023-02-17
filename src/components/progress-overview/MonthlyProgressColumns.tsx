import TableCell, { TableCellProps } from '@mui/material/TableCell';
import { Fragment } from 'react';
import { ProgressColumn } from '../../utils/types';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)<TableCellProps>(() => ({
    minWidth: "150px"
}));

interface MonthlyProgressColumnProps {
    column: ProgressColumn
}

function MonthlyProgressColumn(props: MonthlyProgressColumnProps) {
    const { column } = props;

    return (
        <StyledTableCell align="center">{column.title}</StyledTableCell>
    );
}

interface MonthlyProgressColumnsProps {
    columns: ProgressColumn[]
}

export default function MonthlyProgressColumns(props: MonthlyProgressColumnsProps) {
    const { columns } = props;
    return (
        <Fragment>
            {columns.map(c =>
                <MonthlyProgressColumn key={c.title} column={c} />
            )}
        </Fragment>
    );
}