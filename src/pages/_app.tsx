import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useReducer } from 'react';
import Head from 'next/head';
import { initialAppData, removeSigner, AppContext, signerReducer } from '../context/app_context';
import { SnackbarProvider } from 'notistack';
import { appWithTranslation } from 'next-i18next';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAndUpdateWalletAccount } from '../components/shared/account/wallet';
import { ThemeProvider } from '@mui/material/styles';
import { etheriscTheme } from '../config/theme';
import Layout from '../components/layout';


export function App(appProps: AppProps) {
  const [ data, dispatch ] = useReducer(signerReducer, initialAppData());

  if (data.provider != undefined) {
    data.provider.on('network', (newNetwork: any, oldNetwork: any) => {
      console.log('network', newNetwork, oldNetwork);
      location.reload();
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
        location.reload();
      });
      // @ts-ignore
      window.ethereum.on('network', (newNetwork: any, oldNetwork: any) => {
        console.log('network', newNetwork, oldNetwork);
        location.reload();
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
              <Layout {...appProps} />
            </LocalizationProvider>
          </SnackbarProvider>
        </AppContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App);
