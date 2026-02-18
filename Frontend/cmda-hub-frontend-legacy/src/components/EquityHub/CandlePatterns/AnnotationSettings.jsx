import React, { useEffect, useRef, useState } from "react";
import { X, Check, Trash2 } from "lucide-react";

const GANN_SQUARE_LEVELS = [0, 1, 2, 3, 4, 5];
const GANN_SQUARE_FANS = [
  "8x1",
  "5x1",
  "4x1",
  "3x1",
  "2x1",
  "1x1",
  "1x2",
  "1x3",
  "1x4",
  "1x5",
  "1x8",
];
const GANN_SQUARE_ARCS = [
  "1x0",
  "1.5x0",
  "2x1",
  "3x1",
  "4x1",
  "5x1",
  "1x1",
  "2x0",
  "3x0",
  "4x0",
  "5x0",
];

const GANN_SQUARE_LEVEL_COLORS = {
  0: "#9ca3af",
  1: "#f59e0b",
  2: "#06b6d4",
  3: "#22c55e",
  4: "#3b82f6",
  5: "#7c3aed",
};
const GANN_SQUARE_FAN_PALETTE = [
  "#c4b5fd",
  "#f9a8d4",
  "#d1d5db",
  "#fbbf24",
  "#06b6d4",
  "#22c55e",
  "#10b981",
  "#a3e635",
  "#93c5fd",
  "#c4b5fd",
  "#e9d5ff",
];
const GANN_SQUARE_ARC_PALETTE = [
  "#f59e0b",
  "#f97316",
  "#06b6d4",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#f59e0b",
  "#06b6d4",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
];

const GANN_FAN_DEFAULT_RATIOS = [
  "1x8",
  "1x4",
  "1x3",
  "1x2",
  "1x1",
  "2x1",
  "3x1",
  "4x1",
  "8x1",
];
const LEGACY_GANN_FAN_RATIOS = ["1x1", "2x1", "1x2", "4x1", "1x4"];
const GANN_FAN_DEFAULT_COLORS = {
  "1x8": "#22c55e",
  "1x4": "#10b981",
  "1x3": "#14b8a6",
  "1x2": "#0ea5e9",
  "1x1": "#f59e0b",
  "2x1": "#3b82f6",
  "3x1": "#8b5cf6",
  "4x1": "#ec4899",
  "8x1": "#ef4444",
};

const buildColorMap = (items, palette) =>
  items.reduce((acc, item, idx) => {
    acc[item] = palette[idx % palette.length];
    return acc;
  }, {});

