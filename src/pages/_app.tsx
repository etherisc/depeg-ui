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
import { initialSignerData, SignerActionType, SignerContext, signerReducer } from '../context/signer_context';

// TODO: extract to a separate file
async function switchAccount(dispatch: any) {
  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  await provider.send("eth_requestAccounts", []);

  console.log("getting signer");
  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();  
  console.log(signer);
  dispatch({ type: SignerActionType.UPDATE_SIGNER, signer: signer });
}

export default function App({ Component, pageProps }: AppProps) {
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
          dispatch({ type: SignerActionType.UNSET });
          window.localStorage.clear();
        } else {
          switchAccount(dispatch);
        }
      });
      // @ts-ignore
      window.ethereum.on('chainChanged', function (chain: any) {
        console.log('chainChanged', chain);
        if (chain != "0xa869") {
          console.log('not fuji');
          dispatch({ type: SignerActionType.UNSET });
          window.localStorage.clear();  
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
      </Head>
      <CssBaseline enableColorScheme />
      <SignerContext.Provider value={{ data, dispatch}}>
        <Header />
        <Container maxWidth="lg" sx={{ p: 1 }}>
          <Component {...pageProps} />
        </Container>
      </SignerContext.Provider>
    </React.Fragment>
  );
}
