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
    const { selectedPage, selectedBasin,} = state;

    const handleHome = () => {
        dispatch({ type: "setSelectedBasin", value: null });
        dispatch({ type: "setSelectedPage", value: "dashboard" });
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