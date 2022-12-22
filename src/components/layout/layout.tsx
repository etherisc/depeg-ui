import { Alert, AlertColor, Box, Button, Collapse } from "@mui/material";
import Container from "@mui/material/Container";
import { AppProps } from "next/app";
import { useCallback, useContext, useState } from "react";
import { AppContext } from "../../context/app_context";
import Footer from "./footer";
import Header from "./header";
import UnexpectedChain from "./unexpected_chain";

export default function Layout({ Component, pageProps }: AppProps) {
    const appContext = useContext(AppContext);
    const isExpectedChain = appContext.data.isExpectedChain;
    const [ noticeDismissed, setNoticeDismissed ] = useState(false);

    const content = useCallback(() => {
        if (isExpectedChain) {
            return (<Component {...pageProps} />);
        } else {
            return (<UnexpectedChain />);
        }
    }, [isExpectedChain, Component, pageProps]);

    const dismissClicked = () => {
        setNoticeDismissed(true);
    };

    const globalNotice = useCallback(() => {
        const notice = process.env.NEXT_PUBLIC_GLOBAL_NOTICE_TEXT;
        const type = process.env.NEXT_PUBLIC_GLOBAL_NOTICE_TYPE;
        if (notice !== undefined && notice?.trim() !== "" ) {
            return (<>
                <Container maxWidth={false} sx={{ backgroundColor: 'warning.main' }}>
                    <Container maxWidth="lg">
                        <Collapse in={!noticeDismissed}>
                            <Alert 
                                severity={type as AlertColor} 
                                variant="filled" 
                                action={
                                    <Button color="inherit" size="small" onClick={dismissClicked}>
                                        Dismiss
                                    </Button>
                                }
                                >
                                    {notice}
                            </Alert>
                        </Collapse>
                    </Container>
                </Container>
            </>);
        }
        return (<></>);
    }, [noticeDismissed]);

    return (<>
        {globalNotice()}
        <Header />
        <Container maxWidth="lg" sx={{ p: 1, minHeight: '100%' }}>
            {content()}
        </Container>
        <Footer />
    </>);
}
