// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErc20Token } from '../../../backend/erc20';

type Data = {
    balance: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const address = req.query.address as string;

    console.log("balance check called");
    const currency = process.env.NEXT_PUBLIC_DEPEG_USD2;
    const currencyDecimals = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD2_DECIMALS ?? '6');
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    const coinSourceSigner: Signer = ethers.Wallet.fromMnemonic(process.env.NEXT_FAUCET_MNEMONIC ?? "").connect(provider);

    const erc20 = getErc20Token(process.env.NEXT_PUBLIC_FAUCET_COIN_ADDRESS ?? "", coinSourceSigner!);
    const balance = await erc20.balanceOf(coinSourceSigner!.getAddress());
    const expectedBalance = parseUnits(process.env.NEXT_PUBLIC_FAUCET_EXPECTED_BALANCE ?? "1000000", currencyDecimals); // 1'000'000 USD2
    let status = 200;

    if (balance.lt(expectedBalance)) {
        status = 500;
    } 
    
    res.status(status).json({ balance: formatUnits(balance, currencyDecimals) });
}
