import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useReducer } from 'react';
import Container from '@mui/material/Container';
import Header from '../components/shared/header';
import Head from 'next/head';
import { initialSignerData, removeSigner, SignerContext, signerReducer } from '../context/signer_context';
import Footer from '../components/shared/footer';
import { SnackbarProvider } from 'notistack';
import { getAccount } from '../utils/metamask';
import { appWithTranslation } from 'next-i18next';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';


export function App({ Component, pageProps }: AppProps) {
  const [ data, dispatch ] = useReducer(signerReducer, initialSignerData());

  if (data.provider != undefined) {
    data.provider.on('network', (newNetwork: any, oldNetwork: any) => {
      console.log('network', newNetwork, oldNetwork);
    });

    // @ts-ignore
    if (window.ethereum !== undefined) {
      // @ts-ignore
      window.ethereum.on('accountsChanged', function (accounts: string[]) {
        console.log('accountsChanged', accounts);
        if (accounts.length == 0) {
          removeSigner(dispatch);
        } else {
          getAccount(dispatch);
        }
      });
      // @ts-ignore
      window.ethereum.on('chainChanged', function (chain: any) {
        console.log('chainChanged', chain);
        if (chain != "0xa869") {
          console.log('not fuji');
          removeSigner(dispatch);
        }
      });
      // @ts-ignore
      window.ethereum.on('network', (newNetwork: any, oldNetwork: any) => {
        console.log('network', newNetwork, oldNetwork);
      });
    }
  }

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <CssBaseline enableColorScheme />
      <SignerContext.Provider value={{ data, dispatch}}>
        <SnackbarProvider maxSnack={3}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <Header />
            <Container maxWidth="lg" sx={{ p: 1 }}>
              <Component {...pageProps} />
            </Container>
            <Footer />
          </LocalizationProvider>
        </SnackbarProvider>
      </SignerContext.Provider>
    </React.Fragment>
  );
}

export default appWithTranslation(App);
