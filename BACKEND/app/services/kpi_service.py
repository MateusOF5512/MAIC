from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.infrastructure import InfrastructureFilter, KpiResponse


class KpiService:
    def __init__(self, repository: JsonInfrastructureRepository | None = None) -> None:
        self.repository = repository or JsonInfrastructureRepository()

    def get_kpis(self, filters: InfrastructureFilter | None = None) -> KpiResponse:
        counts = self.repository.count_by_status(filters)
        return KpiResponse(**counts)
