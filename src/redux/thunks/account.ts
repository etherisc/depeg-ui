import { createAsyncThunk } from "@reduxjs/toolkit"
import { Signer } from "ethers"
import { Amount } from "../../types/amount";
import { DepegProduct__factory } from "../../contracts/depeg-contracts";
import { getErc20Token } from "../../backend/erc20";

const CHAIN_TOKEN_SYMBOL = process.env.NEXT_PUBLIC_CHAIN_TOKEN_SYMBOL || "ETH";

// fetch onchain balances for current account
export const fetchBalances = createAsyncThunk(
    'accounts/fetchBalances',
    async (signer: Signer, thunkAPI) => {
        // fetch chain token balance
        const balance = await signer.getBalance();
        const chainTokenAmount = {
            amount: balance.toString(),
            currency: CHAIN_TOKEN_SYMBOL,
            decimals: 18,
        } as Amount;

        const depegProductContractAddress = process.env.NEXT_PUBLIC_DEPEG_CONTRACT_ADDRESS;
        const depegProduct = DepegProduct__factory.connect(depegProductContractAddress!, signer);
        const myAddress = await signer.getAddress();

        const token1Address = await depegProduct.getProtectedToken();
        const token1 = getErc20Token(token1Address!, signer);
        const token2Address = await depegProduct.getToken();
        const token2 = getErc20Token(token2Address!, signer);

        const token1Balance = await token1?.balanceOf(myAddress);
        const token1Amount = { 
            amount: token1Balance.toString(),
            currency: await token1.symbol(),
            decimals: await token1?.decimals(),
        } as Amount;
        
        const token2Balance = await token2?.balanceOf(myAddress);
        const token2Amount = {
            amount: token2Balance.toString(),
            currency: await token2.symbol(),
            decimals: await token2?.decimals(),
        };

        return [chainTokenAmount, token1Amount, token2Amount];
    }
)
