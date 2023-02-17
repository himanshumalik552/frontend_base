import WarningIcon from '@mui/icons-material/Warning';
import { Grid, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiGrid: {
            styleOverrides: {
                root: {
                    display: "flex",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    //margin: theme.spacing(2),
                    //color: theme.palette.warning.main,
                    fontSize: 14,
                },
            },
        },
    },
});

interface WarningComponentProps {
    message: string;
    show?: boolean;
}

export default function WarningComponent(props: WarningComponentProps) {

    const { message, show } = props;

    if (show === false) {
        return null;
    }

    return (
        <ThemeProvider theme={theme}>
        <Grid>
            <WarningIcon />
            <Typography align="justify">
                {message}
            </Typography>
            </Grid>
        </ThemeProvider>
    );
}
