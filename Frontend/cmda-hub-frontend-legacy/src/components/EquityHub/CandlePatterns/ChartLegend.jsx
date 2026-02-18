import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  ChevronRight,
  PenTool,
  CandlestickChart,
  RotateCcw,
  Trash2,
  Activity,
  Settings,
  Check,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { PatternRegistry } from "./Data/PatternRegistry";

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

// Inline settings editor for drawings
const DrawingSettingsEditor = ({ drawing, onSave, onCancel }) => {
  const [color, setColor] = useState(drawing.color || "#2962FF");
  const [lineWidth, setLineWidth] = useState(drawing.lineWidth || 2);
  const [text, setText] = useState(
    drawing.settings?.text || drawing.text || "",
  );
  const [textSettings, setTextSettings] = useState({
    ...(drawing.settings || {}),
    text: drawing.settings?.text || drawing.text || "",
  });
  const [k, setK] = useState(drawing.k || 2);
  const [priceSource, setPriceSource] = useState(
    drawing.priceSource || "close",
  );
  const [flatMode, setFlatMode] = useState(drawing.flatMode || "auto");
  const [fillOpacity, setFillOpacity] = useState(drawing.fillOpacity || 0.1);
  const [gannFanRatioInput, setGannFanRatioInput] = useState("");

  useEffect(() => {
    setColor(drawing.color || "#2962FF");
    setLineWidth(drawing.lineWidth || 2);
    setText(drawing.settings?.text || drawing.text || "");
    setTextSettings({
      ...(drawing.settings || {}),
      text: drawing.settings?.text || drawing.text || "",
    });
    setK(drawing.k || 2);
    setPriceSource(drawing.priceSource || "close");
    setFlatMode(drawing.flatMode || "auto");
    setFillOpacity(drawing.fillOpacity || 0.1);
  }, [drawing]);
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
  const gannIsFixed =
    drawing.settings?.isFixed ?? drawing.type === "gannSquareFixed";
  const gannLevelColors = {
    ...GANN_SQUARE_LEVEL_COLORS,
    ...(drawing.settings?.levelColors || {}),
  };
  const gannSquareFanColors = {
    ...buildColorMap(GANN_SQUARE_FANS, GANN_SQUARE_FAN_PALETTE),
    ...(drawing.settings?.fanColors || {}),
  };
  const gannArcColors = {
    ...buildColorMap(GANN_SQUARE_ARCS, GANN_SQUARE_ARC_PALETTE),
    ...(drawing.settings?.arcColors || {}),
  };
  const gannActiveLevels = drawing.settings?.levels || GANN_SQUARE_LEVELS;
  const gannActiveFans = drawing.settings?.visibleFans || GANN_SQUARE_FANS;
  const gannActiveArcs = drawing.settings?.visibleArcs || GANN_SQUARE_ARCS;
  const gannFanActiveRatios = resolveFanRatios(
    drawing.settings?.ratios || drawing.settings?.angles,
  );
  const gannFanAvailableRatios = Array.from(
    new Set([...GANN_FAN_DEFAULT_RATIOS, ...gannFanActiveRatios]),
  );
  const gannFanRatioColors = buildFanRatioColors(drawing.settings?.ratioColors);

  const handleSave = () => {
    onSave(
      {
        ...drawing,
        color,
        lineWidth,
        k: drawing.type === "regressionTrend" ? k : undefined,
        priceSource:
          drawing.type === "regressionTrend" ? priceSource : undefined,
        flatMode: drawing.type === "flatTopBottom" ? flatMode : undefined,
        fillOpacity: drawing.type === "flatTopBottom" ? fillOpacity : undefined,
        text:
          drawing.type === "text" || drawing.type === "infoLine"
            ? text
            : drawing.text,
        settings: [
          "text",
          "anchoredText",
          "note",
          "priceNote",
          "callout",
          "pin",
          "flag",
        ].includes(drawing.type)
          ? {
              ...(drawing.settings || {}),
              ...textSettings,
              text: textSettings.text ?? text,
            }
          : drawing.settings,
      },
      true,
    );
  };

  return (
    <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-md shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1">
          <label className="text-[10px] text-slate-500 w-10">Color</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-6 h-5 border border-slate-300 rounded cursor-pointer"
          />
        </div>
        <div className="flex items-center gap-1">
          <label className="text-[10px] text-slate-500 w-10">Width</label>
          <input
            type="number"
            min="1"
            max="10"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="flex-1 w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {drawing.type === "regressionTrend" && (
          <>
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 w-10">Std Dev</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
                className="flex-1 w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 w-10">Source</label>
              <select
                value={priceSource}
                onChange={(e) => setPriceSource(e.target.value)}
                className="flex-1 w-14 px-1 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="close">Close</option>
                <option value="open">Open</option>
                <option value="high">High</option>
                <option value="low">Low</option>
                <option value="hl2">HL2</option>
              </select>
            </div>
          </>
        )}
        {drawing.type === "pitchfork" && (
          <>
            {/* Extensions */}
            {!drawing.settings?.isInsideMode && (
              <div className="col-span-2">
                <label className="text-[10px] text-slate-500 block">
                  Extensions
                </label>
                <select
                  value={drawing.settings?.extendLines || "right"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        extendLines: e.target.value,
                      },
                    })
                  }
                  className="w-full text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 p-1"
                >
                  <option value="none">None</option>
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                  <option value="both">Both</option>
                </select>
              </div>
            )}
            {/* Levels */}
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500 block mb-1">
                Levels
              </label>
              <div className="flex gap-2">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={(drawing.settings?.levels || []).includes(0.5)}
                    onChange={(e) => {
                      const cls = drawing.settings?.levels || [];
                      const newLevels = e.target.checked
                        ? [...cls, 0.5]
                        : cls.filter((l) => l !== 0.5);
                      onSave({
                        ...drawing,
                        settings: { ...drawing.settings, levels: newLevels },
                      });
                    }}
                  />{" "}
                  0.5
                </label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={(drawing.settings?.levels || []).includes(0.75)}
                    onChange={(e) => {
                      const cls = drawing.settings?.levels || [];
                      const newLevels = e.target.checked
                        ? [...cls, 0.75]
                        : cls.filter((l) => l !== 0.75);
                      onSave({
                        ...drawing,
                        settings: { ...drawing.settings, levels: newLevels },
                      });
                    }}
                  />{" "}
                  0.75
                </label>
              </div>
            </div>
          </>
        )}
        {drawing.type === "fibExtension" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Extensions */}
            <div>
              <label className="text-[10px] text-slate-500 block">
                Extensions
              </label>
              <select
                value={drawing.settings?.extendLines || "right"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendLines: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-1 rounded border border-slate-300"
              >
                <option value="none">None</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLabels !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                />
                Labels
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showPrice !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showPrice: e.target.checked,
                      },
                    })
                  }
                />
                Price
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLegs !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLegs: e.target.checked,
                      },
                    })
                  }
                />
                Legs
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.fillBackground !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        fillBackground: e.target.checked,
                      },
                    })
                  }
                />
                Fill
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.reverse}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        reverse: e.target.checked,
                      },
                    })
                  }
                />
                Reverse
              </label>
            </div>

            {/* Levels */}
            <div>
              <label className="text-[10px] text-slate-500 block">Levels</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618,
                  3.618, 4.236,
                ].map((lvl) => (
                  <label
                    key={lvl}
                    className="flex items-center gap-0.5 text-[9px]"
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
                        let next = e.target.checked
                          ? [...current, lvl].sort((a, b) => a - b)
                          : current.filter((l) => l !== lvl);
                        onSave({
                          ...drawing,
                          settings: { ...drawing.settings, levels: next },
                        });
                      }}
                    />{" "}
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {drawing.type === "fibRetracement" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Extensions */}
            <div>
              <label className="text-[10px] text-slate-500 block">
                Extensions
              </label>
              <select
                value={drawing.settings?.extendLines || "both"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendLines: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-1 rounded border border-slate-300"
              >
                <option value="none">None</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLabels !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                />
                Labels
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showPrice !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showPrice: e.target.checked,
                      },
                    })
                  }
                />
                Price
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.fillBackground !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        fillBackground: e.target.checked,
                      },
                    })
                  }
                />
                Fill
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.reverse}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        reverse: e.target.checked,
                      },
                    })
                  }
                />
                Reverse
              </label>
            </div>

            {/* Levels */}
            <div>
              <label className="text-[10px] text-slate-500 block">Levels</label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618,
                  3.618, 4.236,
                ].map((lvl) => (
                  <label
                    key={lvl}
                    className="flex items-center gap-0.5 text-[9px]"
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
                        let next = e.target.checked
                          ? [...current, lvl].sort((a, b) => a - b)
                          : current.filter((l) => l !== lvl);
                        onSave({
                          ...drawing,
                          settings: { ...drawing.settings, levels: next },
                        });
                      }}
                    />{" "}
                    {lvl}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        {drawing.type === "fibChannel" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Extensions */}
            <div>
              <label className="text-[10px] text-slate-500 block">
                Extensions
              </label>
              <select
                value={drawing.settings?.extendLines || "both"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendLines: e.target.value,
                    },
                  })
                }
                className="w-full text-xs p-1 rounded border border-slate-300"
              >
                <option value="none">None</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.sideMode === "both"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        sideMode: e.target.checked ? "both" : "one",
                      },
                    })
                  }
                />
                Both Sides
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLabels !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                />
                Labels
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showPrice !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showPrice: e.target.checked,
                      },
                    })
                  }
                />
                Price
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.fillBackground !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        fillBackground: e.target.checked,
                      },
                    })
                  }
                />
                Fill
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.reverse}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        reverse: e.target.checked,
                      },
                    })
                  }
                />
                Reverse
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showBaseLine !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showBaseLine: e.target.checked,
                      },
                    })
                  }
                />
                Base Line
              </label>
            </div>

            {/* Levels */}
            <div>
              <label className="text-[10px] text-slate-500 block">Levels</label>
              <div className="grid grid-cols-3 gap-1">
                {[0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.618, 2.618].map(
                  (lvl) => (
                    <label
                      key={lvl}
                      className="flex items-center gap-0.5 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={(
                          drawing.settings?.levels || [
                            0.382, 0.618, 1.0, 1.618, 2.618,
                          ]
                        ).includes(lvl)}
                        onChange={(e) => {
                          const current = drawing.settings?.levels || [
                            0.382, 0.618, 1.0, 1.618, 2.618,
                          ];
                          let next = e.target.checked
                            ? [...current, lvl].sort((a, b) => a - b)
                            : current.filter((l) => l !== lvl);
                          onSave({
                            ...drawing,
                            settings: { ...drawing.settings, levels: next },
                          });
                        }}
                      />{" "}
                      {lvl}
                    </label>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
        {drawing.type === "fibTimeZone" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showBase !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showBase: e.target.checked,
                      },
                    })
                  }
                />
                Base Line (0)
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLabels !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                />
                Labels
              </label>
            </div>

            {/* Levels */}
            <div>
              <label className="text-[10px] text-slate-500 block">Levels</label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 5, 8, 13, 21, 34].map((lvl) => {
                  const currentLevels = drawing.settings?.levels || [
                    1, 2, 3, 5, 8, 13, 21, 34,
                  ];
                  const isChecked = currentLevels.includes(lvl);
                  return (
                    <label
                      key={lvl}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? currentLevels.filter((l) => l !== lvl)
                            : [...currentLevels, lvl].sort((a, b) => a - b);
                          onSave({
                            ...drawing,
                            settings: { ...drawing.settings, levels: next },
                          });
                        }}
                      />
                      {lvl}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {drawing.type === "gannFan" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.lockFan || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        lockFan: e.target.checked,
                      },
                    })
                  }
                />
                Lock
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.invert || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        invert: e.target.checked,
                      },
                    })
                  }
                />
                Invert
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.autoScale !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        autoScale: e.target.checked,
                      },
                    })
                  }
                />
                Auto
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.logScale || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        logScale: e.target.checked,
                      },
                    })
                  }
                />
                Log
              </label>
            </div>

            {/* Extend Lines */}
            <div>
              <label className="text-[10px] text-slate-500 block">Extend</label>
              <select
                value={drawing.settings?.extendLines || "right"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendLines: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="right">Right</option>
                <option value="left">Left</option>
                <option value="both">Both</option>
              </select>
            </div>

            {/* Angles */}
            <div>
              <label className="text-[10px] text-slate-500 block">Angles</label>
              <div className="grid grid-cols-2 gap-1">
                {gannFanAvailableRatios.map((ratio) => {
                  const isChecked = gannFanActiveRatios.includes(ratio);
                  const ratioLabel = ratio.replace("x", "/");
                  return (
                    <label
                      key={ratio}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? gannFanActiveRatios.filter((r) => r !== ratio)
                            : [...gannFanActiveRatios, ratio];
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              ratios: next,
                            },
                          });
                        }}
                      />
                      <input
                        type="color"
                        value={gannFanRatioColors[ratio] || "#14b8a6"}
                        onChange={(e) =>
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              ratioColors: {
                                ...gannFanRatioColors,
                                [ratio]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-4 h-3 border border-slate-300 rounded cursor-pointer"
                      />
                      {ratioLabel}
                    </label>
                  );
                })}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  value={gannFanRatioInput}
                  onChange={(e) => setGannFanRatioInput(e.target.value)}
                  placeholder="3x2"
                  className="flex-1 text-[10px] p-0.5 rounded border border-slate-300"
                />
                <button
                  onClick={() => {
                    const trimmed = normalizeFanRatio(gannFanRatioInput.trim());
                    const isValid = /^\d+(\.\d+)?x\d+(\.\d+)?$/.test(trimmed);
                    if (!isValid || gannFanActiveRatios.includes(trimmed))
                      return;
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        ratios: [...gannFanActiveRatios, trimmed],
                      },
                    });
                    setGannFanRatioInput("");
                  }}
                  className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Labels */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showRatio !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showRatio: e.target.checked,
                      },
                    })
                  }
                />
                Ratio
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showDegrees || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showDegrees: e.target.checked,
                      },
                    })
                  }
                />
                Degrees
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showSlope || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showSlope: e.target.checked,
                      },
                    })
                  }
                />
                Slope
              </label>
            </div>

            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.fillBackground || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      fillBackground: e.target.checked,
                    },
                  })
                }
              />
              Fill
            </label>

            <div>
              <label className="text-[10px] text-slate-500 block">
                Label Pos
              </label>
              <select
                value={drawing.settings?.labelPosition || "end"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      labelPosition: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="origin">Origin</option>
                <option value="end">End</option>
              </select>
            </div>

            {/* Style */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Main W
                </label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={drawing.settings?.lineWidthMain || 2}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        lineWidthMain: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Minor W
                </label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={drawing.settings?.lineWidthMinor || 1}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        lineWidthMinor: parseInt(e.target.value, 10),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.opacityDecay !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      opacityDecay: e.target.checked,
                    },
                  })
                }
              />
              Opacity Decay
            </label>
          </div>
        )}

        {drawing.type === "headShoulders" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.enforceConstraints === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      enforceConstraints: e.target.checked,
                    },
                  })
                }
              />
              Enforce Constraints
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Symmetry Tol
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={drawing.settings?.symmetryTolerance ?? 0.1}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      symmetryTolerance: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showMeasuredMove !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showMeasuredMove: e.target.checked,
                    },
                  })
                }
              />
              Measured Move
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.requireBreak || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      requireBreak: e.target.checked,
                    },
                  })
                }
              />
              Require Break
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Labels
            </label>
          </div>
        )}

        {drawing.type === "abcdPattern" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.enforceConstraints === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      enforceConstraints: e.target.checked,
                    },
                  })
                }
              />
              Enforce Constraints
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                AB=CD Tol
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={drawing.settings?.abcdTolerance ?? 0.1}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      abcdTolerance: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showDistanceLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showDistanceLabels: e.target.checked,
                    },
                  })
                }
              />
              Dist Labels
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.extendProjection === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendProjection: e.target.checked,
                    },
                  })
                }
              />
              Extend
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showPRZ !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showPRZ: e.target.checked,
                    },
                  })
                }
              />
              PRZ
            </label>
          </div>
        )}

        {(drawing.type === "harmonicXABCD" ||
          drawing.type === "harmonicCypher" ||
          drawing.type === "harmonicThreeDrives") && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.enforceConstraints === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      enforceConstraints: e.target.checked,
                    },
                  })
                }
              />
              Enforce Constraints
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Fib Tol
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="0.5"
                value={drawing.settings?.fibTolerance ?? 0.08}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      fibTolerance: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showRatioLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showRatioLabels: e.target.checked,
                    },
                  })
                }
              />
              Ratios
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showPRZ !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showPRZ: e.target.checked,
                    },
                  })
                }
              />
              PRZ
            </label>
          </div>
        )}

        {drawing.type === "trianglePattern" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.enforceConstraints === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      enforceConstraints: e.target.checked,
                    },
                  })
                }
              />
              Enforce Constraints
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Min Points
              </label>
              <input
                type="number"
                min="5"
                max="5"
                value={drawing.settings?.minPoints ?? 5}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      minPoints: parseInt(e.target.value, 10),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showApex !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showApex: e.target.checked,
                    },
                  })
                }
              />
              Apex
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showTarget !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showTarget: e.target.checked,
                    },
                  })
                }
              />
              Target
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Labels
            </label>
          </div>
        )}

        {(drawing.type === "elliottImpulse" ||
          drawing.type === "elliottCorrection" ||
          drawing.type === "elliottTriangle" ||
          drawing.type === "elliottCombo") && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.enforceConstraints === true}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      enforceConstraints: e.target.checked,
                    },
                  })
                }
              />
              Enforce Constraints
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">Mode</label>
              <select
                value={drawing.settings?.mode || "strict"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      mode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="strict">Strict</option>
                <option value="loose">Loose</option>
              </select>
            </div>
            {(drawing.type === "elliottImpulse" ||
              drawing.type === "elliottCorrection") && (
              <label className="flex items-center gap-1 text-[10px]">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showFibTargets !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showFibTargets: e.target.checked,
                      },
                    })
                  }
                />
                Fib Targets
              </label>
            )}
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showDegreeLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showDegreeLabels: e.target.checked,
                    },
                  })
                }
              />
              Degree Labels
            </label>
            {drawing.settings?.showDegreeLabels !== false && (
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Degree
                </label>
                <select
                  value={drawing.settings?.degreeLabel || "Minor"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        degreeLabel: e.target.value,
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value="None">None</option>
                  <option value="Minor">Minor</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Primary">Primary</option>
                </select>
              </div>
            )}
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Labels
            </label>
          </div>
        )}

        {drawing.type === "cyclicLines" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div>
              <label className="text-[10px] text-slate-500 block">
                Direction
              </label>
              <select
                value={drawing.settings?.direction || "both"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      direction: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="both">Both</option>
                <option value="right">Right</option>
                <option value="left">Left</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Labels
            </label>
          </div>
        )}

        {drawing.type === "brush" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#3b82f6"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="20"
                value={drawing.settings?.thickness ?? 3}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      thickness: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Opacity
              </label>
              <input
                type="number"
                min="0.1"
                max="1"
                step="0.05"
                value={drawing.settings?.opacity ?? 0.8}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      opacity: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Smoothing
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={drawing.settings?.smoothing ?? 0.35}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      smoothing: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.autoScale !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      autoScale: e.target.checked,
                    },
                  })
                }
              />
              Auto Scale
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapToCandles: e.target.checked,
                    },
                  })
                }
              />
              Snap
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.locked || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      locked: e.target.checked,
                    },
                  })
                }
              />
              Lock
            </label>
          </div>
        )}

        {drawing.type === "arrow" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#3b82f6"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawing.settings?.lineWidth ?? 2}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineWidth: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Line Style
              </label>
              <select
                value={drawing.settings?.lineStyle || "solid"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-slate-500 block">Text</label>
              <input
                type="text"
                value={drawing.settings?.text || ""}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      text: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Text Color
              </label>
              <input
                type="color"
                value={drawing.settings?.textColor || "#0f172a"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      textColor: e.target.value,
                    },
                  })
                }
                className="w-full h-4 p-0 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Text Size
              </label>
              <input
                type="number"
                min="8"
                max="36"
                value={drawing.settings?.textSize ?? 12}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      textSize: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Arrowhead
              </label>
              <select
                value={drawing.settings?.arrowheadStyle || "triangle"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      arrowheadStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="triangle">Triangle</option>
                <option value="line">Line</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.extendBeyondEnd || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extendBeyondEnd: e.target.checked,
                    },
                  })
                }
              />
              Extend
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockAngle || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockAngle: e.target.checked,
                    },
                  })
                }
              />
              Lock Angle
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapToCandles: e.target.checked,
                    },
                  })
                }
              />
              Snap
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.locked || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      locked: e.target.checked,
                    },
                  })
                }
              />
              Lock
            </label>
          </div>
        )}

        {drawing.type === "rectangle" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Border</label>
              <input
                type="color"
                value={
                  drawing.settings?.borderColor || drawing.color || "#3b82f6"
                }
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      borderColor: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Fill</label>
              <input
                type="color"
                value={
                  drawing.settings?.fillColor || drawing.color || "#3b82f6"
                }
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      fillColor: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Opacity
              </label>
              <input
                type="number"
                min="0.05"
                max="1"
                step="0.05"
                value={drawing.settings?.opacity ?? 0.15}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      opacity: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawing.settings?.lineWidth ?? 1}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineWidth: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Line Style
              </label>
              <select
                value={drawing.settings?.lineStyle || "solid"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Extend</label>
              <select
                value={drawing.settings?.extend || "none"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      extend: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="none">None</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="both">Both</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockAspectRatio || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockAspectRatio: e.target.checked,
                    },
                  })
                }
              />
              Lock Aspect
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapToCandles: e.target.checked,
                    },
                  })
                }
              />
              Snap
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.locked || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      locked: e.target.checked,
                    },
                  })
                }
              />
              Lock
            </label>
          </div>
        )}

        {drawing.type === "arc" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#3b82f6"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawing.settings?.lineWidth ?? 2}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineWidth: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Line Style
              </label>
              <select
                value={drawing.settings?.lineStyle || "solid"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.fill || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      fill: e.target.checked,
                    },
                  })
                }
              />
              Fill
            </label>
            {drawing.settings?.fill && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-500 w-10">
                    Fill
                  </label>
                  <input
                    type="color"
                    value={
                      drawing.settings?.fillColor || drawing.color || "#3b82f6"
                    }
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          fillColor: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">
                    Fill Opacity
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={drawing.settings?.fillOpacity ?? 0.15}
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          fillOpacity: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                  />
                </div>
              </>
            )}
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showCenter !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showCenter: e.target.checked,
                    },
                  })
                }
              />
              Show Center
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Show Labels
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Label Mode
              </label>
              <select
                value={drawing.settings?.labelMode || "both"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      labelMode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="radius">Radius</option>
                <option value="diameter">Diameter</option>
                <option value="both">Both</option>
                <option value="none">None</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockRadius || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockRadius: e.target.checked,
                    },
                  })
                }
              />
              Lock Radius
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockAngles || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockAngles: e.target.checked,
                    },
                  })
                }
              />
              Lock Angles
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapAngles || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapAngles: e.target.checked,
                    },
                  })
                }
              />
              Snap Angles
            </label>
            {drawing.settings?.snapAngles && (
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Snap Step
                </label>
                <select
                  value={drawing.settings?.snapAngleStep || 15}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        snapAngleStep: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value={15}>15°</option>
                  <option value={30}>30°</option>
                  <option value={45}>45°</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-[10px] text-slate-500 block">
                Scale Mode
              </label>
              <select
                value={drawing.settings?.scaleMode || "data"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      scaleMode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="data">Data</option>
                <option value="screen">Screen</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.warnOnLogScale !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      warnOnLogScale: e.target.checked,
                    },
                  })
                }
              />
              Warn on Log
            </label>
          </div>
        )}

        {drawing.type === "ellipse" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#3b82f6"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawing.settings?.lineWidth ?? 2}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineWidth: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Line Style
              </label>
              <select
                value={drawing.settings?.lineStyle || "solid"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.fill || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      fill: e.target.checked,
                    },
                  })
                }
              />
              Fill
            </label>
            {drawing.settings?.fill && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-slate-500 w-10">
                    Fill
                  </label>
                  <input
                    type="color"
                    value={
                      drawing.settings?.fillColor || drawing.color || "#3b82f6"
                    }
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          fillColor: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">
                    Fill Opacity
                  </label>
                  <input
                    type="number"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={drawing.settings?.fillOpacity ?? 0.15}
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          fillOpacity: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                  />
                </div>
              </>
            )}
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showCenter !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showCenter: e.target.checked,
                    },
                  })
                }
              />
              Show Center
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showLabels !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showLabels: e.target.checked,
                    },
                  })
                }
              />
              Show Labels
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Label Mode
              </label>
              <select
                value={drawing.settings?.labelMode || "radius"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      labelMode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="radius">Radii</option>
                <option value="none">None</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockX || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockX: e.target.checked,
                    },
                  })
                }
              />
              Lock X
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.lockY || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lockY: e.target.checked,
                    },
                  })
                }
              />
              Lock Y
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.uniformScale || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      uniformScale: e.target.checked,
                    },
                  })
                }
              />
              Uniform
            </label>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Rotation
              </label>
              <input
                type="number"
                min="-180"
                max="180"
                step="1"
                value={drawing.settings?.rotation ?? 0}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      rotation: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Scale Mode
              </label>
              <select
                value={drawing.settings?.scaleMode || "data"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      scaleMode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="data">Data</option>
                <option value="screen">Screen</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.warnOnLogScale !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      warnOnLogScale: e.target.checked,
                    },
                  })
                }
              />
              Warn on Log
            </label>
          </div>
        )}

        {drawing.type === "path" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#3b82f6"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">Width</label>
              <input
                type="number"
                min="1"
                max="10"
                value={drawing.settings?.lineWidth ?? 2}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineWidth: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Line Style
              </label>
              <select
                value={drawing.settings?.lineStyle || "solid"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      lineStyle: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Arrowheads
              </label>
              <select
                value={drawing.settings?.arrowheads || "none"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      arrowheads: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="none">None</option>
                <option value="start">Start</option>
                <option value="end">End</option>
                <option value="both">Both</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.showNodes !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      showNodes: e.target.checked,
                    },
                  })
                }
              />
              Nodes
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapToCandles: e.target.checked,
                    },
                  })
                }
              />
              Snap
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.locked || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      locked: e.target.checked,
                    },
                  })
                }
              />
              Lock
            </label>
          </div>
        )}

        {drawing.type === "highlighter" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] text-slate-500 w-10">Color</label>
              <input
                type="color"
                value={drawing.color || "#facc15"}
                onChange={(e) => onSave({ ...drawing, color: e.target.value })}
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Opacity
              </label>
              <input
                type="number"
                min="0.05"
                max="1"
                step="0.05"
                value={drawing.settings?.opacity ?? 0.18}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      opacity: Number(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block">
                Blend Mode
              </label>
              <select
                value={drawing.settings?.blendMode || "multiply"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      blendMode: e.target.value,
                    },
                  })
                }
                className="w-full text-[10px] p-0.5 rounded border border-slate-300"
              >
                <option value="multiply">Multiply</option>
                <option value="overlay">Overlay</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.autoScale !== false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      autoScale: e.target.checked,
                    },
                  })
                }
              />
              Auto Scale
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.snapToCandles || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      snapToCandles: e.target.checked,
                    },
                  })
                }
              />
              Snap
            </label>
            <label className="flex items-center gap-1 text-[10px]">
              <input
                type="checkbox"
                checked={drawing.settings?.locked || false}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      locked: e.target.checked,
                    },
                  })
                }
              />
              Lock
            </label>
          </div>
        )}
        {drawing.type === "gannBox" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showGridHorz !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showGridHorz: e.target.checked,
                      },
                    })
                  }
                />
                Price Grid
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showGridVert !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showGridVert: e.target.checked,
                      },
                    })
                  }
                />
                Time Grid
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showAngles !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showAngles: e.target.checked,
                      },
                    })
                  }
                />
                Angles
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.fillBackground !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        fillBackground: e.target.checked,
                      },
                    })
                  }
                />
                Fill
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Divisions
                </label>
                <input
                  type="number"
                  min="2"
                  max="16"
                  value={drawing.settings?.gridDivisions || 8}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        gridDivisions: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Origin
                </label>
                <select
                  value={drawing.settings?.angleOrigin || "bottom-left"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        angleOrigin: e.target.value,
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value="bottom-left">B-L</option>
                  <option value="top-left">T-L</option>
                  <option value="bottom-right">B-R</option>
                  <option value="top-right">T-R</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Labels
                </label>
                <select
                  value={drawing.settings?.labelMode || "fractions"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        labelMode: e.target.value,
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value="none">None</option>
                  <option value="fractions">Fractions</option>
                  <option value="values">Values</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Opacity
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={drawing.settings?.opacity || 0.15}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        opacity: parseFloat(e.target.value),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>

            {/* Angles */}
            <div>
              <label className="text-[10px] text-slate-500 block">Angles</label>
              <div className="grid grid-cols-4 gap-1">
                {["1x1", "2x1", "1x2", "4x1", "1x4"].map((angle) => {
                  const currentAngles = drawing.settings?.angles || ["1x1"];
                  const isChecked = currentAngles.includes(angle);
                  return (
                    <label
                      key={angle}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? currentAngles.filter((a) => a !== angle)
                            : [...currentAngles, angle];
                          onSave({
                            ...drawing,
                            settings: { ...drawing.settings, angles: next },
                          });
                        }}
                      />
                      {angle}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <label className="flex items-center gap-1 text-[10px] font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={drawing.settings?.extendAngles || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        extendAngles: e.target.checked,
                      },
                    })
                  }
                />
                Extend Angles
              </label>
            </div>
          </div>
        )}
        {(drawing.type === "gannSquare" ||
          drawing.type === "gannSquareFixed") && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showGridHorz !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showGridHorz: e.target.checked,
                      },
                    })
                  }
                />
                Price Grid
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showGridVert !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showGridVert: e.target.checked,
                      },
                    })
                  }
                />
                Time Grid
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showDiagonals !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showDiagonals: e.target.checked,
                      },
                    })
                  }
                />
                Diagonals
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showArcs !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showArcs: e.target.checked,
                      },
                    })
                  }
                />
                Arcs
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showReverseArcs || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showReverseArcs: e.target.checked,
                      },
                    })
                  }
                />
                Rev Arcs
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={gannIsFixed}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        isFixed: e.target.checked,
                      },
                    })
                  }
                />
                Fixed
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.fillBackground !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        fillBackground: e.target.checked,
                      },
                    })
                  }
                />
                Fill
              </label>
            </div>

            {/* Grid Color */}
            <div className="flex space-x-1 overflow-x-auto pb-1 mt-1">
              {[drawing.color, "#94a3b8", "#ef4444", "#22c55e", "#3b82f6"].map(
                (c) => (
                  <button
                    key={c}
                    onClick={() =>
                      onSave({
                        ...drawing,
                        settings: { ...drawing.settings, gridColor: c },
                      })
                    }
                    className={`w-3 h-3 rounded-full border ${drawing.settings?.gridColor === c ? "ring-1 ring-offset-1 ring-blue-500 border-transparent" : "border-slate-300"}`}
                    style={{ backgroundColor: c }}
                  />
                ),
              )}
            </div>

            {/* Price/Bar Ratio */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-slate-500">P/B:</span>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="1000"
                className="w-12 text-[10px] p-0.5 border rounded bg-transparent"
                value={drawing.settings?.priceBarRatio || 1}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      priceBarRatio: parseFloat(e.target.value),
                    },
                  })
                }
              />
            </div>

            {/* Grid Divisions */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Divisions
                </label>
                <select
                  value={drawing.settings?.gridDivisions || 4}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        gridDivisions: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value={1}>1×1</option>
                  <option value={2}>2×2</option>
                  <option value={4}>4×4</option>
                  <option value={8}>8×8</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block">
                  Labels
                </label>
                <select
                  value={drawing.settings?.labelMode || "fractions"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        labelMode: e.target.value,
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value="none">None</option>
                  <option value="fractions">Fractions</option>
                  <option value="values">Values</option>
                </select>
              </div>
            </div>

            {/* Mode */}
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <label className="text-[10px] text-slate-500 block">Mode</label>
                <select
                  value={gannIsFixed ? "fixed" : "dynamic"}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        isFixed: e.target.value === "fixed",
                      },
                    })
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                >
                  <option value="dynamic">Dynamic</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div />
            </div>

            {/* Levels */}
            <div>
              <label className="text-[10px] text-slate-500 block">Levels</label>
              <div className="grid grid-cols-2 gap-1">
                {GANN_SQUARE_LEVELS.map((lvl) => {
                  const key = String(lvl);
                  const isChecked = gannActiveLevels.includes(lvl);
                  return (
                    <label
                      key={lvl}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? gannActiveLevels.filter((l) => l !== lvl)
                            : [...gannActiveLevels, lvl].sort((a, b) => a - b);
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              levels: next,
                            },
                          });
                        }}
                      />
                      <input
                        type="color"
                        value={gannLevelColors[key]}
                        onChange={(e) =>
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              levelColors: {
                                ...gannLevelColors,
                                [key]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-4 h-3 border border-slate-300 rounded cursor-pointer"
                      />
                      {lvl}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Fans */}
            <div>
              <label className="text-[10px] text-slate-500 block">Fans</label>
              <div className="grid grid-cols-2 gap-1">
                {GANN_SQUARE_FANS.map((fan) => {
                  const isChecked = gannActiveFans.includes(fan);
                  return (
                    <label
                      key={fan}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? gannActiveFans.filter((f) => f !== fan)
                            : [...gannActiveFans, fan];
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              visibleFans: next,
                            },
                          });
                        }}
                      />
                      <input
                        type="color"
                        value={gannSquareFanColors[fan]}
                        onChange={(e) =>
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              fanColors: {
                                ...gannSquareFanColors,
                                [fan]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-4 h-3 border border-slate-300 rounded cursor-pointer"
                      />
                      {fan}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Arcs */}
            <div>
              <label className="text-[10px] text-slate-500 block">Arcs</label>
              <div className="grid grid-cols-2 gap-1">
                {GANN_SQUARE_ARCS.map((arc) => {
                  const isChecked = gannActiveArcs.includes(arc);
                  return (
                    <label
                      key={arc}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? gannActiveArcs.filter((a) => a !== arc)
                            : [...gannActiveArcs, arc];
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              visibleArcs: next,
                            },
                          });
                        }}
                      />
                      <input
                        type="color"
                        value={gannArcColors[arc]}
                        onChange={(e) =>
                          onSave({
                            ...drawing,
                            settings: {
                              ...drawing.settings,
                              arcColors: {
                                ...gannArcColors,
                                [arc]: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-4 h-3 border border-slate-300 rounded cursor-pointer"
                      />
                      {arc}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <label className="flex items-center gap-1 text-[10px] font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={drawing.settings?.extendDiagonals || false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        extendDiagonals: e.target.checked,
                      },
                    })
                  }
                />
                Extend Diagonals
              </label>
            </div>
          </div>
        )}
        {drawing.type === "fibTrendTime" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showLabels !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showLabels: e.target.checked,
                      },
                    })
                  }
                />
                Labels
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={drawing.settings?.showVisuals !== false}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        showVisuals: e.target.checked,
                      },
                    })
                  }
                />
                Trend Lines
              </label>
            </div>

            {/* Ratios */}
            <div>
              <label className="text-[10px] text-slate-500 block">Ratios</label>
              <div className="grid grid-cols-4 gap-1">
                {[1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144].map((lvl) => {
                  const currentLevels = drawing.settings?.levels || [
                    1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144,
                  ];
                  const isChecked = currentLevels.includes(lvl);
                  return (
                    <label
                      key={lvl}
                      className="flex items-center gap-1 text-[9px]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const next = isChecked
                            ? currentLevels.filter((l) => l !== lvl)
                            : [...currentLevels, lvl].sort((a, b) => a - b);
                          onSave({
                            ...drawing,
                            settings: { ...drawing.settings, levels: next },
                          });
                        }}
                      />
                      {lvl}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {drawing.type === "flatTopBottom" && (
          <>
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 w-10">Mode</label>
              <select
                value={flatMode}
                onChange={(e) => setFlatMode(e.target.value)}
                className="flex-1 w-14 px-1 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="auto">Auto</option>
                <option value="top">Flat Top</option>
                <option value="bottom">Flat Bottom</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <label className="text-[10px] text-slate-500 w-10">Opacity</label>
              <input
                type="number"
                step="0.05"
                min="0"
                max="1"
                value={fillOpacity}
                onChange={(e) => setFillOpacity(Number(e.target.value))}
                className="flex-1 w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </>
        )}
        {["longPosition", "shortPosition"].includes(drawing.type) && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Profit Color
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={drawing.settings?.profitColor}
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          profitColor: e.target.value,
                        },
                      })
                    }
                    className="w-full h-4 p-0 order border-slate-300 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Loss Color
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={drawing.settings?.lossColor}
                    onChange={(e) =>
                      onSave({
                        ...drawing,
                        settings: {
                          ...drawing.settings,
                          lossColor: e.target.value,
                        },
                      })
                    }
                    className="w-full h-4 p-0 border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-[9px] text-slate-500 block mb-0.5">
                Target R:R
              </label>
              <input
                type="number"
                step="0.1"
                value={drawing.settings?.riskRewardRatio || 2}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: {
                      ...drawing.settings,
                      riskRewardRatio: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}
        {["dateRange", "priceRange", "datePriceRange"].includes(
          drawing.type,
        ) && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Line Color
                </label>
                <input
                  type="color"
                  value={drawing.settings?.lineColor}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        lineColor: e.target.value,
                      },
                    })
                  }
                  className="w-full h-4 p-0 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Background
                </label>
                <input
                  type="text"
                  value={drawing.settings?.backgroundColor}
                  onChange={(e) =>
                    onSave({
                      ...drawing,
                      settings: {
                        ...drawing.settings,
                        backgroundColor: e.target.value,
                      },
                    })
                  }
                  className="w-full text-[10px] px-1 py-0.5 border border-slate-300 rounded"
                />
              </div>
            </div>
          </div>
        )}
        {drawing.type === "ghostFeed" && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            <div>
              <label className="text-[9px] text-slate-500 block mb-0.5">
                Line Color
              </label>
              <input
                type="color"
                value={drawing.settings?.color || "#9E9E9E"}
                onChange={(e) =>
                  onSave({
                    ...drawing,
                    settings: { ...drawing.settings, color: e.target.value },
                  })
                }
                className="w-full h-4 p-0 border border-slate-300 rounded"
              />
            </div>
          </div>
        )}
        {[
          "text",
          "anchoredText",
          "note",
          "priceNote",
          "callout",
          "pin",
          "flag",
        ].includes(drawing.type) && (
          <div className="col-span-2 space-y-2 mt-1 border-t border-slate-100 pt-1">
            {["text", "anchoredText", "note", "priceNote", "callout"].includes(
              drawing.type,
            ) && (
              <div className="flex items-center gap-1">
                <label className="text-[10px] text-slate-500 w-10">Text</label>
                <input
                  type="text"
                  value={textSettings.text || ""}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  className="flex-1 px-1.5 py-0.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Label..."
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Font
                </label>
                <input
                  type="text"
                  value={textSettings.fontFamily || "sans-serif"}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      fontFamily: e.target.value,
                    }))
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Size
                </label>
                <input
                  type="number"
                  min="8"
                  max="48"
                  value={textSettings.fontSize || 14}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      fontSize: Number(e.target.value),
                    }))
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Color
                </label>
                <input
                  type="color"
                  value={textSettings.color || "#607D8B"}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-full h-4 p-0 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Opacity
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={textSettings.opacity ?? 1}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      opacity: Number(e.target.value),
                    }))
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  BG
                </label>
                <input
                  type="color"
                  value={textSettings.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      backgroundColor: e.target.value,
                    }))
                  }
                  className="w-full h-4 p-0 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  BG A
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={textSettings.backgroundAlpha ?? 1}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      backgroundAlpha: Number(e.target.value),
                    }))
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Border
                </label>
                <input
                  type="color"
                  value={textSettings.borderColor || "#607D8B"}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      borderColor: e.target.value,
                    }))
                  }
                  className="w-full h-4 p-0 border border-slate-300 rounded"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 block mb-0.5">
                  Border W
                </label>
                <input
                  type="number"
                  min="0"
                  max="6"
                  value={textSettings.borderWidth ?? 0}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      borderWidth: Number(e.target.value),
                    }))
                  }
                  className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={textSettings.autoHide || false}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      autoHide: e.target.checked,
                    }))
                  }
                />
                Auto Hide
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={textSettings.adaptiveOpacity !== false}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      adaptiveOpacity: e.target.checked,
                    }))
                  }
                />
                Adaptive
              </label>
            </div>

            {["text", "note"].includes(drawing.type) && (
              <label className="flex items-center gap-1 text-[10px]">
                <input
                  type="checkbox"
                  checked={textSettings.autoScale || false}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      autoScale: e.target.checked,
                    }))
                  }
                />
                Auto Scale
              </label>
            )}

            {drawing.type === "anchoredText" && (
              <label className="flex items-center gap-1 text-[10px]">
                <input
                  type="checkbox"
                  checked={textSettings.showLeader !== false}
                  onChange={(e) =>
                    setTextSettings((prev) => ({
                      ...prev,
                      showLeader: e.target.checked,
                    }))
                  }
                />
                Leader Line
              </label>
            )}

            {drawing.type === "priceNote" && (
              <>
                <label className="flex items-center gap-1 text-[10px]">
                  <input
                    type="checkbox"
                    checked={textSettings.extendLine !== false}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        extendLine: e.target.checked,
                      }))
                    }
                  />
                  Extend Line
                </label>
                <label className="flex items-center gap-1 text-[10px]">
                  <input
                    type="checkbox"
                    checked={textSettings.showPriceLabel !== false}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        showPriceLabel: e.target.checked,
                      }))
                    }
                  />
                  Show Price
                </label>
              </>
            )}

            {drawing.type === "callout" && (
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="text-[9px] text-slate-500 block mb-0.5">
                    Arrow
                  </label>
                  <select
                    value={textSettings.arrowStyle || "triangle"}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        arrowStyle: e.target.value,
                      }))
                    }
                    className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                  >
                    <option value="triangle">Triangle</option>
                    <option value="line">Line</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 block mb-0.5">
                    Bubble
                  </label>
                  <select
                    value={textSettings.bubbleShape || "round"}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        bubbleShape: e.target.value,
                      }))
                    }
                    className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                  >
                    <option value="round">Round</option>
                    <option value="rect">Rect</option>
                  </select>
                </div>
              </div>
            )}

            {["pin", "flag"].includes(drawing.type) && (
              <div className="grid grid-cols-2 gap-1">
                <div>
                  <label className="text-[9px] text-slate-500 block mb-0.5">
                    Size
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="48"
                    value={textSettings.size || 20}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        size: Number(e.target.value),
                      }))
                    }
                    className="w-full text-[10px] p-0.5 rounded border border-slate-300"
                  />
                </div>
                <div className="flex items-center gap-1 text-[10px]">
                  <input
                    type="checkbox"
                    checked={textSettings.showTooltip || false}
                    onChange={(e) =>
                      setTextSettings((prev) => ({
                        ...prev,
                        showTooltip: e.target.checked,
                      }))
                    }
                  />
                  Tooltip
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-1 mt-2 border-t border-slate-100 pt-2">
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
  );
};

