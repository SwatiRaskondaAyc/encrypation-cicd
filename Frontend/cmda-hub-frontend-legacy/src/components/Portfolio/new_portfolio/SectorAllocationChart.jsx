import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

// Vibrant color palette for sectors
const SECTOR_COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f59e0b", // Amber
  "#10b981", // Emerald
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#a855f7", // Violet
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#84cc16", // Lime
];

const SectorAllocationChart = ({ holdings }) => {
  // Prepare sector data from holdings
  const sectorData = useMemo(() => {
    console.log("SectorAllocationChart: Input holdings:", holdings);

    if (!holdings || holdings.length === 0) {
      console.log("SectorAllocationChart: No holdings provided");
      return [];
    }

    const sectorMap = {};
    let totalValue = 0;
    let missingSectorCount = 0;

    holdings.forEach((h, index) => {
      console.log(`Processing holding ${index}:`, h);

      // Calculate market value - try multiple field names
      const qty = parseFloat(
        h["Remaining Qty"] ||
        h.remaining_qty ||
        h.quantity ||
        h.Qty ||
        h.qty ||
        0
      );
      const price = parseFloat(
        h.current_price ||
        h.Close ||
        h.Price ||
        h["Market Price"] ||
        h.price ||
        0
      );

      // If we can't get price*qty, try direct market value field
      let value = qty * price;
      if (value === 0 || isNaN(value)) {
        value = parseFloat(h["Market Value"] || h.market_value || h.value || 0);
      }

      console.log(`  Qty: ${qty}, Price: ${price}, Value: ${value}`);

      if (value > 0) {
        // Get sector from various possible fields
        const sector = h.Sector || h.sector || h.Industry || h.industry || null;

        if (sector) {
          sectorMap[sector] = (sectorMap[sector] || 0) + value;
          totalValue += value;
        } else {
          // Count stocks without sector info
          missingSectorCount++;
          // Group them under "Other"
          sectorMap["Other / Uncategorized"] =
            (sectorMap["Other / Uncategorized"] || 0) + value;
          totalValue += value;
        }
      }
    });

    console.log("SectorAllocationChart: Sector map:", sectorMap);
    console.log("SectorAllocationChart: Total value:", totalValue);
    console.log(
      "SectorAllocationChart: Missing sector count:",
      missingSectorCount
    );

    if (totalValue === 0) {
      console.log(
        "SectorAllocationChart: Total value is 0 - likely missing price/qty data"
      );
      return [];
    }

    const data = Object.keys(sectorMap)
      .map((sector) => ({
        name: sector,
        value: sectorMap[sector],
        percent: ((sectorMap[sector] / totalValue) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value);

    console.log("SectorAllocationChart: Final prepared data:", data);
    return data;
  }, [holdings]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 text-white p-2 rounded-lg shadow-xl text-xs border border-slate-700">
          <p className="font-bold mb-1">{payload[0].name}</p>
          <div className="flex justify-between gap-4">
            <span className="opacity-70">Value:</span>
            <span className="font-mono">
              ₹
              {new Intl.NumberFormat("en-IN").format(
                Math.round(payload[0].value)
              )}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="opacity-70">Share:</span>
            <span className="font-mono">{payload[0].payload.percent}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (sectorData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              Sector Allocation
            </h3>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {sectorData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SECTOR_COLORS[index % SECTOR_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend - Top 4 sectors */}
        <div className="mt-3 space-y-1.5">
          {sectorData.slice(0, 4).map((d, i) => (
            <div
              key={d.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: SECTOR_COLORS[i % SECTOR_COLORS.length],
                  }}
                />
                <span className="text-gray-600 dark:text-gray-400 font-medium truncate">
                  {d.name}
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-500 font-mono font-semibold">
                {d.percent}%
              </span>
            </div>
          ))}
          {sectorData.length > 4 && (
            <div className="text-[10px] text-gray-400 dark:text-gray-500 italic text-center pt-1">
              +{sectorData.length - 4} more sectors
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectorAllocationChart;
