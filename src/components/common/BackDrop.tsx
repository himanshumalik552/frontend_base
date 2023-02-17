import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import React from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    //zIndex: theme.zIndex.modal + 10,
                    color: "#fff",
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    //margin: theme.spacing(0.75),
                    fontSize: "1.3rem",
                    fontStyle: "italic",
                },
            },

        }
    },
});

interface BackDropProps {
    open: boolean
}

export default function BackDrop(props: BackDropProps) {

    const [t] = useTranslation();
    const { open } = props;

    return (
        <ThemeProvider theme={theme}>
            <Backdrop open={open}>
                <div>
                    <Typography>{t("gen_dataLoading")}</Typography>
                    <CircularProgress color="inherit" />
                </div>
            </Backdrop>
        </ThemeProvider>
    );
}
