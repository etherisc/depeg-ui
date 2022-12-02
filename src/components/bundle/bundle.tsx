import { NumberLiteralType } from "typescript";
import { InsuranceApi } from "../../backend/insurance_api";

interface BundleProps {
    insurance: InsuranceApi;
    id: number;
}

export default function Bundle(props: BundleProps) {
    return (<>
        bundle: {props.id}
    </>);
}