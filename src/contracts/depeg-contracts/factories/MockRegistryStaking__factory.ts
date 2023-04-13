/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type {
  MockRegistryStaking,
  MockRegistryStakingInterface,
} from "../MockRegistryStaking";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dipAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "usdtAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes5",
        name: "chain",
        type: "bytes5",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "objectType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "riskpoolId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "bundleId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "LogMockBundleRegistered",
    type: "event",
  },
  {
    inputs: [],
    name: "BUNDLE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CHAIN",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXP",
    outputs: [
      {
        internalType: "int8",
        name: "",
        type: "int8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INSTANCE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MULTIPLIER",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ORACLE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "POLICY",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRODUCT",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REGISTRY",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RISKPOOL",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "STAKE",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "SYMBOL",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TOKEN",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNDEFINED",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "targetNftId",
        type: "uint96",
      },
    ],
    name: "capitalSupport",
    outputs: [
      {
        internalType: "uint256",
        name: "capitalAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "exists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "tokenId",
        type: "uint96",
      },
    ],
    name: "exists",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
        name: "bundleId",
        type: "uint256",
      },
    ],
    name: "getBundleNftId",
    outputs: [
      {
        internalType: "uint96",
        name: "nftId",
        type: "uint96",
      },
    ],
    stateMutability: "view",
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
    name: "getComponentNftId",
    outputs: [
      {
        internalType: "uint96",
        name: "nftId",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDip",
    outputs: [
      {
        internalType: "contract IERC20Metadata",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "instanceId",
        type: "bytes32",
      },
    ],
    name: "getInstanceNftId",
    outputs: [
      {
        internalType: "uint96",
        name: "id",
        type: "uint96",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNft",
    outputs: [
      {
        internalType: "contract IChainNftFacade",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRegistry",
    outputs: [
      {
        internalType: "contract IChainRegistryFacade",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakingWallet",
    outputs: [
      {
        internalType: "address",
        name: "stakingWallet",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementsIStaking",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "maxRewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "string",
        name: "uri",
        type: "string",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
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
        name: "riskpoolId",
        type: "uint256",
      },
    ],
    name: "mockRegisterRiskpool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes5",
        name: "chain",
        type: "bytes5",
      },
      {
        internalType: "uint8",
        name: "objectType",
        type: "uint8",
      },
    ],
    name: "objects",
    outputs: [
      {
        internalType: "uint256",
        name: "numberOfObjects",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rateDecimals",
    outputs: [
      {
        internalType: "uint256",
        name: "decimals",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
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
        name: "riskpoolId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bundleId",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "displayName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "expiryAt",
        type: "uint256",
      },
    ],
    name: "registerBundle",
    outputs: [
      {
        internalType: "uint96",
        name: "nftId",
        type: "uint96",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "dipAmount",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "dipAmount",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "dipAmount",
        type: "uint256",
      },
    ],
    name: "setStakeBalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint96",
        name: "targetNftId",
        type: "uint96",
      },
      {
        internalType: "uint256",
        name: "dipAmount",
        type: "uint256",
      },
    ],
    name: "setStakedDip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes5",
        name: "chain",
        type: "bytes5",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    name: "setStakingRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stakeBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "dipAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes5",
        name: "chain",
        type: "bytes5",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "stakingRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
    ],
    name: "toChain",
    outputs: [
      {
        internalType: "bytes5",
        name: "chain",
        type: "bytes5",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "int8",
        name: "exp",
        type: "int8",
      },
    ],
    name: "toRate",
    outputs: [
      {
        internalType: "uint256",
        name: "rate",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "totalMinted",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "uint48",
        name: "",
        type: "uint48",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "versionParts",
    outputs: [
      {
        internalType: "uint16",
        name: "major",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "minor",
        type: "uint16",
      },
      {
        internalType: "uint16",
        name: "patch",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200170b3803806200170b8339810160408190526200003491620002f7565b60098054336001600160a01b0319918216179091556010805482166001600160a01b03858116919091179091556011805490921690831617905546600a8190556200007f906200015a565b600b805464ffffffffff191660d89290921c919091179055600a54620000a59062000165565b600c819055620000b790600a620003fd565b600d556002600e819055620000cc9062000194565b50620000d9600362000194565b50620000e6600462000194565b50620000f3600462000194565b5062000103607d60021962000204565b600655600b54620001529060d81b8262000121600160001962000204565b6001600160d81b031990921660009081526008602090815260408083206001600160a01b0390941683529290522055565b505062000550565b60d881901b5b919050565b60005b81156200016057806200017b816200051c565b91506200018c9050600a836200038f565b915062000168565b6000620001b730604051806020016040528060008152506200021960201b60201c565b600b5460d81b6001600160d81b03191660009081526020818152604080832060ff8716845290915281208054929350600192909190620001f990849062000374565b909155509092915050565b60006200021283836200025c565b9392505050565b60006200022562000284565b6000818152600460205260408120805460ff19166001179055600f80549293509062000251836200051c565b919050555092915050565b60006200026b8260126200032e565b6200027890600a6200040e565b620002129084620004fa565b6000600c54600a54600d54600e546200029e9190620004fa565b620002aa919062000374565b620002b7906064620004fa565b620002c3919062000374565b600e80549192506000620002d7836200051c565b919050555090565b80516001600160a01b03811681146200016057600080fd5b600080604083850312156200030a578182fd5b6200031583620002df565b91506200032560208401620002df565b90509250929050565b600081810b83820b82821282607f038213811516156200035257620003526200053a565b82607f190382128116156200036b576200036b6200053a565b50019392505050565b600082198211156200038a576200038a6200053a565b500190565b600082620003ab57634e487b7160e01b81526012600452602481fd5b500490565b80825b6001808611620003c45750620003f4565b818704821115620003d957620003d96200053a565b80861615620003e757918102915b9490941c938002620003b3565b94509492505050565b60006200021260001984846200041d565b60006200021260001960ff8516845b6000826200042e5750600162000212565b816200043d5750600062000212565b8160018114620004565760028114620004615762000495565b600191505062000212565b60ff8411156200047557620004756200053a565b6001841b9150848211156200048e576200048e6200053a565b5062000212565b5060208310610133831016604e8410600b8410161715620004cd575081810a83811115620004c757620004c76200053a565b62000212565b620004dc8484846001620003b0565b808604821115620004f157620004f16200053a565b02949350505050565b60008160001904831182151516156200051757620005176200053a565b500290565b60006000198214156200053357620005336200053a565b5060010190565b634e487b7160e01b600052601160045260246000fd5b6111ab80620005606000396000f3fe608060405234801561001057600080fd5b50600436106102a05760003560e01c80635ce4193b11610167578063b3fc986e116100ce578063d15db8b411610087578063d15db8b4146105f8578063d91fc8c714610600578063dadbccee14610634578063f0de82281461050f578063f76f8d781461063c578063fc1cd6cc1461065f576102a0565b8063b3fc986e14610456578063b54ded6e14610552578063bd4080ec14610563578063c0759d0d14610582578063d044a1ed146105ab578063d0def521146105e5576102a0565b8063a2309ff811610120578063a2309ff8146104ff578063a3f4df7e14610507578063aa5c3ab41461050f578063ac513fb814610456578063adc2fc7514610516578063afb9128e1461051e576102a0565b80635ce4193b146104ae5780637b0a47ee146104b657806382bfefc8146104be5780638da5cb5b146104c657806393bc9dfe146104d757806395d89b41146104df576102a0565b806333d84ec01161020b5780634f9c1c09116101c45780634f9c1c091461043157806353bed7c31461043f57806354fd4d50146104475780635ab1bd53146104565780635b1cfdbd146104705780635c3d18ea1461049b576102a0565b806333d84ec01461039057806338013f02146103a35780633e1e5638146103ab57806343ee8213146103ea57806349e19c8c146103f25780634f558e7914610405576102a0565b8063178156ca1161025d578063178156ca146103125780631a12cd471461033e5780631a3480b5146103595780631b08829c14610360578063229e8c9c1461037357806325425a9114610388576102a0565b8063059f8b16146102a557806306433b1b146102c057806306fdde03146102da5780630d40ffc7146102ef5780630dd4d811146102f7578063125fdbbc1461030a575b600080fd5b6102ad610672565b6040519081526020015b60405180910390f35b6102c8600381565b60405160ff90911681526020016102b7565b6102e2610681565b6040516102b79190610e9a565b6102ad6106a1565b6102ad610305366004610d70565b6106b6565b6102c8600a81565b610325610320366004610cd7565b6106eb565b6040516001600160d81b031990911681526020016102b7565b610346601281565b60405160009190910b81526020016102b7565b60126102ad565b60015b60405190151581526020016102b7565b610386610381366004610cd7565b600755565b005b6102c8601581565b6102ad61039e366004610e57565b6106f6565b6102c8601681565b6103866103b9366004610da2565b6001600160d81b031990921660009081526008602090815260408083206001600160a01b0390941683529290522055565b6102c8600281565b610386610400366004610e71565b61087f565b610363610413366004610cd7565b6001600160601b031660009081526004602052604090205460ff1690565b610363610413366004610e57565b6102c8602881565b604051600181526020016102b7565b305b6040516001600160a01b0390911681526020016102b7565b61048361047e366004610d10565b6108a7565b6040516001600160601b0390911681526020016102b7565b6103866104a9366004610cef565b610935565b6102c8601781565b6006546102ad565b6102c8600481565b6009546001600160a01b0316610458565b6007546102ad565b6040805180820190915260048152632224a82960e11b60208201526102e2565b600f546102ad565b6102e261094e565b60006102ad565b6102c8600081565b61048361052c366004610cef565b60009182526003602090815260408084209284529190529020546001600160601b031690565b6010546001600160a01b0316610458565b60408051600080825260208201526001918101919091526060016102b7565b610483610590366004610cd7565b6000908152600160205260409020546001600160601b031690565b6102ad6105b9366004610ddd565b6001600160d81b0319821660009081526020818152604080832060ff8516845290915290205492915050565b6102ad6105f3366004610c8b565b61096a565b6102c8601481565b61048361060e366004610cef565b60009182526002602090815260408084209284529190529020546001600160601b031690565b6102c8601e81565b6102e2604051806040016040528060048152602001632224a82960e11b81525081565b6102ad61066d366004610e13565b6109a9565b61067e6012600a610fab565b81565b606060405180606001604052806030815260200161114660309139905090565b60006106b161014d6002196109bc565b905090565b6001600160d81b0319821660009081526008602090815260408083206001600160a01b03851684529091529020545b92915050565b60d881901b5b919050565b6001600160601b038116600090815260056020908152604080832054600b5460d81b6001600160d81b0319168452600883528184206011546001600160a01b031680865290845282852054835163313ce56760e01b8152935192949093869363313ce56792600480840193919291829003018186803b15801561077857600080fd5b505afa15801561078c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107b09190610e3b565b90506000601060009054906101000a90046001600160a01b03166001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561080257600080fd5b505afa158015610816573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061083a9190610e3b565b90506000836108528661084d85876110ab565b6109bc565b61085c919061108c565b905061086a6012600a610fab565b6108749082610f45565b979650505050505050565b6001600160601b03821660009081526005602052604090208190556108a381600755565b5050565b60006108b386866109de565b600b54604080516001600160601b038416815260d89290921b6001600160d81b0319166020830152602890820152606081018890526080810187905260a081018690523360c08201529091507fdb4150958a3752b909c33b3c176ca2cd153a25c70b496347d7f110be32eb47f09060e00160405180910390a195945050505050565b61093e82610a49565b506109498282610a9c565b505050565b6040518060600160405280603081526020016111466030913981565b6000610974610b07565b6000818152600460205260408120805460ff19166001179055600f80549293509061099e836110ec565b919050555092915050565b60006109b583836109bc565b9392505050565b60006109c9826012610eed565b6109d490600a610fba565b6109b5908461108c565b60008281526003602090815260408083208484529091529020546001600160601b0316806106e557610a106028610b58565b60009384526003602090815260408086209486529390529190922080546001600160601b0319166001600160601b038316179055919050565b6000818152600160205260409020546001600160601b0316806106f157610a706014610b58565b60009283526001602052604090922080546001600160601b0319166001600160601b0384161790555090565b60008281526002602090815260408083208484529091529020546001600160601b0316806106e557610ace6017610b58565b60009384526002602090815260408086209486529390529190922080546001600160601b0319166001600160601b038316179055919050565b6000600c54600a54600d54600e54610b1f919061108c565b610b299190610f2d565b610b3490606461108c565b610b3e9190610f2d565b600e80549192506000610b50836110ec565b919050555090565b6000610b73306040518060200160405280600081525061096a565b600b5460d81b6001600160d81b03191660009081526020818152604080832060ff8716845290915281208054929350600192909190610bb3908490610f2d565b909155509092915050565b80356001600160a01b03811681146106f157600080fd5b80356001600160d81b0319811681146106f157600080fd5b600082601f830112610bfd578081fd5b813567ffffffffffffffff80821115610c1857610c1861111d565b604051601f8301601f19908116603f01168101908282118183101715610c4057610c4061111d565b81604052838152866020858801011115610c58578485fd5b8360208701602083013792830160200193909352509392505050565b80356001600160601b03811681146106f157600080fd5b60008060408385031215610c9d578182fd5b610ca683610bbe565b9150602083013567ffffffffffffffff811115610cc1578182fd5b610ccd85828601610bed565b9150509250929050565b600060208284031215610ce8578081fd5b5035919050565b60008060408385031215610d01578182fd5b50508035926020909101359150565b600080600080600060a08688031215610d27578081fd5b853594506020860135935060408601359250606086013567ffffffffffffffff811115610d52578182fd5b610d5e88828901610bed565b95989497509295608001359392505050565b60008060408385031215610d82578182fd5b610d8b83610bd5565b9150610d9960208401610bbe565b90509250929050565b600080600060608486031215610db6578283fd5b610dbf84610bd5565b9250610dcd60208501610bbe565b9150604084013590509250925092565b60008060408385031215610def578182fd5b610df883610bd5565b91506020830135610e0881611133565b809150509250929050565b60008060408385031215610e25578182fd5b82359150602083013580820b8114610e08578182fd5b600060208284031215610e4c578081fd5b81516109b581611133565b600060208284031215610e68578081fd5b6109b582610c74565b60008060408385031215610e83578182fd5b610e8c83610c74565b946020939093013593505050565b6000602080835283518082850152825b81811015610ec657858101830151858201604001528201610eaa565b81811115610ed75783604083870101525b50601f01601f1916929092016040019392505050565b600081810b83820b82821282607f03821381151615610f0e57610f0e611107565b82607f19038212811615610f2457610f24611107565b50019392505050565b60008219821115610f4057610f40611107565b500190565b600082610f6057634e487b7160e01b81526012600452602481fd5b500490565b80825b6001808611610f775750610fa2565b818704821115610f8957610f89611107565b80861615610f9657918102915b9490941c938002610f68565b94509492505050565b60006109b56000198484610fc8565b60006109b560001960ff8516845b600082610fd7575060016109b5565b81610fe4575060006109b5565b8160018114610ffa576002811461100457611031565b60019150506109b5565b60ff84111561101557611015611107565b6001841b91508482111561102b5761102b611107565b506109b5565b5060208310610133831016604e8410600b8410161715611064575081810a8381111561105f5761105f611107565b6109b5565b6110718484846001610f65565b80860482111561108357611083611107565b02949350505050565b60008160001904831182151516156110a6576110a6611107565b500290565b600081810b83820b8281128015607f198301841216156110cd576110cd611107565b81607f0183138116156110e2576110e2611107565b5090039392505050565b600060001982141561110057611100611107565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b60ff8116811461114257600080fd5b5056fe44657a656e7472616c697a656420496e737572616e63652050726f746f636f6c20526567697374727920284d4f434b29a264697066735822122047c7a152a7b1ad8857175c7ee086317dd995820973a12552582d96864de3fc4764736f6c63430008020033";

type MockRegistryStakingConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockRegistryStakingConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockRegistryStaking__factory extends ContractFactory {
  constructor(...args: MockRegistryStakingConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    dipAddress: PromiseOrValue<string>,
    usdtAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockRegistryStaking> {
    return super.deploy(
      dipAddress,
      usdtAddress,
      overrides || {}
    ) as Promise<MockRegistryStaking>;
  }
  override getDeployTransaction(
    dipAddress: PromiseOrValue<string>,
    usdtAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(dipAddress, usdtAddress, overrides || {});
  }
  override attach(address: string): MockRegistryStaking {
    return super.attach(address) as MockRegistryStaking;
  }
  override connect(signer: Signer): MockRegistryStaking__factory {
    return super.connect(signer) as MockRegistryStaking__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockRegistryStakingInterface {
    return new utils.Interface(_abi) as MockRegistryStakingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockRegistryStaking {
    return new Contract(address, _abi, signerOrProvider) as MockRegistryStaking;
  }
}
