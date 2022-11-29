/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { DepegProduct, DepegProductInterface } from "../DepegProduct";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "productName",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "registry",
        type: "address",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "riskpoolId",
        type: "uint256",
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
    ],
    name: "LogComponentApproved",
    type: "event",
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
    ],
    name: "LogComponentArchived",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "componentName",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentType",
        name: "componentType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "componentAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "registryAddress",
        type: "address",
      },
    ],
    name: "LogComponentCreated",
    type: "event",
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
    ],
    name: "LogComponentDeclined",
    type: "event",
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
    ],
    name: "LogComponentPaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "componentName",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentType",
        name: "componentType",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "componentAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "LogComponentProposed",
    type: "event",
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
    ],
    name: "LogComponentResumed",
    type: "event",
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
        internalType: "enum IComponent.ComponentState",
        name: "stateOld",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "enum IComponent.ComponentState",
        name: "stateNew",
        type: "uint8",
      },
    ],
    name: "LogComponentStateChanged",
    type: "event",
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
    ],
    name: "LogComponentSuspended",
    type: "event",
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
    ],
    name: "LogComponentUnpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "policyId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "policyHolder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "premiumAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "netPremiumAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sumInsuredAmount",
        type: "uint256",
      },
    ],
    name: "LogDepegApplicationCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "exchangeRate",
        type: "uint256",
      },
    ],
    name: "LogDepegOracleTriggered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "policyId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "policyHolder",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "premiumAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sumInsuredAmount",
        type: "uint256",
      },
    ],
    name: "LogDepegPolicyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "policyId",
        type: "bytes32",
      },
    ],
    name: "LogDepegPolicyProcessed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
    ],
    name: "LogProductApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "productAddress",
        type: "address",
      },
    ],
    name: "LogProductCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
    ],
    name: "LogProductDeclined",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256",
      },
    ],
    name: "LogProductProposed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_DATA_STRUCTURE",
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
    name: "NAME",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "POLICY_FLOW",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "VERSION",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "applications",
    outputs: [
      {
        internalType: "uint256",
        name: "applicationCount",
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
        name: "sumInsured",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxPremium",
        type: "uint256",
      },
    ],
    name: "applyForPolicy",
    outputs: [
      {
        internalType: "bytes32",
        name: "processId",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "approvalCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "archiveCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "calculateFee",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalAmount",
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
        name: "sumInsured",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "bundleId",
        type: "uint256",
      },
    ],
    name: "calculateNetPremium",
    outputs: [
      {
        internalType: "uint256",
        name: "netPremium",
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
        name: "netPremium",
        type: "uint256",
      },
    ],
    name: "calculatePremium",
    outputs: [
      {
        internalType: "uint256",
        name: "premiumAmount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "declineCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getApplicationDataStructure",
    outputs: [
      {
        internalType: "string",
        name: "dataStructure",
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
        name: "applicationIdx",
        type: "uint256",
      },
    ],
    name: "getApplicationId",
    outputs: [
      {
        internalType: "bytes32",
        name: "processId",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getClaimDataStructure",
    outputs: [
      {
        internalType: "string",
        name: "dataStructure",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeeFractionFullUnit",
    outputs: [
      {
        internalType: "uint256",
        name: "fractionFullUnit",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFeeSpecification",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "componentId",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fixedFee",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "fractionalFee",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "feeCalculationData",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "createdAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "updatedAt",
            type: "uint256",
          },
        ],
        internalType: "struct ITreasury.FeeSpecification",
        name: "feeSpecification",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getId",
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
    name: "getName",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
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
    name: "getPayoutDataStructure",
    outputs: [
      {
        internalType: "string",
        name: "dataStructure",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "getPolicyFlow",
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
    inputs: [
      {
        internalType: "uint256",
        name: "policyIdx",
        type: "uint256",
      },
    ],
    name: "getPolicyId",
    outputs: [
      {
        internalType: "bytes32",
        name: "processId",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "policyHolder",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "idx",
        type: "uint256",
      },
    ],
    name: "getProcessId",
    outputs: [
      {
        internalType: "bytes32",
        name: "processId",
        type: "bytes32",
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
        internalType: "contract IRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRiskpoolId",
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
    name: "getState",
    outputs: [
      {
        internalType: "enum IComponent.ComponentState",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getToken",
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
    name: "getType",
    outputs: [
      {
        internalType: "enum IComponent.ComponentType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOracle",
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
    inputs: [],
    name: "isProduct",
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
    inputs: [],
    name: "isRiskpool",
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
    name: "pauseCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "policies",
    outputs: [
      {
        internalType: "uint256",
        name: "policyCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "policyHolder",
        type: "address",
      },
    ],
    name: "processIds",
    outputs: [
      {
        internalType: "uint256",
        name: "numberOfProcessIds",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "processId",
        type: "bytes32",
      },
    ],
    name: "processPolicy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "resumeCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "capacity",
        type: "uint256",
      },
    ],
    name: "riskPoolCapacityCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "setId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "suspendCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "triggerOracle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpauseCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200213b3803806200213b8339810160408190526200003491620005a1565b838270506f6c69637944656661756c74466c6f7760781b8386846001826200005c336200043d565b6001600160a01b038116620000c35760405162461bcd60e51b815260206004820152602360248201527f4552524f523a434d502d3030343a52454749535452595f414444524553535f5a60448201526245524f60e81b606482015260840160405180910390fd5b60038054610100600160a81b0319166101006001600160a01b03841602179055620000ed6200048d565b600480546001600160a01b0319166001600160a01b039290921691909117905562000117620004a8565b600580546001600160a01b0319166001600160a01b039290921691909117905562000141620004d5565b600680546001600160a01b0319166001600160a01b0392909216919091179055600183815560038054849260ff19909116908360028111156200019457634e487b7160e01b600052602160045260246000fd5b02179055506001546003546040517f04a2dea3211d6352f30925875b6e2e984642f84e1bcffe65ffaa1b04c1197b7a92620001e892909160ff82169130916101009091046001600160a01b031690620005ee565b60405180910390a15050600880546001600160a01b0319166001600160a01b0387161790555060098290556200021e83620004ef565b600780546001600160a01b0319166001600160a01b03929092169190911790556200025a6d50726f647563745365727669636560901b620004ef565b600a80546001600160a01b0319166001600160a01b0392909216919091179055620002976e496e7374616e63655365727669636560881b620004ef565b600b80546001600160a01b0319166001600160a01b03929092169190911790556040513081527fced180b842b890d77dab95dcbf4654065589a164226ef9faa91a7601fb67c4679060200160405180910390a15050600b546040516309e4fb4360e31b815260048101869052600094506001600160a01b039091169250634f27da18915060240160206040518083038186803b1580156200033757600080fd5b505afa1580156200034c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200037291906200057b565b600f80546001600160a01b0319166001600160a01b0383811691909117909155600b5460408051633800918160e21b815290519394508493919092169163e0024604916004808301926020929190829003018186803b158015620003d557600080fd5b505afa158015620003ea573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200041091906200057b565b601080546001600160a01b0319166001600160a01b03929092169190911790555062000652945050505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000620004a36541636365737360d01b620004ef565b905090565b6000620004a37f436f6d706f6e656e744f776e6572536572766963650000000000000000000000620004ef565b6000620004a36e496e7374616e63655365727669636560881b5b600354604051631c2d8fb360e31b81526004810183905260009161010090046001600160a01b03169063e16c7d989060240160206040518083038186803b1580156200053a57600080fd5b505afa1580156200054f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200057591906200057b565b92915050565b6000602082840312156200058d578081fd5b81516200059a8162000639565b9392505050565b60008060008060808587031215620005b7578283fd5b845193506020850151620005cb8162000639565b6040860151909350620005de8162000639565b6060959095015193969295505050565b84815260808101600385106200061457634e487b7160e01b600052602160045260246000fd5b60208201949094526001600160a01b0392831660408201529116606090910152919050565b6001600160a01b03811681146200064f57600080fd5b50565b611ad980620006626000396000f3fe608060405234801561001057600080fd5b506004361061028a5760003560e01c806370d2fe531161015c578063b3fca9bd116100ce578063d73cd99211610087578063d73cd992146103b3578063e0815f0d14610516578063f2fde38b1461051e578063f3b86c9914610531578063f4fdc1fa14610544578063ffa1ad74146105555761028a565b8063b3fca9bd146103b3578063bd1fe5d0146104e0578063be169e7e146103b3578063d0e0ba95146104e8578063d1fe9536146104fb578063d52d2d06146105035761028a565b80638da5cb5b116101205780638da5cb5b1461048157806394f64ff41461049257806399a5d7471461049a5780639a82f890146104c2578063a18f5ae2146103b3578063a3f4df7e146104ca5761028a565b806370d2fe531461042b578063715018a6146104335780637cc347921461043b5780637ce5e82f14610464578063893d20e81461046c5761028a565b80633ec92bda116102005780635ecf09ae116101b95780635ecf09ae146103da5780636319112b146103ed578063637d08f4146103f5578063638ce0ba146104065780636bb2d61d1461040e578063702e7e1f146104235761028a565b80633ec92bda1461036d57806348f54f031461038a5780635971d6431461039d57806359dacc6a146103b35780635ab1bd53146103bb5780635d1ca631146103d25761028a565b80631865c57d116102525780631865c57d146103005780631b867c6314610315578063205de66a1461031d57806321df0da714610330578063258d560c1461035557806339cf5e161461036d5761028a565b8063082ebc161461028f57806309128d83146102b55780630b228d95146102d057806315dae03e146102e557806317d7de7c146102f8575b600080fd5b6102a261029d3660046117a5565b610562565b6040519081526020015b60405180910390f35b6102a270506f6c69637944656661756c74466c6f7760781b81565b6102e36102de36600461158c565b6107fa565b005b60035460ff166040516102ac91906118b3565b6001546102a2565b610308610843565b6040516102ac9190611899565b6102e36108c9565b6102a261032b36600461158c565b610921565b6008546001600160a01b03165b6040516001600160a01b0390911681526020016102ac565b61035d610957565b60405190151581526020016102ac565b6040805160208101909152600081525b6040516102ac9190611886565b6102a261039836600461158c565b610987565b61037d6040518060200160405280600081525081565b6102e3610a5e565b61033d60035461010090046001600160a01b031690565b6002546102a2565b6102a26103e83660046117a5565b610aa8565b6102a2610c6b565b6007546001600160a01b031661033d565b6102e3610ce8565b610416610d35565b6040516102ac91906118fe565b600d546102a2565b6009546102a2565b6102e3610dfa565b6102a2610449366004611502565b6001600160a01b03166000908152600e602052604090205490565b600c546102a2565b61033d600080546001600160a01b03166108c4565b6000546001600160a01b031661033d565b61037d610e0c565b6104ad6104a836600461158c565b610e2c565b604080519283526020830191909152016102ac565b61035d610e90565b6102a26b11195c1959d41c9bd91d58dd60a21b81565b6102e3610e98565b6102e36104f636600461158c565b610ee5565b6102e3610f2f565b6102a261051136600461158c565b610f64565b61035d610f87565b6102e361052c366004611502565b610f90565b6102a261053f366004611541565b611006565b6102e361055236600461158c565b50565b6102a262302e3160e81b81565b601054600090819081906001600160a01b03166334e7312261058360025490565b866040518363ffffffff1660e01b81526004016105aa929190918252602082015260400190565b604080518083038186803b1580156105c157600080fd5b505afa1580156105d5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f99190611782565b604080516020810182526000808252600f5492516319394b5360e11b8152600481018b90526024810185905294965092945033939092916001600160a01b03169063327296a69060440160006040518083038186803b15801561065b57600080fd5b505afa15801561066f573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261069791908101906115bc565b90506106a683888b8585611129565b600c805460018082019092557fdf6966c971051c3d54ec59162606531493a51404a002842f56009d7e5cf4a8c7018290556001600160a01b0385166000818152600e6020908152604080832080549586018155835291819020909301849055805184815292830191909152810189905260608101869052608081018b90529096507fa15cbb6ab088cf7ea571c54e17bf5a89eda7f4e025f6bb3cdac49dede62150a89060a00160405180910390a1600061075f876111b4565b905080156107ed57600d80546001810182556000919091527fd7b6990105719101dabeb77144f2a3385c8033acd3af97e9423a695e81ad1eb501879055604080518881526001600160a01b0386166020820152908101899052606081018b90527ffcdeb29f9923d17eafa045ba38f2682e3371d3b6d318526a738dcc2e0b638d399060800160405180910390a15b5050505050509392505050565b61080381611239565b61080c8161129b565b6040518181527f545fb7b003bf3501deddc41d39b0290706d68b2c66b2a26acc674df728d01cbf906020015b60405180910390a150565b600654600254604051635e966e4560e01b815260048101919091526000916001600160a01b031690635e966e459060240160206040518083038186803b15801561088c57600080fd5b505afa1580156108a0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c491906115ef565b905090565b6108de6810dbdb5c1bdb995b9d60ba1b6112cc565b6001600160a01b0316336001600160a01b0316146109175760405162461bcd60e51b815260040161090e906118c7565b60405180910390fd5b61091f61134e565b565b6000600d828154811061094457634e487b7160e01b600052603260045260246000fd5b906000526020600020015490505b919050565b600060025b60035460ff16600281111561098157634e487b7160e01b600052602160045260246000fd5b14905090565b600080610992610d35565b90506000601060009054906101000a90046001600160a01b03166001600160a01b0316638ccf5ca26040518163ffffffff1660e01b815260040160206040518083038186803b1580156109e457600080fd5b505afa1580156109f8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a1c91906115a4565b6040830151602084015191925090610a348187611989565b610a3e90846119c1565b9450610a4a82846119e0565b610a5490866119a1565b9695505050505050565b610a736810dbdb5c1bdb995b9d60ba1b6112cc565b6001600160a01b0316336001600160a01b031614610aa35760405162461bcd60e51b815260040161090e906118c7565b61091f565b600b54604051632d0821b760e01b81526004810183905260009182916001600160a01b0390911690632d0821b79060240160006040518083038186803b158015610af157600080fd5b505afa158015610b05573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610b2d919081019061160e565b600f546080820151604051630908003160e01b815292935060009283928392839283926001600160a01b031691630908003191610b6d9190600401611886565b60a06040518083038186803b158015610b8557600080fd5b505afa158015610b99573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bbd91906117d0565b600f5460405163055bc75d60e21b8152959a50939850919650945092506001600160a01b03169063156f1d7490610c0d908d908d9086906004019283526020830191909152604082015260600190565b60206040518083038186803b158015610c2557600080fd5b505afa158015610c39573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c5d91906115a4565b9a9950505050505050505050565b60105460408051634667ae5160e11b815290516000926001600160a01b031691638ccf5ca2916004808301926020929190829003018186803b158015610cb057600080fd5b505afa158015610cc4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c491906115a4565b610cfd6810dbdb5c1bdb995b9d60ba1b6112cc565b6001600160a01b0316336001600160a01b031614610d2d5760405162461bcd60e51b815260040161090e906118c7565b61091f61138b565b610d6e6040518060c001604052806000815260200160008152602001600081526020016060815260200160008152602001600081525090565b6010546001600160a01b031663a434f0ad610d8860025490565b6040518263ffffffff1660e01b8152600401610da691815260200190565b60006040518083038186803b158015610dbe57600080fd5b505afa158015610dd2573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526108c491908101906116e2565b610e026113b5565b61091f600061140f565b6060604051806060016040528060258152602001611a7f60259139905090565b6000806000610e39610d35565b905080602001519250600081604001511115610e7e57610e57610c6b565b848260400151610e6791906119c1565b610e7191906119a1565b610e7b9084611989565b92505b610e888385611989565b915050915091565b60008061095c565b610ead6810dbdb5c1bdb995b9d60ba1b6112cc565b6001600160a01b0316336001600160a01b031614610edd5760405162461bcd60e51b815260040161090e906118c7565b61091f61145f565b610efa6810dbdb5c1bdb995b9d60ba1b6112cc565b6001600160a01b0316336001600160a01b031614610f2a5760405162461bcd60e51b815260040161090e906118c7565b600255565b604051620f4240808252907f736406d646811139b9f0fca94b5cf6bb07d8ef4d9de95662a9e43ee2135bc86b90602001610838565b6000600c828154811061094457634e487b7160e01b600052603260045260246000fd5b6000600161095c565b610f986113b5565b6001600160a01b038116610ffd5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b606482015260840161090e565b6105528161140f565b6001600160a01b0382166000908152600e602052604081205461106b5760405162461bcd60e51b815260206004820152601860248201527f4552524f523a44502d3030313a4e4f5f504f4c49434945530000000000000000604482015260640161090e565b6001600160a01b0383166000908152600e602052604090205482106110de5760405162461bcd60e51b815260206004820152602360248201527f4552524f523a44502d3030323a504f4c4943595f494e4445585f544f4f5f4c4160448201526252474560e81b606482015260840161090e565b6001600160a01b0383166000908152600e6020526040902080548390811061111657634e487b7160e01b600052603260045260246000fd5b9060005260206000200154905092915050565b600a546040516349dc20a560e11b81526000916001600160a01b0316906393b8414a90611162908990899089908990899060040161183b565b602060405180830381600087803b15801561117c57600080fd5b505af1158015611190573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a5491906115a4565b600a54604051631b07b17f60e01b8152600481018390526000916001600160a01b031690631b07b17f90602401602060405180830381600087803b1580156111fb57600080fd5b505af115801561120f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611233919061156c565b92915050565b600a546040516318c882f360e31b8152600481018390526001600160a01b039091169063c6441798906024015b600060405180830381600087803b15801561128057600080fd5b505af1158015611294573d6000803e3d6000fd5b5050505050565b600a54604051630e71e78360e21b8152600481018390526001600160a01b03909116906339c79e0c90602401611266565b600354604051631c2d8fb360e31b81526004810183905260009161010090046001600160a01b03169063e16c7d989060240160206040518083038186803b15801561131657600080fd5b505afa15801561132a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112339190611525565b7fb79d34516b55d664b61192aa41fbc0625b132fb7129bd3b3a31f46d1befa706161137860025490565b60405190815260200160405180910390a1565b7fcff3b7b8b07d4d8f74bf41f05737717140d5916781b9dff86ea0b996f2fdb9f961137860025490565b6000546001600160a01b0316331461091f5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161090e565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b7f38954b1d025d5a8ffcf9b42d431be2745cdcd05d32b0e5ad33ee2db025ef5b5561137860025490565b600082601f830112611499578081fd5b815167ffffffffffffffff8111156114b3576114b3611a53565b6114c6601f8201601f1916602001611958565b8181528460208386010111156114da578283fd5b6114eb8260208301602087016119f7565b949350505050565b80516004811061095257600080fd5b600060208284031215611513578081fd5b813561151e81611a69565b9392505050565b600060208284031215611536578081fd5b815161151e81611a69565b60008060408385031215611553578081fd5b823561155e81611a69565b946020939093013593505050565b60006020828403121561157d578081fd5b8151801515811461151e578182fd5b60006020828403121561159d578081fd5b5035919050565b6000602082840312156115b5578081fd5b5051919050565b6000602082840312156115cd578081fd5b815167ffffffffffffffff8111156115e3578182fd5b6114eb84828501611489565b600060208284031215611600578081fd5b81516007811061151e578182fd5b60006020828403121561161f578081fd5b815167ffffffffffffffff80821115611636578283fd5b818401915061014080838703121561164c578384fd5b61165581611958565b905082518152602083015160208201526040830151604082015261167b606084016114f3565b6060820152608083015182811115611691578485fd5b61169d87828601611489565b60808301525060a0838101519082015260c0808401519082015260e0808401519082015261010080840151908201526101209283015192810192909252509392505050565b6000602082840312156116f3578081fd5b815167ffffffffffffffff8082111561170a578283fd5b9083019060c0828603121561171d578283fd5b61172760c0611958565b825181526020830151602082015260408301516040820152606083015182811115611750578485fd5b61175c87828601611489565b6060830152506080830151608082015260a083015160a082015280935050505092915050565b60008060408385031215611794578182fd5b505080516020909101519092909150565b6000806000606084860312156117b9578081fd5b505081359360208301359350604090920135919050565b600080600080600060a086880312156117e7578283fd5b5050835160208501516040860151606087015160809097015192989197509594509092509050565b600081518084526118278160208601602086016119f7565b601f01601f19169290920160200192915050565b600060018060a01b038716825285602083015284604083015260a0606083015261186860a083018561180f565b828103608084015261187a818561180f565b98975050505050505050565b60006020825261151e602083018461180f565b60208101600783106118ad576118ad611a3d565b91905290565b60208101600383106118ad576118ad611a3d565b6020808252601b908201527f4552524f523a434d502d3030323a4e4f545f434f4d504f4e454e540000000000604082015260600190565b600060208252825160208301526020830151604083015260408301516060830152606083015160c0608084015261193860e084018261180f565b9050608084015160a084015260a084015160c08401528091505092915050565b604051601f8201601f1916810167ffffffffffffffff8111828210171561198157611981611a53565b604052919050565b6000821982111561199c5761199c611a27565b500190565b6000826119bc57634e487b7160e01b81526012600452602481fd5b500490565b60008160001904831182151516156119db576119db611a27565b500290565b6000828210156119f2576119f2611a27565b500390565b60005b83811015611a125781810151838201526020016119fa565b83811115611a21576000848401525b50505050565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052602160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b038116811461055257600080fdfe2875696e74323536206475726174696f6e2c75696e74323536206d61785072656d69756d29a2646970667358221220c40931f9b01dd7d3a4fcafaae635211b50ecbcd9f4303312c4a4824b5870e6f464736f6c63430008020033";

type DepegProductConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DepegProductConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DepegProduct__factory extends ContractFactory {
  constructor(...args: DepegProductConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    productName: PromiseOrValue<BytesLike>,
    registry: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DepegProduct> {
    return super.deploy(
      productName,
      registry,
      token,
      riskpoolId,
      overrides || {}
    ) as Promise<DepegProduct>;
  }
  override getDeployTransaction(
    productName: PromiseOrValue<BytesLike>,
    registry: PromiseOrValue<string>,
    token: PromiseOrValue<string>,
    riskpoolId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      productName,
      registry,
      token,
      riskpoolId,
      overrides || {}
    );
  }
  override attach(address: string): DepegProduct {
    return super.attach(address) as DepegProduct;
  }
  override connect(signer: Signer): DepegProduct__factory {
    return super.connect(signer) as DepegProduct__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DepegProductInterface {
    return new utils.Interface(_abi) as DepegProductInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DepegProduct {
    return new Contract(address, _abi, signerOrProvider) as DepegProduct;
  }
}
