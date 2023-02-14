// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from 'ethers';
import { formatBytes32String, formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErc20Token } from '../../../backend/erc20';
import { DepegProduct__factory } from '../../../contracts/depeg-contracts';
import { redisClient } from '../../../utils/redis';

type Data = {
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    console.log("fake-depeg reset called");

    if (process.env.NEXT_PUBLIC_FEATURE_FAKE_DEPEG_ENABLED !== 'true') {
        res.status(400).json({});
        return; 
    }

    await redisClient.del("fake-depeg-block-number");

    console.log("fake-depeg reset done");
    res.status(200).json({});
}


function getProductOwnerSigner(): Signer {
    const mnemonic = process.env.NEXT_PUBLIC_FAKE_DEPEG_PRODUCT_OWNER_MNEMONIC;
    if (!mnemonic) {
        throw new Error("Product owner mnemonic not set");
    }

    const walletNumber = parseInt(process.env.NEXT_PUBLIC_FAKE_DEPEG_PRODUCT_OWNER_HD_WALLET_INDEX ?? '0');
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    return ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${walletNumber}`).connect(provider);
}