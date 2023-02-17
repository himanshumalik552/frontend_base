import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack, { StackProps } from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { AppContext } from '../../App';

const StyledStack = styled(Stack)<StackProps>(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1.5),
    '& .MuiLink-root': {
        cursor: 'pointer',
    }
}));

export default function NavBreadcrumbs() {

    const appContext = useContext(AppContext);
    const { state, dispatch } = appContext;
    const { selectedPage, selectedBasin, selectedBasinPackage } = state;

    const handleHome = () => {
        dispatch({ type: "setSelectedBasin", value: null });
        dispatch({ type: "setSelectedBasinPackage", value: null });
        dispatch({ type: "setSelectedPage", value: "dashboard" });
    }

    const handleBasin = () => {
        if (!selectedBasin) { return }
        dispatch({ type: "setSelectedBasinPackage", value: null });
        dispatch({ type: "setSelectedPage", value: "basin_packages" });
    }

    const handleSelectPackageDetails = () => {
        dispatch({ type: "setSelectedPage", value: "basin_package_details" });
    }

    const breadcrumbs: JSX.Element[] = []

    if (selectedPage && selectedPage !== "dashboard") {
        breadcrumbs.push(
            <Link key="1" underline="hover" color="primary" onClick={handleHome}>
                All basins
            </Link>
        )
    }

    if (selectedBasin && selectedPage && selectedPage === "basin_packages") {
        breadcrumbs.push(
            <Typography key="4">
                {selectedBasin.name}
            </Typography>
        )
    }

    if (selectedBasin && selectedPage &&
        ["basin_package_details",
            "physical_progress_details", "financial_progress_details",
            "physical_progress_report", "financial_progress_report"].includes(selectedPage)) {
        breadcrumbs.push(
            <Link key="1" underline="hover" color="primary" onClick={handleBasin}>
                {selectedBasin.name}
            </Link>
        )
    }

    if (selectedBasinPackage && selectedPage && selectedPage === "basin_package_details") {
        breadcrumbs.push(
            <Typography key="4">
                {selectedBasinPackage.name}
            </Typography>
        )
    }

    if (selectedBasinPackage && selectedPage &&
        ["physical_progress_details", "financial_progress_details",
            "physical_progress_report", "financial_progress_report"
        ].includes(selectedPage)) {
        breadcrumbs.push(
            <Link key="5" underline="hover" color="primary" onClick={handleSelectPackageDetails}>
                {selectedBasinPackage.name}
            </Link>
        )
    }

    if (selectedBasinPackage && selectedPage && selectedPage === "physical_progress_details") {
        breadcrumbs.push(
            <Typography key="6">
                Physical progress
            </Typography>
        )
    }

    if (selectedBasinPackage && selectedPage && selectedPage === "financial_progress_details") {
        breadcrumbs.push(
            <Typography key="7">
                Financial progress
            </Typography>
        )
    }

    if (selectedBasinPackage && selectedPage && selectedPage === "physical_progress_report") {
        breadcrumbs.push(
            <Typography key="6">
                Physical progress overview
            </Typography>
        )
    }

    if (selectedBasinPackage && selectedPage && selectedPage === "financial_progress_report") {
        breadcrumbs.push(
            <Typography key="7">
                Financial progress overview
            </Typography>
        )
    }

    return (
        <StyledStack spacing={2}>
            <Breadcrumbs
                separator={<NavigateNextIcon fontSize="small" />}
                aria-label="breadcrumb"
            >
                {breadcrumbs}
            </Breadcrumbs>
        </StyledStack>
    );
}