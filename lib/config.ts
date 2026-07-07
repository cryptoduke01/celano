import { createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient } from "@tanstack/react-query";
import { createConfig as createZamaConfig } from "@zama-fhe/react-sdk/wagmi";
import { web } from "@zama-fhe/sdk/web";
import { sepolia as sepoliaFhe, type FheChain } from "@zama-fhe/sdk/chains";

// Sepolia RPC — override with NEXT_PUBLIC_SEPOLIA_RPC for the hosted demo
// (public endpoints rate-limit under real traffic). Falls back to a public gateway.
const SEPOLIA_RPC =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC || "https://sepolia.gateway.tenderly.co";

// Wagmi config
export const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(SEPOLIA_RPC),
  },
  ssr: true,
});

// Zama FHE chain config.
// For production-grade apps, run your own relayer proxy at /api/relayer/:chainId
// and point relayerUrl there. For fast demo we try the public relayer pattern.
export const mySepoliaFhe: FheChain = {
  ...sepoliaFhe,
  // Public community / Zama relayer endpoints are documented in Zama SDK guides.
  // Many teams proxy. We default to the documented public pattern for Sepolia.
  relayerUrl: "https://relayer.zama.ai",
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
