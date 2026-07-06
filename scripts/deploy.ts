// Celano — ConfidentialYieldVault Deploy Script
// Run: pnpm deploy:sepolia
// After deploy, paste the vault address into the UI "TARGET CASTLE VAULT" field.

import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n🏰 Deploying Celano Castle Vault");
  console.log("Deployer:", deployer.address);

  const C_USDC_MOCK = "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639"; // official Zama Sepolia cUSDC wrapper

  const Vault = await hre.ethers.getContractFactory("ConfidentialYieldVault");
  const vault = await Vault.deploy(C_USDC_MOCK);

  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();

  console.log("\n✅ ConfidentialYieldVault deployed to:", vaultAddress);
  console.log("   Accepting encrypted deposits of:", C_USDC_MOCK);
  console.log("\nNext steps:");
  console.log("  1. Copy the vault address above");
  console.log("  2. Paste it into the Celano UI → The Armory → TARGET CASTLE VAULT");
  console.log("  3. Use the app to Shield & Bring Inside (real confidentialTransferAndCall)");
  console.log("  4. (Optional) Verify on Etherscan if desired\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
