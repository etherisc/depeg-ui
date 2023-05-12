import { BigNumber } from "ethers";
import { BundleData } from "../backend/bundle_data";
import { minBigNumber } from "./bignumber";
import dayjs from "dayjs";

export function formatBundleState(bundle: BundleData, t: (p: string, o: any) => string): string {
    const expiredAt = dayjs.unix(bundle.createdAt).add(parseInt(bundle.lifetime), 's');
    if (expiredAt.isBefore(dayjs())) {
        return t('bundle_state_expired', { ns: 'common'})
    }
    return t('bundle_state_' + bundle.state, { ns: 'common'})
}


export function filterApplicableBundles(bundles: Array<BundleData>, sumInsured: BigNumber, durationSeconds: number): Array<BundleData> {
    return bundles.filter(bundle => {
        const minSumInsured = BigNumber.from(bundle.minProtectedAmount);
        if (sumInsured.lt(minSumInsured)) {
            console.log("sumInsured less that min sum insured", sumInsured.toNumber(), bundle);
            return false;
        }
        const maxSumInsured = BigNumber.from(bundle.maxProtectedAmount);
        if (sumInsured.gt(maxSumInsured)) {
            console.log("sumInsured greater that max sum insured", sumInsured.toNumber(), bundle);
            return false;
        }
        if (durationSeconds < bundle.minDuration) {
            console.log("duration less that min duration", durationSeconds, bundle);
            return false;
        }
        if (durationSeconds > bundle.maxDuration) {
            console.log("duration greater that max duration", durationSeconds, bundle);
            return false;
        }
        let capacity = BigNumber.from(bundle.capacity);
        // stake adjusted capacity
        const capitalSupportRemaining = BigNumber.from(bundle.supportedCapacityRemaining);
        capacity = minBigNumber(capacity, capitalSupportRemaining);
        if (capacity.lt(sumInsured)) {
            console.log("capacity less that sum insured", capacity.toNumber(), sumInsured.toNumber(), bundle);
            return false;
        }
        return true;
    });
}
