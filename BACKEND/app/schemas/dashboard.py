from pydantic import BaseModel


class ChartDataPoint(BaseModel):
    label: str
    value: int
    key: str | None = None


class DashboardChartsResponse(BaseModel):
    by_type: list[ChartDataPoint]
    by_management: list[ChartDataPoint]
    by_city: list[ChartDataPoint]
    by_neighborhood: list[ChartDataPoint]
