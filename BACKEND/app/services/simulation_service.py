from typing import Any

from app.database.record_normalizer import get_record_altitude
from app.models.infrastructure import InfrastructureStatus
from app.database.connection import get_infrastructure_repository
from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.infrastructure import (
    GeoJsonFeatureCollection,
    InfrastructureFilter,
    KpiResponse,
)

SEA_LEVEL_ALERT_MARGIN_M = 1.0


def classify_sea_level_impact(altitude: float | None, sea_level: float) -> str | None:
    if altitude is None:
        return None
    if altitude <= sea_level:
        return InfrastructureStatus.CRITICA.value
    if altitude <= sea_level + SEA_LEVEL_ALERT_MARGIN_M:
        return InfrastructureStatus.ALERTA.value
    return InfrastructureStatus.OK.value


class SimulationService:
    def __init__(self, repository: JsonInfrastructureRepository | None = None) -> None:
        self.repository = repository or get_infrastructure_repository()

    def get_sea_level_range(self) -> dict[str, float]:
        altitude_range = self.repository.get_altitude_range()
        max_altitude = altitude_range["max"] if altitude_range else 35.0
        return {"min": 0.0, "max": max_altitude}

    def get_kpis(
        self, sea_level: float, filters: InfrastructureFilter | None = None
    ) -> KpiResponse:
        records = self.repository.list_all(filters)
        counts = {"total": 0, "ok": 0, "alert": 0, "critical": 0}

        for record in records:
            impact = classify_sea_level_impact(get_record_altitude(record), sea_level)
            if impact is None:
                continue
            counts["total"] += 1
            if impact == InfrastructureStatus.OK.value:
                counts["ok"] += 1
            elif impact == InfrastructureStatus.ALERTA.value:
                counts["alert"] += 1
            elif impact == InfrastructureStatus.CRITICA.value:
                counts["critical"] += 1

        return KpiResponse(**counts)

    def get_geojson(
        self, sea_level: float, filters: InfrastructureFilter | None = None
    ) -> GeoJsonFeatureCollection:
        records = self.repository.list_all(filters)
        features: list[dict[str, Any]] = []

        for record in records:
            latitude = record.get("latitude")
            longitude = record.get("longitude")
            altitude = get_record_altitude(record)
            if latitude is None or longitude is None or altitude is None:
                continue

            simulation_status = classify_sea_level_impact(altitude, sea_level)
            if simulation_status is None:
                continue

            features.append(
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [longitude, latitude],
                    },
                    "properties": {
                        "id": record.get("id"),
                        "name": record.get("name"),
                        "type": record.get("type"),
                        "status": record.get("status"),
                        "simulation_status": simulation_status,
                        "latitude": latitude,
                        "longitude": longitude,
                        "altitude_m": record.get("altitude_m"),
                        "altitude_m_estimada": altitude,
                        "sea_level": sea_level,
                        "management": record.get("management"),
                        "cep": record.get("cep"),
                        "city": record.get("city"),
                        "neighborhood": record.get("neighborhood"),
                        "street": record.get("street"),
                        "number": record.get("number"),
                    },
                }
            )

        return GeoJsonFeatureCollection(features=features)
