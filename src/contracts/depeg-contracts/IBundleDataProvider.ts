/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace IBundleDataProvider {
  export type BundleKeyStruct = {
    instanceId: PromiseOrValue<BytesLike>;
    bundleId: PromiseOrValue<BigNumberish>;
  };

  export type BundleKeyStructOutput = [string, BigNumber] & {
    instanceId: string;
    bundleId: BigNumber;
  };

  export type BundleInfoStruct = {
    key: IBundleDataProvider.BundleKeyStruct;
    riskpool: IComponentDataProvider.ComponentKeyStruct;
    name: PromiseOrValue<string>;
    state: PromiseOrValue<BigNumberish>;
    token: IInstanceDataProvider.TokenKeyStruct;
    tokenSymbol: PromiseOrValue<string>;
    tokenDecimals: PromiseOrValue<BigNumberish>;
    expiryAt: PromiseOrValue<BigNumberish>;
    closedAt: PromiseOrValue<BigNumberish>;
    createdAt: PromiseOrValue<BigNumberish>;
    updatedAt: PromiseOrValue<BigNumberish>;
  };

  export type BundleInfoStructOutput = [
    IBundleDataProvider.BundleKeyStructOutput,
    IComponentDataProvider.ComponentKeyStructOutput,
    string,
    number,
    IInstanceDataProvider.TokenKeyStructOutput,
    string,
    number,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber
  ] & {
    key: IBundleDataProvider.BundleKeyStructOutput;
    riskpool: IComponentDataProvider.ComponentKeyStructOutput;
    name: string;
    state: number;
    token: IInstanceDataProvider.TokenKeyStructOutput;
    tokenSymbol: string;
    tokenDecimals: number;
    expiryAt: BigNumber;
    closedAt: BigNumber;
    createdAt: BigNumber;
    updatedAt: BigNumber;
  };
}

export declare namespace IComponentDataProvider {
  export type ComponentKeyStruct = {
    instanceId: PromiseOrValue<BytesLike>;
    componentId: PromiseOrValue<BigNumberish>;
  };

  export type ComponentKeyStructOutput = [string, BigNumber] & {
    instanceId: string;
    componentId: BigNumber;
  };

  export type ComponentInfoStruct = {
    key: IComponentDataProvider.ComponentKeyStruct;
    componentType: PromiseOrValue<BigNumberish>;
    state: PromiseOrValue<BigNumberish>;
    createdAt: PromiseOrValue<BigNumberish>;
    updatedAt: PromiseOrValue<BigNumberish>;
  };

  export type ComponentInfoStructOutput = [
    IComponentDataProvider.ComponentKeyStructOutput,
    number,
    number,
    BigNumber,
    BigNumber
  ] & {
    key: IComponentDataProvider.ComponentKeyStructOutput;
    componentType: number;
    state: number;
    createdAt: BigNumber;
    updatedAt: BigNumber;
  };
}

export declare namespace IInstanceDataProvider {
  export type TokenKeyStruct = {
    token: PromiseOrValue<string>;
    chainId: PromiseOrValue<BigNumberish>;
  };

  export type TokenKeyStructOutput = [string, BigNumber] & {
    token: string;
    chainId: BigNumber;
  };

  export type InstanceInfoStruct = {
    id: PromiseOrValue<BytesLike>;
    state: PromiseOrValue<BigNumberish>;
    displayName: PromiseOrValue<string>;
    chainId: PromiseOrValue<BigNumberish>;
    registry: PromiseOrValue<string>;
    createdAt: PromiseOrValue<BigNumberish>;
    updatedAt: PromiseOrValue<BigNumberish>;
  };

  export type InstanceInfoStructOutput = [
    string,
    number,
    string,
    BigNumber,
    string,
    BigNumber,
    BigNumber
  ] & {
    id: string;
    state: number;
    displayName: string;
    chainId: BigNumber;
    registry: string;
    createdAt: BigNumber;
    updatedAt: BigNumber;
  };

  export type TokenInfoStruct = {
    key: IInstanceDataProvider.TokenKeyStruct;
    state: PromiseOrValue<BigNumberish>;
    symbol: PromiseOrValue<string>;
    decimals: PromiseOrValue<BigNumberish>;
    createdAt: PromiseOrValue<BigNumberish>;
    updatedAt: PromiseOrValue<BigNumberish>;
  };

