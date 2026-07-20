"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { Play, X } from "lucide-react";

interface Column {
  header: string;
  accessor: string;
}

interface ReportCardProps {
  title: string;
  description: string;
  columns: Column[];
  onRun: () => Promise<any[]>;
}

export function ReportCard({
  title,
  description,
  columns,
  onRun,
}: ReportCardProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState(false);

  const handleRun = async () => {
    try {
      setLoading(true);
      setError(null);
      const results = await onRun();
      setData(results);
      setHasRun(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to run report";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setData([]);
    setHasRun(false);
    setError(null);
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          {hasRun && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              aria-label="Clear results"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleRun}
            disabled={loading}
            size="sm"
            aria-label={`Run ${title}`}
          >
            <Play className="h-4 w-4 mr-2" />
            {loading ? "Running..." : "Run Report"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {hasRun && !loading && !error && (
        <div className="mt-4">
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <DataTable data={data} columns={columns} />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {data.length} {data.length === 1 ? "result" : "results"}
          </p>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="text-sm text-muted-foreground mt-2">Running report...</p>
        </div>
      )}
    </div>
  );
}
