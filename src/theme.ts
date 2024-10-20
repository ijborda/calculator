'use client';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { green, red, grey } from '@mui/material/colors';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    common: {
      white: '#fff',
    },
    text: {
      primary: grey[800],
      secondary: grey[600],
    },
    primary: {
      main: '#a47c48',
    },
    secondary: {
      main: green[500],
    },
    error: {
      main: '#d74141',
    },
    warning: {
      main: '#92923b',
    },
    success: {
      main: '#188d18',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    h1: {
      fontSize: '2.4rem',
      fontWeight: 400,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h3: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '0.6rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.5rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '0.9rem',
    },
  },
});

export default theme;
