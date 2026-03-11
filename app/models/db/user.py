"""User and API key database models."""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import secrets
from app.core.database import Base
from app.core.pricing import PricingTier


class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(255), nullable=True)

    # Web3 wallet (if user signed up with wallet)
    wallet_address = Column(String(42), unique=True, nullable=True, index=True)

    # Status
    is_active = Column(Boolean, default=True)
    is_email_verified = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    subscriptions = relationship("Subscription", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class APIKey(Base):
    """API key model for authentication."""
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # API key (stored hashed in production)
    key = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)  # User-friendly name

    # Status
    is_active = Column(Boolean, default=True)

    # Limits (can override subscription defaults)
    rate_limit_override = Column(Integer, nullable=True)  # Requests per minute
    monthly_quota_override = Column(Integer, nullable=True)  # Total monthly calls

    # Usage tracking (cached, real usage in Redis)
    current_month_calls = Column(Integer, default=0)
    total_calls_lifetime = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_used_at = Column(DateTime(timezone=True), nullable=True)
    expires_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="api_keys")

    @staticmethod
    def generate_key() -> str:
        """Generate a new API key."""
        # Format: sai_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX (40 chars + prefix)
        prefix = "sai_"  # "saucy ai" prefix
        random_key = secrets.token_urlsafe(30)  # ~40 characters after encoding
        return f"{prefix}{random_key}"

    def __repr__(self):
        return f"<APIKey(id={self.id}, name={self.name}, key={self.key[:12]}...)>"


class Subscription(Base):
    """Subscription model."""
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    # Subscription details
    tier = Column(SQLEnum(PricingTier), nullable=False, index=True)
    status = Column(String(50), nullable=False, default="active", index=True)  # active, canceled, expired, past_due
    billing_period = Column(String(20), nullable=False)  # monthly, yearly

    # Pricing
    amount_usd = Column(Integer, nullable=False)  # Amount in cents
    currency = Column(String(3), default="USD")

    # Payment provider
    provider = Column(String(50), nullable=False)  # stripe, inxy, payram, binance
    provider_subscription_id = Column(String(255), nullable=True, index=True)  # External subscription ID
    provider_customer_id = Column(String(255), nullable=True)  # External customer ID

    # Billing cycle
    current_period_start = Column(DateTime(timezone=True), nullable=False)
    current_period_end = Column(DateTime(timezone=True), nullable=False)

    # Cancellation
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscriptions")
    payments = relationship("Payment", back_populates="subscription", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Subscription(id={self.id}, tier={self.tier}, status={self.status})>"


class Payment(Base):
    """Payment transaction model."""
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    subscription_id = Column(Integer, ForeignKey("subscriptions.id", ondelete="SET NULL"), nullable=True, index=True)

    # Payment details
    amount = Column(Integer, nullable=False)  # Amount in smallest currency unit (cents or wei)
    currency = Column(String(10), nullable=False)  # USD, USDC, USDT, ETH, BTC
    status = Column(String(50), nullable=False, default="pending", index=True)  # pending, completed, failed, refunded

    # Payment method
    payment_method = Column(String(50), nullable=False)  # stripe_card, stripe_crypto, inxy, payram, binance_pay
    provider = Column(String(50), nullable=False)  # stripe, inxy, payram, binance
    provider_payment_id = Column(String(255), nullable=True, unique=True, index=True)  # External payment ID

    # Crypto-specific fields
    blockchain = Column(String(50), nullable=True)  # ethereum, polygon, base, bsc, bitcoin
    tx_hash = Column(String(66), nullable=True, unique=True, index=True)  # Transaction hash
    from_address = Column(String(42), nullable=True)  # Payer's wallet
    to_address = Column(String(42), nullable=True)  # Receiving wallet

    # Metadata
    description = Column(String(500), nullable=True)
    metadata = Column(String(1000), nullable=True)  # JSON string for additional data

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)
    refunded_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="payments")
    subscription = relationship("Subscription", back_populates="payments")

    def __repr__(self):
        return f"<Payment(id={self.id}, amount={self.amount}, currency={self.currency}, status={self.status})>"


class UsageLog(Base):
    """API usage log for detailed analytics."""
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    api_key = Column(String(64), ForeignKey("api_keys.key", ondelete="CASCADE"), nullable=False, index=True)

    # Request details
    endpoint = Column(String(255), nullable=False, index=True)
    method = Column(String(10), nullable=False)  # GET, POST, etc.
    status_code = Column(Integer, nullable=False)

    # Cost
    cost_units = Column(Integer, default=1)

    # Performance
    response_time_ms = Column(Integer, nullable=True)

    # Metadata
    ip_address = Column(String(45), nullable=True)  # Support IPv6
    user_agent = Column(String(500), nullable=True)

    # Timestamp
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    def __repr__(self):
        return f"<UsageLog(endpoint={self.endpoint}, timestamp={self.timestamp})>"
