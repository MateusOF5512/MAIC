from app.database.connection import get_infrastructure_repository
from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.infrastructure import (
    InfrastructureFilter,
    InfrastructureRead,
    NearbyByTypeItem,
    NearbyByTypeResponse,
    NearbyOrigin,
)
from app.services.geocode_service import GeocodeService
from app.utils.geo import haversine_km


class ProximityService:
    def __init__(
        self,
        repository: JsonInfrastructureRepository | None = None,
        geocode_service: GeocodeService | None = None,
    ) -> None:
        self.repository = repository or get_infrastructure_repository()
        self.geocode_service = geocode_service or GeocodeService()

    def find_nearest_by_type(
        self,
        cep: str,
        filters: InfrastructureFilter | None = None,
    ) -> NearbyByTypeResponse:
        origin = self.geocode_service.geocode_cep(cep)
        records = self.repository.list_all(filters)

        best_by_type: dict[str, NearbyByTypeItem] = {}

        for record in records:
            latitude = record.get("latitude")
            longitude = record.get("longitude")
            infra_type = record.get("type")

            if latitude is None or longitude is None or not infra_type:
                continue

            distance_km = haversine_km(
                origin.latitude,
                origin.longitude,
                latitude,
                longitude,
            )

            current = best_by_type.get(infra_type)
            if current is None or distance_km < current.distance_km:
                best_by_type[infra_type] = NearbyByTypeItem(
                    type=infra_type,
                    distance_km=round(distance_km, 2),
                    infrastructure=InfrastructureRead.model_validate(record),
                )

        results = sorted(best_by_type.values(), key=lambda item: item.distance_km)

        return NearbyByTypeResponse(
            origin=NearbyOrigin(
                cep=origin.cep,
                latitude=origin.latitude,
                longitude=origin.longitude,
                address=origin.address,
            ),
            results=results,
        )
