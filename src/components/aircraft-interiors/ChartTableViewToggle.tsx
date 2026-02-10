import { useState } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChartTableViewToggleProps {
  children: React.ReactNode;
  tableContent: React.ReactNode;
}

export function ChartTableViewToggle({ children, tableContent }: ChartTableViewToggleProps) {
  const [view, setView] = useState<"chart" | "table">("chart");

  return (
    <div className="relative">
      <div className="absolute right-12 top-0 z-10">
        <div className="flex items-center rounded-lg border border-border bg-secondary/50 p-0.5">
          <button
            onClick={() => setView("chart")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
              view === "chart"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Chart view"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
              view === "table"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Table view"
          >
            <Table2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        {view === "chart" ? (
          <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        ) : (
          <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tableContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DataTableProps {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: (string | number)[][];
}

export function DataTable({ title, subtitle, headers, rows }: DataTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className={`px-4 sm:px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-secondary/20 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className={`px-4 sm:px-6 py-3 text-sm ${
                      cellIdx === 0
                        ? "text-left font-medium text-foreground"
                        : "text-right font-mono text-muted-foreground"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
