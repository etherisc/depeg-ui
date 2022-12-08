import Container from "@mui/material/Container";
import { AppProps } from "next/app";
import { useCallback, useContext } from "react";
import { AppContext } from "../../context/app_context";
import Footer from "./footer";
import Header from "./header";
import UnexpectedChain from "./unexpected_chain";

export default function Layout({ Component, pageProps }: AppProps) {
    const appContext = useContext(AppContext);
    const isExpectedChain = appContext.data.isExpectedChain;

    const content = useCallback(() => {
        if (isExpectedChain) {
            return (<Component {...pageProps} />);
        } else {
            return (<UnexpectedChain />);
        }
    }, [isExpectedChain, Component, pageProps]);
    

    return (<>
        <Header />
        <Container maxWidth="lg" sx={{ p: 1 }}>
            {content()}
        </Container>
        <Footer />
    </>);
}