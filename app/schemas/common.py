"""Common schemas used across the application."""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ErrorResponse(BaseModel):
    """Standard error response format."""
    error: str = Field(..., description="Error type")
    detail: str = Field(..., description="Error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""
    limit: int = Field(default=10, ge=1, le=100, description="Number of items to return")
    offset: int = Field(default=0, ge=0, description="Number of items to skip")


class PaginatedResponse(BaseModel):
    """Paginated response wrapper."""
    total: int = Field(..., description="Total number of items")
    limit: int = Field(..., description="Items per page")
    offset: int = Field(..., description="Items skipped")
    has_more: bool = Field(..., description="Whether more items exist")


class SuccessResponse(BaseModel):
    """Standard success response."""
    success: bool = True
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
