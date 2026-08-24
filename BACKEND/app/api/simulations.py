from fastapi import APIRouter, Query

from app.models.infrastructure import InfrastructureStatus
from app.schemas.infrastructure import (
    AltitudeRangeResponse,
    GeoJsonFeatureCollection,
    InfrastructureFilter,
    KpiResponse,
)
from app.services.simulation_service import SimulationService

router = APIRouter(prefix="/simulations", tags=["simulations"])


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


@router.get("/sea-level/range", response_model=AltitudeRangeResponse)
def get_sea_level_range() -> AltitudeRangeResponse:
    data = SimulationService().get_sea_level_range()
    return AltitudeRangeResponse(**data)


@router.get("/kpis", response_model=KpiResponse)
def get_simulation_kpis(
    sea_level: float = Query(default=0, ge=0),
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> KpiResponse:
    filters = _build_filters(
        status=status,
        type=type,
        city=city,
        neighborhood=neighborhood,
        search=search,
        management=management,
        altitude_min=altitude_min,
        altitude_max=altitude_max,
    )
    return SimulationService().get_kpis(sea_level, filters)


@router.get("/geojson", response_model=GeoJsonFeatureCollection)
def get_simulation_geojson(
    sea_level: float = Query(default=0, ge=0),
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
        status=status,
        type=type,
        city=city,
        neighborhood=neighborhood,
        search=search,
        management=management,
        altitude_min=altitude_min,
        altitude_max=altitude_max,
    )
    return SimulationService().get_geojson(sea_level, filters)
