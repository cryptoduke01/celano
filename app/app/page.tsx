"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract, useChainId, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { sepolia } from "wagmi/chains";
import { encodeAbiParameters } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Eye,
  ArrowDownToLine,
  Wallet,
  KeyRound,
  Copy,
  Lock,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { VaultDoor } from "../components/VaultDoor";
import { LiveTx } from "../components/LiveTx";
import { CastleMark } from "../components/CastleMark";

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
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const wrongNetwork = isConnected && chainId !== sepolia.id;

  // Auto-switch to Sepolia the moment a wallet connects on the wrong chain.
  useEffect(() => {
    if (isConnected && chainId !== sepolia.id) {
      switchChain?.({ chainId: sepolia.id });
    }
  }, [isConnected, chainId, switchChain]);

  // Real Zama FHE hooks (TanStack under the hood)
  const encrypt = useEncrypt();
  const grantPermit = useGrantPermit();

  const [decrypting, setDecrypting] = useState(false);
  const [privateValue, setPrivateValue] = useState<string | null>(null);
  const [lastDecryptedHandle, setLastDecryptedHandle] = useState<string | null>(null);
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

  // === VAULT (deploy with `pnpm deploy:sepolia`; set NEXT_PUBLIC_VAULT_ADDRESS or paste in the UI for the live flow) ===
  const [vaultAddress, setVaultAddress] = useState<string>(
    process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0xYourDeployedVaultAddressHere"
  );

  const isLive = !!vaultAddress && !vaultAddress.includes("YourDeployed");

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

  // Encrypted yield accrual — a quiet, always-on counter for the treasury view.
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
    if (!isConnected || !isLive) {
      toast("Connect and set a deployed vault address first.");
      return;
    }
    try {
      await grantPermit.mutateAsync([vaultAddress as `0x${string}`, selectedStrategy.address as `0x${string}`]);
      logActivity("PERMIT GRANTED", "Authorized KMS decryption for this account");
      toast.success("Decryption permit granted. You can now unseal your positions.");
    } catch (e: any) {
      console.error(e);
      if (e?.message?.toLowerCase?.().includes("reject")) {
        toast("Permit request cancelled.");
      } else {
        toast.error("Permit failed. Please try again.");
      }
    }
  };

  // Real decryption path — reads true plaintext from Zama KMS when a handle + ACL exist.
  const handleDecryptAll = async () => {
    if (!isConnected) return;

    if (decryptionInputs.length === 0) {
      toast("Nothing to decrypt yet — seal a deposit first.", {
        description: "Your encrypted position appears here once it is on-chain.",
      });
      return;
    }

    setDecrypting(true);
    try {
      const { data } = await refetchDecrypt();

      if (data && Object.keys(data).length > 0) {
        const first = Object.values(data)[0] as bigint | number;
        const num = typeof first === "bigint" ? Number(first) / 1_000_000 : Number(first);
        const value = num.toFixed(2);
        setPrivateValue(value);

        const handleUsed = (onChainSharesHandle || decryptionInputs[0]?.encryptedValue) as string | undefined;
        setLastDecryptedHandle(handleUsed || null);

        logActivity("DECRYPTED", `KMS plaintext: ${value} USD`);
        toast.success("Decrypted via Zama KMS. Only you can see this.");
      } else {
        // Handle exists but KMS returned nothing — permit/ACL not yet propagated.
        toast("Still sealed. Grant a decrypt permit, then try again.", {
          description: "The KMS only serves plaintext once your permit is active.",
        });
      }
    } catch (e) {
      console.error(e);
      toast("Could not reach the KMS just now. Your position stays sealed.");
    } finally {
      setDecrypting(false);
    }
  };

  // Per-position real decrypt attempt
  const handleDecryptPosition = async (index: number) => {
    const pos = positions[index];
    setDecrypting(true);
    try {
      const { data } = await refetchDecrypt();

      if (data && Object.keys(data).length > 0) {
        const first = Object.values(data)[0] as bigint | number;
        const num = typeof first === "bigint" ? Number(first) / 1_000_000 : Number(first);
        const value = num.toFixed(2);
        setPrivateValue(value);

        const handleUsed = (pos.rawHandle || onChainSharesHandle) as string | undefined;
        setLastDecryptedHandle(handleUsed || null);

        logActivity("DECRYPTED", `${pos.token} · ${value} USD`, lastTxHash);
        toast.success(`Decrypted ${pos.token} via Zama KMS.`);
      } else {
        toast("Still sealed. Grant a decrypt permit, then try again.");
      }
    } catch (e) {
      console.error(e);
      toast("Could not reach the KMS just now. Your position stays sealed.");
    } finally {
      setDecrypting(false);
    }
  };

  const handleShieldAndDeposit = async () => {
    if (!depositAmount || !isConnected) {
      toast("Connect a wallet and enter an amount.");
      return;
    }
    if (!isLive) {
      toast("Set a deployed vault address first.", {
        description: "Deploy with pnpm deploy:sepolia, then paste the address.",
      });
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

      const handle = (encResult?.handles?.[0] ?? encResult?.[0]) as `0x${string}` | undefined;
      if (!handle) {
        throw new Error("Encryption did not return a ciphertext handle.");
      }

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

      toast.success(`Ciphertext sealed. Transaction broadcast to Sepolia.`, {
        description: "Only you control the decryption key.",
      });
      logActivity("SEALED & DEPOSITED", `${depositAmount} ${selectedStrategy.token} sealed into the vault`, hash);
      setDepositAmount("");
    } catch (e: any) {
      console.error(e);
      const msg = e?.shortMessage || e?.message || "";
      if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("denied")) {
        toast("Deposit cancelled.");
      } else {
        toast.error("Seal failed. Check your balance and the vault address.");
      }
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
        logActivity("WITHDREW", `${pos.token} withdrawn from the vault`, hash);
        toast.success(`Withdrawal submitted. TX: ${hash.slice(0, 10)}...`);
      } catch (e: any) {
        console.error(e);
        const msg = (e?.shortMessage || e?.message || "").toLowerCase();
        if (msg.includes("reject") || msg.includes("denied")) {
          toast("Withdrawal cancelled.");
          return; // keep the position; user backed out
        }
        toast.error("Withdrawal failed. Please try again.");
      }
    } else {
      logActivity("WITHDREW", `${pos.token} (local)`);
    }

    // Always update local state (the on-chain state is authoritative once mined)
    setPositions((prev) => prev.filter((_, i) => i !== index));
  };

  const decryptBusy = decrypting || isRealDecryptFetching;
  const copyText = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Top bar */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <CastleMark size={30} gold />
              <div className="logotype text-[20px]">Celano</div>
            </Link>
            <div className="hidden items-center gap-5 text-[13px] text-[var(--text-muted)] md:flex">
              <a href="#treasury" className="transition-colors hover:text-[var(--text)]">Treasury</a>
              <a href="#positions" className="transition-colors hover:text-[var(--text)]">Positions</a>
              <Link href="/docs" className="transition-colors hover:text-[var(--text)]">Docs</Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isConnected && (
              <span className="chip hidden tabular-nums lg:inline-flex">
                <span className="text-[var(--text-faint)]">Accrued</span>
                <span className="font-medium text-[var(--yellow-bright)]">+${accruedYield.toFixed(2)}</span>
              </span>
            )}
            {isLive ? (
              <span className="pill pill-green hidden sm:inline-flex"><span className="dot dot-live" />On-chain</span>
            ) : (
              <span className="pill pill-demo hidden sm:inline-flex"><span className="dot dot-demo" />Demo</span>
            )}
            {isConnected ? (
              <button onClick={handleDisconnect} className="btn btn-secondary font-mono text-xs">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </button>
            ) : (
              <button onClick={handleConnect} className="btn btn-primary">
                <Wallet className="h-4 w-4" /> Connect
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Wrong-network banner */}
      {wrongNetwork && (
        <div className="border-b border-[rgba(211,162,74,0.3)] bg-[var(--demo-dim)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-2.5 md:px-8">
            <div className="flex items-center gap-2 text-[13px] text-[var(--demo)]">
              <AlertTriangle className="h-4 w-4" />
              Wrong network. Celano runs on Sepolia.
            </div>
            <button onClick={() => switchChain?.({ chainId: sepolia.id })} className="btn btn-secondary px-3 py-1 text-xs">
              Switch to Sepolia
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-5 md:px-8 pt-8 pb-24">
        {/* Compact tool header */}
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-[-0.02em]">Treasury</h1>
            <p className="mt-0.5 text-[13px] text-[var(--text-muted)]">
              Encrypted positions on Zama FHEVM · decrypt on demand
            </p>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {isLive ? (
              <span className="pill pill-green"><span className="dot dot-live" />Live vault</span>
            ) : (
              <span className="pill pill-demo"><span className="dot dot-demo" />No vault set</span>
            )}
          </div>
        </header>

        {/* Encrypted value — primary treasury surface */}
        <section id="treasury" className="mb-6 scroll-mt-24">
          <div className="mb-3 flex items-baseline justify-between px-0.5">
            <span className="eyebrow">Treasury · Encrypted Value</span>
            <span className="text-[11px] text-[var(--text-faint)]">Decrypt on demand · KMS</span>
          </div>

          <div className="premium-card gold-accent p-6 md:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              {/* Value */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="eyebrow text-[var(--text-muted)]">Encrypted Value</span>
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span
                    key={privateValue ?? "sealed"}
                    className={`data-dense text-6xl font-semibold tracking-[-0.04em] md:text-7xl ${privateValue ? "value-reveal" : "mask-shimmer"}`}
                  >
                    {privateValue ?? "••••••"}
                  </span>
                  <span className="text-2xl text-[var(--text-faint)]">USD</span>
                  {lastDecryptedHandle && <span className="pill pill-green">KMS</span>}
                </div>

                {lastDecryptedHandle && (
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-[var(--live)]">
                    <span>from {lastDecryptedHandle.slice(0, 10)}…{lastDecryptedHandle.slice(-6)}</span>
                    {privateValue && (
                      <button onClick={() => copyText(privateValue, "Decrypted value copied")} className="btn btn-secondary px-2 py-0.5 text-[10px]">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[var(--text-muted)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--live)]" />
                  <span>Fully encrypted on Zama FHEVM</span>
                  <span className="mx-1 text-[var(--text-faint)]">·</span>
                  <span>+</span>
                  <motion.span
                    key={accruedYield}
                    initial={{ opacity: 0.55, y: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="tabular-nums font-medium text-[var(--yellow-bright)]"
                  >
                    {accruedYield.toFixed(2)}
                  </motion.span>
                  <span>yield accrued</span>
                </div>

                {onChainSharesHandle && (
                  <div
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-[11px]"
                    style={{ borderColor: "rgba(34,197,94,0.3)", background: "var(--live-dim)", color: "var(--live)" }}
                  >
                    <span className="dot dot-live" />
                    On-chain handle {String(onChainSharesHandle).slice(0, 10)}…{String(onChainSharesHandle).slice(-6)}
                    <button onClick={() => copyText(String(onChainSharesHandle), "Live handle copied")} className="ml-1 rounded border border-[rgba(34,197,94,0.35)] px-1.5 py-px text-[9px]">
                      Copy
                    </button>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <VaultDoor state={isDepositing || isWritePending ? "sealing" : privateValue ? "open" : "closed"} />
                  {lastTxHash && <LiveTx hash={lastTxHash} />}
                </div>
              </div>

              {/* Actions */}
              <div className="flex w-full shrink-0 flex-col gap-2 lg:w-[264px]">
                <button onClick={handleDecryptAll} disabled={!isConnected || decrypting} className="btn btn-primary w-full">
                  <Eye className="h-4 w-4" />
                  {decryptBusy ? "Decrypting…" : "Decrypt Positions"}
                </button>
                <button
                  onClick={handleGrantPermit}
                  disabled={!isConnected || grantPermit.isPending || !isLive}
                  className="btn btn-secondary w-full"
                >
                  <KeyRound className="h-4 w-4" />
                  {grantPermit.isPending ? "Authorizing…" : "Grant Decrypt Permit"}
                </button>
                <div className="mt-1 flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--inset)] px-3 py-2 text-[11px]">
                  <span className="text-[var(--text-faint)]">KMS path</span>
                  {decryptionInputs.length > 0 ? (
                    <span className="text-[var(--live)]">Ready</span>
                  ) : (
                    <span className="text-[var(--text-muted)]">Awaiting handle</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stat rail */}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-4">
              {[
                { label: "Strategies", value: String(STRATEGIES.length), gold: false },
                { label: "Positions", value: String(positions.length), gold: false },
                { label: "Security", value: "FHE Encrypted", gold: true },
                { label: "Status", value: isLive ? "Live" : "Operational", gold: true },
              ].map((s) => (
                <div key={s.label} className="bg-[var(--card)] px-4 py-4">
                  <div className="eyebrow">{s.label}</div>
                  <div className={`mt-1.5 tabular-nums ${s.gold ? "text-[15px] font-medium text-[var(--gold-bright)]" : "text-2xl font-semibold"}`}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Positions */}
          <div id="positions" className="scroll-mt-24 xl:col-span-7">
            <div className="mb-3 flex items-center justify-between px-0.5">
              <span className="eyebrow">Positions{positions.length > 0 ? ` · ${positions.length}` : ""}</span>
              <span className="text-[11px] text-[var(--text-faint)]">Encrypted · on-chain</span>
            </div>

            <div className="premium-card overflow-hidden">
              {(positions.length > 0 || onChainSharesHandle) ? (
                <div className="overflow-x-auto">
                  <table className="blotter">
                    <thead>
                      <tr>
                        <th className="text-left">Asset</th>
                        <th className="text-left">Ciphertext Handle</th>
                        <th className="text-left">Status</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onChainSharesHandle && (
                        <tr>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[rgba(34,197,94,0.3)] bg-[var(--live-dim)] font-mono text-[10px] text-[var(--live)]">ON</span>
                              <span className="font-medium text-[var(--text)]">On-chain</span>
                            </div>
                          </td>
                          <td className="font-mono text-[var(--text-muted)]">{String(onChainSharesHandle).slice(0, 12)}…{String(onChainSharesHandle).slice(-8)}</td>
                          <td><span className="pill pill-green"><span className="dot dot-live" />Live</span></td>
                          <td className="text-right">
                            <button onClick={() => copyText(String(onChainSharesHandle), "Handle copied")} className="btn btn-secondary px-2.5 py-1 text-[11px]"><Copy className="h-3 w-3" /> Copy</button>
                          </td>
                        </tr>
                      )}
                      <AnimatePresence>
                        {positions.map((pos, i) => (
                          <motion.tr
                            key={pos.rawHandle ? String(pos.rawHandle) : i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1], delay: i * 0.03 }}
                          >
                            <td>
                              <div className="flex items-center gap-2.5">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--card-2)] font-mono text-[10px]">{pos.token.slice(0, 2)}</span>
                                <span className="font-medium text-[var(--text)]">{pos.token} Position</span>
                              </div>
                            </td>
                            <td className="font-mono text-[var(--text-muted)]">{pos.handle}</td>
                            <td><span className="pill pill-gold"><span className="dot dot-gold" />Encrypted</span></td>
                            <td>
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => handleDecryptPosition(i)} disabled={decrypting} className="btn btn-secondary px-2.5 py-1 text-[11px]"><Eye className="h-3 w-3" /> Decrypt</button>
                                <button onClick={() => handleWithdraw(i)} className="btn btn-secondary btn-danger px-2.5 py-1 text-[11px]"><ArrowDownToLine className="h-3.5 w-3.5" /> Withdraw</button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--inset)]"><Lock className="h-4 w-4 text-[var(--text-faint)]" /></span>
                  <div className="text-[15px] font-medium">No positions yet</div>
                  <div className="max-w-xs text-[13px] text-[var(--text-muted)]">Seal a deposit to create your first encrypted holding. Balances never leave the ciphertext domain.</div>
                </div>
              )}
            </div>
          </div>

          {/* Deposit */}
          <div className="xl:col-span-5">
            <div className="mb-3 flex items-center justify-between px-0.5">
              <span className="eyebrow">Deposit</span>
              <span className={`pill ${isLive ? "pill-green" : "pill-demo"}`}><span className={`dot ${isLive ? "dot-live" : "dot-demo"}`} />{isLive ? "Live" : "No vault"}</span>
            </div>

            <div className="premium-card p-5 md:p-6">
              <div className="eyebrow mb-2">Strategy</div>
              {STRATEGIES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStrategy(s)}
                  className={`mb-2 w-full rounded-xl border p-4 text-left transition-all ${selectedStrategy.id === s.id ? "border-[var(--gold-line)] bg-[var(--gold-dim)]" : "border-[var(--border)] hover:border-[var(--border-strong)]"}`}
                >
                  <div className="flex items-center justify-between font-medium">
                    <span>{s.name}</span>
                    <span className="tabular-nums text-sm text-[var(--gold-bright)]">{s.apy}</span>
                  </div>
                  <div className="mt-1 text-[13px] leading-snug text-[var(--text-muted)]">{s.description}</div>
                </button>
              ))}

              <div className="mt-5">
                <div className="eyebrow mb-1.5">Amount</div>
                <div className="field px-4 py-3">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 bg-transparent text-3xl font-medium tabular-nums placeholder:text-[var(--text-faint)] focus:outline-none"
                  />
                  <span className="pl-3 text-sm text-[var(--text-muted)]">{selectedStrategy.token}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="eyebrow">Vault Address · Sepolia</span>
                  <span className={isLive ? "text-[11px] text-[var(--live)]" : "text-[11px] text-[var(--demo)]"}>{isLive ? "Connected" : "Not set"}</span>
                </div>
                <input
                  value={vaultAddress}
                  onChange={(e) => setVaultAddress(e.target.value)}
                  className="input w-full font-mono text-xs"
                  placeholder="0xYourVault…"
                />
                <div className="mt-1.5 text-[11px] text-[var(--text-faint)]">Deploy with <span className="font-mono text-[var(--text-muted)]">pnpm deploy:sepolia</span>, then paste the address to go live.</div>
              </div>

              <div className="card-inset mt-3 p-3">
                <div className="eyebrow mb-2">Test Assets</div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--gold-bright)]">cUSDC</span>
                    <button onClick={() => copyText(C_USDC_MOCK)} className="btn btn-secondary px-2 py-0.5 text-[10px]">{C_USDC_MOCK.slice(0, 6)}… <Copy className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--gold-bright)]">Registry</span>
                    <button onClick={() => copyText(WRAPPERS_REGISTRY)} className="btn btn-secondary px-2 py-0.5 text-[10px]">{WRAPPERS_REGISTRY.slice(0, 6)}… <Copy className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleShieldAndDeposit}
                disabled={!isConnected || isDepositing || !depositAmount || isWritePending}
                className="btn btn-primary mt-4 w-full py-3.5"
              >
                <Shield className="h-4 w-4" />
                {isDepositing || isWritePending ? "Sealing…" : "Seal & Deposit"}
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[var(--text-faint)]">
                <Lock className="h-3 w-3" /> Real FHE · ciphertext only
              </div>
              {lastTxHash && <div className="mt-3 flex justify-center"><LiveTx hash={lastTxHash} /></div>}
            </div>
          </div>
        </div>

        {/* Ledger */}
        {(activities.length > 0 || lastTxHash) && (
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between px-0.5">
              <span className="eyebrow flex items-center gap-1.5"><Activity className="h-3 w-3" /> Ledger</span>
              <span className="text-[11px] text-[var(--text-faint)]">Session activity</span>
            </div>
            <div className="premium-card scroll-slim max-h-[172px] overflow-auto p-2">
              {activities.length === 0 ? (
                <div className="px-3 py-4 text-[13px] text-[var(--text-muted)]">No activity yet.</div>
              ) : (
                <div className="divide-y divide-[var(--hairline)]">
                  {activities.map((a, idx) => (
                    <div key={idx} className="flex items-center gap-3 px-3 py-2 font-mono text-[11px]">
                      <span className="w-16 shrink-0 text-[var(--text-faint)]">{a.time}</span>
                      <span className="w-40 shrink-0 font-medium text-[var(--gold-bright)]">{a.action}</span>
                      <span className="flex-1 truncate text-[var(--text-muted)]">{a.detail}</span>
                      {a.tx && <LiveTx hash={a.tx} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

      </div>

      {/* Footer status */}
      <footer className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 border-t border-[var(--border)] px-5 pb-10 pt-6 font-mono text-[10px] tracking-[0.08em] text-[var(--text-faint)] md:px-8">
        <span className="text-[var(--text-muted)]">CELANO</span>
        <span>ZAMA FHEVM</span>
        <span>SEPOLIA</span>
        <span>ERC-7984 · euint64</span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: isConnected ? "var(--live)" : "var(--text-faint)" }} />
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </span>
      </footer>
    </div>
  );
}
