from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.infrastructure import InfrastructureStatus


class InfrastructureBase(BaseModel):
    name: str = Field(..., max_length=255)
    type: str = Field(..., max_length=100)
    status: InfrastructureStatus = InfrastructureStatus.OK
    latitude: float | None = None
    longitude: float | None = None
    altitude_m: float | None = None
    altitude_m_estimada: float | None = None
    cep: str | None = Field(default=None, max_length=10)
    city: str | None = Field(default=None, max_length=100)
    neighborhood: str | None = Field(default=None, max_length=100)
    street: str | None = Field(default=None, max_length=255)
    number: str | None = Field(default=None, max_length=50)
    management: str | None = Field(default=None, max_length=100)
    source: str | None = Field(default=None, max_length=255)
    source_updated_at: datetime | None = None


class InfrastructureCreate(InfrastructureBase):
    pass


class InfrastructureUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    type: str | None = Field(default=None, max_length=100)
    status: InfrastructureStatus | None = None
    latitude: float | None = None
    longitude: float | None = None
    altitude_m: float | None = None
    altitude_m_estimada: float | None = None
    cep: str | None = Field(default=None, max_length=10)
    city: str | None = Field(default=None, max_length=100)
    neighborhood: str | None = Field(default=None, max_length=100)
    street: str | None = Field(default=None, max_length=255)
    number: str | None = Field(default=None, max_length=50)
    management: str | None = Field(default=None, max_length=100)
    source: str | None = Field(default=None, max_length=255)
    source_updated_at: datetime | None = None


class InfrastructureStatusPatch(BaseModel):
    status: InfrastructureStatus


class InfrastructureRead(InfrastructureBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime | None = None
    updated_at: datetime | None = None


class InfrastructureFilter(BaseModel):
    status: InfrastructureStatus | None = None
    type: str | None = None
    city: str | None = None
    neighborhood: str | None = None
    search: str | None = None
    management: str | None = None
    altitude_min: float | None = None
    altitude_max: float | None = None


class KpiResponse(BaseModel):
    total: int
    ok: int
    alert: int
    critical: int


class AltitudeRangeResponse(BaseModel):
    min: float
    max: float


class GeoJsonFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: list[dict[str, Any]]


class NearbyOrigin(BaseModel):
    cep: str
    latitude: float
    longitude: float
    address: str | None = None


class NearbyByTypeItem(BaseModel):
    type: str
    distance_km: float
    infrastructure: InfrastructureRead


class NearbyByTypeResponse(BaseModel):
    origin: NearbyOrigin
    results: list[NearbyByTypeItem]
