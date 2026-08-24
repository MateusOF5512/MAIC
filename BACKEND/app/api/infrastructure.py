from fastapi import APIRouter, Query

from app.models.infrastructure import InfrastructureStatus
from app.schemas.infrastructure import (
    AltitudeRangeResponse,
    GeoJsonFeatureCollection,
    InfrastructureCreate,
    InfrastructureFilter,
    InfrastructureRead,
    InfrastructureStatusPatch,
    InfrastructureUpdate,
    NearbyByTypeResponse,
)
from app.services.geo_service import GeoService
from app.services.infrastructure_service import InfrastructureService
from app.services.proximity_service import ProximityService

router = APIRouter(prefix="/infrastructures", tags=["infrastructures"])


def _build_filters(
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> InfrastructureFilter:
    return InfrastructureFilter(
        status=status,
        type=type,
        city=city,
        neighborhood=neighborhood,
        search=search,
        management=management,
        altitude_min=altitude_min,
        altitude_max=altitude_max,
    )


@router.get("/geojson", response_model=GeoJsonFeatureCollection)
def get_infrastructures_geojson(
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> GeoJsonFeatureCollection:
    filters = _build_filters(
        status,
        type,
        city,
        neighborhood,
        search,
        management,
        altitude_min,
        altitude_max,
    )
    return GeoService().get_geojson(filters)


@router.get("/options/filters")
def get_filter_options() -> dict[str, list[str]]:
    return InfrastructureService().get_filter_options()


@router.get("/options/altitude", response_model=AltitudeRangeResponse)
def get_altitude_range() -> AltitudeRangeResponse:
    return InfrastructureService().get_altitude_range()


@router.get("/nearby-by-type", response_model=NearbyByTypeResponse)
def get_nearby_by_type(
    cep: str = Query(..., min_length=8, max_length=10),
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> NearbyByTypeResponse:
    filters = _build_filters(
        status,
        type,
        city,
        neighborhood,
        search,
        management,
        altitude_min,
        altitude_max,
    )
    return ProximityService().find_nearest_by_type(cep, filters)


@router.get("", response_model=list[InfrastructureRead])
def list_infrastructures(
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> list[InfrastructureRead]:
    filters = _build_filters(
        status,
        type,
        city,
        neighborhood,
        search,
        management,
        altitude_min,
        altitude_max,
    )
    return InfrastructureService().list_infrastructures(filters)


@router.get("/{infrastructure_id}", response_model=InfrastructureRead)
def get_infrastructure(infrastructure_id: str) -> InfrastructureRead:
    return InfrastructureService().get_infrastructure(infrastructure_id)


@router.post("", response_model=InfrastructureRead, status_code=201)
def create_infrastructure(data: InfrastructureCreate) -> InfrastructureRead:
    return InfrastructureService().create_infrastructure(data)


@router.put("/{infrastructure_id}", response_model=InfrastructureRead)
def update_infrastructure(
    infrastructure_id: str, data: InfrastructureUpdate
) -> InfrastructureRead:
    return InfrastructureService().update_infrastructure(infrastructure_id, data)


@router.patch("/{infrastructure_id}/status", response_model=InfrastructureRead)
def patch_infrastructure_status(
    infrastructure_id: str, data: InfrastructureStatusPatch
) -> InfrastructureRead:
    return InfrastructureService().update_status(infrastructure_id, data)
