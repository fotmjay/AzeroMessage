import { responsiveFontSizes, createTheme } from "@mui/material";

export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#00eac7",
      },
      secondary: {
        main: "#7ff4e3",
      },
      info: {
        main: "#0288d1",
      },
      background: {
        paper: "#14202a",
        default: "#14202a",
      },
      text: {
        primary: "#ffffff",
        secondary: "rgba(255,255,255,0.7)",
        disabled: "rgba(255,255,255,0.38)",
      },
      error: {
        main: "#ff4f4c",
      },
      warning: {
        main: "#ffd23f",
      },
      success: {
        main: "#66d16f",
      },
      divider: "rgba(255,255,255,0.2)",
    },
    typography: {
      body2: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      overline: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      caption: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      button: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      body1: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle1: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h6: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h5: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h4: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h3: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h2: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h1: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  })
);

export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
      primary: {
        main: "#00eac7",
      },
      secondary: {
        main: "#14202a",
      },
      info: {
        main: "#0288d1",
      },
      background: {
        default: "#f3f4f4",
        paper: "rgba(150,150,150, 0.1)",
      },
      text: {
        primary: "#14202a",
        secondary: "rgba(20,32,42,0.6)",
        disabled: "rgba(20,32,42,0.38)",
      },
      error: {
        main: "#ff4f4c",
      },
      warning: {
        main: "#fa7b05",
      },
      success: {
        main: "#66d16f",
      },
      divider: "rgba(0,0,0,0.15)",
    },
    typography: {
      body2: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      overline: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      caption: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      button: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      body1: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle2: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      subtitle1: {
        fontFamily: '"Karla", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h6: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h5: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h4: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h3: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h2: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
      h1: {
        fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  })
);
