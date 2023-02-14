import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import Policies from '../components/policies/policies';
import { useEffect, useMemo } from 'react';
import { getBackendApi } from '../backend/backend_api';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function PoliciesPage() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const router = useRouter();
    const signer = useSelector((state: RootState) => state.chain.signer);
    const provider = useSelector((state: RootState) => state.chain.provider);
    const isConnected = useSelector((state: RootState) => state.chain.isConnected);

    const insurance = useMemo(() => getBackendApi(
        enqueueSnackbar,
        t,
        signer,
        provider,
    ), [enqueueSnackbar, signer, provider, t]);

    
    // if wallet has no policies, redirect to application page
    async function redirectToApplication() {
        if ( isConnected && await insurance.policiesCount(await signer!!.getAddress()) === 0 ) {
            router.push('/');
            return;
        }
    }

    redirectToApplication();

    useEffect(() => {
        redirectToApplication();
    }, [signer]);

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            <Policies backend={insurance} />
        </>
    )
}

export async function getStaticProps() {
    if (process.env.NODE_ENV === "development") {
        await i18n?.reloadResources();
    }
    return {
        props: {
            ...(await serverSideTranslations('en', ['common', 'policies'])),
        },
    }
}