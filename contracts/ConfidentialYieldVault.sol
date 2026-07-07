// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.27;

import {FHE, euint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {IERC7984Receiver} from "@openzeppelin/confidential-contracts/interfaces/IERC7984Receiver.sol";
import {IERC7984} from "@openzeppelin/confidential-contracts/interfaces/IERC7984.sol";

/**
 * Celano — ConfidentialYieldVault
 *
 * A confidential yield treasury. Accepts encrypted ERC-7984 deposits via
 * confidentialTransferAndCall and stores each depositor's position as an encrypted
 * euint64 share balance. Positions never appear in plaintext; only the owner can
 * decrypt their own balance via the Zama KMS.
 *
 * Built on the official Zama FHEVM stack (fhevm 0.11 + OpenZeppelin confidential
 * contracts) for the Zama Developer Program — Mainnet Season 3.
 */
contract ConfidentialYieldVault is ZamaEthereumConfig, IERC7984Receiver {
    // The confidential token this vault accepts (e.g. cUSDC mock on Sepolia)
    IERC7984 public immutable TOKEN;

    // Encrypted shares per user: euint64 handle
    mapping(address => euint64) private _shares;

    // Encrypted total shares (for future proportional yield distribution)
    euint64 private _totalShares;

    event Deposit(address indexed user, bytes32 sharesHandle);
    event Withdraw(address indexed user, bytes32 amountHandle);

    error ZeroAddress();

    constructor(address token) {
        require(token != address(0), ZeroAddress());
        TOKEN = IERC7984(token);
    }

    /**
     * Callback from ERC7984 confidentialTransferAndCall.
     * msg.sender must be the TOKEN. `data` is abi.encode(beneficiary).
     * Returns an encrypted boolean; the token refunds the transfer if it decrypts to false.
     */
    function onConfidentialTransferReceived(
        address /* operator */,
        address /* from */,
        euint64 amount,
        bytes calldata data
    ) external returns (ebool) {
        require(msg.sender == address(TOKEN), "Only token");

        address beneficiary = abi.decode(data, (address));
        if (beneficiary == address(0)) {
            // Signal rejection; the token contract handles the refund.
            ebool rejected = FHE.asEbool(false);
            FHE.allow(rejected, msg.sender);
            return rejected;
        }

        // Credit the beneficiary with encrypted shares (1:1 for MVP; can evolve to a share price).
        _shares[beneficiary] = FHE.add(_shares[beneficiary], amount);
        _totalShares = FHE.add(_totalShares, amount);

        // ACL: the vault operates on both handles; the beneficiary may decrypt their own shares.
        FHE.allowThis(_shares[beneficiary]);
        FHE.allow(_shares[beneficiary], beneficiary);
        FHE.allowThis(_totalShares);

        emit Deposit(beneficiary, FHE.toBytes32(_shares[beneficiary]));

        // Success — grant the token ACL to read the encrypted return value.
        ebool ok = FHE.asEbool(true);
        FHE.allow(ok, msg.sender);
        return ok;
    }

    /**
     * Withdraw the full encrypted position for the caller.
     * Clears the shares and triggers a confidential transfer back through the token.
     */
    function withdraw() external {
        euint64 toWithdraw = _shares[msg.sender];

        // Clear the position and decrement the encrypted total.
        _shares[msg.sender] = FHE.asEuint64(0);
        FHE.allowThis(_shares[msg.sender]);
        _totalShares = FHE.sub(_totalShares, toWithdraw);
        FHE.allowThis(_totalShares);

        // The vault holds the cTokens (received via transferAndCall); allow it to move `toWithdraw`.
        FHE.allowThis(toWithdraw);
        FHE.allow(toWithdraw, address(TOKEN));
        TOKEN.confidentialTransfer(msg.sender, toWithdraw);

        emit Withdraw(msg.sender, FHE.toBytes32(toWithdraw));
    }

    /**
     * Returns the caller's encrypted shares (handle).
     * The frontend uses the Zama SDK to request user decryption.
     */
    function sharesOf(address user) external view returns (euint64) {
        return _shares[user];
    }

    /**
     * Public total-shares handle for aggregate visibility.
     */
    function totalShares() external view returns (euint64) {
        return _totalShares;
    }

    /**
     * Re-grant the caller decryption access to their own shares (e.g. after re-encryption).
     */
    function allowSelf() external {
        FHE.allow(_shares[msg.sender], msg.sender);
    }
}
