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
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    const coinSourceSigner: Signer = ethers.Wallet.fromMnemonic(process.env.NEXT_FAUCET_MNEMONIC ?? "").connect(provider);

    if (process.env.NEXT_FAUCET_SEND_ETHERS === "true") {
        console.log("sending ethers to", address);
        // transfer 10 eth to pay for trx
        let ethTx = {
            to: address!,
            gasLimit: 50000,
            value: parseEther("10.0") // 10 ETH
        };
        console.log("sending eth to", ethTx.to);
        const tx = await coinSourceSigner!.sendTransaction(ethTx);
        await tx.wait();
        console.log("done");
    }

    if (process.env.NEXT_FAUCET_SEND_TESTCOIN === "true") {
        console.log("sending testcoin to", address);
        // transfer 1'000'000 testcoin
        const tokenAddress = process.env.NEXT_FAUCET_COIN_ADDRESS ?? "";
        await transferAmount(address!, 1000000000000, tokenAddress, coinSourceSigner!); 
        console.log("done");
    }

    res.status(200).json({ name: 'John' });
}
