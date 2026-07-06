// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {ConfidentialFHEVMConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IERC7984Receiver} from "@openzeppelin/confidential-contracts/interfaces/IERC7984Receiver.sol";
import {IERC7984} from "@openzeppelin/confidential-contracts/interfaces/IERC7984.sol";

/**
 * Celano — Confidential Yield Vault (The Castle)
 * 
 * The innermost treasury. Accepts encrypted ERC-7984 deposits via confidentialTransferAndCall.
 * All positions (shares) remain fully encrypted.
 * Only the owner can decrypt.
 *
 * Built for the Zama Developer Program — Mainnet Season 3.
 * Castle-grade privacy. Industry execution.
 */
contract ConfidentialYieldVault is ConfidentialFHEVMConfig, IERC7984Receiver {
    // The confidential token this vault accepts (e.g. cUSDC mock on Sepolia)
    IERC7984 public immutable TOKEN;

    // Encrypted shares per user: euint64 handle
    mapping(address => euint64) private _shares;

    // Encrypted total shares (for future proportional yield distribution)
    euint64 private _totalShares;

    event Deposit(address indexed user, bytes32 sharesHandle);
    event Withdraw(address indexed user, bytes32 amountHandle);

    error ZeroAddress();
    error NothingToWithdraw();

    constructor(address token) {
        require(token != address(0), ZeroAddress());
        TOKEN = IERC7984(token);

        // Make totalShares decryptable by contract for internal math
        FHE.allowThis(_totalShares);
    }

    /**
     * Callback from ERC7984 confidentialTransferAndCall.
     * msg.sender must be the TOKEN.
     * data = abi.encode(beneficiary)
     */
    function onConfidentialTransferReceived(
        address operator,
        address from,
        euint64 amount,
        bytes memory data
    ) external returns (bool) {
        require(msg.sender == address(TOKEN), "Only token");

        address beneficiary = abi.decode(data, (address));
        if (beneficiary == address(0)) {
            // Refund path: return false to signal reject (amount already transferred in, but we can burn or return logic)
            // For simplicity in MVP we revert on bad beneficiary by returning false + the token handles it.
            return false;
        }

        // Credit the beneficiary with encrypted shares = amount (1:1 for MVP, can evolve to share price)
        _shares[beneficiary] = FHE.add(_shares[beneficiary], amount);
        _totalShares = FHE.add(_totalShares, amount);

        // Grant ACL so the user can later decrypt their position
        FHE.allow(_shares[beneficiary], beneficiary);
        FHE.allowThis(_shares[beneficiary]);
        FHE.allow(_totalShares, address(this));

        emit Deposit(beneficiary, FHE.toBytes32(_shares[beneficiary]));

        return true;
    }

    /**
     * Withdraw the full encrypted position for the caller.
     * Burns the shares and triggers a confidential transfer back.
     */
    function withdraw() external {
        euint64 currentShares = _shares[msg.sender];
        
        // Check if user has anything (using isInitialized or non-zero pattern)
        // For FHE we use a sentinel pattern or allow user to attempt and fail gracefully.
        // Simpler: we let the user call, and if zero the transfer will be zero.

        euint64 toWithdraw = currentShares;

        // Clear position
        _shares[msg.sender] = FHE.asEuint64(0);
        _totalShares = FHE.sub(_totalShares, toWithdraw);

        FHE.allowThis(_totalShares);

        // Transfer the confidential amount back to user
        // Note: In real setup the vault must have been approved or hold the tokens.
        // Because we received via transferAndCall, the vault holds the cTokens.
        TOKEN.confidentialTransfer(msg.sender, toWithdraw);

        emit Withdraw(msg.sender, FHE.toBytes32(toWithdraw));
    }

    /**
     * Returns the caller's encrypted shares (handle).
     * Frontend uses the Zama SDK to request user decryption.
     */
    function sharesOf(address user) external view returns (euint64) {
        return _shares[user];
    }

    /**
     * Public total shares handle. Can be used for aggregate TVL visibility.
     * For full audit, owner or authorized parties can be granted decrypt.
     */
    function totalShares() external view returns (euint64) {
        return _totalShares;
    }

    /**
     * Allow a user to explicitly grant themselves access (in case of re-encryption needs).
     */
    function allowSelf() external {
        FHE.allow(_shares[msg.sender], msg.sender);
    }
}
