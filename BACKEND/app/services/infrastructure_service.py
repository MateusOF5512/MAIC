from fastapi import HTTPException, status

from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.infrastructure import (
    AltitudeRangeResponse,
    InfrastructureCreate,
    InfrastructureFilter,
    InfrastructureRead,
    InfrastructureStatusPatch,
    InfrastructureUpdate,
)


class InfrastructureService:
    def __init__(self, repository: JsonInfrastructureRepository | None = None) -> None:
        self.repository = repository or JsonInfrastructureRepository()

    def list_infrastructures(
        self, filters: InfrastructureFilter | None = None
    ) -> list[InfrastructureRead]:
        records = self.repository.list_all(filters)
        return [InfrastructureRead.model_validate(record) for record in records]

    def get_infrastructure(self, infrastructure_id: str) -> InfrastructureRead:
        record = self.repository.get_by_id(infrastructure_id)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Infraestrutura não encontrada",
            )
        return InfrastructureRead.model_validate(record)

    def create_infrastructure(self, data: InfrastructureCreate) -> InfrastructureRead:
        record = self.repository.create(data)
        return InfrastructureRead.model_validate(record)

    def update_infrastructure(
        self, infrastructure_id: str, data: InfrastructureUpdate
    ) -> InfrastructureRead:
        record = self.repository.update(infrastructure_id, data)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Infraestrutura não encontrada",
            )
        return InfrastructureRead.model_validate(record)

    def update_status(
        self, infrastructure_id: str, data: InfrastructureStatusPatch
    ) -> InfrastructureRead:
        record = self.repository.update_status(infrastructure_id, data)
        if record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Infraestrutura não encontrada",
            )
        return InfrastructureRead.model_validate(record)

    def get_filter_options(self) -> dict[str, list[str]]:
        records = self.repository.list_all()
        cities = sorted({r.get("city") for r in records if r.get("city")})
        neighborhoods = sorted({r.get("neighborhood") for r in records if r.get("neighborhood")})
        types = sorted({r.get("type") for r in records if r.get("type")})
        managements = sorted({r.get("management") for r in records if r.get("management")})
        return {
            "cities": cities,
            "neighborhoods": neighborhoods,
            "types": types,
            "managements": managements,
        }

    def get_altitude_range(self) -> AltitudeRangeResponse:
        altitude_range = self.repository.get_altitude_range()
        if altitude_range is None:
            return AltitudeRangeResponse(min=0, max=0)
        return AltitudeRangeResponse(**altitude_range)
