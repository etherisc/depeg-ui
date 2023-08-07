import { Signer } from "ethers";
import { formatBytes32String } from "ethers/lib/utils";
import { DepegRiskpool, DepegRiskpool__factory, IInstanceService, IInstanceService__factory, IRegistry__factory, IRiskpoolService, IRiskpoolService__factory } from "../contracts/depeg-contracts";

export async function getInstanceService(registryAddress: string, signer: Signer): Promise<IInstanceService> {
    // console.log("getInstanceService", registryAddress);
    const registry = IRegistry__factory.connect(registryAddress, signer);
    const instanceServiceAddress = await registry.getContract(formatBytes32String("InstanceService"));
    // console.log("instanceServiceAddress", instanceServiceAddress);
    return IInstanceService__factory.connect(instanceServiceAddress, signer);
}

export async function getRiskpoolService(instanceService: IInstanceService): Promise<IRiskpoolService> {
    const riskpoolServiceAddress = await instanceService.getRiskpoolService();
    // console.log("riskpoolServiceAddress", riskpoolServiceAddress);
    return IRiskpoolService__factory.connect(riskpoolServiceAddress, instanceService.signer);
}

export async function getDepegRiskpool(instanceService: IInstanceService, componentId: number): Promise<DepegRiskpool> {
    // console.log("getDepegRiskpool", componentId);
    const componentAddress = await instanceService.getComponent(componentId);
    if (componentAddress === undefined) {
        throw new Error("Component not found");
    }
    return DepegRiskpool__factory.connect(componentAddress, instanceService.signer);
}