from typing import Any

from app.database.json_store import JsonStore
from app.database.record_normalizer import get_record_altitude, normalize_records
from app.models.infrastructure import InfrastructureStatus
from app.repositories.infrastructure_repository import InfrastructureRepository
from app.schemas.infrastructure import (
    InfrastructureCreate,
    InfrastructureFilter,
    InfrastructureStatusPatch,
    InfrastructureUpdate,
)


class JsonInfrastructureRepository(InfrastructureRepository):
    def __init__(self, store: JsonStore | None = None) -> None:
        self.store = store or JsonStore()

    def _load_records(self) -> list[dict[str, Any]]:
        return normalize_records(self.store.read_all())

    def list_all(self, filters: InfrastructureFilter | None = None) -> list[dict[str, Any]]:
        return self._apply_filters(self._load_records(), filters)

    def get_by_id(self, infrastructure_id: str) -> dict[str, Any] | None:
        target_id = str(infrastructure_id)
        for record in self._load_records():
            if record.get("id") == target_id:
                return record
        return None

    def create(self, data: InfrastructureCreate) -> dict[str, Any]:
        records = self.store.read_all()
        record = normalize_record_dict(JsonStore.new_record(data.model_dump(mode="json")))
        records.append(record)
        self.store.write_all(records)
        return record

    def update(self, infrastructure_id: str, data: InfrastructureUpdate) -> dict[str, Any] | None:
        records = self.store.read_all()
        target_id = str(infrastructure_id)
        for index, record in enumerate(records):
            if str(record.get("id")) != target_id:
                continue
            updates = data.model_dump(mode="json", exclude_unset=True)
            updated = JsonStore.touch_record(record, updates)
            records[index] = normalize_record_dict(updated)
            self.store.write_all(records)
            return records[index]
        return None

    def update_status(
        self, infrastructure_id: str, data: InfrastructureStatusPatch
    ) -> dict[str, Any] | None:
        return self.update(
            infrastructure_id,
            InfrastructureUpdate(status=data.status),
        )

    def count_by_status(self, filters: InfrastructureFilter | None = None) -> dict[str, int]:
        records = self._apply_filters(self._load_records(), filters)
        counts = {
            "total": len(records),
            "ok": 0,
            "alert": 0,
            "critical": 0,
        }
        for record in records:
            status = record.get("status")
            if status == InfrastructureStatus.OK.value:
                counts["ok"] += 1
            elif status == InfrastructureStatus.ALERTA.value:
                counts["alert"] += 1
            elif status == InfrastructureStatus.CRITICA.value:
                counts["critical"] += 1
        return counts

    def get_altitude_range(self) -> dict[str, float] | None:
        altitudes = [
            altitude
            for altitude in (get_record_altitude(record) for record in self._load_records())
            if altitude is not None
        ]
        if not altitudes:
            return None
        return {"min": min(altitudes), "max": max(altitudes)}

    def replace_all(self, records: list[dict[str, Any]]) -> None:
        self.store.write_all(records)

    def is_empty(self) -> bool:
        return self.store.is_empty()

    @staticmethod
    def _apply_filters(
        records: list[dict[str, Any]], filters: InfrastructureFilter | None
    ) -> list[dict[str, Any]]:
        if filters is None:
            return records

        filtered = records

        if filters.status is not None:
            status_value = filters.status.value
            filtered = [r for r in filtered if r.get("status") == status_value]

        if filters.type is not None:
            type_value = filters.type.strip()
            filtered = [r for r in filtered if r.get("type") == type_value]

        if filters.city:
            city = filters.city.strip().lower()
            filtered = [r for r in filtered if (r.get("city") or "").lower() == city]

        if filters.neighborhood:
            neighborhood = filters.neighborhood.strip().lower()
            filtered = [
                r for r in filtered if (r.get("neighborhood") or "").lower() == neighborhood
            ]

        if filters.management:
            management = filters.management.strip().upper()
            filtered = [
                r for r in filtered if (r.get("management") or "").upper() == management
            ]

        if filters.altitude_min is not None or filters.altitude_max is not None:
            min_alt = filters.altitude_min
            max_alt = filters.altitude_max
            filtered = [
                r
                for r in filtered
                if (altitude := get_record_altitude(r)) is not None
                and (min_alt is None or altitude >= min_alt)
                and (max_alt is None or altitude <= max_alt)
            ]

        if filters.search:
            term = filters.search.strip().lower()
            filtered = [
                r
                for r in filtered
                if term in (r.get("name") or "").lower()
                or term in (r.get("city") or "").lower()
                or term in (r.get("neighborhood") or "").lower()
                or term in (r.get("street") or "").lower()
                or term in (r.get("type") or "").lower()
                or term in (r.get("management") or "").lower()
            ]

        return filtered


def normalize_record_dict(record: dict[str, Any]) -> dict[str, Any]:
    return normalize_records([record])[0]
