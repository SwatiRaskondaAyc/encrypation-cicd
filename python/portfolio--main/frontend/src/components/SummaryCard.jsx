import React from "react";
import {
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Activity,
  Info,
} from "lucide-react";

const SummaryCard = ({
  title,
  value,
  isCurrency = false,
  suffix = "",
  colorScale = false,
  highlight = false,
  customIcon,
  customColor,
  onInfoClick, // New prop for modal trigger
  viewDetails = false, // Show bottom button instead of top icon
}) => {
  const formatValue = (val) => {
    if (val === null || val === undefined || isNaN(val)) return "-";

    if (isCurrency) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(val);
    }

    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // Default State
  let valueColor = "text-gray-900";
  let Icon = customIcon || (isCurrency ? IndianRupee : Activity);

  // Color Logic
  if (colorScale) {
    if (value > 0) {
      valueColor = "text-green-600";
      Icon = customIcon || TrendingUp;
    } else if (value < 0) {
      valueColor = "text-red-600";
      Icon = customIcon || TrendingDown;
    } else {
      valueColor = "text-gray-500";
    }
  } else if (highlight) {
    valueColor = "text-blue-600";
  }

  // Custom Color Override (Pastels logic or direct text colors)
  if (customColor === "emerald") valueColor = "text-emerald-600";
  if (customColor === "rose") valueColor = "text-rose-600";
  if (customColor === "violet") valueColor = "text-violet-600";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {title}
              </p>
              {onInfoClick && !viewDetails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInfoClick();
                  }}
                  className="text-gray-400 hover:text-blue-500 transition-colors p-1 -ml-1 rounded-full hover:bg-blue-50"
                >
                  <Info size={14} />
                </button>
              )}
            </div>
          </div>
          <Icon
            size={20}
            className={`${
              colorScale && value !== 0
                ? value > 0
                  ? "text-green-500"
                  : "text-red-500"
                : customColor
                ? `text-${customColor}-500`
                : "text-gray-400"
            }`}
          />
        </div>

        <h2 className={`text-2xl font-bold ${valueColor}`}>
          {isCurrency ? formatValue(value) : `${formatValue(value)}${suffix}`}
        </h2>
      </div>

      {viewDetails && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onInfoClick) onInfoClick();
          }}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors mt-4 pt-4 border-t border-gray-50 w-full"
        >
          <Info size={16} />
          View Details
        </button>
      )}
    </div>
  );
};

export default SummaryCard;
