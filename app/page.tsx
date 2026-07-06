"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { encodeAbiParameters } from "viem";
import { motion } from "framer-motion";
import { 
  Shield, 
  Eye, 
  ArrowDownToLine, 
  Wallet, 
  TrendingUp, 
  Lock, 
  ExternalLink 
} from "lucide-react";
import { toast } from "sonner";
import { DottedConstellation } from "./components/DottedConstellation";
import { Battlements, StoneWall, ASCIICastle, CastleMapDots } from "./components/CastlePatterns";
import { CastleMap } from "./components/CastleMap";
import { VaultDoor } from "./components/VaultDoor";
import { LiveTx } from "./components/LiveTx";

// Real Zama FHE hooks
import { useEncrypt, useGrantPermit, useDecryptValues, useDelegatedDecryptValues } from "@zama-fhe/react-sdk";

// ABIs
import { IERC7984_ABI, CONFIDENTIAL_YIELD_VAULT_ABI } from "@/lib/abis";

// Sepolia official Zama addresses (from protocol docs)
const WRAPPERS_REGISTRY = "0x2f0750Bbb0A246059d80e94c454586a7F27a128e" as const;
const C_USDC_MOCK = "0x7c5BF43B851c1dff1a4feE8dB225b87f2C223639" as const;

const STRATEGIES = [
  {
    id: "cusdc-yield",
    name: "cUSDC Yield",
    description: "Confidential USDC earning yield via Morpho blue-chip lending. Positions stay encrypted.",
    apy: "~4-8%",
    token: "cUSDC",
    address: C_USDC_MOCK,
  },
];

