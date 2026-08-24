from typing import Any

from app.database.connection import get_infrastructure_repository
from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.infrastructure import GeoJsonFeatureCollection, InfrastructureFilter


class GeoService:
    def __init__(self, repository: JsonInfrastructureRepository | None = None) -> None:
        self.repository = repository or get_infrastructure_repository()

    def get_geojson(self, filters: InfrastructureFilter | None = None) -> GeoJsonFeatureCollection:
        records = self.repository.list_all(filters)
        features: list[dict[str, Any]] = []

        for record in records:
            latitude = record.get("latitude")
            longitude = record.get("longitude")
            if latitude is None or longitude is None:
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
                        "latitude": latitude,
                        "longitude": longitude,
                        "altitude_m": record.get("altitude_m"),
                        "altitude_m_estimada": record.get("altitude_m_estimada"),
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
