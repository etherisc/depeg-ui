import { BigNumber, Signer } from "ethers";
import { IInstanceService } from "../contracts/depeg-contracts";
import { IChainRegistry, IChainRegistry__factory, IStaking, IStaking__factory } from "../contracts/registry-contracts";

export default class StakingApi {
    private stakingContract: IStaking;
    private chainRegistryContract?: IChainRegistry;
    private instanceService: IInstanceService;
    private instanceId?: string;
    

    constructor(stakingAddress: string, signer: Signer, instanceService: IInstanceService) {
        this.stakingContract = IStaking__factory.connect(stakingAddress, signer);
        this.instanceService = instanceService;
    }

    async initialize(): Promise<void> {
        const chainRegistryAddress = await this.stakingContract.getRegistry();
        this.chainRegistryContract = IChainRegistry__factory.connect(chainRegistryAddress, this.stakingContract.signer);
    }

    async getInstanceId(): Promise<string> {
        if (this.instanceId !== undefined) {
            return this.instanceId;
        }

        this.instanceId = await this.instanceService.getInstanceId();
        return this.instanceId;
    }

    async getSupportedCapital(bundleId: number): Promise<BigNumber> {
        const instanceId = await this.getInstanceId();
        console.log("chainRegistryContract!.getBundleNftId", instanceId, bundleId);
        const bundleNftId = await this.chainRegistryContract!.getBundleNftId(instanceId, bundleId);
        console.log("stakingContract.capitalSupport", bundleNftId.toNumber());
        return await this.stakingContract.capitalSupport(bundleNftId);
    }

}