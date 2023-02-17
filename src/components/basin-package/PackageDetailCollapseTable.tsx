import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Tooltip } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import Grid, { GridProps } from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../App';
import { BasinPackage } from '../../utils/types';
import RiverWorkDetailTable from '../river-work/RiverWorkDetailTable';

const StyledGrid = styled(Grid)<GridProps>(() => ({
    '& svg, .MuiLink-root': {
        color: "#a5c100",
    },
    '& :hover': {
        color: "#00567D",
        cursor: "pointer !important",
    },
}));

interface PackageDetailCollapseTableProps {
    selectedBasinPackage: BasinPackage;
}

export default function PackageDetailCollapseTable(props: PackageDetailCollapseTableProps) {
    const [t] = useTranslation(["table-management", "general"]);
    const { selectedBasinPackage } = props;
    const [open, setOpen] = React.useState(false);
    const appContext = React.useContext(AppContext);
    const { dispatch } = appContext;
    const viewProgressText = t('view.progress', { ns: "general" });

    const handleSelectPackageDetail = () => {
        dispatch({ "type": "setSelectedPage", value: 'basin_package_details' });
        dispatch({ "type": "setSelectedBasinPackage", value: selectedBasinPackage });
    }

    const handleOpen = () => {
        setOpen(!open)
    }

    return (
        <React.Fragment>
            <TableRow>
                <TableCell size='small'>
                    <StyledGrid container alignItems="center">
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={handleOpen}
                        >
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                        <Tooltip title={viewProgressText}>
                            <IconButton color="primary" onClick={handleSelectPackageDetail}>
                                <DisplaySettingsIcon />
                            </IconButton>
                        </Tooltip>
                        <Link variant="h4" underline="hover" onClick={handleOpen}>
                            {selectedBasinPackage.name}
                        </Link>
                    </StyledGrid>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ padding: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" >
                        <RiverWorkDetailTable showImage key={selectedBasinPackage.id} packageData={selectedBasinPackage} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
