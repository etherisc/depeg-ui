import { i18n, useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from "next/head";
import ClaimSuccess from '../components/claim_success/claim_success';

export default function ClaimSuccessPage() {
    const { t } = useTranslation('common');
    

    return (
        <>
            <Head>
                <title>{t('apptitle')}</title>
            </Head>

            <ClaimSuccess />
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