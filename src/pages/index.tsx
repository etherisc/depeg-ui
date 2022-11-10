import Application, { ApplicationProps } from "../components/application/application";
import { InsuranceData } from "../model/insurance_data";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";

export default function Home() {

  const insurance = {
      usd1: 'USDC',
      usd2: 'USDT',
      insuredAmountMin: 3000,
      insuredAmountMax: 10000,
      coverageDurationDaysMin: 14,
      coverageDurationDaysMax: 45,
  } as InsuranceData;

  const {t} = useTranslation('common');

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
      ...(await serverSideTranslations('en', ['common', 'application'])),    },
  }
}