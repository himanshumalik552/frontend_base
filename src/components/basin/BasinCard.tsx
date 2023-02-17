import { Grid } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea, { CardActionAreaProps } from '@mui/material/CardActionArea';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useContext } from 'react';
import { AppContext } from '../../App';
import { Basin } from '../../utils/types';

const StyledCardActionArea = styled(CardActionArea)<CardActionAreaProps>(({ theme }) => ({
    backgroundColor: '#a5c100',
    color: "#00567D",
    '& .MuiGrid-root': {
        padding: theme.spacing(4),
        minHeight: 200,
        minWidth: 250,
    },
    '& :hover': {
        backgroundColor: "#00567D",
        color: '#a5c100',
    },
}));

interface BasinCardProps {
    basin: Basin
}

const BasinCard = (props: BasinCardProps) => {
    const { basin } = props;
    const appContext = useContext(AppContext);
    const { dispatch } = appContext;

    const handleSelect = () => {
        dispatch({ "type": "setSelectedPage", value: 'basin_packages' });
        dispatch({ "type": "setSelectedBasin", value: basin });
    }

    return (
        <Card>
            <StyledCardActionArea onClick={handleSelect}>
                <Grid container justifyContent="center" alignItems="center">
                    <Typography variant='h3'>
                        {basin.name}
                    </Typography>
                </Grid>
            </StyledCardActionArea>
        </Card>
    )
}

export default BasinCard