/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IComponentRegistry,
  IComponentRegistryInterface,
} from "../IComponentRegistry";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentType",
        name: "componentType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentState",
        name: "state",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isNewComponent",
        type: "bool",
      },
    ],
    name: "LogInstanceRegistryComponentRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentState",
        name: "oldState",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentState",
        name: "newState",
        type: "uint8",
      },
    ],
    name: "LogInstanceRegistryComponentUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
    ],
    name: "registerComponent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
    ],
    name: "updateComponent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IComponentRegistry__factory {
  static readonly abi = _abi;
  static createInterface(): IComponentRegistryInterface {
    return new utils.Interface(_abi) as IComponentRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IComponentRegistry {
    return new Contract(address, _abi, signerOrProvider) as IComponentRegistry;
  }
}
