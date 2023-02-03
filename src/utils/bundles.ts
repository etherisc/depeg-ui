import { BigNumber } from "ethers";
import { BundleData } from "../backend/bundle_data";

export function filterApplicableBundles(bundles: Array<BundleData>, sumInsured: BigNumber, durationSeconds: number): Array<BundleData> {
    return bundles.filter(bundle => {
        const minSumInsured = BigNumber.from(bundle.minSumInsured);
        const maxSumInsured = BigNumber.from(bundle.maxSumInsured);
        if (sumInsured.lt(minSumInsured)) {
            console.log("sumInsured less that min sum insured", sumInsured.toNumber(), bundle);
            return false;
        }
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
        return true;
    });    
}
