import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import { getBackendApi } from "../backend/backend_api";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Price from "../components/price/price";

export default function PricePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation('common');
  const signer = useSelector((state: RootState) => state.chain.signer);
  const provider = useSelector((state: RootState) => state.chain.provider);

  const insurance = useMemo(() => getBackendApi(
    enqueueSnackbar,
    t,
    signer,
    provider,
  ), [enqueueSnackbar, signer, provider, t]);
  
  return (
    <>
      <Head>
          <title>{t('apptitle')}</title>
      </Head>
      
      <Price insurance={insurance} />
    </>
  )
}

export async function getStaticProps() {
  if (process.env.NODE_ENV === "development") {
    await i18n?.reloadResources();
  }
  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'price'])),   
    },
  }
}