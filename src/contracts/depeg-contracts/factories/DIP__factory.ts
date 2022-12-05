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
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280602081526020017f446563656e7472616c697a656420496e737572616e63652050726f746f636f6c8152506040518060400160405280600381526020016204449560ec1b81525081600390805190602001906200007c929190620001bf565b50805162000092906004906020840190620001bf565b505050620000cd620000a9620000d360201b60201c565b620000b76012600a620002cd565b620000c790633b9aca00620003c5565b620000d7565b6200043a565b3390565b6001600160a01b038216620001325760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b806002600082825462000146919062000265565b90915550506001600160a01b038216600090815260208190526040812080548392906200017590849062000265565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b828054620001cd90620003e7565b90600052602060002090601f016020900481019282620001f157600085556200023c565b82601f106200020c57805160ff19168380011785556200023c565b828001600101855582156200023c579182015b828111156200023c5782518255916020019190600101906200021f565b506200024a9291506200024e565b5090565b5b808211156200024a57600081556001016200024f565b600082198211156200027b576200027b62000424565b500190565b80825b6001808611620002945750620002c4565b818704821115620002a957620002a962000424565b80861615620002b757918102915b9490941c93800262000283565b94509492505050565b6000620002e160001960ff851684620002e8565b9392505050565b600082620002f957506001620002e1565b816200030857506000620002e1565b81600181146200032157600281146200032c5762000360565b6001915050620002e1565b60ff84111562000340576200034062000424565b6001841b91508482111562000359576200035962000424565b50620002e1565b5060208310610133831016604e8410600b841016171562000398575081810a8381111562000392576200039262000424565b620002e1565b620003a7848484600162000280565b808604821115620003bc57620003bc62000424565b02949350505050565b6000816000190483118215151615620003e257620003e262000424565b500290565b600281046001821680620003fc57607f821691505b602082108114156200041e57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fd5b610aaa806200044a6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80633950935111610097578063a457c2d711610066578063a457c2d7146101f3578063a9059cbb14610206578063dd62ed3e14610219578063f76f8d781461022c576100f5565b8063395093511461018957806370a082311461019c57806395d89b41146101af578063a3f4df7e146101b7576100f5565b806323b872dd116100d357806323b872dd1461014d5780632e0f2625146101605780632ff2e9dc1461017a578063313ce56714610182576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd1461013b575b600080fd5b61010261024e565b60405161010f9190610882565b60405180910390f35b61012b610126366004610859565b6102e0565b604051901515815260200161010f565b6002545b60405190815260200161010f565b61012b61015b36600461081e565b6102f8565b610168601281565b60405160ff909116815260200161010f565b61013f61031e565b6012610168565b61012b610197366004610859565b61033b565b61013f6101aa3660046107d2565b61035d565b61010261037c565b6101026040518060400160405280602081526020017f446563656e7472616c697a656420496e737572616e63652050726f746f636f6c81525081565b61012b610201366004610859565b61038b565b61012b610214366004610859565b610416565b61013f6102273660046107ec565b610424565b6101026040518060400160405280600381526020016204449560ec1b81525081565b60606003805461025d90610a23565b80601f016020809104026020016040519081016040528092919081815260200182805461028990610a23565b80156102d65780601f106102ab576101008083540402835291602001916102d6565b820191906000526020600020905b8154815290600101906020018083116102b957829003601f168201915b5050505050905090565b6000336102ee81858561044f565b5060019392505050565b600033610306858285610573565b6103118585856105ed565b60019150505b9392505050565b61032a6012600a610933565b61033890633b9aca00610a04565b81565b6000336102ee81858561034e8383610424565b61035891906108d5565b61044f565b6001600160a01b0381166000908152602081905260409020545b919050565b60606004805461025d90610a23565b600033816103998286610424565b9050838110156103fe5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61040b828686840361044f565b506001949350505050565b6000336102ee8185856105ed565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b0383166104b15760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103f5565b6001600160a01b0382166105125760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103f5565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b600061057f8484610424565b905060001981146105e757818110156105da5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103f5565b6105e7848484840361044f565b50505050565b6001600160a01b0383166106515760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103f5565b6001600160a01b0382166106b35760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103f5565b6001600160a01b0383166000908152602081905260409020548181101561072b5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103f5565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906107629084906108d5565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516107ae91815260200190565b60405180910390a36105e7565b80356001600160a01b038116811461037757600080fd5b6000602082840312156107e3578081fd5b610317826107bb565b600080604083850312156107fe578081fd5b610807836107bb565b9150610815602084016107bb565b90509250929050565b600080600060608486031215610832578081fd5b61083b846107bb565b9250610849602085016107bb565b9150604084013590509250925092565b6000806040838503121561086b578182fd5b610874836107bb565b946020939093013593505050565b6000602080835283518082850152825b818110156108ae57858101830151858201604001528201610892565b818111156108bf5783604083870101525b50601f01601f1916929092016040019392505050565b600082198211156108e8576108e8610a5e565b500190565b80825b60018086116108ff575061092a565b81870482111561091157610911610a5e565b8086161561091e57918102915b9490941c9380026108f0565b94509492505050565b600061031760001960ff85168460008261094f57506001610317565b8161095c57506000610317565b8160018114610972576002811461097c576109a9565b6001915050610317565b60ff84111561098d5761098d610a5e565b6001841b9150848211156109a3576109a3610a5e565b50610317565b5060208310610133831016604e8410600b84101617156109dc575081810a838111156109d7576109d7610a5e565b610317565b6109e984848460016108ed565b8086048211156109fb576109fb610a5e565b02949350505050565b6000816000190483118215151615610a1e57610a1e610a5e565b500290565b600281046001821680610a3757607f821691505b60208210811415610a5857634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea26469706673582212205d9a659bc6553fd64ac08bd7cbbe2fb3741bebd0b4a3db6a2497113cc3c4507f64736f6c63430008020033";

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
