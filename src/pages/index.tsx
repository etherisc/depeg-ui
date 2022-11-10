import Application, { ApplicationProps } from "../components/application/application";
import { InsuranceApi } from "../model/insurance_data";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { i18n } from "next-i18next";
import { delay } from "../utils/delay";
import { useSnackbar } from "notistack";

export default function Home() {
  const { enqueueSnackbar } = useSnackbar();

  const insurance = {
      usd1: 'USDC',
      usd2: 'USDT',
      insuredAmountMin: 3000,
      insuredAmountMax: 10000,
      coverageDurationDaysMin: 14,
      coverageDurationDaysMax: 45,
      calculatePremium(walletAddress: string, insuredAmount: number, coverageDurationDays: number) {
        return Promise.resolve(insuredAmount * 0.017);
      },
      async createApproval(walletAddress: string, premium: number) {
        enqueueSnackbar(`Approval mocked (${walletAddress}, ${premium}`,  { autoHideDuration: 3000, variant: 'info' });
        await delay(2000);
        return Promise.resolve(true);
      },
      async applyForPolicy(walletAddress, insuredAmount, coverageDurationDays) {
        enqueueSnackbar(`Policy mocked (${walletAddress}, ${insuredAmount}, ${coverageDurationDays})`,  { autoHideDuration: 3000, variant: 'info' });
        await delay(2000);
        return Promise.resolve(true);
      }
  } as InsuranceApi;

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