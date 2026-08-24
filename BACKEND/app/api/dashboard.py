from fastapi import APIRouter, Query

from app.models.infrastructure import InfrastructureStatus
from app.schemas.dashboard import DashboardChartsResponse
from app.schemas.infrastructure import InfrastructureFilter
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


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


@router.get("/charts", response_model=DashboardChartsResponse)
def get_dashboard_charts(
    status: InfrastructureStatus | None = Query(default=None),
    type: str | None = Query(default=None),
    city: str | None = Query(default=None),
    neighborhood: str | None = Query(default=None),
    search: str | None = Query(default=None),
    management: str | None = Query(default=None),
    altitude_min: float | None = Query(default=None),
    altitude_max: float | None = Query(default=None),
) -> DashboardChartsResponse:
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
    return DashboardService().get_charts(filters)
