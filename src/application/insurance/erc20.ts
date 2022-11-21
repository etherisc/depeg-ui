import { Signer } from "ethers";
import { IERC20, IERC20__factory } from "../../contracts/gif-interface";

export function getErc20Token(address: string, signer: Signer): IERC20 {
    return IERC20__factory.connect(address, signer);
}

/** Checks weather the given wallet has the expected balance */
export async function hasBalance(walletAddress: string, expectedBalance: number, tokenAddress: string, signer: Signer): Promise<boolean> {
    const token = getErc20Token(tokenAddress, signer);
    const balance = await token.balanceOf(walletAddress);
    return balance.gte(expectedBalance);
}
