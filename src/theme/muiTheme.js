// src/theme/muiTheme.js
import { createTheme } from '@mui/material/styles';
import catppuccinMocha from './colors';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: catppuccinMocha.lavender,
    },
    text: {
      primary: catppuccinMocha.text,
    },
    background: {
      default: catppuccinMocha.base,
    },
  },
});

export default muiTheme;

