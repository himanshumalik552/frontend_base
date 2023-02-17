import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions, { CardActionsProps } from '@mui/material/CardActions';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { TypographyProps } from '@mui/system';
import { useTranslation } from 'react-i18next';
import ProgressChart from '../common/ProgressChart';

const StyledHeading = styled(Typography)<TypographyProps>(() => ({
    display: 'flex',
    justifyContent: 'space-evenly',
    fontSize: '20px',
}));

const StyledCardActions = styled(CardActions)<CardActionsProps>(({ theme }) => ({
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .MuiButton-root': {
        marginBottom: theme.spacing(1),
    }
}));

interface ProgressCardProps {
    data: number[];
    handleDetailClick: () => void;
    handleReportClick?: () => void;
    title: string;
}

export default function ProgressCard(props: ProgressCardProps) {

    const [t] = useTranslation(["general-basin"]);
    const { title, data, handleDetailClick, handleReportClick } = props;

    return (
        <Box sx={{ minWidth: 300 }}>
            <Card variant="elevation">
                <CardContent>
                    <StyledHeading>
                        {title}
                    </StyledHeading>
                    <ProgressChart data={data} />
                </CardContent>
                <StyledCardActions>
                    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
                        <Button
                            variant='contained'
                            size="small"
                            startIcon={<InfoIcon />}
                            onClick={handleDetailClick}>
                            {t('view_details')}
                        </Button>
                        {handleReportClick &&
                            <Button
                                variant='contained'
                                size="small"
                                startIcon={<CalendarMonthIcon />}
                                onClick={handleReportClick}>
                                Progress overview
                            </Button>}
                    </Grid>
                </StyledCardActions>
            </Card>
        </Box>
    );
}