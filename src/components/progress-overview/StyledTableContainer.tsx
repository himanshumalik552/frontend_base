import { styled } from '@mui/material/styles';
import TableContainer, { TableContainerProps } from '@mui/material/TableContainer';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import { Box, BoxProps } from '@mui/material';

const StyledTableContainer = styled(TableContainer)<TableContainerProps>(({ theme }) => ({
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1),
    '& .MuiTableHead-root': {
        '& .MuiTableCell-root': {
            backgroundColor:"#eaecc2",
            border: '1px solid lightgray',
        },
    },
    '& .MuiTableBody-root': {
        '& .MuiTableCell-root': {
            backgroundColor: "#fff",
            border: '1px solid lightgray',
        },
    },
}));

const StickyTableHeadCell = styled(TableCell)<TableCellProps>(() => ({
    minWidth: '500px',
    position: 'sticky',
    background: "#e6e6e6",
    left: 0,
    zIndex: 1,
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    padding: '15px 15px 0px 15px',
    display: 'flex',
    alignItems: 'end',
    '& .Mui-selected': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    '& .MuiToggleButton-root': {
        ':hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.common.white,
        }
    },
    
}));

export { StyledTableContainer, StickyTableHeadCell, StyledBox };