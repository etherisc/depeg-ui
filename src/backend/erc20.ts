import { BigNumber, Signer } from "ethers";
import { ERC20, ERC20__factory } from "../contracts/depeg-contracts";

export function getErc20Token(address: string, signer: Signer): ERC20 {
    return ERC20__factory.connect(address, signer);
}

/** Checks weather the given wallet has the expected balance */
export async function hasBalance(walletAddress: string, expectedBalance: BigNumber, tokenAddress: string, signer: Signer): Promise<boolean> {
    const token = getErc20Token(tokenAddress, signer);
    const balance = await token.balanceOf(walletAddress);
    return balance.gte(expectedBalance);
}

export async function transferAmount(walletAddress: string, amountToTransfer: BigNumber, tokenAddress: string, signer: Signer): Promise<boolean> {
    console.log(`Transferring ${amountToTransfer} from ${walletAddress} to ${tokenAddress}`);
    const token = getErc20Token(tokenAddress, signer);
    const tx = await token.transfer(walletAddress, amountToTransfer, { gasLimit: 100000});
    const rcpt = await tx.wait();
    return rcpt.status === 1;
}

/**
 * Checks weather the given address pair has the expected allowance.
 */
export async function hasAllowance(sourceAddress: string, targetAddress: string, amount: BigNumber, tokenAddress: string, signer: Signer): Promise<Boolean> {
    const token = getErc20Token(tokenAddress, signer);
    const allowance = await token.allowance(sourceAddress, targetAddress);
    return allowance.gte(amount);
}