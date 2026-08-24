from collections import Counter

from app.repositories.json_infrastructure_repository import JsonInfrastructureRepository
from app.schemas.dashboard import ChartDataPoint, DashboardChartsResponse
from app.schemas.infrastructure import InfrastructureFilter


class DashboardService:
    def __init__(self, repository: JsonInfrastructureRepository | None = None) -> None:
        self.repository = repository or JsonInfrastructureRepository()

    def get_charts(self, filters: InfrastructureFilter | None = None) -> DashboardChartsResponse:
        records = self.repository.list_all(filters)

        return DashboardChartsResponse(
            by_type=self._aggregate(records, "type", limit=8),
            by_management=self._aggregate(records, "management"),
            by_city=self._aggregate(records, "city"),
            by_neighborhood=self._aggregate(records, "neighborhood", limit=8),
        )

    @staticmethod
    def _aggregate(
        records: list[dict],
        field: str,
        limit: int | None = None,
    ) -> list[ChartDataPoint]:
        counter: Counter[str] = Counter()
        for record in records:
            raw = record.get(field)
            key = str(raw).strip() if raw else "NAO_INFORMADO"
            counter[key] += 1

        items = sorted(counter.items(), key=lambda item: (-item[1], item[0]))
        if limit is not None:
            items = items[:limit]

        return [
            ChartDataPoint(
                key=key,
                label=_format_label(field, key),
                value=value,
            )
            for key, value in items
        ]


def _format_label(field: str, key: str) -> str:
    if key == "NAO_INFORMADO":
        return "Não informado"

    if field == "management":
        return key.replace("_", " ").title()

    if field == "type":
        return key.replace("_", " ").title()

    return key
