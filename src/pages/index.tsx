import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import Policies from '../components/policies/policies';
import { useContext, useMemo } from 'react';
import { getInsuranceApi } from '../model/insurance_api';
import { AppContext } from '../context/app_context';

export default function PoliciesPage() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const appContext = useContext(AppContext);

    const insurance = useMemo(() => getInsuranceApi(
        enqueueSnackbar,
        appContext.data.signer,
        appContext.data.provider,
    ), [enqueueSnackbar, appContext]);

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            <Policies insurance={insurance} />
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