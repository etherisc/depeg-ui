import Application, { ApplicationProps } from "../components/application/application";
import { InsuranceData } from "../utils/insurance_data";

export default function Home() {

  const insurance = {
      usd1: 'USDC',
      usd2: 'USDT',
    
  } as InsuranceData;

  return (
    <>
      <Application insurance={insurance} />
    </>
  )
}
