from datetime import UTC, datetime
from typing import Any


def get_record_altitude(record: dict[str, Any]) -> float | None:
    value = record.get("altitude_m_estimada")
    if value is None:
        value = record.get("altitude_m")
    if value is None:
        return None
    return float(value)


def normalize_record(raw: dict[str, Any]) -> dict[str, Any]:
    altitude = get_record_altitude(raw)
    now = datetime.now(UTC).isoformat()

    normalized: dict[str, Any] = {
        **raw,
        "id": str(raw.get("id")),
        "altitude_m_estimada": altitude,
        "altitude_m": raw.get("altitude_m", altitude),
        "management": raw.get("management"),
        "source": raw.get("source"),
        "source_updated_at": raw.get("source_updated_at"),
        "created_at": raw.get("created_at") or now,
        "updated_at": raw.get("updated_at") or now,
    }
    return normalized


def normalize_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [normalize_record(record) for record in records]
