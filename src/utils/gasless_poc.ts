import { BigNumber, Signer, providers } from "ethers";
import { formatBytes32String, formatEther, formatUnits } from "ethers/lib/utils";
import { toHex } from "./numbers";
import { DepegProduct__factory, Gasless__factory } from "../contracts/depeg-contracts";
import { nanoid } from 'nanoid';

const depegProductAddress = process.env.NEXT_PUBLIC_DEPEG_PRODUCT_ADDRESS;
const gaslessContractAddress = process.env.NEXT_PUBLIC_GASLESS_CONTRACT_ADDRESS;
const chainId = toHex(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"));

export async function applyForPolicyGasless(signer: Signer, walletAddress: string, protectedAmount: BigNumber, coverageDuration: number, premium: BigNumber, bundleId: number) {

    // const msgParams = JSON.stringify({
    const domain = {
        // This defines the network, in this case, Mainnet.
        chainId: chainId,
        // Give a user-friendly name to the specific contract you're signing for.
        name: 'EtheriscDepeg',
        // Add a verifying contract to make sure you're establishing contracts with the proper entity.
        verifyingContract: gaslessContractAddress,
        // This identifies the latest version.
        version: '1',
    };

    const types = {
        // This refers to the domain the contract is hosted on.
        // EIP712Domain: [
        //     { name: 'name', type: 'string' },
        //     { name: 'version', type: 'string' },
        //     { name: 'chainId', type: 'uint256' },
        //     { name: 'verifyingContract', type: 'address' },
        // ],
        Policy: [
            { name: 'wallet', type: 'address' },
            { name: 'protectedBalance', type: 'uint256' },   
            { name: 'duration', type: 'uint256' },
            { name: 'bundleId', type: 'uint256' },
            { name: 'signatureId', type: 'bytes32' },
        ],
    }
        

    const sigId = nanoid();
    const signatureId = formatBytes32String(sigId);
    const message = {
        wallet: walletAddress,
        protectedBalance: formatUnits(protectedAmount, 0),
        duration: coverageDuration,
        bundleId: bundleId,
        signatureId: signatureId, 
    };
        // // This refers to the keys of the following types object.
        // primaryType: 'Policy',
    // });

    const sender = await signer.getAddress();
    console.log("sending sign request", sender, domain, types, message);
    // const signature = await (signer.provider! as providers.Web3Provider).send("eth_signTypedData_v4", [sender, msgParams]);
    // @ts-ignore - _signTypedData is not part of the public API, but it's a generic way to sign EIP712 messages
    const signature = await signer._signTypedData(domain, types, message);
    console.log("signature", signature);

    // const signatureContract = Gasless__factory.connect(gaslessContractAddress!, signer);
    // console.log("sending tx", sender, walletAddress, protectedAmount, coverageDuration, bundleId, signature);
    // await signatureContract.applyForPolicy(sender, walletAddress, protectedAmount, coverageDuration, bundleId, signature);

    const depegProduct = DepegProduct__factory.connect(depegProductAddress!, signer);
    const tx = await depegProduct.applyForPolicyWithBundleAndSignature(walletAddress, walletAddress, protectedAmount, coverageDuration, bundleId, signatureId, signature);


    console.log("done");

}