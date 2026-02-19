"use client";
import { MoreHorizontal } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  title?: string;
  action?: React.ReactNode;
}

export default function DataTable({ columns, data, title, action }: DataTableProps) {
  return (
    <div className="card-dark overflow-hidden">
      {title && (
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="text-base font-bold text-[--color-text]">{title}</h3>
          {action}
        </div>
      )}
      <div className="overflow-x-auto p-5">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-right p-3 text-[11px] font-semibold text-[--color-muted] uppercase tracking-wider border-b border-[--color-border]"
                >
                  {col.label}
                </th>
              ))}
              <th className="w-10 border-b border-[--color-border]"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="p-3 text-[13px] text-[--color-text] border-b border-white/[0.04]"
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                <td className="p-3 border-b border-white/[0.04]">
                  <button className="p-1 rounded-lg hover:bg-white/5 text-[--color-muted]">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
