import json
import threading
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from uuid import UUID, uuid4

from app.core.config import get_settings


class JsonStore:
    def __init__(self, file_path: Path | None = None) -> None:
        settings = get_settings()
        self.file_path = file_path or settings.data_file
        self._lock = threading.Lock()
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        if not self.file_path.exists():
            self._write_all([])

    def read_all(self) -> list[dict[str, Any]]:
        with self._lock:
            if not self.file_path.exists():
                return []
            content = self.file_path.read_text(encoding="utf-8").strip()
            if not content:
                return []
            return json.loads(content)

    def write_all(self, records: list[dict[str, Any]]) -> None:
        with self._lock:
            self._write_all(records)

    def _write_all(self, records: list[dict[str, Any]]) -> None:
        self.file_path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = self.file_path.with_suffix(".tmp")
        temp_path.write_text(
            json.dumps(records, ensure_ascii=False, indent=2, default=_json_default),
            encoding="utf-8",
        )
        temp_path.replace(self.file_path)

    def is_empty(self) -> bool:
        return len(self.read_all()) == 0

    @staticmethod
    def new_record(data: dict[str, Any]) -> dict[str, Any]:
        now = datetime.now(UTC).isoformat()
        record = {
            "id": str(uuid4()),
            "created_at": now,
            "updated_at": now,
            **data,
        }
        return record

    @staticmethod
    def touch_record(record: dict[str, Any], updates: dict[str, Any]) -> dict[str, Any]:
        updated = {**record, **updates}
        updated["updated_at"] = datetime.now(UTC).isoformat()
        return updated


def _json_default(value: Any) -> Any:
    if isinstance(value, UUID):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    raise TypeError(f"Object of type {type(value)} is not JSON serializable")
