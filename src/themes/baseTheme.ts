import { createTheme } from '@mui/material/styles'

// documentation using a theme: https://mui.com/styles/advanced/ (makestyles is the most easy one.)

const baseTheme = createTheme({
  //overrides: {
  //  MuiTableRow: {
  //    root: {
  //      '&.Mui-selected': {
  //        backgroundColor: "rgb(236 255 252)"
  //      }
  //    }
  //  }
  //},
  palette: {
    background: {
      default: '#F5F7FA',
      paper: '#fff',
    },
    common: {
      black: '#000',
      white: '#fff',
    },
    error: {
      contrastText: '#fff',
      dark: '#E99C00', // orange error
      light: '#E8C2C2', // light red
      main: '#9F0000' // dark red
    },
    primary: {
      contrastText: '#fff',
      light: '#406E87',
      main: '#0D74DC',
    },
    secondary: {
      contrastText: '#fff',
      light: '#5FB9AA',
      main: '#2AA18D'
    },
    //tertiary: {
    //  contrastText: '#fff',
    //  light: '#F3775C',
    //  main: '#F26849'
    //},
    text: {
      disabled: 'rgba(0, 0, 0, 0.38)',
      primary: '#2A3448',
      secondary: 'rgba(42, 52, 72, 1)',
    },
    //warn: {
    //  red: '#9F0000',
    //  hover: '#800000',
    //  green: '#009200',
    //},
  },
  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: 700
    },
    h2: {
      fontSize: '24px',
      fontWeight: 500
    },
    h3: {
      fontSize: '18px',
      fontWeight: 500
    },
    h4: {
      fontSize: '16px',
      fontWeight: 500
    },
    h5: {
      fontSize: '14px',
      fontWeight: 500
    },
    h6: {
      fontSize: '12px',
      fontWeight: 500
    },
    subtitle1: {
      fontWeight: 700
    },
    subtitle2: {
      fontWeight: 700
    },
    body1: {
      fontSize: '16px',
      fontWeight: 400
    },
    body2: {
      fontSize: '14px',
      fontWeight: 400
    },
    fontFamily: [
      'Roboto' // google fonts Barlow
    ].join(',')
  }
})
export default baseTheme
