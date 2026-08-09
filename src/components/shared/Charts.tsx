"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const CHART_COLORS = ["#2563eb", "#7c3aed", "#059669", "#f59e0b", "#ef4444", "#0891b2", "#d946ef", "#84cc16"];

function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  return {
    isDark,
    axis: isDark ? "#64748b" : "#9ca3af",
    grid: isDark ? "#1e293b" : "#e5e7eb",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipText: isDark ? "#f1f5f9" : "#111827",
  };
}

interface TooltipContentProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload?: Record<string, unknown> }>;
  label?: string;
  formatValue?: (value: number) => string;
}

function ChartTooltip({ active, payload, label, formatValue }: TooltipContentProps) {
  const theme = useChartTheme();
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{ backgroundColor: theme.tooltipBg, borderColor: theme.grid, color: theme.tooltipText }}
    >
      {label && <p className="font-semibold mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: entry.payload?.color as string || CHART_COLORS[i % CHART_COLORS.length] }} />
          {entry.name}: <span className="font-semibold">{formatValue ? formatValue(entry.value) : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

interface SeriesData {
  name: string;
  value: number;
  color?: string;
}

export function StatusPieChart({ data, title }: { data: SeriesData[]; title?: string }) {
  const theme = useChartTheme();

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            labelLine={false}
            fontSize={11}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={<ChartTooltip />}
            contentStyle={{ backgroundColor: "transparent", border: "none" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface LineSeries {
  month: string;
  revenue: number;
}

export function RevenueLineChart({ data, title }: { data: LineSeries[]; title?: string }) {
  const theme = useChartTheme();

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.axis }} />
          <YAxis tick={{ fontSize: 11, fill: theme.axis }} />
          <Tooltip
            content={<ChartTooltip formatValue={(v) => `$${v.toLocaleString()}`} />}
            contentStyle={{ backgroundColor: "transparent", border: "none" }}
          />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyRentalsBarChart({ data, title }: { data: { month: string; count: number }[]; title?: string }) {
  const theme = useChartTheme();

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.axis }} />
          <YAxis tick={{ fontSize: 11, fill: theme.axis }} />
          <Tooltip
            content={<ChartTooltip />}
            contentStyle={{ backgroundColor: "transparent", border: "none" }}
          />
          <Bar dataKey="count" name="Rentals" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryBarChart({ data, title }: { data: { category: string; count: number }[]; title?: string }) {
  const theme = useChartTheme();

  return (
    <div className="w-full">
      {title && <h3 className="font-semibold text-sm mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
          <XAxis type="number" tick={{ fontSize: 11, fill: theme.axis }} />
          <YAxis
            type="category"
            dataKey="category"
            width={110}
            tick={{ fontSize: 11, fill: theme.axis }}
          />
          <Tooltip
            content={<ChartTooltip />}
            contentStyle={{ backgroundColor: "transparent", border: "none" }}
          />
          <Bar dataKey="count" name="Items" fill="#059669" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
