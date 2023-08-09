import { BigNumber, Signer } from "ethers";
import { toHex } from "../utils/numbers";
import { formatUnits, formatBytes32String } from "ethers/lib/utils";
import { nanoid } from "nanoid";
import { TransactionFailedError } from "../utils/error";

export class ApplicationGasless {
    private depegProductAddress: string | undefined;
    private chainId: string;
    private signer: Signer;

    constructor(signer: Signer) {
        this.depegProductAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
        this.chainId = toHex(parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1"));
        this.signer = signer;
    }

    async applyForPolicyGasless(
        walletAddress: string, 
        protectedAmount: BigNumber, 
        coverageDurationSeconds: number,
        bundleId: number,
        beforeApplyCallback?: (address: string) => void,
        beforeWaitCallback?: (address: string) => void,
    ): Promise<{ status: boolean, processId: string|undefined}> {
        if (process.env.NEXT_PUBLIC_FEATURE_GASLESS_TRANSACTION !== 'true') {
            throw new Error("Gasless transactions are not enabled");
        }
        
        console.log("applyForPolicyGasless", walletAddress, protectedAmount, coverageDurationSeconds, bundleId);

        if (beforeApplyCallback !== undefined) {
            beforeApplyCallback("");
        }
        
        const domain = {
            chainId: this.chainId,
            name: 'EtheriscDepeg',
            // TODO: helper address
            verifyingContract: this.depegProductAddress,
            version: '1',
        };

        const types = {
            Policy: [
                { name: 'wallet', type: 'address' },
                { name: 'protectedBalance', type: 'uint256' },   
                { name: 'duration', type: 'uint256' },
                { name: 'bundleId', type: 'uint256' },
                { name: 'signatureId', type: 'bytes32' },
            ],
        }

        const signatureId = nanoid();
        const message = {
            wallet: walletAddress,
            protectedBalance: formatUnits(protectedAmount, 0),
            duration: coverageDurationSeconds,
            bundleId: bundleId,
            signatureId: formatBytes32String(signatureId), 
        };

        const policyHolderAddress = await this.signer.getAddress();
        console.log("sending sign request", policyHolderAddress, domain, types, message);
        // const signature = await (signer.provider! as providers.Web3Provider).send("eth_signTypedData_v4", [sender, msgParams]);
        let signature;

        try {
            // @ts-ignore - _signTypedData is not part of the public API, but it's a generic way to sign EIP712 messages
            signature = await this.signer._signTypedData(domain, types, message);
            console.log("signature", signature);        
        } catch (e) {
            console.log("signing failed", e);
            throw new TransactionFailedError("Transaction signing failed", e);
        }

        const data = {
            policyHolder: policyHolderAddress,
            protectedWallet: walletAddress,
            protectedBalance: protectedAmount.toString(),
            duration: coverageDurationSeconds,
            bundleId,
            signatureId,
            signature,
        };

        const res = await fetch("/api/application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (res.status !== 200) {
            throw new TransactionFailedError(`invalid response from backend. statuscode ${res.status}. test: ${res.text}`, res.statusText);
        }

        return {
            status: true, 
            processId: "pending"
        };    
    }

}