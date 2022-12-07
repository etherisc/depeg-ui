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
import { initialAppData, removeSigner, AppContext, signerReducer, AppActionType } from '../context/app_context';
import Footer from '../components/shared/footer';
import { SnackbarProvider } from 'notistack';
import { appWithTranslation } from 'next-i18next';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAndUpdateWalletAccount } from '../components/shared/account/wallet';
import { ThemeProvider } from '@mui/material/styles';
import { etheriscTheme } from '../config/theme';


export function App({ Component, pageProps }: AppProps) {
  const [ data, dispatch ] = useReducer(signerReducer, initialAppData());

  if (data.provider != undefined) {
    data.provider.on('network', (newNetwork: any, oldNetwork: any) => {
      console.log('network', newNetwork, oldNetwork);
      dispatch({ type: AppActionType.CHAIN_CHANGED, chainId: newNetwork.chainId });
    });

    // @ts-ignore
    if (window.ethereum !== undefined) {
      // @ts-ignore
      window.ethereum.on('accountsChanged', function (accounts: string[]) {
        console.log('accountsChanged', accounts);
        if (accounts.length == 0) {
          removeSigner(dispatch);
        } else {
          getAndUpdateWalletAccount(dispatch);
        }
      });
      // @ts-ignore
      window.ethereum.on('chainChanged', function (chain: any) {
        console.log('chainChanged', chain);
        dispatch({ type: AppActionType.CHAIN_CHANGED, chainId: chain });
      });
      // @ts-ignore
      window.ethereum.on('network', (newNetwork: any, oldNetwork: any) => {
        console.log('network', newNetwork, oldNetwork);
        dispatch({ type: AppActionType.CHAIN_CHANGED, chainId: newNetwork.chainId });
      });
    }
  }

  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={etheriscTheme}>
        <CssBaseline enableColorScheme />
        <AppContext.Provider value={{ data, dispatch}} >
          <SnackbarProvider maxSnack={3}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <Header />
              <Container maxWidth="lg" sx={{ p: 1 }}>
                <Component {...pageProps} />
              </Container>
              <Footer />
            </LocalizationProvider>
          </SnackbarProvider>
        </AppContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App);
