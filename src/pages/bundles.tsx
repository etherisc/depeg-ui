import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import Policies from '../components/policies/policies';
import { useContext, useEffect, useMemo } from 'react';
import { getInsuranceApi } from '../model/insurance_api';
import { AppContext } from '../context/app_context';
import { useRouter } from 'next/router';
import { Signer } from 'ethers/lib/ethers';
import Bundles from '../components/bundles/bundles';

export default function BundlesPage() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const appContext = useContext(AppContext);
    const router = useRouter();

    const insurance = useMemo(() => getInsuranceApi(
        enqueueSnackbar,
        t,
        appContext.data.signer,
        appContext.data.provider,
    ), [enqueueSnackbar, appContext, t]);

    
    // TODO: reenable this once we can get a bundle count quickly
    // // if wallet has no policies, redirect to application page
    // async function redirectToInvest(signer: Signer | undefined) {
    //     if ( appContext.data.signer !== undefined && await insurance.policiesCount(await signer!!.getAddress()) === 0 ) {
    //         router.push('/invest');
    //         return;
    //     }
    // }

    // redirectToInvest(appContext.data.signer);

    // useEffect(() => {
        // redirectToInvest(appContext.data.signer);
    // }, [appContext.data.signer]);

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            <Bundles insurance={insurance} />
        </>
    )
}

export async function getStaticProps() {
    if (process.env.NODE_ENV === "development") {
        await i18n?.reloadResources();
    }
    return {
        props: {
            ...(await serverSideTranslations('en', ['common', 'bundles'])),
        },
    }
}