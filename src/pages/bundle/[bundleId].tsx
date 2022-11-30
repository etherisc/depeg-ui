import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import { useContext, useMemo } from 'react';
import { getInsuranceApi } from '../../backend/insurance_api';
import { AppContext } from '../../context/app_context';
import { useRouter } from 'next/router';
import Bundle from '../../components/bundle/bundle';

export default function BundlePage() {
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation('common');
    const appContext = useContext(AppContext);
    const router = useRouter();
    let bundleId = undefined;

    if (router.isReady) {
        bundleId = parseInt(router.query.bundleId as string);
    }

    console.log(`showing bundle ${bundleId}`);

    const insurance = useMemo(() => getInsuranceApi(
        enqueueSnackbar,
        t,
        appContext.data.signer,
        appContext.data.provider,
    ), [enqueueSnackbar, appContext, t]);

    let bundle = (<></>);

    if (bundleId !== undefined) {
        bundle = (<Bundle insurance={insurance} id={bundleId} />);
    }

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            {bundle}
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

export async function getStaticPaths() {
    return {
        paths: [
            // String variant:
            // '/bundle/42',
            // Object variant:
            // { params: { bundleId: '44' } },
        ],
        fallback: 'blocking',
    }
}