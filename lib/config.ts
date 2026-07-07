import { createConfig, http, fallback } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import { createConfig as createZamaConfig } from "@zama-fhe/react-sdk/wagmi";
import { web } from "@zama-fhe/sdk/web";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";

// Sepolia RPCs. A single public endpoint (e.g. Alchemy's shared "demo" key)
// rate-limits (HTTP 429) under any real traffic, so we use a fallback list:
// viem rolls over to the next endpoint on failure. A dedicated endpoint set via
// NEXT_PUBLIC_SEPOLIA_RPC takes priority.
const SEPOLIA_RPCS = [
  process.env.NEXT_PUBLIC_SEPOLIA_RPC,
  "https://ethereum-sepolia-rpc.publicnode.com",
  "https://sepolia.gateway.tenderly.co",
  "https://1rpc.io/sepolia",
  "https://sepolia.drpc.org",
].filter(Boolean) as string[];

const sepoliaTransport = fallback(
  SEPOLIA_RPCS.map((url) => http(url, { timeout: 12_000 })),
  { rank: false, retryCount: 2 }
);

// Wagmi config
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: sepoliaTransport,
  },
  ssr: true,
});

// Zama FHE chain config.
// Use the SDK's built-in Sepolia chain as-is — it already carries the correct
// testnet relayer (https://relayer.testnet.zama.org/v2), ACL, and KMS addresses.
// Only override relayerUrl if you run your own proxy at /api/relayer/:chainId.
export const mySepoliaFhe: FheChain = {
  ...sepoliaFhe,
  // Pin the SDK's own read RPC to a reliable endpoint (avoids the shared
  // Alchemy demo key that returns 429). Prefer a dedicated one if provided.
  network: process.env.NEXT_PUBLIC_SEPOLIA_RPC || SEPOLIA_RPCS[0],
  ...(process.env.NEXT_PUBLIC_RELAYER_URL
    ? { relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL }
    : {}),
} as const satisfies FheChain;

export const zamaConfig = createZamaConfig({
  chains: [mySepoliaFhe],
  wagmiConfig,
  relayers: {
    [mySepoliaFhe.id ?? 11155111]: web(),
  },
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

// Common addresses for Sepolia (TokenOps factories / singletons live here)
export const TOKENOPS_ADDRESSES = {
  // These are the canonical addresses from the @tokenops/sdk package.
  // The SDK exports them, but we surface a few here for clarity in the UI.
  // Prefer importing from the SDK subpaths when possible.
} as const;

// A simple helper to get a human-friendly network name
export function getNetworkName(chainId: number) {
  if (chainId === sepolia.id) return "Sepolia";
  return `Chain ${chainId}`;
}
