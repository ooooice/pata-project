import { createTheme } from '@mui/material';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(26, 54, 124)',
    },
    secondary: {
      main: 'rgb(255, 130, 92)',
    },
    error: {
      main: '#e57373',
    },
    info: {
      main: 'rgba(0, 0, 0, 0.6)',
    }
  },
  typography: {
    fontFamily: [
      '"Poppins"',
      'sans-serif',
    ].join(','),
  },
});

export default theme;