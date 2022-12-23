/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
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

export interface IStakingRegistryInterface extends utils.Interface {
  functions: {
    "getBundleCapitalSupport(bytes32,uint256)": FunctionFragment;
    "getBundleStakes(bytes32,uint256)": FunctionFragment;
    "getBundleToken(bytes32,uint256)": FunctionFragment;
    "registerBundle(bytes32,uint256)": FunctionFragment;
    "registerRiskpool(bytes32,uint256)": FunctionFragment;
    "updateBundle(bytes32,uint256)": FunctionFragment;
    "updateRiskpool(bytes32,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "getBundleCapitalSupport"
      | "getBundleStakes"
      | "getBundleToken"
      | "registerBundle"
      | "registerRiskpool"
      | "updateBundle"
      | "updateRiskpool"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getBundleCapitalSupport",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBundleStakes",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getBundleToken",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerBundle",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "registerRiskpool",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateBundle",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRiskpool",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "getBundleCapitalSupport",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBundleStakes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBundleToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerBundle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "registerRiskpool",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateBundle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRiskpool",
    data: BytesLike
  ): Result;

  events: {};
}

export interface IStakingRegistry extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IStakingRegistryInterface;

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
    getBundleCapitalSupport(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { capitalAmount: BigNumber }>;

    getBundleStakes(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { dipAmount: BigNumber }>;

    getBundleToken(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string] & { token: string }>;

    registerBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    updateRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  getBundleCapitalSupport(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBundleStakes(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBundleToken(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  registerBundle(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerRiskpool(
    instanceId: PromiseOrValue<BytesLike>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateBundle(
    instanceId: PromiseOrValue<BytesLike>,
    bundleId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  updateRiskpool(
    instanceId: PromiseOrValue<BytesLike>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getBundleCapitalSupport(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleStakes(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleToken(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    registerBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    registerRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    updateRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    getBundleCapitalSupport(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleStakes(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBundleToken(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    registerBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    updateRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getBundleCapitalSupport(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBundleStakes(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBundleToken(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    registerBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateBundle(
      instanceId: PromiseOrValue<BytesLike>,
      bundleId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    updateRiskpool(
      instanceId: PromiseOrValue<BytesLike>,
      riskpoolId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
