import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@fhevm/hardhat-plugin";

// Celano — Hardhat 2 + Zama FHEVM toolchain.
// The fhevm plugin wires the encrypted precompiles; hardhat-ethers powers the deploy script.
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      // FHEVM requires the cancun EVM target.
      evmVersion: "cancun",
    },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC || "https://sepolia.gateway.tenderly.co",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
};

export default config;
