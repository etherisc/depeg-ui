import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <Component {...pageProps} />
    </React.Fragment>
  );
}
