import Application, { ApplicationProps } from "../components/application/application";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { useSnackbar } from "notistack";
import { insuranceApiMock } from "../model/insurance_api_mock";

export default function ApplicationPage() {
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation('common');

  const insurance = insuranceApiMock(enqueueSnackbar);
  
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