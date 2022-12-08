// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next'
import { transferAmount } from '../../backend/erc20';

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const address = req.query.address as string;

    console.log("faucet called for", address);
    const currency = process.env.NEXT_PUBLIC_DEPEG_USD2;
    const currencyDecimals = parseInt(process.env.NEXT_PUBLIC_DEPEG_USD2_DECIMALS ?? '6');
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    const coinSourceSigner: Signer = ethers.Wallet.fromMnemonic(process.env.NEXT_FAUCET_MNEMONIC ?? "").connect(provider);

    if (process.env.NEXT_FAUCET_SEND_ETHERS === "true") {
        // transfer 10 eth to pay for trx
        let ethTx = {
            to: address!,
            gasLimit: 50000,
            value: parseEther("10.0") // 10 ETH
        };
        console.log("sending 10 eth to", ethTx.to);
        const tx = await coinSourceSigner!.sendTransaction(ethTx);
        await tx.wait();
        console.log("done");
    }

    if (process.env.NEXT_FAUCET_SEND_TESTCOIN === "true") {
        const amount = 1000000 * Math.pow(10, currencyDecimals); // 1'000'000 USD2
        console.log("sending", currency, address);
        // transfer 1'000'000 testcoin
        const tokenAddress = process.env.NEXT_FAUCET_COIN_ADDRESS ?? "";
        await transferAmount(address!, amount, tokenAddress, coinSourceSigner!); 
        console.log("done");
    }

    res.status(200).json({ name: 'John' });
}
