#!/usr/bin/env python3
"""Deploy WhalePredictor.sol to BSC Testnet (chainId 97)."""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from solcx import compile_standard, install_solc
from web3 import Web3

ROOT = Path(__file__).resolve().parents[1]
CONTRACT_PATH = ROOT / "contracts" / "WhalePredictor.sol"


def _load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        raise RuntimeError(".env not found. Create it from .env.example and fill required values.")
    load_dotenv(env_path)


def _required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def main() -> int:
    _load_env()

    rpc_url = os.getenv("BSC_TESTNET_RPC_URL", "").strip() or os.getenv(
        "BSC_RPC_URL", "https://data-seed-prebsc-1-s1.binance.org:8545/"
    )
    private_key = _required("CONTRACT_PRIVATE_KEY")

    w3 = Web3(Web3.HTTPProvider(rpc_url))
    if not w3.is_connected():
        raise RuntimeError(f"Cannot connect to RPC: {rpc_url}")

    chain_id = w3.eth.chain_id
    if chain_id != 97:
        raise RuntimeError(
            f"Connected to wrong chainId {chain_id}. Expected 97 (BSC Testnet). "
            "Set BSC_TESTNET_RPC_URL/BSC_RPC_URL to a testnet endpoint."
        )

    account = w3.eth.account.from_key(private_key)
    balance_wei = w3.eth.get_balance(account.address)
    balance_bnb = w3.from_wei(balance_wei, "ether")
    if balance_bnb <= 0:
        raise RuntimeError(
            f"Deployer {account.address} has 0 tBNB on BSC testnet. Fund from faucet first."
        )

    print(f"Connected chainId: {chain_id}")
    print(f"Deployer: {account.address}")
    print(f"Balance: {balance_bnb} tBNB")

    source = CONTRACT_PATH.read_text(encoding="utf-8")
    install_solc("0.8.20")

    compiled = compile_standard(
        {
            "language": "Solidity",
            "sources": {"WhalePredictor.sol": {"content": source}},
            "settings": {
                "optimizer": {"enabled": True, "runs": 200},
                "outputSelection": {
                    "*": {
                        "*": [
                            "abi",
                            "evm.bytecode",
                            "evm.deployedBytecode",
                        ]
                    }
                },
            },
        },
        solc_version="0.8.20",
    )

    artifact = compiled["contracts"]["WhalePredictor.sol"]["WhalePredictor"]
    abi = artifact["abi"]
    bytecode = artifact["evm"]["bytecode"]["object"]

    contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    nonce = w3.eth.get_transaction_count(account.address)
    gas_price = w3.eth.gas_price

    tx = contract.constructor().build_transaction(
        {
            "from": account.address,
            "nonce": nonce,
            "chainId": chain_id,
            "gasPrice": gas_price,
        }
    )

    gas_estimate = w3.eth.estimate_gas(tx)
    tx["gas"] = int(gas_estimate * 1.2)

    signed = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed.raw_transaction)
    print(f"Deployment tx: 0x{tx_hash.hex()}")
    print("Waiting for receipt...")

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=180)
    if receipt.status != 1:
        raise RuntimeError(f"Deployment failed. Receipt status: {receipt.status}")

    contract_address = receipt.contractAddress
    print(f"Contract deployed: {contract_address}")
    print(f"Block: {receipt.blockNumber}")
    print(f"Gas used: {receipt.gasUsed}")
    print(f"BscScan: https://testnet.bscscan.com/address/{contract_address}")

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}")
        raise SystemExit(1)
