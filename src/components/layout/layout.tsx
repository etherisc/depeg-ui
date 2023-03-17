import { Alert, AlertColor, Button, Collapse } from "@mui/material";
import Container from "@mui/material/Container";
import { useTranslation } from "next-i18next";
import { AppProps } from "next/app";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Footer from "./footer";
import Header from "./header";
import UnexpectedChain from "./unexpected_chain";

export default function Layout({ Component, pageProps }: AppProps) {
    const { title, items } = pageProps;

    const { t } = useTranslation('common');
    const [ noticeDismissed, setNoticeDismissed ] = useState(false);
    const isExpectedChain = useSelector((state: RootState) => state.chain.isExpectedChain);

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
                                        { t('action.dismiss') }
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
        <Header title={title} items={items} />
        <Container maxWidth="lg" sx={{ p: 1, marginBottom: "5vh" }}>
            {content()}
        </Container>
        <Footer />
    </>);
}
