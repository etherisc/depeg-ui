import { Signer } from "ethers";
import { IERC20, IERC20__factory } from "../../contracts/gif-interface";

export function getErc20Token(address: string, signer: Signer): IERC20 {
    return IERC20__factory.connect(address, signer);
}