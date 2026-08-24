"""Database connection helpers (JSON store today, PostGIS later)."""

from app.database.json_store import JsonStore
from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository

_json_store: JsonStore | None = None
_infrastructure_repository: JsonInfrastructureRepository | None = None


def get_json_store() -> JsonStore:
    global _json_store
    if _json_store is None:
        _json_store = JsonStore()
    return _json_store


def get_infrastructure_repository() -> JsonInfrastructureRepository:
    global _infrastructure_repository
    if _infrastructure_repository is None:
        _infrastructure_repository = JsonInfrastructureRepository(get_json_store())
    return _infrastructure_repository
