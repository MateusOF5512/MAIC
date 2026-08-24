"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatCepInput, isCompleteCep } from "@/utils/busca";
import { cn } from "@/utils/cn";

interface CepSearchFormProps {
  onSearch: (cep: string) => { ok: boolean; error?: string };
  isLoading: boolean;
  className?: string;
}

export function CepSearchForm({ onSearch, isLoading, className }: CepSearchFormProps) {
  const [cep, setCep] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setValidationError(null);
    const result = onSearch(cep);
    if (!result.ok) {
      setValidationError(result.error ?? "CEP inválido.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("rounded-xl border border-border bg-white p-4 shadow-sm", className)}
    >
      <h2 className="text-base font-semibold text-slate-900">Busca por Proximidade</h2>
      <p className="mt-1 text-sm text-slate-500">
        Informe seu CEP para encontrar a infraestrutura mais próxima de cada tipo. Use os filtros
        acima para refinar os resultados.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-700">CEP</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="Ex: 88015-270"
            value={cep}
            onChange={(event) => {
              setCep(formatCepInput(event.target.value));
              setValidationError(null);
            }}
            className="h-10 rounded-md border border-border bg-white px-3 text-sm text-slate-900 outline-none ring-slate-400 focus:ring-2"
          />
        </label>

        <Button
          type="submit"
          disabled={!isCompleteCep(cep) || isLoading}
          className="sm:min-w-[140px]"
        >
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? "Pesquisando..." : "Pesquisar"}
        </Button>
      </div>

      {validationError ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      ) : null}
    </form>
  );
}
