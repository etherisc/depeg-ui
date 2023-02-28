import { useSelector } from "react-redux";
import { BackendApi } from "../../backend/backend_api";
import { RootState } from "../../redux/store";
import BundlesList from "./bundles_list";
import ShowBundle from "./show_bundle";

export interface BundlesProps {
    backend: BackendApi;
}

export default function Bundles(props: BundlesProps) {
    const showBundle = useSelector((state: RootState) => state.bundles.showBundle);

    if (showBundle !== undefined) {
        return (<ShowBundle backend={props.backend} />);
    } else {
        return (<BundlesList insurance={props.backend} />);
    }

}