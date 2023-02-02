import { NextApiRequest, NextApiResponse } from "next"
import { BundleData } from "../../../backend/bundle_data"
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers, Signer } from "ethers";
import { DepegProduct, DepegProduct__factory, DepegRiskpool } from "../../../contracts/depeg-contracts";
import { getDepegRiskpool, getInstanceService } from "../../../backend/gif_registry";
import { IInstanceService } from "../../../contracts/gif-interface/IInstanceService";
import { DepegRiskpoolApi } from "../../../backend/riskpool_api";
import { redisClient } from "../../../utils/redis";

const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "0x0";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("updating bundles from blockchain");

    const signer = await getSigner();
    const { depegRiskpool, depegRiskpoolId, instanceService } = await getRiskpool(signer);
    const riskpoolApi = new DepegRiskpoolApi(depegRiskpool, depegRiskpoolId, instanceService);

    const bundles = await riskpoolApi.getBundleData();

    await redisClient.set("bundles", JSON.stringify(bundles));

    res.status(200).json(bundles);
}


async function getSigner(): Promise<Signer> {
    const provider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_CHAIN_RPC_URL);
    return new ethers.VoidSigner("0x0000000000000000000000000000000000000000", provider);
}

async function getRiskpool(signer: Signer): Promise<{ depegProduct: DepegProduct, depegRiskpool: DepegRiskpool, depegRiskpoolId: number, instanceService: IInstanceService }> {
    const depegProduct = DepegProduct__factory.connect(depegProductContractAddress, signer);
    const registryAddress = await depegProduct.getRegistry();
    const instanceService = await getInstanceService(registryAddress, signer);
    const depegRiskpoolId = (await depegProduct.getRiskpoolId()).toNumber();
    const depegRiskpool = await getDepegRiskpool(instanceService, depegRiskpoolId);
    return { depegProduct, depegRiskpool, depegRiskpoolId, instanceService };
}