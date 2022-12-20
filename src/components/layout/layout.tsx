import { Alert, AlertColor } from "@mui/material";
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

    const globalNotice = () => {
        const notice = process.env.NEXT_PUBLIC_GLOBAL_NOTICE_TEXT;
        const type = process.env.NEXT_PUBLIC_GLOBAL_NOTICE_TYPE;
        if (notice !== undefined && notice?.trim() !== "") {
            return (<Alert severity={type as AlertColor} variant="filled" sx={{ mb: 2 }}>{notice}</Alert>);
        }
        return (<></>);
    };

    return (<>
        <Header />
        <Container maxWidth="lg" sx={{ p: 1, marginBottom: "5vh" }}>
            {globalNotice()}
            {content()}
        </Container>
        <Footer />
    </>);
}
