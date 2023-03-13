/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { DIP, DIPInterface } from "../DIP";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DECIMALS",
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
    name: "INITIAL_SUPPLY",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405180606001604052806028815260200162000ea4602891396040805180820190915260038082526204449560ec1b602083015262000053838262000216565b50600462000062828262000216565b5050506200009d62000079620000a360201b60201c565b620000876012600a620003f7565b6200009790633b9aca006200040f565b620000a7565b6200043f565b3390565b6001600160a01b038216620001025760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b806002600082825462000116919062000429565b90915550506001600160a01b038216600081815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b505050565b634e487b7160e01b600052604160045260246000fd5b600181811c908216806200019d57607f821691505b602082108103620001be57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200016d57600081815260208120601f850160051c81016020861015620001ed5750805b601f850160051c820191505b818110156200020e57828155600101620001f9565b505050505050565b81516001600160401b0381111562000232576200023262000172565b6200024a8162000243845462000188565b84620001c4565b602080601f831160018114620002825760008415620002695750858301515b600019600386901b1c1916600185901b1785556200020e565b600085815260208120601f198616915b82811015620002b35788860151825594840194600190910190840162000292565b5085821015620002d25787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b634e487b7160e01b600052601160045260246000fd5b600181815b80851115620003395781600019048211156200031d576200031d620002e2565b808516156200032b57918102915b93841c9390800290620002fd565b509250929050565b6000826200035257506001620003f1565b816200036157506000620003f1565b81600181146200037a57600281146200038557620003a5565b6001915050620003f1565b60ff841115620003995762000399620002e2565b50506001821b620003f1565b5060208310610133831016604e8410600b8410161715620003ca575081810a620003f1565b620003d68383620002f8565b8060001904821115620003ed57620003ed620002e2565b0290505b92915050565b60006200040860ff84168362000341565b9392505050565b8082028115828204841417620003f157620003f1620002e2565b80820180821115620003f157620003f1620002e2565b610a55806200044f6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80633950935111610097578063a457c2d711610066578063a457c2d7146101d5578063a9059cbb146101e8578063dd62ed3e146101fb578063f76f8d781461020e57600080fd5b8063395093511461018957806370a082311461019c57806395d89b41146101c5578063a3f4df7e146101cd57600080fd5b806323b872dd116100d357806323b872dd1461014d5780632e0f2625146101605780632ff2e9dc1461017a578063313ce5671461018257600080fd5b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b610102610230565b60405161010f9190610765565b60405180910390f35b61012b6101263660046107cf565b6102c2565b604051901515815260200161010f565b6002545b60405190815260200161010f565b61012b61015b3660046107f9565b6102dc565b610168601281565b60405160ff909116815260200161010f565b61013f610300565b6012610168565b61012b6101973660046107cf565b61031d565b61013f6101aa366004610835565b6001600160a01b031660009081526020819052604090205490565b61010261033f565b61010261034e565b61012b6101e33660046107cf565b61036a565b61012b6101f63660046107cf565b6103ea565b61013f610209366004610857565b6103f8565b6101026040518060400160405280600381526020016204449560ec1b81525081565b60606003805461023f9061088a565b80601f016020809104026020016040519081016040528092919081815260200182805461026b9061088a565b80156102b85780601f1061028d576101008083540402835291602001916102b8565b820191906000526020600020905b81548152906001019060200180831161029b57829003601f168201915b5050505050905090565b6000336102d0818585610423565b60019150505b92915050565b6000336102ea858285610547565b6102f58585856105c1565b506001949350505050565b61030c6012600a6109be565b61031a90633b9aca006109cd565b81565b6000336102d081858561033083836103f8565b61033a91906109e4565b610423565b60606004805461023f9061088a565b6040518060600160405280602881526020016109f86028913981565b6000338161037882866103f8565b9050838110156103dd5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102f58286868403610423565b6000336102d08185856105c1565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166104855760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103d4565b6001600160a01b0382166104e65760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103d4565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061055384846103f8565b905060001981146105bb57818110156105ae5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103d4565b6105bb8484848403610423565b50505050565b6001600160a01b0383166106255760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103d4565b6001600160a01b0382166106875760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103d4565b6001600160a01b038316600090815260208190526040902054818110156106ff5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103d4565b6001600160a01b03848116600081815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a36105bb565b600060208083528351808285015260005b8181101561079257858101830151858201604001528201610776565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b03811681146107ca57600080fd5b919050565b600080604083850312156107e257600080fd5b6107eb836107b3565b946020939093013593505050565b60008060006060848603121561080e57600080fd5b610817846107b3565b9250610825602085016107b3565b9150604084013590509250925092565b60006020828403121561084757600080fd5b610850826107b3565b9392505050565b6000806040838503121561086a57600080fd5b610873836107b3565b9150610881602084016107b3565b90509250929050565b600181811c9082168061089e57607f821691505b6020821081036108be57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b600181815b808511156109155781600019048211156108fb576108fb6108c4565b8085161561090857918102915b93841c93908002906108df565b509250929050565b60008261092c575060016102d6565b81610939575060006102d6565b816001811461094f576002811461095957610975565b60019150506102d6565b60ff84111561096a5761096a6108c4565b50506001821b6102d6565b5060208310610133831016604e8410600b8410161715610998575081810a6102d6565b6109a283836108da565b80600019048211156109b6576109b66108c4565b029392505050565b600061085060ff84168361091d565b80820281158282048414176102d6576102d66108c4565b808201808211156102d6576102d66108c456fe446563656e7472616c697a656420496e737572616e63652050726f746f636f6c202d2044554d4d59a26469706673582212206e26aac0d2edf528c923d880cf2ab0bce10fc832106a01d0f270f78966a0094064736f6c63430008130033446563656e7472616c697a656420496e737572616e63652050726f746f636f6c202d2044554d4d59";

type DIPConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DIPConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DIP__factory extends ContractFactory {
  constructor(...args: DIPConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<DIP> {
    return super.deploy(overrides || {}) as Promise<DIP>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): DIP {
    return super.attach(address) as DIP;
  }
  override connect(signer: Signer): DIP__factory {
    return super.connect(signer) as DIP__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DIPInterface {
    return new utils.Interface(_abi) as DIPInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): DIP {
    return new Contract(address, _abi, signerOrProvider) as DIP;
  }
}