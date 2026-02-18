import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Trash2,
  X,
  Layers,
  PenTool,
  Activity,
  CandlestickChart,
  Settings,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { PatternRegistry } from "./Data/PatternRegistry";

const LayerSection = ({
  title,
  icon: Icon,
  count,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Icon className="w-4 h-4 text-slate-500" />
          <span>{title}</span>
          {count > 0 && (
            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="bg-slate-50/50 pb-2">{children}</div>}
    </div>
  );
};

const LayerItem = ({
  label,
  subLabel,
  onDelete,
  onEdit,
  onToggleVisibility,
  isVisible = true,
  icon: Icon,
  color,
}) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-100 group transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="p-1.5 rounded border border-slate-200"
          style={{ backgroundColor: color || "white" }}
        >
          {Icon ? (
            <Icon
              className="w-3.5 h-3.5"
              style={{ color: color ? "white" : "#64748b" }}
            />
          ) : (
            <Activity
              className="w-3.5 h-3.5"
              style={{ color: color ? "white" : "#64748b" }}
            />
          )}
        </div>
        <div className="truncate">
          <div
            className="text-xs font-medium text-slate-700 truncate"
            title={label}
          >
            {label}
          </div>
          {subLabel && (
            <div className="text-[10px] text-slate-400 truncate">
              {subLabel}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className={`p-1.5 rounded transition-all ${
              isVisible
                ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
            } opacity-0 group-hover:opacity-100`}
            title={isVisible ? "Hide" : "Show"}
          >
            {isVisible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
            title="Edit Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const INDICATOR_LEVELS = {
  RSI: [30, 70],
  CCI: [-100, 100],
  WILLR: [-20, -80],
  STOCH: [20, 80],
  StochRSI: [20, 80],
  DeM: [0.3, 0.7],
  UO: [30, 50, 70],
  MFI: [20, 80],
  ROC: [0],
  AO: [0],
  TRIX: [0],
};

// Inline settings editor for indicators
const IndicatorSettingsEditor = ({ indicator, onSave, onCancel }) => {
  const [params, setParams] = useState({ ...indicator.params });
  const [color, setColor] = useState(indicator.color || "#2962FF");
  const [lineWidth, setLineWidth] = useState(indicator.lineWidth || 1);

  // Levels Logic
  const defaultLevels = INDICATOR_LEVELS[indicator.id] || [];
  const currentLevels = indicator.params?.levels || defaultLevels;
  const [levelsStr, setLevelsStr] = useState(
    Array.isArray(currentLevels) ? currentLevels.join(", ") : ""
  );

  const handleParamChange = (key, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setParams((prev) => ({ ...prev, [key]: numValue }));
    }
  };

  const handleSave = () => {
    const finalLevels = levelsStr
      .split(",")
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));

    onSave({
      ...indicator,
      params: { ...params, levels: finalLevels },
      color,
      lineWidth,
    });
  };

  // Define editable params based on indicator type
  const getEditableParams = () => {
    const editableFields = [];

    // Period-based indicators
    if (params.period !== undefined) {
      editableFields.push({ key: "period", label: "Period", type: "number" });
    }
    // MACD-style
    if (params.fastPeriod !== undefined) {
      editableFields.push({
        key: "fastPeriod",
        label: "Fast Period",
        type: "number",
      });
    }
    if (params.slowPeriod !== undefined) {
      editableFields.push({
        key: "slowPeriod",
        label: "Slow Period",
        type: "number",
      });
    }
    if (params.signalPeriod !== undefined) {
      editableFields.push({
        key: "signalPeriod",
        label: "Signal Period",
        type: "number",
      });
    }
    // BB
    if (params.stdDev !== undefined) {
      editableFields.push({
        key: "stdDev",
        label: "Std Dev",
        type: "number",
      });
    }
    // SuperTrend / KC
    if (params.multiplier !== undefined) {
      editableFields.push({
        key: "multiplier",
        label: "Multiplier",
        type: "number",
      });
    }
    // PSAR
    if (params.step !== undefined) {
      editableFields.push({ key: "step", label: "Step", type: "number" });
    }
    if (params.max !== undefined) {
      editableFields.push({ key: "max", label: "Max", type: "number" });
    }
    // StochRSI
    if (params.rsiPeriod !== undefined) {
      editableFields.push({
        key: "rsiPeriod",
        label: "RSI Period",
        type: "number",
      });
    }
    if (params.stochasticPeriod !== undefined) {
      editableFields.push({
        key: "stochasticPeriod",
        label: "Stoch Period",
        type: "number",
      });
    }
    if (params.kPeriod !== undefined) {
      editableFields.push({
        key: "kPeriod",
        label: "%K Period",
        type: "number",
      });
    }
    if (params.dPeriod !== undefined) {
      editableFields.push({
        key: "dPeriod",
        label: "%D Period",
        type: "number",
      });
    }

    return editableFields;
  };

  const editableParams = getEditableParams();
  const showLevels = defaultLevels.length > 0 || (indicator.params?.levels && indicator.params.levels.length > 0);

  return (
    <div className="px-3 py-2 bg-slate-100 border-t border-slate-200">
      <div className="text-xs font-medium text-slate-600 mb-2">
        Edit {indicator.name || indicator.id}
      </div>
      <div className="space-y-2">
        {editableParams.map((field) => (
          <div key={field.key} className="flex items-center gap-2">
            <label className="text-[10px] text-slate-500 w-20">
              {field.label}
            </label>
            <input
              type="number"
              value={params[field.key]}
              onChange={(e) => handleParamChange(field.key, e.target.value)}
              className="flex-1 w-full px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
        
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-500 w-20">Width</label>
          <input
            type="number"
            min="1"
            max="5"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="flex-1 w-full px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[10px] text-slate-500 w-20">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-5 border border-slate-300 rounded cursor-pointer"
          />
          <span className="text-[10px] text-slate-400">{color}</span>
        </div>

        {showLevels && (
          <div className="flex items-center gap-2">
             <label className="text-[10px] text-slate-500 w-20">Levels</label>
             <input 
                type="text"
                value={levelsStr}
                onChange={(e) => setLevelsStr(e.target.value)}
                placeholder="e.g. 30, 70"
                className="flex-1 w-full px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
             />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 border-t border-slate-200 pt-2">
        {/* Pane Controls */}
        {indicator.paneIndex > 0 ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const newIdx = Math.max(1, indicator.paneIndex - 1);
                if (newIdx !== indicator.paneIndex) {
                  onSave({ ...indicator, paneIndex: newIdx, params, color, lineWidth });
                }
              }}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600 border border-slate-200 bg-white"
              title="Move Pane Up"
            >
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => {
                const newIdx = indicator.paneIndex + 1;
                onSave({ ...indicator, paneIndex: newIdx, params, color, lineWidth });
              }}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-blue-600 border border-slate-200 bg-white"
              title="Move Pane Down"
            >
              <ArrowDown size={12} />
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex justify-end gap-1">
          <button
            onClick={onCancel}
            className="px-2 py-0.5 text-[10px] text-slate-600 hover:bg-slate-200 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-2 py-0.5 text-[10px] bg-blue-500 text-white hover:bg-blue-600 rounded flex items-center gap-0.5"
          >
            <Check className="w-3 h-3" />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default function LayersPanel({
  isOpen,
  onClose,
  drawings = [],
  indicators = [],
  patterns = [],
  onRemoveDrawing,
  onRemoveIndicator,
  onRemovePattern,
  onUpdateIndicator,
  onToggleIndicatorVisibility,
}) {
  const [sections, setSections] = useState({
    drawings: false,
    indicators: false,
    patterns: false,
  });
  const [editingIndicatorUuid, setEditingIndicatorUuid] = useState(null);

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditIndicator = (uuid) => {
    setEditingIndicatorUuid((prev) => (prev === uuid ? null : uuid));
  };

  const handleSaveIndicator = (updatedIndicator) => {
    if (onUpdateIndicator) {
      onUpdateIndicator(updatedIndicator);
    }
    setEditingIndicatorUuid(null);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 sm:right-6 w-72 max-h-[calc(100%-5rem)] bg-white rounded-xl shadow-xl border border-slate-200 flex flex-col z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-semibold text-slate-800">Layers</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 rounded text-slate-500"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content - Scrollable */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        {/* Drawings Section */}
        <LayerSection
          title="Drawings"
          icon={PenTool}
          count={drawings.length}
          isOpen={sections.drawings}
          onToggle={() => toggleSection("drawings")}
        >
          {drawings.length === 0 ? (
            <div className="px-8 py-4 text-xs text-slate-400 text-center italic">
              No drawings added
            </div>
          ) : (
            drawings.map((d, i) => (
              <LayerItem
                key={`${d.type}-${i}`}
                label={d.type.replace(/([A-Z])/g, " $1").trim()}
                subLabel={`Item #${i + 1}`}
                icon={PenTool}
                onDelete={() => onRemoveDrawing(i)}
              />
            ))
          )}
        </LayerSection>

        {/* Indicators Section */}
        <LayerSection
          title="Indicators"
          icon={Activity}
          count={indicators.length}
          isOpen={sections.indicators}
          onToggle={() => toggleSection("indicators")}
        >
          {indicators.length === 0 ? (
            <div className="px-8 py-4 text-xs text-slate-400 text-center italic">
              No indicators active
            </div>
          ) : (
            indicators.map((ind, i) => (
              <React.Fragment key={ind.uuid || i}>
                <LayerItem
                  label={ind.name || ind.id}
                  subLabel={
                    ind.params
                      ? Object.entries(ind.params)
                          .filter(([k, v]) => typeof v === "number")
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")
                      : ""
                  }
                  icon={Activity}
                  color={ind.color}
                  isVisible={ind.visible !== false}
                  onEdit={() => handleEditIndicator(ind.uuid)}
                  onToggleVisibility={
                    onToggleIndicatorVisibility
                      ? () => onToggleIndicatorVisibility(ind.uuid)
                      : undefined
                  }
                  onDelete={() => onRemoveIndicator(ind.uuid)}
                />
                {editingIndicatorUuid === ind.uuid && (
                  <IndicatorSettingsEditor
                    indicator={ind}
                    onSave={handleSaveIndicator}
                    onCancel={() => setEditingIndicatorUuid(null)}
                  />
                )}
              </React.Fragment>
            ))
          )}
        </LayerSection>

        {/* Patterns Section */}
        <LayerSection
          title="Patterns"
          icon={CandlestickChart}
          count={patterns.length}
          isOpen={sections.patterns}
          onToggle={() => toggleSection("patterns")}
        >
          {patterns.length === 0 ? (
            <div className="px-8 py-4 text-xs text-slate-400 text-center italic">
              No patterns selected
            </div>
          ) : (
            patterns.map((pid, i) => {
              const meta = PatternRegistry.getPattern(pid);
              return (
                <LayerItem
                  key={pid}
                  label={meta?.name || pid}
                  subLabel={meta?.bias?.toUpperCase()}
                  icon={CandlestickChart}
                  onDelete={() => onRemovePattern(pid)}
                />
              );
            })
          )}
        </LayerSection>
      </div>
    </div>
  );
}
