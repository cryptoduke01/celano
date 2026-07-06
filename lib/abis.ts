// Minimal ABIs for Celano on-chain interactions
// The most common successful form for Zama v3 + confidentialTransferAndCall is:
// confidentialTransferAndCall(to, handle, inputProof, data)

export const IERC7984_ABI = [
  {
    type: "function",
    name: "confidentialTransferAndCall",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "handle", type: "bytes32" },
      { name: "inputProof", type: "bytes" },
      { name: "data", type: "bytes" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  // Some deployments use the externalEuint struct form
  {
    type: "function",
    name: "confidentialTransferAndCall",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      {
        name: "amount",
        type: "tuple",
        components: [
          { name: "handle", type: "bytes32" },
          { name: "inputProof", type: "bytes" },
        ],
      },
      { name: "data", type: "bytes" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const CONFIDENTIAL_YIELD_VAULT_ABI = [
  {
    type: "function",
    name: "withdraw",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "sharesOf",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bytes32" }], // euint64 handle
  },
  {
    type: "function",
    name: "onConfidentialTransferReceived",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "from", type: "address" },
      { name: "amount", type: "bytes32" },
      { name: "data", type: "bytes" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
