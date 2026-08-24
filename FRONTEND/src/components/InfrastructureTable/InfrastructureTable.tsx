"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { useInfrastructures } from "@/hooks/useInfrastructureData";
import { useFilters } from "@/hooks/useFilters";
import type { Infrastructure } from "@/types/infrastructure";
import { cn, formatNullable } from "@/utils/cn";
import { getManagementLabel, getTypeIcon, getTypeLabel } from "@/utils/status";

const PAGE_SIZE = 10;
const columnHelper = createColumnHelper<Infrastructure>();

export function InfrastructureTable() {
  const { filters } = useFilters();
  const { data = [], isLoading, isError } = useInfrastructures(filters);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: PAGE_SIZE });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", { header: "Nome" }),
      columnHelper.accessor("type", {
        header: "Tipo",
        cell: (info) => {
          const type = info.getValue();
          return (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden>{getTypeIcon(type)}</span>
              {getTypeLabel(type)}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("city", {
        header: "Cidade",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("neighborhood", {
        header: "Bairro",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("street", {
        header: "Rua",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("number", {
        header: "Número",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("cep", {
        header: "CEP",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("management", {
        header: "Gestão",
        cell: (info) => getManagementLabel(info.getValue()),
      }),
      columnHelper.accessor("latitude", {
        header: "Latitude",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("longitude", {
        header: "Longitude",
        cell: (info) => formatNullable(info.getValue()),
      }),
      columnHelper.accessor("altitude_m_estimada", {
        header: "Altura est. (m)",
        cell: (info) => formatNullable(info.getValue()),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalRows = data.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const from = totalRows === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
  const to = Math.min((pageIndex + 1) * PAGE_SIZE, totalRows);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                  Carregando infraestruturas...
                </td>
              </tr>
            )}
            {isError && !isLoading && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-status-critica">
                  Não foi possível carregar os dados.
                </td>
              </tr>
            )}
            {!isLoading && !isError && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted">
                  Nenhuma infraestrutura encontrada.
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && totalRows > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-slate-600">
          <p>
            Mostrando {from}–{to} de {totalRows}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-medium transition-colors",
                table.getCanPreviousPage()
                  ? "bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed bg-slate-50 text-slate-400",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="min-w-[5rem] text-center tabular-nums">
              {pageIndex + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 font-medium transition-colors",
                table.getCanNextPage()
                  ? "bg-white text-slate-700 hover:bg-slate-50"
                  : "cursor-not-allowed bg-slate-50 text-slate-400",
              )}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