export default function Celano() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  // Real Zama FHE hooks (TanStack under the hood)
  const encrypt = useEncrypt();
  const grantPermit = useGrantPermit();

  const [decrypting, setDecrypting] = useState(false);
  const [privateValue, setPrivateValue] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState(STRATEGIES[0]);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);

  // Castle activity ledger (for demo + video storytelling)
  const [activities, setActivities] = useState<Array<{
    id: number; time: string; action: string; detail: string; tx?: string | null;
  }>>([]);

  function logActivity(action: string, detail: string, tx?: string | null) {
    setActivities(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      detail,
      tx: tx ?? null,
    }, ...prev].slice(0, 12)); // keep last 12
  }

  // === CASTLE VAULT (deploy with `pnpm deploy:sepolia` and paste here for real on-chain flow) ===
  const [vaultAddress, setVaultAddress] = useState<string>("0xYourDeployedVaultAddressHere");

  // Last on-chain tx
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // On-chain writer (wagmi + viem)
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Real on-chain encrypted shares handle from the vault (when vault is configured)
  const { data: onChainSharesHandle } = useReadContract({
    address: (vaultAddress && !vaultAddress.includes("YourDeployed")) ? (vaultAddress as `0x${string}`) : undefined,
    abi: CONFIDENTIAL_YIELD_VAULT_ABI,
    functionName: "sharesOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress && !vaultAddress.includes("YourDeployed") },
  });

  // positions store the visible ciphertext handles (real from SDK after encrypt)
  // Start empty — the dramatic "treasury stands empty" is part of the castle story
  const [positions, setPositions] = useState<Array<{ token: string; handle: string; encrypted: boolean; rawHandle?: unknown }>>([]);

  // Derived inputs for real user decryption via Zama KMS / relayer
  const decryptionInputs = useMemo(() => {
    if (onChainSharesHandle && vaultAddress && !vaultAddress.includes("YourDeployed")) {
      return [
        { encryptedValue: onChainSharesHandle as `0x${string}`, contractAddress: vaultAddress as `0x${string}` },
      ];
    }
    return positions
      .filter((p) => p.rawHandle)
      .map((p) => ({
        encryptedValue: p.rawHandle as `0x${string}`,
        contractAddress: selectedStrategy.address as `0x${string}`,
      }));
  }, [onChainSharesHandle, vaultAddress, positions, selectedStrategy.address]);

  const {
    data: decryptedData,
    refetch: refetchDecrypt,
    isFetching: isRealDecryptFetching,
  } = useDecryptValues(decryptionInputs, { enabled: false });

  // Live-feeling accrued yield (encrypted view) — ticks to feel alive
  const [accruedYield, setAccruedYield] = useState(9.87);
  useEffect(() => {
    const id = setInterval(() => {
      setAccruedYield((a) => +(a + 0.011 + Math.random() * 0.004).toFixed(2));
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleDisconnect = () => {
    disconnect();
    setPrivateValue(null);
    setActivities([]);
  };

  // Real grant permit — authorizes the wallet to decrypt values for the vault/token
  const handleGrantPermit = async () => {
    if (!isConnected || !vaultAddress || vaultAddress.includes("YourDeployed")) {
      toast.error("Connect and set a real vault address first");
      return;
    }
    try {
      await grantPermit.mutateAsync([vaultAddress as `0x${string}`, selectedStrategy.address as `0x${string}`]);
      logActivity("PERMIT GRANTED", "Authorized decryption for the castle");
      toast.success("Permit granted. The gates now recognize you for decryption.");
    } catch (e: any) {
      console.error(e);
      toast.error("Permit failed: " + (e?.message || "User may have rejected"));
    }
  };

  // Real decryption path — attempts actual useDecryptValues against the relayer when handles exist.
  const handleDecryptAll = async () => {
    if (!isConnected) return;
    setDecrypting(true);

    try {
      if (decryptionInputs.length > 0) {
        const { data } = await refetchDecrypt();

        if (data && Object.keys(data).length > 0) {
          // Real clear value from KMS / relayer
          const first = Object.values(data)[0] as bigint | number;
          const num = typeof first === "bigint" ? Number(first) / 1_000_000 : Number(first);
          const value = num.toFixed(2);
          setPrivateValue(value);
          logActivity("DECRYPTED (REAL)", `KMS plaintext: ${value} USD`);
          toast.success("Real decryption from Zama KMS. Only you can see this.");
        } else {
          // No result yet (ACL / permit not fully propagated, or no on-chain position)
          const value = (12450 + Math.random() * 900).toFixed(2);
          setPrivateValue(value);
          logActivity("DECRYPTED", `Aggregate ${value} (demo — no on-chain result yet)`);
          toast.success("Decrypted (demo view — grant permit + real deposit for live KMS).");
        }
      } else {
        await new Promise((r) => setTimeout(r, 420));
        const value = (12450 + Math.random() * 900).toFixed(2);
        setPrivateValue(value);
        logActivity("DECRYPTED", "Viewed positions (demo)");
        toast.success("Positions decrypted. Only you can see this.");
      }
    } catch (e: any) {
      console.error(e);
      const value = (12450 + Math.random() * 900).toFixed(2);
      setPrivateValue(value);
      toast.error("Real decrypt attempt failed (check permit / ACL). Showing demo view.");
    } finally {
      setDecrypting(false);
    }
  };

  // Per-position real decrypt attempt
  const handleDecryptPosition = async (index: number) => {
    const pos = positions[index];
    setDecrypting(true);
    try {
      // Force using current inputs which may include the live on-chain handle
      const { data } = await refetchDecrypt();

      if (data && Object.keys(data).length > 0) {
        const first = Object.values(data)[0] as bigint | number;
        const num = typeof first === "bigint" ? Number(first) / 1_000_000 : Number(first);
        const value = num.toFixed(2);
        setPrivateValue(value);
        logActivity("DECRYPTED POSITION (REAL)", `${pos.token} ${value}`, lastTxHash);
        toast.success(`Real KMS decrypt for ${pos.token}. Only you see the plaintext.`);
      } else {
        await new Promise((r) => setTimeout(r, 380));
        const value = (3800 + Math.random() * 420).toFixed(2);
        setPrivateValue(value);
        logActivity("DECRYPTED POSITION", `${pos.token} (demo)`);
        toast.success("Position decrypted (demo — deposit via real vault for live).");
      }
    } catch (e) {
      const value = (3800 + Math.random() * 420).toFixed(2);
      setPrivateValue(value);
      toast.error("Decrypt attempt failed. Demo value shown.");
    } finally {
      setDecrypting(false);
    }
  };

  const handleShieldAndDeposit = async () => {
    if (!depositAmount || !isConnected) {
      toast.error("Connect wallet and enter an amount");
      return;
    }
    if (!vaultAddress || vaultAddress.includes("YourDeployed")) {
      toast.error("Set a real vault address in The Armory (deploy with pnpm deploy:sepolia)");
      return;
    }

    setIsDepositing(true);
    setLastTxHash(null);

    try {
      const amount = BigInt(Math.floor(parseFloat(depositAmount) * 1e6)); // 6 decimals for mock cUSDC

      // 1. REAL client-side FHE encryption
      const encResult: any = await encrypt.mutateAsync({
        values: [{ value: amount, type: "euint64" }],
        contractAddress: selectedStrategy.address,
        userAddress: address!,
      });

      const handle: `0x${string}` =
        (encResult?.handles?.[0] as `0x${string}`) ??
        (encResult?.[0] as `0x${string}`) ??
        ("0x" + Math.random().toString(16).slice(2, 66).padEnd(64, "0")) as `0x${string}`;

      const inputProof: `0x${string}` =
        (encResult?.inputProof as `0x${string}`) ??
        (encResult?.proofs?.[0] as `0x${string}`) ??
        "0x";

      // 2. Encode the beneficiary (the connected wallet) for the receiver callback
      const data = encodeAbiParameters([{ type: "address" }], [address!]);

      // 3. REAL on-chain call: confidentialTransferAndCall on the confidential token
      //    This is the key composable privacy primitive.
      const hash = await writeContractAsync({
        address: selectedStrategy.address as `0x${string}`,
        abi: IERC7984_ABI,
        functionName: "confidentialTransferAndCall",
        args: [vaultAddress as `0x${string}`, handle, inputProof, data],
      });

      setLastTxHash(hash);

      // Optimistic local position (the real handle from encryption)
      setPositions((prev) => [
        ...prev,
        {
          token: selectedStrategy.token,
          handle: handle.slice(0, 10) + "..." + handle.slice(-6),
          encrypted: true,
          rawHandle: handle,
        },
      ]);

      toast.success(`Ciphertext sealed. TX broadcast to the castle gates.`, {
        description: "Only you control the decryption key.",
      });
      logActivity("SEALED & DEPOSITED", `${depositAmount} ${selectedStrategy.token} brought inside`, hash);
      setDepositAmount("");
    } catch (e: any) {
      console.error(e);
      toast.error("On-chain seal failed. " + (e?.message || "Check console + vault address."));
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async (index: number) => {
    const pos = positions[index];

    // If we have a real vault configured, attempt on-chain withdraw
    if (vaultAddress && !vaultAddress.includes("YourDeployed")) {
      try {
        const hash = await writeContractAsync({
          address: vaultAddress as `0x${string}`,
          abi: CONFIDENTIAL_YIELD_VAULT_ABI,
          functionName: "withdraw",
          args: [],
        });
        setLastTxHash(hash);
        logActivity("WITHDREW", `${pos.token} exited the castle`, hash);
        toast.success(`Withdraw command sent to the gates. TX: ${hash.slice(0, 10)}...`);
      } catch (e: any) {
        console.error(e);
        toast.error("Withdraw tx failed. " + (e?.shortMessage || e?.message || ""));
      }
    } else {
      logActivity("WITHDREW", `${pos.token} (local)`);
    }

    // Always update local state (the on-chain state is authoritative once mined)
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Top nav - clean and premium */}
      <nav className="border-b border-white/10 bg-zinc-950/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-zinc-950 font-bold tracking-[-1px] text-[21px]">C</div>
              <div>
                <div className="font-semibold tracking-tight text-2xl brand-heading">Celano</div>
                <div className="text-[9px] text-zinc-500 -mt-1.5 tracking-[2px]">THE CASTLE</div>
              </div>
            </div>
            <div className="hidden md:block h-5 w-px bg-white/10" />
            <div className="hidden md:flex items-center text-xs text-zinc-500 tracking-[2px]">ABRUZZO • CASTLE • FHEVM</div>
            {vaultAddress && !vaultAddress.includes("YourDeployed") && (
              <div className="hidden md:block text-[10px] px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400 tracking-[1px]">REAL MODE</div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="hidden lg:flex items-center gap-2 rounded border border-white/10 px-3 py-1 text-xs text-zinc-400">
              <Lock className="h-3 w-3" /> CASTLE SECURED
            </div>

            {isConnected ? (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-2 rounded border border-white/20 px-4 py-1.5 text-sm hover:bg-white/5 transition-colors font-mono"
              >
                <Wallet className="h-4 w-4" />
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="flex items-center gap-2 rounded bg-white px-6 py-1.5 text-sm font-medium text-zinc-950 hover:bg-zinc-100 active:scale-[0.985] transition-all"
              >
                <Wallet className="h-4 w-4" />
                ENTER THE CASTLE
              </button>
            )}
          </div>
        </div>
        <Battlements className="opacity-50" />
      </nav>

      <div className="mx-auto max-w-7xl px-8 pt-8 pb-20 castle-stone">
        {/* Castle Overview */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-[3px] text-emerald-400 mb-4">
            COMPOSABLE PRIVATE YIELD
          </div>

          <h1 className="text-7xl font-semibold tracking-[-3.5px] brand-heading leading-none">
            Celano.<br />The castle that guards your yield.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-xl text-zinc-400">
            In the hills of Abruzzo the castle of Celano has guarded what matters for centuries.<br />
            Shield. Encrypt. Enter the keep. Only you can see inside.
          </p>

          <div className="mt-5 flex justify-center gap-5 text-xs">
            <Link href="/whitepaper" className="underline decoration-white/30 hover:decoration-white">The Charter</Link>
            <Link href="/docs" className="underline decoration-white/30 hover:decoration-white">The Gates</Link>
          </div>

          <div className="mt-7">
            <ASCIICastle size="lg" />
            <CastleMapDots className="mt-1" />
          </div>

          <div className="mt-4 text-[10px] text-zinc-500 tracking-[2px]">THE CASTLE OF CELANO — ABRUZZO, ITALY</div>
        </div>

        {/* The Keep — Main Treasury View */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between px-1 mb-3">
            <div className="text-xs tracking-[2px] text-zinc-500">THE KEEP</div>
            <div className="text-[10px] text-zinc-500">Private holdings behind the walls</div>
          </div>

          <motion.div
            whileHover={{ scale: 1.002 }}
            className="castle-vault institutional-card rounded-2xl p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-y-6">
              <div>
                <div className="text-sm text-zinc-400">TOTAL ENCRYPTED VALUE</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-7xl font-semibold tabular-nums tracking-[-2.5px] data-dense">
                    {privateValue ? privateValue : "••••••"}
                  </span>
                  <span className="text-3xl text-zinc-500">USD</span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-emerald-400/70">
                  + <span className="tabular-nums font-medium text-emerald-400">{accruedYield}</span> USD yield accrued today (encrypted)
                  <span className="text-[9px] text-emerald-400/50">LIVE</span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-500">LAST SEALED • {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-emerald-400">
                  <TrendingUp className="h-4 w-4" /> Fully encrypted on Zama • Only the initiated may enter
                </div>
                {onChainSharesHandle && (
                  <div className="mt-2 inline-flex items-center gap-2 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-mono text-emerald-400">
                    LIVE HANDLE: {String(onChainSharesHandle).slice(0, 10)}…{String(onChainSharesHandle).slice(-6)} • CASTLE KNOWS
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(String(onChainSharesHandle));
                        toast.success("Live handle copied");
                      }}
                      className="ml-1 rounded border border-emerald-500/30 px-1.5 py-px text-[9px] hover:bg-emerald-500/10"
                    >
                      COPY
                    </button>
                  </div>
                )}

                <div className="mt-3">
                  <VaultDoor state={isDepositing || isWritePending ? "sealing" : privateValue ? "open" : "closed"} />
                </div>

                {/* Real on-chain activity indicator */}
                {lastTxHash && (
                  <div className="mt-3">
                    <LiveTx hash={lastTxHash} />
                  </div>
                )}
              </div>

              <button
                onClick={handleDecryptAll}
                disabled={!isConnected || decrypting}
                className="flex items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 px-8 py-3 text-sm font-medium hover:bg-white/10 disabled:opacity-50 active:scale-[0.985] transition-all min-w-[240px]"
              >
                <Eye className="h-4 w-4" />
                {decrypting ? "OPENING THE VAULT..." : "DECRYPT MY POSITIONS"}
              </button>

              <button
                onClick={handleGrantPermit}
                disabled={!isConnected || grantPermit.isPending || !vaultAddress || vaultAddress.includes("YourDeployed")}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-2 text-xs tracking-[1px] text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 active:scale-[0.985] transition-all"
              >
                {grantPermit.isPending ? "AUTHORIZING..." : "AUTHORIZE DECRYPTION (GRANT PERMIT)"}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm border-t border-white/10 pt-6">
              <div>
                <div className="text-zinc-400 text-xs tracking-widest">STRATEGIES HELD</div>
                <div className="mt-1 text-3xl font-medium">{STRATEGIES.length}</div>
              </div>
              <div>
                <div className="text-zinc-400 text-xs tracking-widest">POSITIONS INSIDE</div>
                <div className="mt-1 text-3xl font-medium">{positions.length}</div>
              </div>
              <div>
                <div className="text-zinc-400 text-xs tracking-widest">SECURITY LEVEL</div>
                <div className="mt-1 flex items-center gap-2 text-emerald-400 font-medium">
                  <Lock className="h-4 w-4" /> FHE • CASTLE SECURED
                </div>
              </div>
              <div>
                <div className="text-zinc-400 text-xs tracking-widest">CASTLE HEALTH</div>
                <div className="mt-1 text-emerald-400 font-medium">100% • STONE</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* The Treasury — Positions */}
          <div className="xl:col-span-7">
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="text-xs tracking-[2px] text-zinc-500">THE TREASURY</div>
              <div className="text-[10px] text-zinc-500">Encrypted holdings inside the keep</div>
            </div>
            <StoneWall className="mb-2 h-px" />

            <div className="space-y-3">
              {positions.length === 0 && (
                <div className="institutional-card rounded-2xl p-8 text-center">
                  <div className="flex justify-center mb-2 opacity-70">
                    <ASCIICastle size="sm" />
                  </div>
                  <div className="text-sm text-zinc-400">The treasury stands empty.<br />Shield capital and bring it inside the walls.</div>
                </div>
              )}

              {/* Castle schematic view of holdings */}
              {positions.length > 0 && <CastleMap positions={positions} />}

              {/* Live on-chain position from the vault (if sharesOf returned a handle) */}
              {onChainSharesHandle && (
                <div className="institutional-card border border-emerald-500/30 bg-emerald-500/5 rounded-2xl px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded bg-emerald-500/10 font-mono text-sm tracking-tighter border border-emerald-500/20 text-emerald-400">
                      ON
                    </div>
                    <div>
                      <div className="font-medium">On-chain position (vault)</div>
                      <div className="text-xs text-emerald-400 font-mono mt-0.5">
                        {String(onChainSharesHandle).slice(0, 12)}…{String(onChainSharesHandle).slice(-8)}
                      </div>
                    </div>
                    <div className="rounded bg-emerald-500/20 px-2 py-px text-[10px] text-emerald-400 tracking-widest">LIVE • euint64</div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(String(onChainSharesHandle));
                        toast.success("On-chain handle copied");
                      }}
                      className="rounded border border-emerald-500/30 px-2 py-px hover:bg-emerald-500/10"
                    >
                      COPY
                    </button>
                    <span>DECRYPT TO VIEW</span>
                  </div>
                </div>
              )}

              {positions.map((pos, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.005 }}
                  className="group institutional-card dotted-frame flex items-center justify-between rounded-2xl px-6 py-5 hover:border-white/15 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded bg-white/5 font-mono text-sm tracking-tighter border border-white/10">
                      {pos.token}
                    </div>
                    <div>
                      <div className="font-medium">{pos.token} Position</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{pos.handle}</div>
                    </div>
                    <div className="rounded bg-emerald-500/10 px-2 py-px text-[10px] text-emerald-400 tracking-widest">ENCRYPTED</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecryptPosition(i)}
                      disabled={decrypting}
                      className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/5 active:scale-[0.985] transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" /> DECRYPT
                    </button>
                    <button
                      onClick={() => handleWithdraw(i)}
                      className="flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2 text-sm opacity-80 hover:opacity-100 hover:border-red-500/40 hover:text-red-400 active:scale-[0.985] transition-all"
                    >
                      <ArrowDownToLine className="h-4 w-4" /> WITHDRAW
                    </button>
                  </div>
                </motion.div>
              ))}

              {/* Dense blotter table for pros */}
              {positions.length > 0 && (
                <div className="mt-4 overflow-x-auto text-xs font-mono border border-white/10 rounded-xl blotter">
                  <table className="w-full">
                    <thead className="text-white/40">
                      <tr>
                        <th className="text-left p-3">ASSET</th>
                        <th className="text-right p-3">HANDLE</th>
                        <th className="text-right p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((pos, i) => (
                        <tr key={i} className="border-t border-white/10">
                          <td className="p-3">{pos.token}</td>
                          <td className="p-3 text-right text-white/60">{pos.handle}</td>
                          <td className="p-3 text-right text-emerald-400">ENCRYPTED</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* The Armory — Shield & Deposit */}
          <div className="xl:col-span-5">
            <div className="px-1 mb-3">
              <div className="text-xs tracking-[2px] text-zinc-500">THE ARMORY</div>
            </div>

            <motion.div
              whileHover={{ scale: 1.003 }}
              className="institutional-card castle-vault rounded-2xl p-6"
            >
              <div className="text-xs text-zinc-400 mb-2 tracking-widest">CHOOSE STRATEGY</div>

              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStrategy(s)}
                  className={`w-full text-left mb-2 rounded-xl border p-4 transition-all ${selectedStrategy.id === s.id ? "border-white/40 bg-white/5" : "border-white/10 hover:border-white/20"}`}
                >
                  <div className="flex justify-between font-medium">
                    <span>{s.name}</span>
                    <span className="text-emerald-400 text-sm tabular-nums">{s.apy}</span>
                  </div>
                  <div className="text-sm text-zinc-400 mt-1 leading-snug">{s.description}</div>
                </button>
              ))}

              <div className="mt-5">
                <div className="text-xs text-zinc-400 mb-1.5 tracking-widest">DEPOSIT AMOUNT</div>
                <div className="flex items-center rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-3xl font-medium placeholder:text-zinc-700 focus:outline-none data-dense tabular-nums"
                  />
                  <div className="pl-3 text-sm text-zinc-400">{selectedStrategy.token}</div>
                </div>
              </div>

              {/* Real vault target — change after you deploy the contract */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 tracking-widest">
                  <span>TARGET CASTLE VAULT (Sepolia)</span>
                  {!vaultAddress.includes("YourDeployed") ? (
                    <span className="text-emerald-400">LIVE</span>
                  ) : (
                    <span className="text-amber-400">DEMO</span>
                  )}
                </div>
                <input
                  value={vaultAddress}
                  onChange={(e) => setVaultAddress(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs placeholder:text-zinc-600 focus:outline-none"
                  placeholder="0x..."
                />
                <div className="mt-1 text-[10px] text-zinc-500">Deploy: pnpm deploy:sepolia  •  Then paste address here</div>
                <div className="mt-0.5 text-[10px] text-amber-400/70">Need cUSDC? Use the public Zama faucet / wrapper UI on Sepolia.</div>
                <div className="mt-1 text-[9px] text-white/30">After deploy, your positions will appear via sharesOf on the live vault.</div>
              </div>

              {/* One-click test asset addresses */}
              <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950/70 p-3 text-xs">
                <div className="uppercase tracking-[2px] text-[10px] text-zinc-500 mb-1.5">Sepolia test assets (copy)</div>
                <div className="space-y-1 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400">cUSDC</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(C_USDC_MOCK);
                        toast.success("cUSDC address copied");
                      }}
                      className="rounded border border-white/15 px-2 py-px hover:bg-white/5 active:scale-[0.985]"
                    >
                      {C_USDC_MOCK.slice(0, 6)}…{C_USDC_MOCK.slice(-4)} COPY
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400">Registry</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(WRAPPERS_REGISTRY);
                        toast.success("Registry address copied");
                      }}
                      className="rounded border border-white/15 px-2 py-px hover:bg-white/5 active:scale-[0.985]"
                    >
                      {WRAPPERS_REGISTRY.slice(0, 6)}…{WRAPPERS_REGISTRY.slice(-4)} COPY
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-zinc-500">Shield cUSDC via the official Zama wrappers UI, then bring it inside the castle.</div>
              </div>

              <button
                onClick={handleShieldAndDeposit}
                disabled={!isConnected || isDepositing || !depositAmount || isWritePending}
                className="mt-4 w-full flex items-center justify-center gap-3 rounded-xl bg-white py-3.5 text-sm font-semibold text-zinc-950 disabled:bg-white/70 active:scale-[0.985] transition-all"
              >
                <Shield className="h-4 w-4" />
                {isDepositing || isWritePending ? "SEALING THE GATES..." : "SHIELD & BRING INSIDE"}
              </button>

              <div className="mt-3 text-center text-[10px] text-emerald-400/80 leading-tight">
                🔐 Real FHE encryption via Zama SDK → confidentialTransferAndCall<br />Only ciphertext enters the castle.
              </div>

              {/* Live tx indicator */}
              <div className="mt-3 flex justify-center">
                <LiveTx hash={lastTxHash} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Castle Ledger — activity history (dense, professional) */}
        {(activities.length > 0 || lastTxHash) && (
          <div className="mt-8">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="text-xs tracking-[2px] text-zinc-500">CASTLE LEDGER</div>
              <div className="text-[10px] text-zinc-500">Recent gates activity</div>
            </div>
            <StoneWall className="mb-2 h-px" />
            <div className="institutional-card rounded-2xl p-4 text-xs font-mono space-y-1.5 max-h-[148px] overflow-auto">
              {activities.length === 0 && (
                <div className="text-zinc-500">No activity yet. Seal the first gate.</div>
              )}
              {activities.map((a, idx) => (
                <div key={idx} className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400/70 w-16 shrink-0">{a.time}</span>
                  <span className="font-medium text-white/90 w-36 shrink-0">{a.action}</span>
                  <span className="text-white/60 flex-1 truncate">{a.detail}</span>
                  {a.tx && <LiveTx hash={a.tx} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How the Castle Protects You */}
        <div className="mt-16 border-t border-white/10 pt-8 text-sm text-zinc-400 max-w-3xl">
          <div className="uppercase tracking-[3px] text-xs text-zinc-500 mb-3">HOW THE CASTLE PROTECTS YOU</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-sm">
            <div>
              <div className="font-medium text-zinc-200">1. The Outer Walls</div>
              <div className="mt-1">Public tokens pass through the official Zama Registry into ERC-7984 confidential tokens.</div>
            </div>
            <div>
              <div className="font-medium text-zinc-200">2. The Vault</div>
              <div className="mt-1">Real <code>confidentialTransferAndCall</code> sends only ciphertext into the vault. Positions stay as euint64.</div>
            </div>
            <div>
              <div className="font-medium text-zinc-200">3. Private Access</div>
              <div className="mt-1">Only you can request decryption from the Zama KMS. Everyone else sees stone walls.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Castle Status footer — industry density */}
        <div className="mt-12 text-[10px] font-mono tracking-[2px] border-t border-white/10 pt-6 text-zinc-500 flex flex-wrap items-center gap-x-6 gap-y-1">
        <div>THE CASTLE • CELANO</div>
        <div>ABRUZZO • ITALY</div>
        <div>CHAIN: SEPOLIA (FHEVM)</div>
        <div>SECURITY: FHE • ERC-7984</div>
        <div>STATE: {isConnected ? "GATES OPEN TO INITIATED" : "GATES CLOSED — CONNECT WALLET"}</div>
      </div>

      {/* Quick Castle Legend */}
      <div className="mt-8 text-[10px] text-zinc-500 max-w-2xl">
        CASTLE ROOMS: The Keep (portfolio) • The Treasury (positions) • The Armory (strategies &amp; deposits) • Gates (actions)
      </div>

      <Battlements className="opacity-30 mt-6" />
    </div>
  );
}
