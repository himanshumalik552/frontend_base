import EditIcon from '@mui/icons-material/Edit';
import { Checkbox, IconButton, TableCell, TableHead, TableRow, Toolbar, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { FinancialDetailProgress, FinancialProgress, } from '../../utils/types';
import AddIcon from '@mui/icons-material/Add';
import { Fragment } from 'react';
import styled from '@emotion/styled';
import { TableRowProps } from '@mui/material/TableRow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';




const StyledRow= styled(TableRow)<TableRowProps>(() => ({
    backgroundColor:"#eaecc2"
}));
interface HeadCell {
    disablePadding: boolean;
    id: keyof FinancialDetailProgress;
    label: string;
    numeric: boolean;
}

interface FinancialDetailTableHeadProps {
    numSelected: number;
    hasEditorRights:boolean;
}

export function FinancialDetailTableHead(props: FinancialDetailTableHeadProps) {

    const [t] = useTranslation("Financial-progress");
    const { numSelected,hasEditorRights } = props;


    const headCells: HeadCell[] = [
        {
            id: 'description',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_item_work'),
        },
        {
            id: 'totalAmount',
            numeric: false,
            disablePadding: true,
            label: t('financial_progress_header_total_amount'),
        },
        {
            id: 'amountPaidInMonth',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_present_month_paid'),
        },
        {
            id: 'amountPaidTillMonth',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_preceding_month_paid'),
        },
        {
            id: 'totalAmomuntPaid',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_total_amount_paid'),
        },
        {
            id: 'percentageofPaymentPaid',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_paid_payment_percentage'),
        },
        {
            id: 'percentageOfTotalCost',
            numeric: false,
            disablePadding: false,
            label: t('financial_progress_header_percentage_total_cost'),
        },

    ];

    return (
        <TableHead>
            <StyledRow>
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
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}

                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </StyledRow>
        </TableHead>
    );
}

interface FinancialProgressTableToolbarProps {
    numSelected: number;
    handleUpdateFinancialDetail?: () => void;
    handleAddFinancialDetail?: () => void;
    percentageOfAmountPaid: number;
    selectedProgress: FinancialProgress | null;
    handleGoBack: () => void;
}

export default function FinancialProgressTableToolbar(props: FinancialProgressTableToolbarProps) {

    const [t] = useTranslation("financial-progress");
    const { selectedProgress, percentageOfAmountPaid, numSelected, handleUpdateFinancialDetail, handleAddFinancialDetail, handleGoBack } = props;
    const tooltipEditFinancialProgress = t('financial_progress_tooltip_edit');
    const tooltipAddFinancialProgress = t('financial_progress_tooltip_add');

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
                        component="div"
                    >
                        {t('financial_progress_table_head_title')}

                    </Typography>
       
                    <Typography align={'center'} component="div" variant="h4">

                        {t('financial_progress_table_percentage_of_amount_paid')}
                        <br/>
                        ({percentageOfAmountPaid})%
                    </Typography>
                </Fragment>
            )}
            <Typography>

            </Typography>
            {numSelected === 1 && handleAddFinancialDetail &&
                <Tooltip title={tooltipAddFinancialProgress}>
                    <IconButton onClick={handleAddFinancialDetail}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>}
            {numSelected === 1 && handleUpdateFinancialDetail &&
                <Tooltip title={tooltipEditFinancialProgress}>
                <IconButton disabled={!selectedProgress} onClick={handleUpdateFinancialDetail}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>}

        </Toolbar>
    );
}