import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import Container from '@mui/material/Container';
import Header from '../components/shared/header';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline enableColorScheme />
      <Header />
      <Container maxWidth="lg" sx={{ p: 1 }}>
        <Component {...pageProps} />
      </Container>
    </React.Fragment>
  );
}
