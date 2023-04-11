import { Signer } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { BundleData } from "../../../backend/bundle_data";
import { getDepegRiskpool, getInstanceService } from "../../../backend/gif_registry";
import { DepegRiskpoolApi } from "../../../backend/riskpool_api";
import { DepegProduct, DepegProduct__factory, DepegRiskpool, IInstanceService } from "../../../contracts/depeg-contracts";
import { getBackendVoidSigner } from "../../../utils/chain";
import { redisClient } from "../../../utils/redis";
import { isIpAllowedToConnect } from "../../../utils/check_ip";

const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS ?? "0x0";
const usd2Decimals = parseInt(process.env.NEXT_PUBLIC_USD2_DECIMALS ?? "6");

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<BundleData>>
) {
    console.log("called /api/bundles/update");

    if (! isIpAllowedToConnect(req, res)) {
        return;
    }

    const signer = await getBackendVoidSigner();
    const { depegRiskpool, depegRiskpoolId, instanceService } = await getRiskpool(signer);
    const riskpoolApi = new DepegRiskpoolApi(depegRiskpool, depegRiskpoolId, instanceService, usd2Decimals);
    await riskpoolApi.initialize();

    const updateOnlyBundle = req.query.bundleId as string;

    let bundles;

    if (updateOnlyBundle !== undefined) {
        console.log("fetching bundle", updateOnlyBundle);
        bundles = await updateBundle(riskpoolApi, parseInt(updateOnlyBundle));
    } else {
        console.log("fetching all bundles");
        bundles = await updateAllBundles(riskpoolApi);
    }

    res.status(200).json(bundles);
}

async function updateBundle(riskpoolApi: DepegRiskpoolApi, bundleId: number): Promise<Array<BundleData>> {
    const bundle = await riskpoolApi.getBundleDataByBundleId(bundleId);

    const storedBundles = await redisClient.get("bundles");
    const bundles = storedBundles ? JSON.parse(storedBundles) : [];
    // update bundle
    const index = bundles.findIndex((b: BundleData) => b.id === bundleId);
    if (index !== -1) {
        bundles[index] = bundle;
    } else {
        bundles.push(bundle);
    }

    await redisClient.set("bundles", JSON.stringify(bundles));
    return [bundle];
}

async function updateAllBundles(riskpoolApi: DepegRiskpoolApi): Promise<Array<BundleData>> {
    const bundles = await riskpoolApi.getBundleData();
    await redisClient.set("bundles", JSON.stringify(bundles));
    return bundles;
}

async function getRiskpool(signer: Signer): 
        Promise<{ 
            depegProduct: DepegProduct, 
            depegRiskpool: DepegRiskpool, 
            depegRiskpoolId: number, 
            instanceService: IInstanceService 
        }> 
{
    const depegProduct = DepegProduct__factory.connect(depegProductContractAddress, signer);
    const registryAddress = await depegProduct.getRegistry();
    const instanceService = await getInstanceService(registryAddress, signer);
    const depegRiskpoolId = (await depegProduct.getRiskpoolId()).toNumber();
    const depegRiskpool = await getDepegRiskpool(instanceService, depegRiskpoolId);
    return { depegProduct, depegRiskpool, depegRiskpoolId, instanceService };
}