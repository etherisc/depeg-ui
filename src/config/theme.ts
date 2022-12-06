import { createTheme } from '@mui/material/styles';
import red from '@mui/material/colors/red';

// etherisc main colors
// red: EE4620
// blue: 5081F4
// green: 41D895
// yellow: F8B83A
// dark gray: 333F52
// light gray: C5D0DE

export const etheriscTheme = createTheme({
    palette: {
        background: {
            default: "#EBF0FC",
        },
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#5081F4',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            // light: will be calculated from palette.secondary.main,
            main: '#F8B83A', // yello
            // main: '#41D895', // green
            // dark: will be calculated from palette.secondary.main,
            // contrastText: will be calculated to contrast with palette.secondary.main
        },
    },
});
