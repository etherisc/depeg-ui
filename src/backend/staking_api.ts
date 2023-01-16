import { BigNumber, Signer } from "ethers";
import { IStakingDataProvider, IStakingDataProvider__factory } from "../contracts/depeg-contracts";
import { IInstanceService } from "../contracts/gif-interface";

export default class StakingApi {
    private stakingContract: IStakingDataProvider;
    private instanceService: IInstanceService;
    private instanceId?: string;
    

    constructor(stakingAddress: string, signer: Signer, instanceService: IInstanceService) {
        this.stakingContract = IStakingDataProvider__factory.connect(stakingAddress, signer);
        this.instanceService = instanceService;
    }

    async getInstanceId(): Promise<string> {
        if (this.instanceId !== undefined) {
            return this.instanceId;
        }

        this.instanceId = await this.instanceService.getInstanceId();
        return this.instanceId;
    }

    async getSupportedCapital(riskpoolId: number, bundleId: number): Promise<BigNumber> {
        const targetId = await this.stakingContract.toBundleTargetId(await this.getInstanceId(), riskpoolId, bundleId);
        return await this.stakingContract.capitalSupport(targetId);
    }

}