"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboardCharts } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import type { ChartDataPoint } from "@/types/infrastructure";
import { cn } from "@/utils/cn";
import { getManagementLabel, getTypeIcon, getTypeLabel } from "@/utils/status";

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#ca8a04",
  "#475569",
  "#0d9488",
  "#e11d48",
];

const TOP_N = 8;

function formatTypeLabel(point: ChartDataPoint) {
  const label = point.key ? getTypeLabel(point.key) : point.label;
  const icon = point.key ? getTypeIcon(point.key) : "📍";
  return `${icon} ${label}`;
}

function formatManagementLabel(point: ChartDataPoint) {
  return point.key ? getManagementLabel(point.key) : point.label;
}

function withLabels(
  points: ChartDataPoint[],
  formatter: (point: ChartDataPoint) => string = (point) => point.label,
) {
  return points.map((point) => ({
    ...point,
    label: formatter(point),
  }));
}

function topN(points: ChartDataPoint[], limit = TOP_N) {
  return points.slice(0, limit);
}

function chartHeight(itemCount: number, min = 280) {
  return Math.max(min, itemCount * 36 + 32);
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint & { label: string }; value: number }>;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-slate-900">{item.label}</p>
      <p className="text-slate-600">{payload[0].value} infraestruturas</p>
    </div>
  );
}

function ChartCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function EmptyChartState({ message, height = 280 }: { message: string; height?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500"
      style={{ height }}
    >
      {message}
    </div>
  );
}

function LoadingChartState({ height = 280 }: { height?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg bg-slate-50 text-sm text-slate-500"
      style={{ height }}
    >
      Carregando gráfico...
    </div>
  );
}

function HorizontalBarChart({
  data,
  barColor = "#2563eb",
  yWidth = 140,
  height = 280,
}: {
  data: Array<ChartDataPoint & { label: string }>;
  barColor?: string | ((entry: ChartDataPoint & { label: string }, index: number) => string);
  yWidth?: number;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
        <YAxis
          type="category"
          dataKey="label"
          width={yWidth}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "#f8fafc" }} />
        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={entry.key ?? entry.label}
              fill={
                typeof barColor === "function"
                  ? barColor(entry, index)
                  : barColor
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DashboardCharts() {
  const { filters } = useFilters();
  const { data, isLoading, isError } = useDashboardCharts(filters);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {[
          "Infraestruturas por tipo",
          "Infraestruturas por gestão",
          "Infraestruturas por município",
          "Top bairros",
        ].map((title) => (
          <ChartCard key={title} title={title} description="Carregando dados...">
            <LoadingChartState />
          </ChartCard>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-status-critica/30 bg-status-critica/5 px-4 py-6 text-sm text-status-critica">
        Não foi possível carregar os gráficos do dashboard.
      </div>
    );
  }

  const byType = topN(withLabels(data.by_type, formatTypeLabel));
  const byManagement = withLabels(data.by_management, formatManagementLabel);
  const byCity = withLabels(data.by_city);
  const byNeighborhood = topN(withLabels(data.by_neighborhood));

  const typeChartHeight = chartHeight(byType.length);
  const cityChartHeight = chartHeight(byCity.length, 220);
  const neighborhoodChartHeight = chartHeight(byNeighborhood.length);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <ChartCard
        title="Infraestruturas por tipo"
        description="Top 8 categorias críticas no recorte filtrado."
      >
        {byType.length === 0 ? (
          <EmptyChartState
            message="Nenhuma infraestrutura para os filtros atuais."
            height={typeChartHeight}
          />
        ) : (
          <HorizontalBarChart
            data={byType}
            yWidth={168}
            height={typeChartHeight}
            barColor={(_, index) => CHART_COLORS[index % CHART_COLORS.length]}
          />
        )}
      </ChartCard>

      <ChartCard
        title="Infraestruturas por gestão"
        description="Participação por esfera administrativa (estadual, municipal, federal)."
      >
        {byManagement.length === 0 ? (
          <EmptyChartState message="Nenhuma infraestrutura para os filtros atuais." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={byManagement}
                dataKey="value"
                nameKey="label"
                cx="38%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {byManagement.map((entry, index) => (
                  <Cell
                    key={entry.key ?? entry.label}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={10}
                formatter={(value: string) => (
                  <span className="text-sm text-slate-700">{value}</span>
                )}
              />
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard
        title="Infraestruturas por município"
        description="Concentração territorial das infraestruturas monitoradas."
      >
        {byCity.length === 0 ? (
          <EmptyChartState
            message="Nenhuma infraestrutura para os filtros atuais."
            height={cityChartHeight}
          />
        ) : (
          <HorizontalBarChart
            data={byCity}
            yWidth={108}
            height={cityChartHeight}
            barColor="#2563eb"
          />
        )}
      </ChartCard>

      <ChartCard
        title="Top bairros"
        description="Oito bairros com maior número de infraestruturas no recorte atual."
      >
        {byNeighborhood.length === 0 ? (
          <EmptyChartState
            message="Nenhuma infraestrutura para os filtros atuais."
            height={neighborhoodChartHeight}
          />
        ) : (
          <HorizontalBarChart
            data={byNeighborhood}
            yWidth={108}
            height={neighborhoodChartHeight}
            barColor="#0891b2"
          />
        )}
      </ChartCard>
    </div>
  );
}
