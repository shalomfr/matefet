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
    <div className="glass-card overflow-hidden">
      {title && (
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="text-base font-bold text-[#1e1b3a]">{title}</h3>
          {action}
        </div>
      )}
      <div className="overflow-x-auto p-5">
        <table className="glass-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
                <td>
                  <button className="p-1 rounded-lg hover:bg-white/60 text-[#9b98b8]">
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
