import styled from '@emotion/styled';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, IconButton, TableCell, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { TableCellProps } from '@mui/material/TableCell';
import { TableRowProps } from '@mui/material/TableRow';
import { Fragment } from 'react';
import { PhysicalDetailProgress, PhysicalProgress } from '../../utils/types';

const StyledCell = styled(TableCell)<TableCellProps>(() => ({
    borderRight: '1px solid lightgray',
}));

const StyledRow = styled(TableRow)<TableRowProps>(() => ({
    backgroundColor: "#eaecc2"
}));
interface HeadCell {
    disablePadding: boolean;
    id: keyof PhysicalDetailProgress;
    label: string;
    numeric: boolean;

}

interface PhysicalDetailTableHeadProps {
    numSelected: number;
    hasEditorRights: boolean;
}

export function PhysicalDetailTableHead(props: PhysicalDetailTableHeadProps) {

    const [t] = useTranslation("physical-progress");
    const { numSelected, hasEditorRights } = props;



    const headCells: HeadCell[] = [
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_item_work'),
        },
        {
            id: 'quantity',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_quantity'),
        },
        {
            id: 'unit',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_unit'),
        },

        {
            id: 'workInMonth',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_present_month'),
        },
        {
            id: 'workTillMonth',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_preceding_month'),
        },
        {
            id: 'workCompleted',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_work_complete'),
        },
        {
            id: 'workDone',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_work_done'),
        },
        {
            id: 'status',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_work_status'),
        },
        {
            id: 'percentageOfTotalWork',
            numeric: false,
            disablePadding: false,
            label: t('physical_progress_header_total_work'),
        },

    ];

    return (
        <TableHead>
            <StyledRow >
                <TableCell width="50px">
                    S. No.
                </TableCell>
                {hasEditorRights &&
                    <TableCell padding="checkbox">
                        <Checkbox
                            disabled
                            color="primary"
                            indeterminate={numSelected > 0}
                            checked={numSelected === 1}
                        />
                    </TableCell>
                }
                {headCells.map((headCell) => (
                    <StyledCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}

                    >
                        {headCell.label}
                    </StyledCell>
                ))}
            </StyledRow>
        </TableHead>
    );
}

interface PhysicalProgressTableToolbarProps {
    numSelected: number;
    handleUpdatePhysicalDetail?: () => void;
    handleAddPhysicalDetail?: () => void;
    handleGoBack: () => void;
    percentageOfWorkCompleted: number;
    selectedProgress: PhysicalProgress | null;
}

export default function PhysicalProgressTableToolbar(props: PhysicalProgressTableToolbarProps) {

    const [t] = useTranslation("physical-progress");
    const { selectedProgress, percentageOfWorkCompleted, numSelected, handleUpdatePhysicalDetail, handleAddPhysicalDetail, handleGoBack } = props;
    const tooltipEditPhysicalProgress = t('physical_progress_tooltip_edit');
    const tooltipAddPhysicalProgress = t('physical_progress_tooltip_add');

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                <Fragment>
                    <Tooltip title="Go back to previous page">
                        <IconButton color="primary" style={{ marginTop: '-5px', marginRight: '5px' }} onClick={handleGoBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h2"
                        id="tableTitle"
                        component="div"
                    >
                        {t('physical_progress_table_head_title')}
                    </Typography>
                    <Typography
                        align={'center'}
                        variant="h4"
                        id="tableTitle"
                        component="div"
                    >
                        {t('physical_progress_table_percentage_of_total_work')}
                        ({percentageOfWorkCompleted})%
                    </Typography>
                </Fragment>
            )}
            {numSelected === 1 && handleAddPhysicalDetail &&
                <Tooltip title={tooltipAddPhysicalProgress}>
                    <IconButton onClick={handleAddPhysicalDetail}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>}
            {numSelected === 1 && handleUpdatePhysicalDetail &&
                <Tooltip title={tooltipEditPhysicalProgress}>
                    <IconButton disabled={!selectedProgress} onClick={handleUpdatePhysicalDetail}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>}

        </Toolbar>
    );
}