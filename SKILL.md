# Aether — Build Skill (inspired by tushaarmehtaa/tushar-skills)

High bar, no slop, ship something that can actually win.

## Core Principles (applied here)

- **Remove AI slop**: Every line of UI copy is tight, specific, and human. No "revolutionary", "seamless", gradient hero walls of text, or filler adjectives. Benefits first. Privacy is explained plainly.

- **Pre-flight before anything ships**: `pnpm pre-flight` (typecheck + lint) must pass. Contracts compile cleanly. No secrets in code. Real error states exist.

- **Premium UI by default**: This is not a demo. Dark, modern, fast, accessible. Clear hierarchy, excellent states (loading skeletons, empty, error, success), delightful micro-interactions. Privacy is a first-class visual (badges, decrypt affordances).

- **Real composability**: We use the official Zama Wrappers Registry + ERC-7984 confidentialTransferAndCall pattern. We compose with the live confidential DeFi story (cUSDC wrappers + yield).

- **Correct FHE ACL discipline**: Transient where possible, explicit allow for users, never make sensitive aggregates publicly decryptable without intent.

- **Launch ready thinking**: Vercel deploy, Sepolia contracts, clear README, video script ready, submission assets prepared.

- **One logical change per step**: We ship working vertical slices.

## How we used the skill on this project

- Adopted pre-flight script.
- Wrote crisp marketing + in-app copy.
- Built the vault using the modern receiver pattern from current Zama examples.
- Frontend is a full dashboard experience, not a toy form.
- Every decrypt and encrypted input goes through the official SDK.

If you're an agent working on this: run pre-flight before suggesting a "final" version. Strip any generic language. Make the UI feel like a real product that institutions would look at twice.

## Quick commands

```bash
pnpm pre-flight
pnpm dev
```

Target: Builder Track 1st place — Zama Developer Program Mainnet Season 3.

Deadline: July 7 2026 23:59 AOE.

No excuses. Ship clean.