const AnnotationSettings = ({
  drawing: initialDrawing,
  onUpdate,
  onClose,
  onRemove,
  position,
}) => {
  if (!initialDrawing) return null;
  const panelRef = useRef(null);
  const [draftDrawing, setDraftDrawing] = useState(initialDrawing);
  const drawing = draftDrawing;

  useEffect(() => {
    setDraftDrawing(initialDrawing);
  }, [initialDrawing]);

  const updateSetting = (key, value) => {
    setDraftDrawing((prev) => ({
      ...prev,
      settings: {
        ...(prev.settings || {}),
        [key]: value,
      },
    }));
  };

  const updateColor = (color) => {
    setDraftDrawing((prev) => ({
      ...prev,
      color,
    }));
  };

  const [gannFanRatioInput, setGannFanRatioInput] = useState("");

  const normalizeFanRatio = (ratio) => {
    if (typeof ratio !== "string") return ratio;
    return ratio.replace("/", "x");
  };

  const resolveFanRatios = (ratios) => {
    if (!Array.isArray(ratios) || ratios.length === 0)
      return GANN_FAN_DEFAULT_RATIOS;
    const normalized = ratios
      .map((ratio) => normalizeFanRatio(ratio))
      .filter(Boolean);
    if (normalized.length === 0) return GANN_FAN_DEFAULT_RATIOS;
    const legacySet = new Set(LEGACY_GANN_FAN_RATIOS);
    if (
      normalized.length === legacySet.size &&
      normalized.every((ratio) => legacySet.has(ratio))
    ) {
      return GANN_FAN_DEFAULT_RATIOS;
    }
    return normalized;
  };

  const buildFanRatioColors = (ratioColors) => {
    const merged = { ...GANN_FAN_DEFAULT_COLORS };
    if (ratioColors && typeof ratioColors === "object") {
      Object.entries(ratioColors).forEach(([key, value]) => {
        const normalizedKey = normalizeFanRatio(key);
        if (normalizedKey) merged[normalizedKey] = value;
      });
    }
    return merged;
  };

  return (
    <div
      ref={panelRef}
      data-annotation-settings="true"
      className="absolute bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4 w-68 z-50 animate-in fade-in zoom-in-95 duration-200"
      style={{
        left: position ? `${position.x + 10}px` : "auto",
        top: position ? `${position.y + 10}px` : "auto",
        right: position ? "auto" : "1rem",
        transformOrigin: "top left",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Settings</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              onRemove?.();
              onClose?.();
            }}
            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
            title="Delete Drawing"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {drawing.type === "pitchfork" && (
        <div className="space-y-3">
          {/* Extension Settings (Disabled for Inside Mode) */}
          {!drawing.settings.isInsideMode && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Extensions
              </label>
              <select
                value={drawing.settings.extendLines || "right"}
                onChange={(e) => updateSetting("extendLines", e.target.value)}
                className="w-full text-sm p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
              >
                <option value="none">None</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>
          )}

          {/* Fill Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={drawing.settings.showFill !== false}
              onChange={(e) => updateSetting("showFill", e.target.checked)}
              id="showFill"
            />
            <label htmlFor="showFill" className="text-sm">
              Show Fill
            </label>
          </div>

          {/* Levels Configuration */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Extra Levels
            </label>
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={(drawing.settings.levels || []).includes(0.5)}
                  onChange={(e) => {
                    const current = drawing.settings.levels || [0.5];
                    let next;
                    if (e.target.checked) next = [...current, 0.5];
                    else next = current.filter((l) => l !== 0.5);
                    updateSetting("levels", next);
                  }}
                />
                <span>0.5 (Median)</span>
              </label>
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={(drawing.settings.levels || []).includes(0.75)}
                  onChange={(e) => {
                    const current = drawing.settings.levels || [0.5];
                    let next;
                    if (e.target.checked) next = [...current, 0.75];
                    else next = current.filter((l) => l !== 0.75);
                    updateSetting("levels", next);
                  }}
                />
                <span>0.75</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* --- FIB EXTENSION SETTINGS --- */}
      {drawing.type === "fibExtension" && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {/* Extension Direction */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Extensions
            </label>
            <select
              value={drawing.settings?.extendLines || "right"}
              onChange={(e) => updateSetting("extendLines", e.target.value)}
              className="w-full text-sm p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="none">None</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) => updateSetting("showLabels", e.target.checked)}
              />
              <span>Labels</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showPrice !== false}
                onChange={(e) => updateSetting("showPrice", e.target.checked)}
              />
              <span>Price</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLegs !== false}
                onChange={(e) => updateSetting("showLegs", e.target.checked)}
              />
              <span>Legs</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.fillBackground !== false}
                onChange={(e) =>
                  updateSetting("fillBackground", e.target.checked)
                }
              />
              <span>Fill</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.reverse}
                onChange={(e) => updateSetting("reverse", e.target.checked)}
              />
              <span>Reverse</span>
            </label>
          </div>

          {/* Levels Configuration */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Active Levels
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618,
                3.618, 4.236,
              ].map((lvl) => (
                <label
                  key={lvl}
                  className="flex items-center space-x-1 text-[10px]"
                >
                  <input
                    type="checkbox"
                    checked={(
                      drawing.settings?.levels || [
                        0, 0.618, 1, 1.618, 2.618, 3.618, 4.236,
                      ]
                    ).includes(lvl)}
                    onChange={(e) => {
                      const current = drawing.settings?.levels || [
                        0, 0.618, 1, 1.618, 2.618, 3.618, 4.236,
                      ];
                      let next;
                      if (e.target.checked)
                        next = [...current, lvl].sort((a, b) => a - b);
                      else next = current.filter((l) => l !== lvl);
                      updateSetting("levels", next);
                    }}
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "fibRetracement" && (
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {/* Extensions */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Extensions
            </label>
            <select
              value={drawing.settings?.extendLines || "none"}
              onChange={(e) => updateSetting("extendLines", e.target.value)}
              className="w-full text-sm p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="none">None</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) => updateSetting("showLabels", e.target.checked)}
              />
              <span>Labels</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showPrice !== false}
                onChange={(e) => updateSetting("showPrice", e.target.checked)}
              />
              <span>Price</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.fillBackground !== false}
                onChange={(e) =>
                  updateSetting("fillBackground", e.target.checked)
                }
              />
              <span>Fill</span>
            </label>
            <label className="flex items-center space-x-1 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.reverse}
                onChange={(e) => updateSetting("reverse", e.target.checked)}
              />
              <span>Reverse</span>
            </label>
          </div>

          {/* Levels */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Active Levels
            </label>
            <div className="grid grid-cols-3 gap-1">
              {[
                0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618,
                3.618, 4.236,
              ].map((lvl) => (
                <label
                  key={lvl}
                  className="flex items-center space-x-1 text-[10px]"
                >
                  <input
                    type="checkbox"
                    checked={(
                      drawing.settings?.levels || [
                        0, 0.236, 0.382, 0.5, 0.618, 0.786, 1,
                      ]
                    ).includes(lvl)}
                    onChange={(e) => {
                      const current = drawing.settings?.levels || [
                        0, 0.236, 0.382, 0.5, 0.618, 0.786, 1,
                      ];
                      let next;
                      if (e.target.checked)
                        next = [...current, lvl].sort((a, b) => a - b);
                      else next = current.filter((l) => l !== lvl);
                      updateSetting("levels", next);
                    }}
                  />
                  <span>{lvl}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "fibChannel" && (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {/* Side Mode */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Side Mode
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-700 rounded p-0.5">
              {["one", "both"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateSetting("sideMode", mode)}
                  className={`flex-1 text-xs py-1 rounded capitalize ${drawing.settings?.sideMode === mode ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 font-medium" : "text-slate-500"}`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Lines Extend */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Extend Lines
            </label>
            <select
              value={drawing.settings?.extendLines || "both"}
              onChange={(e) => updateSetting("extendLines", e.target.value)}
              className="w-full text-sm p-1.5 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="none">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="both">Both</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700 mt-2">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showBaseLine !== false}
                onChange={(e) =>
                  updateSetting("showBaseLine", e.target.checked)
                }
              />
              <span>Show Base Trend Line</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) => updateSetting("showLabels", e.target.checked)}
              />
              <span>Show Labels</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showPrice !== false}
                onChange={(e) => updateSetting("showPrice", e.target.checked)}
              />
              <span>Show Price</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.fillBackground !== false}
                onChange={(e) =>
                  updateSetting("fillBackground", e.target.checked)
                }
              />
              <span>Fill Background</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.reverse}
                onChange={(e) => updateSetting("reverse", e.target.checked)}
              />
              <span>Reverse Levels</span>
            </label>
          </div>

          {/* Levels */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">
              Channel Levels
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.618, 2.618, 3.618,
                4.236,
              ].map((lvl) => {
                const currentLevels = drawing.settings?.levels || [
                  0.382, 0.618, 1.0, 1.618, 2.618,
                ];
                const isChecked = currentLevels.includes(lvl);
                return (
                  <label
                    key={lvl}
                    className="flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let next = isChecked
                          ? currentLevels.filter((l) => l !== lvl)
                          : [...currentLevels, lvl].sort((a, b) => a - b);
                        updateSetting("levels", next);
                      }}
                      className="rounded-sm border-gray-300 text-blue-600 w-3 h-3"
                    />
                    <span>{lvl}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "fibTimeZone" && (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {/* Toggles */}
          <div className="space-y-2 pt-1 border-b border-slate-100 dark:border-slate-700 pb-2">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showBase !== false}
                onChange={(e) => updateSetting("showBase", e.target.checked)}
              />
              <span>Show Base Line (0)</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) => updateSetting("showLabels", e.target.checked)}
              />
              <span>Show Labels</span>
            </label>
          </div>

          {/* Levels */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">
              Time Zone Levels
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].map((lvl) => {
                const currentLevels = drawing.settings?.levels || [
                  1, 2, 3, 5, 8, 13, 21, 34,
                ];
                const isChecked = currentLevels.includes(lvl);
                return (
                  <label
                    key={lvl}
                    className="flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let next = isChecked
                          ? currentLevels.filter((l) => l !== lvl)
                          : [...currentLevels, lvl].sort((a, b) => a - b);
                        updateSetting("levels", next);
                      }}
                      className="rounded-sm border-gray-300 text-blue-600 w-3 h-3"
                    />
                    <span>{lvl}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "fibTrendTime" && (
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
          {/* Toggles */}
          <div className="space-y-2 pt-1 border-b border-slate-100 dark:border-slate-700 pb-2">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) => updateSetting("showLabels", e.target.checked)}
              />
              <span>Show Labels</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showVisuals !== false}
                onChange={(e) => updateSetting("showVisuals", e.target.checked)}
              />
              <span>Show Trend Lines</span>
            </label>
          </div>

          {/* Time Ratios */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">
              Time Ratios
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].map((lvl) => {
                const currentLevels = drawing.settings?.levels || [
                  1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144,
                ];
                const isChecked = currentLevels.includes(lvl);
                return (
                  <label
                    key={lvl}
                    className="flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        let next = isChecked
                          ? currentLevels.filter((l) => l !== lvl)
                          : [...currentLevels, lvl].sort((a, b) => a - b);
                        updateSetting("levels", next);
                      }}
                      className="rounded-sm border-gray-300 text-blue-600 w-3 h-3"
                    />
                    <span>{lvl}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "gannBox" && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {/* Main Toggles */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-b border-slate-100 dark:border-slate-700 pb-2">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showGridHorz !== false}
                onChange={(e) =>
                  updateSetting("showGridHorz", e.target.checked)
                }
              />
              <span>Price Grid</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showGridVert !== false}
                onChange={(e) =>
                  updateSetting("showGridVert", e.target.checked)
                }
              />
              <span>Time Grid</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showAngles !== false}
                onChange={(e) => updateSetting("showAngles", e.target.checked)}
              />
              <span>Gann Angles</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.fillBackground !== false}
                onChange={(e) =>
                  updateSetting("fillBackground", e.target.checked)
                }
              />
              <span>Fill Box</span>
            </label>
          </div>

          {/* Grid Divisions */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Grid Divisions
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="2"
                max="16"
                step="1"
                value={drawing.settings?.gridDivisions || 8}
                onChange={(e) =>
                  updateSetting("gridDivisions", parseInt(e.target.value))
                }
                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono w-4">
                {drawing.settings?.gridDivisions || 8}
              </span>
            </div>
          </div>

          {/* Angle Origin */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Angle Origin
            </label>
            <select
              value={drawing.settings?.angleOrigin || "bottom-left"}
              onChange={(e) => updateSetting("angleOrigin", e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
            >
              <option value="bottom-left">Bottom Left</option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>

          {/* Extend Angles */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={drawing.settings?.extendAngles || false}
              onChange={(e) => updateSetting("extendAngles", e.target.checked)}
              id="extendAngles"
            />
            <label htmlFor="extendAngles" className="text-sm">
              Extend Angles
            </label>
          </div>

          {/* Labels */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Label Mode
            </label>
            <select
              value={drawing.settings?.labelMode || "fractions"}
              onChange={(e) => updateSetting("labelMode", e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
            >
              <option value="none">None</option>
              <option value="fractions">Division Fractions</option>
              <option value="values">Price & Time Values</option>
            </select>
          </div>

          {/* Angle Selector */}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-2 block">
              Active Angles
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["1x1", "2x1", "1x2", "4x1", "1x4"].map((angle) => {
                const currentAngles = drawing.settings?.angles || ["1x1"];
                const isChecked = currentAngles.includes(angle);
                return (
                  <label
                    key={angle}
                    className="flex items-center space-x-1 text-[10px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = isChecked
                          ? currentAngles.filter((a) => a !== angle)
                          : [...currentAngles, angle];
                        updateSetting("angles", next);
                      }}
                      className="rounded-sm border-gray-300 text-blue-600 w-3 h-3"
                    />
                    <span>{angle}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {drawing.type === "gannFan" && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {(() => {
            const activeRatios = resolveFanRatios(
              drawing.settings?.ratios || drawing.settings?.angles,
            );
            const availableRatios = Array.from(
              new Set([...GANN_FAN_DEFAULT_RATIOS, ...activeRatios]),
            );
            const ratioColors = buildFanRatioColors(
              drawing.settings?.ratioColors,
            );
            return (
              <>
                {/* General */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.lockFan || false}
                      onChange={(e) =>
                        updateSetting("lockFan", e.target.checked)
                      }
                    />
                    <span>Lock Fan</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.invert || false}
                      onChange={(e) =>
                        updateSetting("invert", e.target.checked)
                      }
                    />
                    <span>Invert</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.autoScale !== false}
                      onChange={(e) =>
                        updateSetting("autoScale", e.target.checked)
                      }
                    />
                    <span>Auto Scale</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.logScale || false}
                      onChange={(e) =>
                        updateSetting("logScale", e.target.checked)
                      }
                    />
                    <span>Log Scale</span>
                  </label>
                </div>

                {/* Extend Lines */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Extend Lines
                  </label>
                  <select
                    value={drawing.settings?.extendLines || "right"}
                    onChange={(e) =>
                      updateSetting("extendLines", e.target.value)
                    }
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
                  >
                    <option value="right">Right</option>
                    <option value="left">Left</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                {/* Angles */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Angles
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableRatios.map((ratio) => {
                      const isChecked = activeRatios.includes(ratio);
                      const ratioLabel = ratio.replace("x", "/");
                      return (
                        <label
                          key={ratio}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = isChecked
                                ? activeRatios.filter((r) => r !== ratio)
                                : [...activeRatios, ratio];
                              updateSetting("ratios", next);
                            }}
                          />
                          <input
                            type="color"
                            value={ratioColors[ratio] || "#14b8a6"}
                            onChange={(e) =>
                              updateSetting("ratioColors", {
                                ...ratioColors,
                                [ratio]: e.target.value,
                              })
                            }
                            className="w-5 h-4 border border-slate-300 rounded cursor-pointer"
                          />
                          <span>{ratioLabel}</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={gannFanRatioInput}
                      onChange={(e) => setGannFanRatioInput(e.target.value)}
                      placeholder="e.g. 3x2"
                      className="flex-1 text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                    />
                    <button
                      onClick={() => {
                        const trimmed = normalizeFanRatio(
                          gannFanRatioInput.trim(),
                        );
                        const isValid = /^\d+(\.\d+)?x\d+(\.\d+)?$/.test(
                          trimmed,
                        );
                        if (!isValid || activeRatios.includes(trimmed)) return;
                        updateSetting("ratios", [...activeRatios, trimmed]);
                        setGannFanRatioInput("");
                      }}
                      className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Labels
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={drawing.settings?.showRatio !== false}
                        onChange={(e) =>
                          updateSetting("showRatio", e.target.checked)
                        }
                      />
                      <span>Ratio</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={drawing.settings?.showDegrees || false}
                        onChange={(e) =>
                          updateSetting("showDegrees", e.target.checked)
                        }
                      />
                      <span>Degrees</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs">
                      <input
                        type="checkbox"
                        checked={drawing.settings?.showSlope || false}
                        onChange={(e) =>
                          updateSetting("showSlope", e.target.checked)
                        }
                      />
                      <span>Slope</span>
                    </label>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Label Position
                    </label>
                    <select
                      value={drawing.settings?.labelPosition || "end"}
                      onChange={(e) =>
                        updateSetting("labelPosition", e.target.value)
                      }
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
                    >
                      <option value="origin">Near Origin</option>
                      <option value="end">Near End</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={drawing.settings?.fillBackground || false}
                    onChange={(e) =>
                      updateSetting("fillBackground", e.target.checked)
                    }
                  />
                  <span>Fill</span>
                </div>

                {/* Style */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Main Width
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={drawing.settings?.lineWidthMain || 2}
                        onChange={(e) =>
                          updateSetting(
                            "lineWidthMain",
                            parseInt(e.target.value, 10),
                          )
                        }
                        className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Minor Width
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="4"
                        value={drawing.settings?.lineWidthMinor || 1}
                        onChange={(e) =>
                          updateSetting(
                            "lineWidthMinor",
                            parseInt(e.target.value, 10),
                          )
                        }
                        className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                      />
                    </div>
                  </div>
                  <label className="flex items-center space-x-2 text-xs mt-2">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.opacityDecay !== false}
                      onChange={(e) =>
                        updateSetting("opacityDecay", e.target.checked)
                      }
                    />
                    <span>Opacity Decay</span>
                  </label>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {drawing.type === "headShoulders" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.enforceConstraints === true}
              onChange={(e) =>
                updateSetting("enforceConstraints", e.target.checked)
              }
            />
            <span>Enforce Constraints</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Symmetry Tolerance
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.5"
              value={drawing.settings?.symmetryTolerance ?? 0.1}
              onChange={(e) =>
                updateSetting("symmetryTolerance", parseFloat(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showMeasuredMove !== false}
              onChange={(e) =>
                updateSetting("showMeasuredMove", e.target.checked)
              }
            />
            <span>Show Measured Move</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.requireBreak || false}
              onChange={(e) => updateSetting("requireBreak", e.target.checked)}
            />
            <span>Require Break</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
        </div>
      )}

      {drawing.type === "abcdPattern" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.enforceConstraints === true}
              onChange={(e) =>
                updateSetting("enforceConstraints", e.target.checked)
              }
            />
            <span>Enforce Constraints</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              AB=CD Tolerance
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.5"
              value={drawing.settings?.abcdTolerance ?? 0.1}
              onChange={(e) =>
                updateSetting("abcdTolerance", parseFloat(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showDistanceLabels !== false}
              onChange={(e) =>
                updateSetting("showDistanceLabels", e.target.checked)
              }
            />
            <span>Show Distance Labels</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.extendProjection === true}
              onChange={(e) =>
                updateSetting("extendProjection", e.target.checked)
              }
            />
            <span>Extend Projection</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showPRZ !== false}
              onChange={(e) => updateSetting("showPRZ", e.target.checked)}
            />
            <span>Show PRZ</span>
          </label>
        </div>
      )}

      {(drawing.type === "harmonicXABCD" ||
        drawing.type === "harmonicCypher" ||
        drawing.type === "harmonicThreeDrives") && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.enforceConstraints === true}
              onChange={(e) =>
                updateSetting("enforceConstraints", e.target.checked)
              }
            />
            <span>Enforce Constraints</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Fib Tolerance
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="0.5"
              value={drawing.settings?.fibTolerance ?? 0.08}
              onChange={(e) =>
                updateSetting("fibTolerance", parseFloat(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showRatioLabels !== false}
              onChange={(e) =>
                updateSetting("showRatioLabels", e.target.checked)
              }
            />
            <span>Show Ratio Labels</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showPRZ !== false}
              onChange={(e) => updateSetting("showPRZ", e.target.checked)}
            />
            <span>Show PRZ</span>
          </label>
        </div>
      )}

      {drawing.type === "trianglePattern" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.enforceConstraints === true}
              onChange={(e) =>
                updateSetting("enforceConstraints", e.target.checked)
              }
            />
            <span>Enforce Constraints</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Min Points
            </label>
            <input
              type="number"
              min="5"
              max="5"
              value={drawing.settings?.minPoints ?? 5}
              onChange={(e) =>
                updateSetting("minPoints", parseInt(e.target.value, 10))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showApex !== false}
              onChange={(e) => updateSetting("showApex", e.target.checked)}
            />
            <span>Show Apex</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showTarget !== false}
              onChange={(e) => updateSetting("showTarget", e.target.checked)}
            />
            <span>Show Target</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
        </div>
      )}

      {(drawing.type === "elliottImpulse" ||
        drawing.type === "elliottCorrection" ||
        drawing.type === "elliottTriangle" ||
        drawing.type === "elliottCombo") && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.enforceConstraints === true}
              onChange={(e) =>
                updateSetting("enforceConstraints", e.target.checked)
              }
            />
            <span>Enforce Constraints</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Mode
            </label>
            <select
              value={drawing.settings?.mode || "strict"}
              onChange={(e) => updateSetting("mode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="strict">Strict</option>
              <option value="loose">Loose</option>
            </select>
          </div>
          {(drawing.type === "elliottImpulse" ||
            drawing.type === "elliottCorrection") && (
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.showFibTargets !== false}
                onChange={(e) =>
                  updateSetting("showFibTargets", e.target.checked)
                }
              />
              <span>Show Fib Targets</span>
            </label>
          )}
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showDegreeLabels !== false}
              onChange={(e) =>
                updateSetting("showDegreeLabels", e.target.checked)
              }
            />
            <span>Show Degree Labels</span>
          </label>
          {drawing.settings?.showDegreeLabels !== false && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Degree
              </label>
              <select
                value={drawing.settings?.degreeLabel || "Minor"}
                onChange={(e) => updateSetting("degreeLabel", e.target.value)}
                className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
              >
                <option value="None">None</option>
                <option value="Minor">Minor</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Primary">Primary</option>
              </select>
            </div>
          )}
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
        </div>
      )}

      {drawing.type === "cyclicLines" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Direction
            </label>
            <select
              value={drawing.settings?.direction || "both"}
              onChange={(e) => updateSetting("direction", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="both">Both</option>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
        </div>
      )}

      {drawing.type === "brush" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#3b82f6"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Thickness
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={drawing.settings?.thickness ?? 3}
              onChange={(e) =>
                updateSetting("thickness", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Opacity
            </label>
            <input
              type="number"
              min="0.1"
              max="1"
              step="0.05"
              value={drawing.settings?.opacity ?? 0.8}
              onChange={(e) => updateSetting("opacity", Number(e.target.value))}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Smoothing
            </label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={drawing.settings?.smoothing ?? 0.35}
              onChange={(e) =>
                updateSetting("smoothing", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.autoScale !== false}
              onChange={(e) => updateSetting("autoScale", e.target.checked)}
            />
            <span>Auto Scale</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapToCandles || false}
              onChange={(e) => updateSetting("snapToCandles", e.target.checked)}
            />
            <span>Snap To Candles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.locked || false}
              onChange={(e) => updateSetting("locked", e.target.checked)}
            />
            <span>Lock Drawing</span>
          </label>
        </div>
      )}

      {drawing.type === "arrow" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#3b82f6"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={drawing.settings?.lineWidth ?? 2}
              onChange={(e) =>
                updateSetting("lineWidth", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Style
            </label>
            <select
              value={drawing.settings?.lineStyle || "solid"}
              onChange={(e) => updateSetting("lineStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Text
            </label>
            <input
              type="text"
              value={drawing.settings?.text || ""}
              onChange={(e) => updateSetting("text", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Text Color
              </label>
              <input
                type="color"
                value={drawing.settings?.textColor || "#0f172a"}
                onChange={(e) => updateSetting("textColor", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Text Size
              </label>
              <input
                type="number"
                min="8"
                max="36"
                value={drawing.settings?.textSize ?? 12}
                onChange={(e) =>
                  updateSetting("textSize", Number(e.target.value))
                }
                className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Arrowhead
            </label>
            <select
              value={drawing.settings?.arrowheadStyle || "triangle"}
              onChange={(e) => updateSetting("arrowheadStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="triangle">Triangle</option>
              <option value="line">Line</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.extendBeyondEnd || false}
              onChange={(e) =>
                updateSetting("extendBeyondEnd", e.target.checked)
              }
            />
            <span>Extend Beyond End</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockAngle || false}
              onChange={(e) => updateSetting("lockAngle", e.target.checked)}
            />
            <span>Lock Angle</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapToCandles !== false}
              onChange={(e) => updateSetting("snapToCandles", e.target.checked)}
            />
            <span>Snap To Candles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.locked || false}
              onChange={(e) => updateSetting("locked", e.target.checked)}
            />
            <span>Lock Drawing</span>
          </label>
        </div>
      )}

      {drawing.type === "rectangle" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Border
            </label>
            <input
              type="color"
              value={
                drawing.settings?.borderColor || drawing.color || "#3b82f6"
              }
              onChange={(e) => updateSetting("borderColor", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Fill
            </label>
            <input
              type="color"
              value={drawing.settings?.fillColor || drawing.color || "#3b82f6"}
              onChange={(e) => updateSetting("fillColor", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Opacity
            </label>
            <input
              type="number"
              min="0.05"
              max="1"
              step="0.05"
              value={drawing.settings?.opacity ?? 0.15}
              onChange={(e) => updateSetting("opacity", Number(e.target.value))}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={drawing.settings?.lineWidth ?? 1}
              onChange={(e) =>
                updateSetting("lineWidth", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Style
            </label>
            <select
              value={drawing.settings?.lineStyle || "solid"}
              onChange={(e) => updateSetting("lineStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Extend
            </label>
            <select
              value={drawing.settings?.extend || "none"}
              onChange={(e) => updateSetting("extend", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="none">None</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="both">Both</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockAspectRatio || false}
              onChange={(e) =>
                updateSetting("lockAspectRatio", e.target.checked)
              }
            />
            <span>Lock Aspect</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapToCandles !== false}
              onChange={(e) => updateSetting("snapToCandles", e.target.checked)}
            />
            <span>Snap To Candles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.locked || false}
              onChange={(e) => updateSetting("locked", e.target.checked)}
            />
            <span>Lock Drawing</span>
          </label>
        </div>
      )}

      {drawing.type === "arc" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#3b82f6"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={drawing.settings?.lineWidth ?? 2}
              onChange={(e) =>
                updateSetting("lineWidth", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Style
            </label>
            <select
              value={drawing.settings?.lineStyle || "solid"}
              onChange={(e) => updateSetting("lineStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.fill || false}
              onChange={(e) => updateSetting("fill", e.target.checked)}
            />
            <span>Fill</span>
          </label>
          {drawing.settings?.fill && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 w-16">
                  Fill
                </label>
                <input
                  type="color"
                  value={
                    drawing.settings?.fillColor || drawing.color || "#3b82f6"
                  }
                  onChange={(e) => updateSetting("fillColor", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Fill Opacity
                </label>
                <input
                  type="number"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={drawing.settings?.fillOpacity ?? 0.15}
                  onChange={(e) =>
                    updateSetting("fillOpacity", Number(e.target.value))
                  }
                  className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                />
              </div>
            </>
          )}
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showCenter !== false}
              onChange={(e) => updateSetting("showCenter", e.target.checked)}
            />
            <span>Show Center</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Label Mode
            </label>
            <select
              value={drawing.settings?.labelMode || "both"}
              onChange={(e) => updateSetting("labelMode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="radius">Radius</option>
              <option value="diameter">Diameter</option>
              <option value="both">Both</option>
              <option value="none">None</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockRadius || false}
              onChange={(e) => updateSetting("lockRadius", e.target.checked)}
            />
            <span>Lock Radius</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockAngles || false}
              onChange={(e) => updateSetting("lockAngles", e.target.checked)}
            />
            <span>Lock Angles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapAngles || false}
              onChange={(e) => updateSetting("snapAngles", e.target.checked)}
            />
            <span>Snap Angles</span>
          </label>
          {drawing.settings?.snapAngles && (
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                Snap Step
              </label>
              <select
                value={drawing.settings?.snapAngleStep || 15}
                onChange={(e) =>
                  updateSetting("snapAngleStep", Number(e.target.value))
                }
                className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
              >
                <option value={15}>15°</option>
                <option value={30}>30°</option>
                <option value={45}>45°</option>
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Scale Mode
            </label>
            <select
              value={drawing.settings?.scaleMode || "data"}
              onChange={(e) => updateSetting("scaleMode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="data">Data</option>
              <option value="screen">Screen</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.warnOnLogScale !== false}
              onChange={(e) =>
                updateSetting("warnOnLogScale", e.target.checked)
              }
            />
            <span>Warn On Log Scale</span>
          </label>
        </div>
      )}

      {drawing.type === "ellipse" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#3b82f6"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={drawing.settings?.lineWidth ?? 2}
              onChange={(e) =>
                updateSetting("lineWidth", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Style
            </label>
            <select
              value={drawing.settings?.lineStyle || "solid"}
              onChange={(e) => updateSetting("lineStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.fill || false}
              onChange={(e) => updateSetting("fill", e.target.checked)}
            />
            <span>Fill</span>
          </label>
          {drawing.settings?.fill && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500 w-16">
                  Fill
                </label>
                <input
                  type="color"
                  value={
                    drawing.settings?.fillColor || drawing.color || "#3b82f6"
                  }
                  onChange={(e) => updateSetting("fillColor", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">
                  Fill Opacity
                </label>
                <input
                  type="number"
                  min="0.05"
                  max="1"
                  step="0.05"
                  value={drawing.settings?.fillOpacity ?? 0.15}
                  onChange={(e) =>
                    updateSetting("fillOpacity", Number(e.target.value))
                  }
                  className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                />
              </div>
            </>
          )}
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showCenter !== false}
              onChange={(e) => updateSetting("showCenter", e.target.checked)}
            />
            <span>Show Center</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showLabels !== false}
              onChange={(e) => updateSetting("showLabels", e.target.checked)}
            />
            <span>Show Labels</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Label Mode
            </label>
            <select
              value={drawing.settings?.labelMode || "radius"}
              onChange={(e) => updateSetting("labelMode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="radius">Radii</option>
              <option value="none">None</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockX || false}
              onChange={(e) => updateSetting("lockX", e.target.checked)}
            />
            <span>Lock X</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.lockY || false}
              onChange={(e) => updateSetting("lockY", e.target.checked)}
            />
            <span>Lock Y</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.uniformScale || false}
              onChange={(e) => updateSetting("uniformScale", e.target.checked)}
            />
            <span>Uniform Scale</span>
          </label>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Rotation (°)
            </label>
            <input
              type="number"
              min="-180"
              max="180"
              step="1"
              value={drawing.settings?.rotation ?? 0}
              onChange={(e) =>
                updateSetting("rotation", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Scale Mode
            </label>
            <select
              value={drawing.settings?.scaleMode || "data"}
              onChange={(e) => updateSetting("scaleMode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="data">Data</option>
              <option value="screen">Screen</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.warnOnLogScale !== false}
              onChange={(e) =>
                updateSetting("warnOnLogScale", e.target.checked)
              }
            />
            <span>Warn On Log Scale</span>
          </label>
        </div>
      )}

      {drawing.type === "path" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#3b82f6"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Width
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={drawing.settings?.lineWidth ?? 2}
              onChange={(e) =>
                updateSetting("lineWidth", Number(e.target.value))
              }
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Line Style
            </label>
            <select
              value={drawing.settings?.lineStyle || "solid"}
              onChange={(e) => updateSetting("lineStyle", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Arrowheads
            </label>
            <select
              value={drawing.settings?.arrowheads || "none"}
              onChange={(e) => updateSetting("arrowheads", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="none">None</option>
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="both">Both</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.showNodes !== false}
              onChange={(e) => updateSetting("showNodes", e.target.checked)}
            />
            <span>Show Nodes</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapToCandles !== false}
              onChange={(e) => updateSetting("snapToCandles", e.target.checked)}
            />
            <span>Snap To Candles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.locked || false}
              onChange={(e) => updateSetting("locked", e.target.checked)}
            />
            <span>Lock Drawing</span>
          </label>
        </div>
      )}

      {drawing.type === "highlighter" && (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-500 w-16">
              Color
            </label>
            <input
              type="color"
              value={drawing.color || "#facc15"}
              onChange={(e) => updateColor(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Opacity
            </label>
            <input
              type="number"
              min="0.05"
              max="1"
              step="0.05"
              value={drawing.settings?.opacity ?? 0.18}
              onChange={(e) => updateSetting("opacity", Number(e.target.value))}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Blend Mode
            </label>
            <select
              value={drawing.settings?.blendMode || "multiply"}
              onChange={(e) => updateSetting("blendMode", e.target.value)}
              className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
            >
              <option value="multiply">Multiply</option>
              <option value="overlay">Overlay</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.autoScale !== false}
              onChange={(e) => updateSetting("autoScale", e.target.checked)}
            />
            <span>Auto Scale</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.snapToCandles || false}
              onChange={(e) => updateSetting("snapToCandles", e.target.checked)}
            />
            <span>Snap To Candles</span>
          </label>
          <label className="flex items-center space-x-2 text-xs">
            <input
              type="checkbox"
              checked={drawing.settings?.locked || false}
              onChange={(e) => updateSetting("locked", e.target.checked)}
            />
            <span>Lock Drawing</span>
          </label>
        </div>
      )}

      {(drawing.type === "gannSquare" ||
        drawing.type === "gannSquareFixed") && (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {(() => {
            const isFixed =
              drawing.settings?.isFixed ?? drawing.type === "gannSquareFixed";
            const levelColors = {
              ...GANN_SQUARE_LEVEL_COLORS,
              ...(drawing.settings?.levelColors || {}),
            };
            const fanColors = {
              ...buildColorMap(GANN_SQUARE_FANS, GANN_SQUARE_FAN_PALETTE),
              ...(drawing.settings?.fanColors || {}),
            };
            const arcColors = {
              ...buildColorMap(GANN_SQUARE_ARCS, GANN_SQUARE_ARC_PALETTE),
              ...(drawing.settings?.arcColors || {}),
            };
            const activeLevels = drawing.settings?.levels || GANN_SQUARE_LEVELS;
            const activeFans =
              drawing.settings?.visibleFans || GANN_SQUARE_FANS;
            const activeArcs =
              drawing.settings?.visibleArcs || GANN_SQUARE_ARCS;

            return (
              <>
                {/* Main Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.showGridHorz !== false}
                      onChange={(e) =>
                        updateSetting("showGridHorz", e.target.checked)
                      }
                    />
                    <span>Price Grid</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.showGridVert !== false}
                      onChange={(e) =>
                        updateSetting("showGridVert", e.target.checked)
                      }
                    />
                    <span>Time Grid</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.showDiagonals !== false}
                      onChange={(e) =>
                        updateSetting("showDiagonals", e.target.checked)
                      }
                    />
                    <span>Diagonals</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.showArcs !== false}
                      onChange={(e) =>
                        updateSetting("showArcs", e.target.checked)
                      }
                    />
                    <span>Arcs</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.showReverseArcs || false}
                      onChange={(e) =>
                        updateSetting("showReverseArcs", e.target.checked)
                      }
                    />
                    <span>Reverse Arcs</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs">
                    <input
                      type="checkbox"
                      checked={drawing.settings?.fillBackground !== false}
                      onChange={(e) =>
                        updateSetting("fillBackground", e.target.checked)
                      }
                    />
                    <span>Fill Box</span>
                  </label>
                </div>

                {/* Levels */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Levels
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GANN_SQUARE_LEVELS.map((lvl) => {
                      const key = String(lvl);
                      const isChecked = activeLevels.includes(lvl);
                      return (
                        <label
                          key={lvl}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = isChecked
                                ? activeLevels.filter((l) => l !== lvl)
                                : [...activeLevels, lvl].sort((a, b) => a - b);
                              updateSetting("levels", next);
                            }}
                          />
                          <input
                            type="color"
                            value={levelColors[key]}
                            onChange={(e) =>
                              updateSetting("levelColors", {
                                ...levelColors,
                                [key]: e.target.value,
                              })
                            }
                            className="w-5 h-4 border border-slate-300 rounded cursor-pointer"
                          />
                          <span>{lvl}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Fans */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Fans
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GANN_SQUARE_FANS.map((fan) => {
                      const isChecked = activeFans.includes(fan);
                      return (
                        <label
                          key={fan}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = isChecked
                                ? activeFans.filter((f) => f !== fan)
                                : [...activeFans, fan];
                              updateSetting("visibleFans", next);
                            }}
                          />
                          <input
                            type="color"
                            value={fanColors[fan]}
                            onChange={(e) =>
                              updateSetting("fanColors", {
                                ...fanColors,
                                [fan]: e.target.value,
                              })
                            }
                            className="w-5 h-4 border border-slate-300 rounded cursor-pointer"
                          />
                          <span>{fan}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Arcs */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-2 block">
                    Arcs
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {GANN_SQUARE_ARCS.map((arc) => {
                      const isChecked = activeArcs.includes(arc);
                      return (
                        <label
                          key={arc}
                          className="flex items-center gap-2 text-[10px]"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = isChecked
                                ? activeArcs.filter((a) => a !== arc)
                                : [...activeArcs, arc];
                              updateSetting("visibleArcs", next);
                            }}
                          />
                          <input
                            type="color"
                            value={arcColors[arc]}
                            onChange={(e) =>
                              updateSetting("arcColors", {
                                ...arcColors,
                                [arc]: e.target.value,
                              })
                            }
                            className="w-5 h-4 border border-slate-300 rounded cursor-pointer"
                          />
                          <span>{arc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Color */}
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Grid Color
                  </label>
                  <div className="flex space-x-1 overflow-x-auto pb-1">
                    {[
                      drawing.color,
                      "#94a3b8",
                      "#ef4444",
                      "#22c55e",
                      "#3b82f6",
                    ].map((c) => (
                      <button
                        key={c}
                        onClick={() => updateSetting("gridColor", c)}
                        className={`w-4 h-4 rounded border ${drawing.settings?.gridColor === c ? "ring-1 ring-offset-1 ring-blue-500 border-transparent" : "border-slate-300"}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Grid Divisions */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Grid Divisions
                  </label>
                  <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-700 rounded p-1">
                    {[1, 2, 4, 5, 8, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => updateSetting("gridDivisions", n)}
                        className={`flex-1 min-w-[30px] text-[10px] py-1 rounded ${drawing.settings?.gridDivisions === n || (!drawing.settings?.gridDivisions && n === 4) ? "bg-white dark:bg-slate-600 shadow-sm text-blue-600 font-medium" : "text-slate-500"}`}
                      >
                        {n}×{n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Extend Options */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={drawing.settings?.extendDiagonals || false}
                    onChange={(e) =>
                      updateSetting("extendDiagonals", e.target.checked)
                    }
                    id="extendDiagonals"
                  />
                  <label htmlFor="extendDiagonals" className="text-sm">
                    Extend Diagonals
                  </label>
                </div>

                {/* Labels */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Label Mode
                  </label>
                  <select
                    value={drawing.settings?.labelMode || "fractions"}
                    onChange={(e) => updateSetting("labelMode", e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
                  >
                    <option value="none">None</option>
                    <option value="fractions">Division Fractions</option>
                    <option value="values">Price & Time Values</option>
                  </select>
                </div>

                {/* Price/Bar Options */}
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Mode
                  </label>
                  <select
                    value={isFixed ? "fixed" : "dynamic"}
                    onChange={(e) =>
                      updateSetting("isFixed", e.target.value === "fixed")
                    }
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 mb-2"
                  >
                    <option value="dynamic">Dynamic</option>
                    <option value="fixed">Fixed</option>
                  </select>

                  <label className="flex items-center space-x-2 text-xs mb-2">
                    <input
                      type="checkbox"
                      checked={isFixed}
                      onChange={(e) =>
                        updateSetting("isFixed", e.target.checked)
                      }
                    />
                    <span className="font-medium">Fixed (Lock Aspect)</span>
                  </label>

                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Price/Bar Ratio
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={drawing.settings?.priceBarRatio || 1}
                    onChange={(e) =>
                      updateSetting("priceBarRatio", parseFloat(e.target.value))
                    }
                    className="w-full text-xs p-1 rounded border border-slate-200 dark:border-slate-600 bg-transparent"
                  />
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Position Tool Settings */}
      {[
        "text",
        "anchoredText",
        "note",
        "priceNote",
        "callout",
        "pin",
        "flag",
      ].includes(drawing.type) && (
        <div className="space-y-3 mb-4">
          <div className="text-sm font-medium border-b pb-1 mb-2">
            Text & Notes
          </div>
          {["text", "anchoredText", "note", "priceNote", "callout"].includes(
            drawing.type,
          ) && (
            <div>
              <label className="text-xs text-slate-500 block mb-1">Text</label>
              <input
                type="text"
                value={drawing.settings?.text || ""}
                onChange={(e) => updateSetting("text", e.target.value)}
                className="w-full text-xs border rounded p-1"
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Font</label>
              <input
                type="text"
                value={drawing.settings?.fontFamily || "sans-serif"}
                onChange={(e) => updateSetting("fontFamily", e.target.value)}
                className="w-full text-xs border rounded p-1"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Font Size
              </label>
              <input
                type="number"
                min="8"
                max="48"
                value={drawing.settings?.fontSize || 14}
                onChange={(e) =>
                  updateSetting("fontSize", Number(e.target.value))
                }
                className="w-full text-xs border rounded p-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">Color</label>
              <input
                type="color"
                value={drawing.settings?.color || "#607D8B"}
                onChange={(e) => updateSetting("color", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Opacity
              </label>
              <input
                type="number"
                min="0.1"
                max="1"
                step="0.05"
                value={drawing.settings?.opacity ?? 1}
                onChange={(e) =>
                  updateSetting("opacity", Number(e.target.value))
                }
                className="w-full text-xs border rounded p-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Background
              </label>
              <input
                type="color"
                value={drawing.settings?.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  updateSetting("backgroundColor", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                BG Alpha
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={drawing.settings?.backgroundAlpha ?? 1}
                onChange={(e) =>
                  updateSetting("backgroundAlpha", Number(e.target.value))
                }
                className="w-full text-xs border rounded p-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Border Color
              </label>
              <input
                type="color"
                value={drawing.settings?.borderColor || "#607D8B"}
                onChange={(e) => updateSetting("borderColor", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Border Width
              </label>
              <input
                type="number"
                min="0"
                max="6"
                value={drawing.settings?.borderWidth ?? 0}
                onChange={(e) =>
                  updateSetting("borderWidth", Number(e.target.value))
                }
                className="w-full text-xs border rounded p-1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.autoHide || false}
                onChange={(e) => updateSetting("autoHide", e.target.checked)}
              />
              <span>Auto Hide</span>
            </label>
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.adaptiveOpacity !== false}
                onChange={(e) =>
                  updateSetting("adaptiveOpacity", e.target.checked)
                }
              />
              <span>Adaptive Opacity</span>
            </label>
          </div>
          {["text", "note"].includes(drawing.type) && (
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.autoScale || false}
                onChange={(e) => updateSetting("autoScale", e.target.checked)}
              />
              <span>Auto Scale</span>
            </label>
          )}
          {!["text", "note"].includes(drawing.type) && (
            <label className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles !== false}
                onChange={(e) =>
                  updateSetting("snapToCandles", e.target.checked)
                }
              />
              <span>Snap To Candles</span>
            </label>
          )}

          {drawing.type === "anchoredText" && (
            <>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLeader !== false}
                  onChange={(e) =>
                    updateSetting("showLeader", e.target.checked)
                  }
                />
                <span>Leader Line</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.lockOffset || false}
                  onChange={(e) =>
                    updateSetting("lockOffset", e.target.checked)
                  }
                />
                <span>Lock Offset</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.autoFlip !== false}
                  onChange={(e) => updateSetting("autoFlip", e.target.checked)}
                />
                <span>Auto Flip</span>
              </label>
            </>
          )}

          {drawing.type === "priceNote" && (
            <>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showPriceLabel !== false}
                  onChange={(e) =>
                    updateSetting("showPriceLabel", e.target.checked)
                  }
                />
                <span>Show Price</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.extendLine !== false}
                  onChange={(e) =>
                    updateSetting("extendLine", e.target.checked)
                  }
                />
                <span>Extend Line</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.snapToTick !== false}
                  onChange={(e) =>
                    updateSetting("snapToTick", e.target.checked)
                  }
                />
                <span>Snap To Tick</span>
              </label>
            </>
          )}

          {drawing.type === "callout" && (
            <>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Arrow Style
                </label>
                <select
                  value={drawing.settings?.arrowStyle || "triangle"}
                  onChange={(e) => updateSetting("arrowStyle", e.target.value)}
                  className="w-full text-xs border rounded p-1"
                >
                  <option value="triangle">Triangle</option>
                  <option value="line">Line</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Bubble
                </label>
                <select
                  value={drawing.settings?.bubbleShape || "round"}
                  onChange={(e) => updateSetting("bubbleShape", e.target.value)}
                  className="w-full text-xs border rounded p-1"
                >
                  <option value="round">Round</option>
                  <option value="rect">Rect</option>
                </select>
              </div>
            </>
          )}

          {drawing.type === "note" && (
            <>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.collapsed || false}
                  onChange={(e) => updateSetting("collapsed", e.target.checked)}
                />
                <span>Collapsed</span>
              </label>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.pinned || false}
                  onChange={(e) => updateSetting("pinned", e.target.checked)}
                />
                <span>Pinned</span>
              </label>
            </>
          )}

          {["pin", "flag"].includes(drawing.type) && (
            <>
              <div>
                <label className="text-xs text-slate-500 block mb-1">
                  Size
                </label>
                <input
                  type="number"
                  min="10"
                  max="48"
                  value={drawing.settings?.size || 20}
                  onChange={(e) =>
                    updateSetting("size", Number(e.target.value))
                  }
                  className="w-full text-xs border rounded p-1"
                />
              </div>
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showTooltip || false}
                  onChange={(e) =>
                    updateSetting("showTooltip", e.target.checked)
                  }
                />
                <span>Show Tooltip</span>
              </label>
              {drawing.settings?.showTooltip && (
                <div>
                  <label className="text-xs text-slate-500 block mb-1">
                    Tooltip
                  </label>
                  <input
                    type="text"
                    value={drawing.settings?.tooltipText || ""}
                    onChange={(e) =>
                      updateSetting("tooltipText", e.target.value)
                    }
                    className="w-full text-xs border rounded p-1"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {["longPosition", "shortPosition"].includes(drawing.type) && (
        <div className="space-y-3 mb-4">
          <div className="text-sm font-medium border-b pb-1 mb-2">
            Position Settings
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Profit Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ background: drawing.settings?.profitColor }}
                />
                <input
                  type="text"
                  value={drawing.settings?.profitColor}
                  onChange={(e) => updateSetting("profitColor", e.target.value)}
                  className="w-full text-[10px] border rounded p-1"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">
                Loss Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ background: drawing.settings?.lossColor }}
                />
                <input
                  type="text"
                  value={drawing.settings?.lossColor}
                  onChange={(e) => updateSetting("lossColor", e.target.value)}
                  className="w-full text-[10px] border rounded p-1"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Target R:R
            </label>
            <input
              type="number"
              step="0.1"
              value={drawing.settings?.riskRewardRatio || 2}
              onChange={(e) =>
                updateSetting("riskRewardRatio", parseFloat(e.target.value))
              }
              className="w-full text-xs border rounded p-1"
            />
          </div>
        </div>
      )}

      {/* Measure Tool Settings */}
      {["dateRange", "priceRange", "datePriceRange"].includes(drawing.type) && (
        <div className="space-y-3 mb-4">
          <div className="text-sm font-medium border-b pb-1 mb-2">
            Measure Settings
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Background
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{ background: drawing.settings?.backgroundColor }}
              />
              <input
                type="text"
                value={drawing.settings?.backgroundColor}
                onChange={(e) =>
                  updateSetting("backgroundColor", e.target.value)
                }
                className="w-full text-[10px] border rounded p-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">
              Line Color
            </label>
            <input
              type="color"
              value={drawing.settings?.lineColor}
              onChange={(e) => updateSetting("lineColor", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Ghost Feed Settings */}
      {drawing.type === "ghostFeed" && (
        <div className="space-y-3 mb-2">
          <div className="text-sm font-medium border-b pb-1 mb-2">
            Ghost Line
          </div>
          {/* Reuse general color but provide explicit label/control if needed, for now standard color picker below works for 'color' property on drawing root? No, likely settings.color */}
          {/* If drawing object has root color, uses that. If settings.color, we need to map. */}
          {/* Ghost uses settings.color in drawing logic. */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Color</label>
            <input
              type="color"
              value={drawing.settings?.color || "#9E9E9E"}
              onChange={(e) => updateSetting("color", e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
        <label className="text-xs font-medium text-slate-500 mb-1 block">
          Color
        </label>
        <div className="flex space-x-2">
          {["#2962FF", "#D32F2F", "#00E676", "#FFEA00", "#AA00FF"].map((c) => (
            <button
              key={c}
              onClick={() => updateColor(c)}
              className={`w-6 h-6 rounded-full border ${drawing.color === c ? "ring-2 ring-offset-1 ring-blue-500" : "border-transparent"}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            onUpdate?.(draftDrawing);
            onClose?.();
          }}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <Check className="h-3.5 w-3.5" />
          Apply
        </button>
      </div>
    </div>
  );
};

export default AnnotationSettings;
