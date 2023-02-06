import { BigNumber } from "ethers";
import { BundleData } from "../backend/bundle_data";
import { minBigNumber } from "./bignumber";

export function filterApplicableBundles(bundles: Array<BundleData>, sumInsured: BigNumber, durationSeconds: number): Array<BundleData> {
    return bundles.filter(bundle => {
        const minSumInsured = BigNumber.from(bundle.minSumInsured);
        if (sumInsured.lt(minSumInsured)) {
            console.log("sumInsured less that min sum insured", sumInsured.toNumber(), bundle);
            return false;
        }
        const maxSumInsured = BigNumber.from(bundle.maxSumInsured);
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
        const capitalSupport = BigNumber.from(bundle.capitalSupport);
        const locked = BigNumber.from(bundle.locked);
        // stake adjusted capacity
        capacity = minBigNumber(capacity, capitalSupport.sub(locked));
        if (capacity.lt(sumInsured)) {
            console.log("capacity less that sum insured", capacity.toNumber(), sumInsured.toNumber(), bundle);
            return false;
        }
        return true;
    });
}
