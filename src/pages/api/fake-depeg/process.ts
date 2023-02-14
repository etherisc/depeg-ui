// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErc20Token } from '../../../backend/erc20';
import { DepegProduct__factory, ERC20__factory } from '../../../contracts/depeg-contracts';
import { IERC20__factory } from '../../../contracts/gif-interface';
import { redisClient } from '../../../utils/redis';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log("fake-depeg confirm called");

    if (process.env.NEXT_PUBLIC_FEATURE_FAKE_DEPEG_ENABLED !== 'true') {
        res.status(400).json({ });
        return; 
    }

    const productOwnerSigner: Signer = getProductOwnerSigner();

    const latestBlockNumber = parseInt(await redisClient.get("fake-depeg-block-number") ?? '0');

    if (latestBlockNumber === 0) {
        console.log("no block number set");
        res.status(500).json({});
        return;
    }

    const depegProduct = DepegProduct__factory.connect(process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "", productOwnerSigner);
    const usd2 = ERC20__factory.connect(await depegProduct.getToken(), productOwnerSigner);

    const policies = (await depegProduct.policiesToProcess()).toNumber();
    console.log("policies to process: ", policies);

    let balances = [];
    let processIds = [];

    for (let p = 0; p < policies; p++) {
        const { processId, wallet } = await depegProduct.getPolicyToProcess(p);
        console.log("processing policy: ", processId, wallet);
        const currentBalance = await usd2.balanceOf(wallet);
        console.log("current balance: ", formatUnits(currentBalance, await usd2.decimals()));
        const balance = await depegProduct.createDepegBalance(wallet, latestBlockNumber, currentBalance);
        balances.push(balance);
        processIds.push(processId);
    }

    if (balances.length > 0) {
        await depegProduct.addDepegBalances(balances);
        console.log("balances added");
        await depegProduct.processPolicies(processIds);
        console.log("policies processed: ", processIds);
    }
    
    console.log("fake-depeg confirm done");
    res.status(200).json({});
}


function getProductOwnerSigner(): Signer {
    const mnemonic = process.env.NEXT_PUBLIC_FAKE_DEPEG_PRODUCT_OWNER_MNEMONIC;
    if (!mnemonic) {
        throw new Error("Product owner mnemonic not set");
    }

    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    const walletIndex = parseInt(process.env.NEXT_PUBLIC_FAKE_DEPEG_PRODUCT_OWNER_HD_WALLET_INDEX ?? '0');
    return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${walletIndex}`).connect(provider);
}