  export type TokenInfoStructOutput = [
    IInstanceDataProvider.TokenKeyStructOutput,
    number,
    string,
    number,
    BigNumber,
    BigNumber
  ] & {
    key: IInstanceDataProvider.TokenKeyStructOutput;
    state: number;
    symbol: string;
    decimals: number;
    createdAt: BigNumber;
    updatedAt: BigNumber;
  };
}

export interface IBundleDataProviderInterface extends utils.Interface {
  functions: {
    "bundles(bytes32)": FunctionFragment;
    "bundles(bytes32,uint256)": FunctionFragment;
    "components(bytes32)": FunctionFragment;
    "getBundleId(bytes32,uint256,uint256)": FunctionFragment;
    "getBundleId(bytes32,uint256)": FunctionFragment;
    "getBundleInfo(bytes32,uint256)": FunctionFragment;
    "getComponentId(bytes32,uint256)": FunctionFragment;
    "getComponentInfo(bytes32,uint256)": FunctionFragment;
    "getInstanceId(uint256)": FunctionFragment;
    "getInstanceInfo(bytes32)": FunctionFragment;
    "getTokenId(uint256)": FunctionFragment;
    "getTokenInfo(address)": FunctionFragment;
    "getTokenInfo(address,uint256)": FunctionFragment;
    "instances()": FunctionFragment;
    "isRegisteredBundle(bytes32,uint256)": FunctionFragment;
    "isRegisteredComponent(bytes32,uint256)": FunctionFragment;
    "isRegisteredInstance(bytes32)": FunctionFragment;
    "isRegisteredToken(address)": FunctionFragment;
    "isRegisteredToken(address,uint256)": FunctionFragment;
    "tokens()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "bundles(bytes32)"
      | "bundles(bytes32,uint256)"
      | "components"
      | "getBundleId(bytes32,uint256,uint256)"
      | "getBundleId(bytes32,uint256)"
      | "getBundleInfo"
      | "getComponentId"
      | "getComponentInfo"
      | "getInstanceId"
      | "getInstanceInfo"
      | "getTokenId"
      | "getTokenInfo(address)"
      | "getTokenInfo(address,uint256)"
      | "instances"
      | "isRegisteredBundle"
      | "isRegisteredComponent"
      | "isRegisteredInstance"
      | "isRegisteredToken(address)"
      | "isRegisteredToken(address,uint256)"
      | "tokens"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "bundles(bytes32)",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "bundles(bytes32,uint256)",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "components",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBundleId(bytes32,uint256,uint256)",
    values: [
      PromiseOrValue<BytesLike>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getBundleId(bytes32,uint256)",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBundleInfo",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getComponentId",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getComponentInfo",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getInstanceId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getInstanceInfo",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenId",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenInfo(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenInfo(address,uint256)",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "instances", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isRegisteredBundle",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredComponent",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredInstance",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredToken(address)",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredToken(address,uint256)",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "tokens", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "bundles(bytes32)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "bundles(bytes32,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "components", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBundleId(bytes32,uint256,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBundleId(bytes32,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBundleInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComponentId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getComponentInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInstanceId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInstanceInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getTokenId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getTokenInfo(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenInfo(address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "instances", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredBundle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredComponent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredInstance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredToken(address)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredToken(address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokens", data: BytesLike): Result;

  events: {};
}

export interface IBundleDataProvider extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBundleDataProviderInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    "bundles(bytes32)"(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { numberOfBundles: BigNumber }>;

    "bundles(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { numberOfBundles: BigNumber }>;

    components(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { numberOfComponents: BigNumber }>;

    "getBundleId(bytes32,uint256,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { bundleId: BigNumber }>;

    "getBundleId(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { bundleId: BigNumber }>;

    getBundleInfo(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IBundleDataProvider.BundleInfoStructOutput] & {
        info: IBundleDataProvider.BundleInfoStructOutput;
      }
    >;

    getComponentId(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { componentId: BigNumber }>;

    getComponentInfo(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IComponentDataProvider.ComponentInfoStructOutput] & {
        info: IComponentDataProvider.ComponentInfoStructOutput;
      }
    >;

    getInstanceId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { instanceId: string }>;

    getInstanceInfo(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<
      [IInstanceDataProvider.InstanceInfoStructOutput] & {
        info: IInstanceDataProvider.InstanceInfoStructOutput;
      }
    >;

    getTokenId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber] & { tokenAddress: string; chainId: BigNumber }
    >;

    "getTokenInfo(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<
      [IInstanceDataProvider.TokenInfoStructOutput] & {
        info: IInstanceDataProvider.TokenInfoStructOutput;
      }
    >;

    "getTokenInfo(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [IInstanceDataProvider.TokenInfoStructOutput] & {
        info: IInstanceDataProvider.TokenInfoStructOutput;
      }
    >;

    instances(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { numberOfInstances: BigNumber }>;

    isRegisteredBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isRegistered: boolean }>;

    isRegisteredComponent(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isRegistered: boolean }>;

    isRegisteredInstance(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isRegistered: boolean }>;

    "isRegisteredToken(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isRegistered: boolean }>;

    "isRegisteredToken(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean] & { isRegistered: boolean }>;

    tokens(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { numberOfTokens: BigNumber }>;
  };

  "bundles(bytes32)"(
    instanceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "bundles(bytes32,uint256)"(
    instanceId: PromiseOrValue<BytesLike>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  components(
    instanceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getBundleId(bytes32,uint256,uint256)"(
    instanceId: PromiseOrValue<BytesLike>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    idx: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  "getBundleId(bytes32,uint256)"(
    instanceId: PromiseOrValue<BytesLike>,
    idx: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBundleInfo(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IBundleDataProvider.BundleInfoStructOutput>;

  getComponentId(
    instanceId: PromiseOrValue<BytesLike>,
    idx: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getComponentInfo(
    instanceId: PromiseOrValue<BytesLike>,
    componentId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IComponentDataProvider.ComponentInfoStructOutput>;

  getInstanceId(
    idx: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getInstanceInfo(
    instanceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<IInstanceDataProvider.InstanceInfoStructOutput>;

  getTokenId(
    idx: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber] & { tokenAddress: string; chainId: BigNumber }
  >;

  "getTokenInfo(address)"(
    tokenAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<IInstanceDataProvider.TokenInfoStructOutput>;

  "getTokenInfo(address,uint256)"(
    tokenAddress: PromiseOrValue<string>,
    chainId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<IInstanceDataProvider.TokenInfoStructOutput>;

  instances(overrides?: CallOverrides): Promise<BigNumber>;

  isRegisteredBundle(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isRegisteredComponent(
    instanceId: PromiseOrValue<BytesLike>,
    componentId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isRegisteredInstance(
    instanceId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isRegisteredToken(address)"(
    tokenAddress: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  "isRegisteredToken(address,uint256)"(
    tokenAddress: PromiseOrValue<string>,
    chainId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  tokens(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    "bundles(bytes32)"(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "bundles(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    components(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBundleId(bytes32,uint256,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBundleId(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleInfo(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IBundleDataProvider.BundleInfoStructOutput>;

    getComponentId(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComponentInfo(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IComponentDataProvider.ComponentInfoStructOutput>;

    getInstanceId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getInstanceInfo(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<IInstanceDataProvider.InstanceInfoStructOutput>;

    getTokenId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, BigNumber] & { tokenAddress: string; chainId: BigNumber }
    >;

    "getTokenInfo(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<IInstanceDataProvider.TokenInfoStructOutput>;

    "getTokenInfo(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<IInstanceDataProvider.TokenInfoStructOutput>;

    instances(overrides?: CallOverrides): Promise<BigNumber>;

    isRegisteredBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isRegisteredComponent(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isRegisteredInstance(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isRegisteredToken(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    "isRegisteredToken(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tokens(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    "bundles(bytes32)"(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "bundles(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    components(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBundleId(bytes32,uint256,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getBundleId(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleInfo(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComponentId(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getComponentInfo(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInstanceId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getInstanceInfo(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTokenInfo(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "getTokenInfo(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    instances(overrides?: CallOverrides): Promise<BigNumber>;

    isRegisteredBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isRegisteredComponent(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isRegisteredInstance(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isRegisteredToken(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "isRegisteredToken(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokens(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    "bundles(bytes32)"(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "bundles(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    components(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getBundleId(bytes32,uint256,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getBundleId(bytes32,uint256)"(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBundleInfo(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComponentId(
      instanceId: PromiseOrValue<BytesLike>,
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getComponentInfo(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInstanceId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getInstanceInfo(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenId(
      idx: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTokenInfo(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "getTokenInfo(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    instances(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isRegisteredBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isRegisteredComponent(
      instanceId: PromiseOrValue<BytesLike>,
      componentId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isRegisteredInstance(
      instanceId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isRegisteredToken(address)"(
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isRegisteredToken(address,uint256)"(
      tokenAddress: PromiseOrValue<string>,
      chainId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
