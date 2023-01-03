import '../../styles/globals.css'
import type { AppProps } from 'next/app'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import React, { useReducer } from 'react';
import Head from 'next/head';
import { initialAppData, AppContext, signerReducer } from '../context/app_context';
import { SnackbarProvider } from 'notistack';
import { appWithTranslation } from 'next-i18next';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getAndUpdateWalletAccount } from '../utils/wallet';
import { ThemeProvider } from '@mui/material/styles';
import { etheriscTheme } from '../config/theme';
import Layout from '../components/layout/layout';

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store';
import { removeSigner } from '../utils/chain';
config.autoAddCss = false; /* eslint-disable import/first */

export function App(appProps: AppProps) {
  
  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <ThemeProvider theme={etheriscTheme}>
        <CssBaseline enableColorScheme />
        <Provider store={store}>
          <AppWithBlockchainConnection {...appProps} />
        </Provider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default appWithTranslation(App);


export function AppWithBlockchainConnection(appProps: AppProps) {
  const [ data, dispatch ] = useReducer(signerReducer, initialAppData());
  const reduxDispatch = useDispatch();

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
          removeSigner(reduxDispatch);
        } else {
          getAndUpdateWalletAccount(reduxDispatch);
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
    <AppContext.Provider value={{ data, dispatch}} >
      <SnackbarProvider maxSnack={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Layout {...appProps} />
        </LocalizationProvider>
      </SnackbarProvider>
    </AppContext.Provider>
  );
}
