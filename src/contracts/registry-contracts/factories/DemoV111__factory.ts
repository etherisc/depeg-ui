/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { DemoV111, DemoV111Interface } from "../DemoV111";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "Version",
        name: "version",
        type: "uint48",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "activatedBy",
        type: "address",
      },
    ],
    name: "LogVersionableActivated",
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
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "activatedBy",
        type: "address",
      },
    ],
    name: "activate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "activatedBy",
        type: "address",
      },
    ],
    name: "activateAndSetOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "blockNumber",
    outputs: [
      {
        internalType: "Blocknumber",
        name: "",
        type: "uint32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "idx",
        type: "uint256",
      },
    ],
    name: "getVersion",
    outputs: [
      {
        internalType: "Version",
        name: "",
        type: "uint48",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Version",
        name: "_version",
        type: "uint48",
      },
    ],
    name: "getVersionInfo",
    outputs: [
      {
        components: [
          {
            internalType: "Version",
            name: "version",
            type: "uint48",
          },
          {
            internalType: "address",
            name: "implementation",
            type: "address",
          },
          {
            internalType: "address",
            name: "activatedBy",
            type: "address",
          },
          {
            internalType: "Blocknumber",
            name: "activatedIn",
            type: "uint32",
          },
          {
            internalType: "Timestamp",
            name: "activatedAt",
            type: "uint40",
          },
        ],
        internalType: "struct IVersionable.VersionInfo",
        name: "",
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
        name: "x",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "shift",
        type: "uint8",
      },
    ],
    name: "intToBytes",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Version",
        name: "_version",
        type: "uint48",
      },
    ],
    name: "isActivated",
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
    name: "message",
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
    name: "ping",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "newMessage",
        type: "string",
      },
    ],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "ChainId",
        name: "x",
        type: "bytes5",
      },
    ],
    name: "toInt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Blocknumber",
        name: "x",
        type: "uint32",
      },
    ],
    name: "toInt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "Timestamp",
        name: "x",
        type: "uint40",
      },
    ],
    name: "toInt",
    outputs: [
      {
        internalType: "uint256",
        name: "",
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
    name: "upgradable",
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
    name: "value",
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
        internalType: "Version",
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
        internalType: "VersionPart",
        name: "major",
        type: "uint16",
      },
      {
        internalType: "VersionPart",
        name: "minor",
        type: "uint16",
      },
      {
        internalType: "VersionPart",
        name: "patch",
        type: "uint16",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "versions",
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
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506200001e303362000140565b600254610100900460ff16158080156200003f5750600254600160ff909116105b806200005b5750303b1580156200005b575060025460ff166001145b620000c45760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6002805460ff191660011790558015620000e8576002805461ff0019166101001790555b620000f262000444565b801562000139576002805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5062000631565b60006200014c620004ac565b65ffffffffffff8116600090815260208190526040902060010154909150600160a01b900463ffffffff1615620001d65760405162461bcd60e51b815260206004820152602760248201527f4552524f523a56524e2d3030313a56455253494f4e5f414c52454144595f41436044820152661512559055115160ca1b6064820152608401620000bb565b6001541562000299576001805460009190620001f4908290620005ef565b8154811062000207576200020762000605565b90600052602060002090600591828204019190066006029054906101000a900465ffffffffffff1690506200023d8282620004c2565b620002975760405162461bcd60e51b8152602060048201526024808201527f4552524f523a56524e2d3030323a56455253494f4e5f4e4f545f494e4352454160448201526353494e4760e01b6064820152608401620000bb565b505b60018054808201825560009190915260058082047fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf601805465ffffffffffff808616600694909506939093026101000a848102930219169190911790556040805160a0810182529182526001600160a01b03808616602084015284169082015260608101620003254390565b63ffffffff1681526020014264ffffffffff90811690915265ffffffffffff8084166000908152602081815260409182902085518154928701516001600160a01b039081166601000000000000026001600160d01b0319909416919095161791909117815584820151600190910180546060870151608090970151909516600160c01b0264ffffffffff60c01b1963ffffffff909716600160a01b026001600160c01b031990961692909416919091179390931793909316179055517ff7b17693e830f8b239607e857ac81b076450829d544c053d533d1b278d18cd8990620004379083908690869065ffffffffffff9390931683526001600160a01b03918216602084015216604082015260600190565b60405180910390a1505050565b600254610100900460ff16620004a05760405162461bcd60e51b815260206004820152602b6024820152600080516020620018e983398151915260448201526a6e697469616c697a696e6760a81b6064820152608401620000bb565b620004aa620004d7565b565b6000620004bd60018060016200053e565b905090565b65ffffffffffff808216908316115b92915050565b600254610100900460ff16620005335760405162461bcd60e51b815260206004820152602b6024820152600080516020620018e983398151915260448201526a6e697469616c697a696e6760a81b6064820152608401620000bb565b620004aa3362000587565b600061ffff84811690848116908416806200057063ffff0000601089901b1665ffff0000000060208b901b166200061b565b6200057c91906200061b565b979650505050505050565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b634e487b7160e01b600052601160045260246000fd5b81810381811115620004d157620004d1620005d9565b634e487b7160e01b600052603260045260246000fd5b80820180821115620004d157620004d1620005d9565b6112a880620006416000396000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c80638e258689116100b8578063da09d4841161007c578063da09d484146102b6578063de788b2c146102ce578063e21f37ce14610341578063f2fde38b14610349578063f4d26fec1461035c578063f8b1cb3c1461036457600080fd5b80638e2586891461022d5780639555c4db14610240578063aa615ec814610253578063b88da75914610276578063bd4080ec1461028957600080fd5b80635c36b186116100ff5780635c36b186146101bf57806366362612146101df5780636effeac4146101f3578063715018a61461020a5780638da5cb5b1461021257600080fd5b80631080d8951461013c578063368b8772146101655780633fa4f2451461017a57806354fd4d501461018c57806357e871e7146101ab575b600080fd5b61014f61014a366004610d57565b61036c565b60405161015c9190610dd3565b60405180910390f35b610178610173366004610e03565b6103a2565b005b6068545b60405190815260200161015c565b6101946103ba565b60405165ffffffffffff909116815260200161015c565b60405163ffffffff4316815260200161015c565b604080518082019091526004815263706f6e6760e01b602082015261014f565b61017e6101ed366004610eb4565b60d81c90565b61017e610201366004610ede565b63ffffffff1690565b6101786103ce565b6035546040516001600160a01b03909116815260200161015c565b61017861023b366004610f20565b6103e2565b61017861024e366004610f63565b610501565b610266610261366004610f96565b61050b565b604051901515815260200161015c565b610194610284366004610fbe565b610537565b6102916105cd565b6040805161ffff9485168152928416602084015292169181019190915260600161015c565b61017e6102c4366004610fd7565b64ffffffffff1690565b6102e16102dc366004610f96565b6105ed565b60408051825165ffffffffffff1681526020808401516001600160a01b039081169183019190915283830151169181019190915260608083015163ffffffff169082015260809182015164ffffffffff169181019190915260a00161015c565b61014f6106ea565b610178610357366004610ffe565b61077c565b61014f6107f5565b60015461017e565b6040805160ff831684901b60f01b6001600160f01b03191660208201528151600281830301815260229091019091525b92915050565b6103aa610815565b60676103b682826110a2565b5050565b60006103c9600180600161086f565b905090565b6103d6610815565b6103e060006108b4565b565b600254610100900460ff16158080156104025750600254600160ff909116105b8061041c5750303b15801561041c575060025460ff166001145b6104415760405162461bcd60e51b815260040161043890611162565b60405180910390fd5b6002805460ff191660011790558015610464576002805461ff0019166101001790555b61046f848484610906565b6040518060400160405280602081526020017f7370656369616c206d657373616765202d20617320696e697469616c697a6564815250606790816104b391906110a2565b5080156104fb576002805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498906020015b60405180910390a15b50505050565b6103b682826109dc565b65ffffffffffff16600090815260208190526040902060010154600160a01b900463ffffffff16151590565b600154600090821061058b5760405162461bcd60e51b815260206004820152601d60248201527f4552524f523a56524e2d3031303a494e4445585f544f4f5f4c415247450000006044820152606401610438565b6001828154811061059e5761059e6111b0565b90600052602060002090600591828204019190066006029054906101000a900465ffffffffffff169050919050565b60008060006105e26105dd6103ba565b610cbb565b925092509250909192565b6040805160a0810182526000808252602082018190529181018290526060810182905260808101919091526106218261050b565b61066d5760405162461bcd60e51b815260206004820152601d60248201527f4552524f523a56524e2d3032303a56455253494f4e5f554e4b4e4f574e0000006044820152606401610438565b5065ffffffffffff90811660009081526020818152604091829020825160a0810184528154948516815266010000000000009094046001600160a01b03908116928501929092526001015490811691830191909152600160a01b810463ffffffff166060830152600160c01b900464ffffffffff16608082015290565b6060606780546106f990611019565b80601f016020809104026020016040519081016040528092919081815260200182805461072590611019565b80156107725780601f1061074757610100808354040283529160200191610772565b820191906000526020600020905b81548152906001019060200180831161075557829003601f168201915b5050505050905090565b610784610815565b6001600160a01b0381166107e95760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610438565b6107f2816108b4565b50565b606060405180606001604052806025815260200161124e60259139905090565b6035546001600160a01b031633146103e05760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610438565b600061ffff848116908481169084168061089f63ffff0000601089901b1665ffff0000000060208b901b166111dc565b6108a991906111dc565b979650505050505050565b603580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b600254610100900460ff16158080156109265750600254600160ff909116105b806109405750303b158015610940575060025460ff166001145b61095c5760405162461bcd60e51b815260040161043890611162565b6002805460ff19166001179055801561097f576002805461ff0019166101001790555b61098984836109dc565b610991610cfd565b61099a8361077c565b80156104fb576002805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb3847402498906020016104f2565b60006109e66103ba565b90506109f18161050b565b15610a4e5760405162461bcd60e51b815260206004820152602760248201527f4552524f523a56524e2d3030313a56455253494f4e5f414c52454144595f41436044820152661512559055115160ca1b6064820152608401610438565b60015415610b12576001805460009190610a699082906111ef565b81548110610a7957610a796111b0565b90600052602060002090600591828204019190066006029054906101000a900465ffffffffffff169050610ab8828265ffffffffffff90811691161190565b610b105760405162461bcd60e51b8152602060048201526024808201527f4552524f523a56524e2d3030323a56455253494f4e5f4e4f545f494e4352454160448201526353494e4760e01b6064820152608401610438565b505b60018054808201825560009190915260058082047fb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf601805465ffffffffffff808616600694909506939093026101000a848102930219169190911790556040805160a0810182529182526001600160a01b03808616602084015284169082015260608101610b9d4390565b63ffffffff1681526020014264ffffffffff90811690915265ffffffffffff8084166000908152602081815260409182902085518154928701516001600160a01b039081166601000000000000026001600160d01b0319909416919095161791909117815584820151600190910180546060870151608090970151909516600160c01b0264ffffffffff60c01b1963ffffffff909716600160a01b026001600160c01b031990961692909416919091179390931793909316179055517ff7b17693e830f8b239607e857ac81b076450829d544c053d533d1b278d18cd8990610cae9083908690869065ffffffffffff9390931683526001600160a01b03918216602084015216604082015260600190565b60405180910390a1505050565b6000808065ffffffffffff841661ffff602086901c16610cdb83836111ef565b9150601082901c6000610cee81856111ef565b92989197509195509350505050565b600254610100900460ff16610d245760405162461bcd60e51b815260040161043890611202565b6103e0600254610100900460ff16610d4e5760405162461bcd60e51b815260040161043890611202565b6103e0336108b4565b60008060408385031215610d6a57600080fd5b82359150602083013560ff81168114610d8257600080fd5b809150509250929050565b6000815180845260005b81811015610db357602081850181015186830182015201610d97565b506000602082860101526020601f19601f83011685010191505092915050565b602081526000610de66020830184610d8d565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600060208284031215610e1557600080fd5b813567ffffffffffffffff80821115610e2d57600080fd5b818401915084601f830112610e4157600080fd5b813581811115610e5357610e53610ded565b604051601f8201601f19908116603f01168101908382118183101715610e7b57610e7b610ded565b81604052828152876020848701011115610e9457600080fd5b826020860160208301376000928101602001929092525095945050505050565b600060208284031215610ec657600080fd5b81356001600160d81b031981168114610de657600080fd5b600060208284031215610ef057600080fd5b813563ffffffff81168114610de657600080fd5b80356001600160a01b0381168114610f1b57600080fd5b919050565b600080600060608486031215610f3557600080fd5b610f3e84610f04565b9250610f4c60208501610f04565b9150610f5a60408501610f04565b90509250925092565b60008060408385031215610f7657600080fd5b610f7f83610f04565b9150610f8d60208401610f04565b90509250929050565b600060208284031215610fa857600080fd5b813565ffffffffffff81168114610de657600080fd5b600060208284031215610fd057600080fd5b5035919050565b600060208284031215610fe957600080fd5b813564ffffffffff81168114610de657600080fd5b60006020828403121561101057600080fd5b610de682610f04565b600181811c9082168061102d57607f821691505b60208210810361104d57634e487b7160e01b600052602260045260246000fd5b50919050565b601f82111561109d57600081815260208120601f850160051c8101602086101561107a5750805b601f850160051c820191505b8181101561109957828155600101611086565b5050505b505050565b815167ffffffffffffffff8111156110bc576110bc610ded565b6110d0816110ca8454611019565b84611053565b602080601f83116001811461110557600084156110ed5750858301515b600019600386901b1c1916600185901b178555611099565b600085815260208120601f198616915b8281101561113457888601518255948401946001909101908401611115565b50858210156111525787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6020808252602e908201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160408201526d191e481a5b9a5d1a585b1a5e995960921b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b8082018082111561039c5761039c6111c6565b8181038181111561039c5761039c6111c6565b6020808252602b908201527f496e697469616c697a61626c653a20636f6e7472616374206973206e6f74206960408201526a6e697469616c697a696e6760a81b60608201526080019056fe6865792066726f6d2075706772616461626c6544656d6f202d2044656d6f2076312e312e30a2646970667358221220abbd087deeefd898e176b53d6f40f4d91c8b172b12a06c73f7770c6804f3e60364736f6c63430008130033496e697469616c697a61626c653a20636f6e7472616374206973206e6f742069";

type DemoV111ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DemoV111ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DemoV111__factory extends ContractFactory {
  constructor(...args: DemoV111ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DemoV111> {
    return super.deploy(overrides || {}) as Promise<DemoV111>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DemoV111 {
    return super.attach(address) as DemoV111;
  }
  override connect(signer: Signer): DemoV111__factory {
    return super.connect(signer) as DemoV111__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DemoV111Interface {
    return new utils.Interface(_abi) as DemoV111Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DemoV111 {
    return new Contract(address, _abi, signerOrProvider) as DemoV111;
  }
}
