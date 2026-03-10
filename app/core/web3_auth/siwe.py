"""
Web3 Authentication Module using Sign-In with Ethereum (SIWE)

Provides wallet-based authentication for dApp integration.
"""

import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from siwe import SiweMessage
from eth_account.messages import encode_defunct
from web3 import Web3
import secrets
import logging

logger = logging.getLogger(__name__)


class Web3Auth:
    """Handle SIWE (Sign-In with Ethereum) authentication"""

    def __init__(self):
        self.nonces: Dict[str, Dict[str, Any]] = {}  # In production, use Redis
        self.w3 = Web3()

    def generate_nonce(self) -> str:
        """Generate a cryptographically secure nonce"""
        return secrets.token_urlsafe(32)

    def create_siwe_message(
        self,
        address: str,
        domain: str,
        uri: str,
        chain_id: int = 1,
        statement: str = "Sign in to AI Whale Service"
    ) -> Dict[str, Any]:
        """
        Create a SIWE message for the user to sign

        Returns:
            dict: Contains nonce and message to sign
        """
        nonce = self.generate_nonce()

        # Store nonce with expiration
        self.nonces[nonce] = {
            'address': address.lower(),
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=10),
        }

        # Create SIWE message
        message = SiweMessage({
            "domain": domain,
            "address": address,
            "statement": statement,
            "uri": uri,
            "version": "1",
            "chainId": chain_id,
            "nonce": nonce,
            "issuedAt": datetime.utcnow().isoformat(),
        })

        return {
            "nonce": nonce,
            "message": message.prepare_message(),
            "expires_at": self.nonces[nonce]['expires_at'].isoformat(),
        }

    def verify_signature(
        self,
        message: str,
        signature: str,
        nonce: str
    ) -> Dict[str, Any]:
        """
        Verify a signed SIWE message

        Returns:
            dict: Contains verification status and user info
        """
        try:
            # Check nonce exists and hasn't expired
            if nonce not in self.nonces:
                return {"verified": False, "error": "Invalid nonce"}

            nonce_data = self.nonces[nonce]
            if datetime.utcnow() > nonce_data['expires_at']:
                del self.nonces[nonce]
                return {"verified": False, "error": "Nonce expired"}

            # Parse SIWE message
            siwe_message = SiweMessage.from_message(message)

            # Verify signature
            recovered_address = self._recover_address(message, signature)

            if not recovered_address:
                return {"verified": False, "error": "Invalid signature"}

            # Check address matches
            if recovered_address.lower() != nonce_data['address']:
                return {"verified": False, "error": "Address mismatch"}

            # Authentication successful
            del self.nonces[nonce]  # Use nonce only once

            return {
                "verified": True,
                "address": recovered_address,
                "chain_id": siwe_message.chain_id,
                "authenticated_at": datetime.utcnow().isoformat(),
            }

        except Exception as e:
            logger.error(f"SIWE verification error: {e}")
            return {"verified": False, "error": str(e)}

    def _recover_address(self, message: str, signature: str) -> Optional[str]:
        """Recover Ethereum address from signature"""
        try:
            message_hash = encode_defunct(text=message)
            address = self.w3.eth.account.recover_message(
                message_hash,
                signature=signature
            )
            return address
        except Exception as e:
            logger.error(f"Address recovery error: {e}")
            return None

    def cleanup_expired_nonces(self):
        """Remove expired nonces (call periodically)"""
        now = datetime.utcnow()
        expired = [
            nonce for nonce, data in self.nonces.items()
            if data['expires_at'] < now
        ]
        for nonce in expired:
            del self.nonces[nonce]

        if expired:
            logger.info(f"Cleaned up {len(expired)} expired nonces")


# Global auth instance
web3_auth = Web3Auth()
