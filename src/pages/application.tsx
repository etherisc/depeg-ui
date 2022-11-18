import Application from "../components/application/application";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import { getInsuranceApi } from "../model/insurance_api";
import { SignerContext } from "../context/signer_context";
import { useContext, useMemo } from "react";

export default function ApplicationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation('common');
  const signerContext = useContext(SignerContext);

  const insurance = useMemo(() => getInsuranceApi(
    enqueueSnackbar,
    signerContext?.data.signer,
    signerContext?.data.provider,
  ), [enqueueSnackbar, signerContext]);
  
  return (
    <>
      <Head>
          <title>{t('apptitle')}</title>
      </Head>
      
      <Application insurance={insurance} />
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === "development") {
    await i18n?.reloadResources();
  }
  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'application'])),   
    },
  }
}