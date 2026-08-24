from fastapi import APIRouter, Query

from app.models.infrastructure import InfrastructureStatus
from app.schemas.infrastructure import InfrastructureFilter, KpiResponse
from app.services.kpi_service import KpiService

router = APIRouter(prefix="/kpis", tags=["kpis"])


@router.get("", response_model=KpiResponse)
def get_kpis(
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> KpiResponse:
    filters = InfrastructureFilter(
        status=status,
        type=type,
        city=city,
        neighborhood=neighborhood,
        search=search,
        management=management,
        altitude_min=altitude_min,
        altitude_max=altitude_max,
    )
    return KpiService().get_kpis(filters)