/* -------------------------------------------------
   Indicator Settings Editor
------------------------------------------------- */
const IndicatorSettingsEditor = ({ indicator, onSave, onCancel }) => {
  const [params, setParams] = useState({ ...indicator.params });
  const [color, setColor] = useState(indicator.color || "#333");

  const formatName = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl rounded-lg p-3 w-64 text-xs animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-700 border-b border-slate-100 pb-1">
          {indicator.name} Settings
        </h4>

        {/* Params */}
        <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {Object.entries(params).map(([key, value]) => {
            if (key.startsWith("_")) return null;
            return (
              <div key={key}>
                <label className="text-[10px] text-slate-500 block mb-0.5">
                  {formatName(key)}
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setParams((p) => ({
                      ...p,
                      [key]: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full text-[11px] p-1 rounded border border-slate-300 focus:border-blue-500 outline-none"
                />
              </div>
            );
          })}
          {Object.keys(params).length === 0 && (
            <div className="text-slate-400 italic text-[10px]">
              No parameters
            </div>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="text-[10px] text-slate-500 block mb-0.5">
            Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-6 border border-slate-300 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-2 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...indicator, params, color })}
            className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 shadow-sm transition-colors flex items-center gap-1"
          >
            <Check size={12} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ChartLegend({
  activeIndicators = [],
  currentValues = {},
  onRemove,
  onUpdateIndicator,
  drawings = [],
  patterns = [],
  onRemoveDrawing,
  onUpdateDrawing,
  onRemovePattern,
  onUndo,
  onClearAll,
}) {
  const [sections, setSections] = useState({
    indicators: false,
    patterns: false,
    drawings: false,
  });
  const [editingIndicatorUuid, setEditingIndicatorUuid] = useState(null);
  const [editingDrawingIndex, setEditingDrawingIndex] = useState(null);

  const hasContent =
    activeIndicators.length > 0 || drawings.length > 0 || patterns.length > 0;

  if (!hasContent) return null;

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEditIndicator = (uuid) => {
    setEditingIndicatorUuid((prev) => (prev === uuid ? null : uuid));
  };

  const handleEditDrawing = (index) => {
    setEditingDrawingIndex((prev) => (prev === index ? null : index));
  };

  const handleSaveIndicator = (updatedIndicator) => {
    if (onUpdateIndicator) {
      onUpdateIndicator(updatedIndicator);
    }
    setEditingIndicatorUuid(null);
  };

  const handleSaveDrawing = (updatedDrawing, index, closeAfterSave = false) => {
    if (onUpdateDrawing) {
      onUpdateDrawing(updatedDrawing, index);
    }
    if (closeAfterSave) {
      setEditingDrawingIndex(null);
    }
  };

  /* -------------------------------------------------
     Render Helpers
  ------------------------------------------------- */
  const renderIndicator = (ind) => {
    const val = currentValues[ind.uuid];
    const label = ind.name || ind.id;
    let displayValue = "—";

    if (val !== undefined && val !== null) {
      if (Array.isArray(val)) {
        displayValue = val
          .map((v) => (typeof v === "number" ? v.toFixed(2) : v))
          .join(" | ");
      } else if (typeof val === "object" && val.value !== undefined) {
        displayValue =
          typeof val.value === "number" ? val.value.toFixed(2) : val.value;
      } else if (typeof val === "number") {
        displayValue = val.toFixed(2);
      } else {
        displayValue = String(val);
      }
    }

    const displayColor = (val && val.color) || ind.color || "#333";
    const isEditing = editingIndicatorUuid === ind.uuid;

    return (
      <div key={ind.uuid} className="flex flex-col">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-slate-200 text-xs font-medium group hover:bg-white min-w-fit">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: displayColor }}
          />
          <span style={{ color: displayColor }}>{label}</span>
          {ind.params?.period && (
            <span className="text-slate-400">({ind.params.period})</span>
          )}
          <span className="text-slate-700 font-bold ml-1">{displayValue}</span>
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(ind.uuid);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-all"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        {isEditing && (
          <IndicatorSettingsEditor
            indicator={ind}
            onSave={handleSaveIndicator}
            onCancel={() => setEditingIndicatorUuid(null)}
          />
        )}
      </div>
    );
  };

  const renderPattern = (pid) => {
    const meta = PatternRegistry.getPattern(pid);
    const label = meta?.shortName || pid;
    const bias = meta?.bias || "neutral";
    const color =
      bias === "bullish"
        ? "#10b981"
        : bias === "bearish"
          ? "#ef4444"
          : "#8b5cf6";

    return (
      <div
        key={pid}
        className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-slate-200 text-xs font-medium group hover:bg-white min-w-fit"
      >
        <CandlestickChart className="w-3 h-3 text-slate-400" />
        <span style={{ color }}>{label}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemovePattern(pid);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 ml-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-all"
          title="Remove"
        >
          <X size={12} />
        </button>
      </div>
    );
  };

  const renderDrawing = (d, index) => {
    const label = d.type
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
    const isEditing = editingDrawingIndex === index;
    const displayColor = d.color || "#2962FF";

    return (
      <div key={`${d.type}-${index}`} className="flex flex-col">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded shadow-sm border border-slate-200 text-xs font-medium group hover:bg-white min-w-fit">
          <PenTool className="w-3 h-3" style={{ color: displayColor }} />
          <span className="text-slate-600">{label}</span>
          <div className="flex items-center gap-0.5 ml-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveDrawing(index);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 ml-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-all"
              title="Remove"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        {isEditing && (
          <DrawingSettingsEditor
            drawing={d}
            onSave={(updated, closeAfterSave = false) =>
              handleSaveDrawing(updated, index, closeAfterSave)
            }
            onCancel={() => setEditingDrawingIndex(null)}
          />
        )}
      </div>
    );
  };

  const SectionHeader = ({ title, count, isOpen, onToggle, icon: Icon }) => (
    <button
      onClick={onToggle}
      className="flex items-center gap-1.5 px-2 py-1 bg-white/90 backdrop-blur-sm rounded shadow-sm border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white transition-all w-full"
    >
      {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      <Icon size={12} className="text-slate-500" />
      <span>{title}</span>
      {count > 0 && (
        <span className="ml-auto bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div
      className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 select-none pointer-events-auto"
      style={{ maxWidth: "320px", alignItems: "flex-start" }}
    >
      {/* Global Controls */}
      <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1.5 py-1 rounded shadow-sm border border-slate-200">
        {onUndo && (
          <button
            onClick={onUndo}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-700 transition-colors"
            title="Undo Last Action"
          >
            <RotateCcw size={13} />
          </button>
        )}
        {onClearAll && (
          <>
            <div className="w-px h-3 bg-slate-200 mx-0.5" />
            <button
              onClick={onClearAll}
              className="p-1 hover:bg-red-50 rounded text-slate-500 hover:text-red-500 transition-colors"
              title="Clear All"
            >
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>

      {/* Indicators Section */}
      {activeIndicators.length > 0 && (
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader
            title="Indicators"
            count={activeIndicators.length}
            isOpen={sections.indicators}
            onToggle={() => toggleSection("indicators")}
            icon={Activity}
          />
          {sections.indicators && (
            <div className="flex flex-col gap-1 pl-1">
              {activeIndicators.map(renderIndicator)}
            </div>
          )}
        </div>
      )}

      {/* Patterns Section */}
      {patterns.length > 0 && (
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader
            title="Patterns"
            count={patterns.length}
            isOpen={sections.patterns}
            onToggle={() => toggleSection("patterns")}
            icon={CandlestickChart}
          />
          {sections.patterns && (
            <div className="flex flex-col gap-1 pl-1">
              {patterns.map(renderPattern)}
            </div>
          )}
        </div>
      )}

      {/* Drawings Section */}
      {drawings.length > 0 && (
        <div className="flex flex-col gap-1 w-full">
          <SectionHeader
            title="Drawings"
            count={drawings.length}
            isOpen={sections.drawings}
            onToggle={() => toggleSection("drawings")}
            icon={PenTool}
          />
          {sections.drawings && (
            <div className="flex flex-col gap-1 pl-1">
              {drawings.map(renderDrawing)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
