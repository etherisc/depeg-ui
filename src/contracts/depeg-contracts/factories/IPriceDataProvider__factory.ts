/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IPriceDataProvider,
  IPriceDataProviderInterface,
} from "../IPriceDataProvider";

const _abi = [
  {
    inputs: [],
    name: "getAggregatorAddress",
    outputs: [
      {
        internalType: "address",
        name: "priceInfoSourceAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAggregatorDecimals",
    outputs: [
      {
        internalType: "uint8",
        name: "priceInfoDecimals",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLatestPriceInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct IPriceDataProvider.PriceInfo",
        name: "priceInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "priceId",
        type: "uint256",
      },
    ],
    name: "getPriceInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
        ],
        internalType: "struct IPriceDataProvider.PriceInfo",
        name: "priceInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenAddress",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IPriceDataProvider__factory {
  static readonly abi = _abi;
  static createInterface(): IPriceDataProviderInterface {
    return new utils.Interface(_abi) as IPriceDataProviderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IPriceDataProvider {
    return new Contract(address, _abi, signerOrProvider) as IPriceDataProvider;
  }
}
