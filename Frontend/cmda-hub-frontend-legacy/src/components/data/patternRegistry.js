
export const PatternRegistry = {
  MASTER: {
    "MICRO-S-001": { name: "Bullish Marubozu", shortName: "Bull Maru", bias: "bullish", type: "continuation" },
    "MICRO-S-002": { name: "Bearish Marubozu", shortName: "Bear Maru", bias: "bearish", type: "continuation" },
    "MICRO-S-003": { name: "Doji", shortName: "Doji", bias: "neutral", type: "indecision" },
    "MICRO-S-004": { name: "Spinning Top", shortName: "Spin Top", bias: "neutral", type: "indecision" },
    "MICRO-S-005": { name: "Hammer", shortName: "Hammer", bias: "bullish", type: "reversal" },
    "MICRO-S-006": { name: "Hanging Man", shortName: "Hang Man", bias: "bearish", type: "reversal" },
    "MICRO-S-007": { name: "Shooting Star", shortName: "Shoot Star", bias: "bearish", type: "reversal" },
    "MICRO-S-008": { name: "Inverted Hammer", shortName: "Inv Hammer", bias: "bullish", type: "reversal" },
    "MICRO-S-009": { name: "Dragonfly Doji", shortName: "Dfly Doji", bias: "bullish", type: "reversal" },
    "MICRO-S-010": { name: "Gravestone Doji", shortName: "Grv Doji", bias: "bearish", type: "reversal" },
    "MICRO-D-001": { name: "Bullish Engulfing", shortName: "Bull Engulf", bias: "bullish", type: "reversal" },
    "MICRO-D-002": { name: "Bearish Engulfing", shortName: "Bear Engulf", bias: "bearish", type: "reversal" },
    "MICRO-D-003": { name: "Bullish Harami", shortName: "Bull Harami", bias: "bullish", type: "reversal" },
    "MICRO-D-004": { name: "Bearish Harami", shortName: "Bear Harami", bias: "bearish", type: "reversal" },
    "MICRO-D-005": { name: "Piercing Pattern", shortName: "Pierce", bias: "bullish", type: "reversal" },
    "MICRO-D-006": { name: "Dark Cloud Cover", shortName: "Dark Cloud", bias: "bearish", type: "reversal" },
    "MICRO-T-001": { name: "Morning Star", shortName: "Morn Star", bias: "bullish", type: "reversal" },
    "MICRO-T-002": { name: "Evening Star", shortName: "Eve Star", bias: "bearish", type: "reversal" },
  },

  buildByType() {
    const byType = {};
    for (const [pid, meta] of Object.entries(this.MASTER)) {
      const { type, bias, name, shortName } = meta;
      if (!byType[type]) byType[type] = {};
      if (!byType[type][bias]) byType[type][bias] = {};
      byType[type][bias][pid] = shortName || name;
    }
    return byType;
  },

  buildByBias() {
    const byBias = {};
    for (const [pid, meta] of Object.entries(this.MASTER)) {
      const { bias, type, name, shortName } = meta;
      if (!byBias[bias]) byBias[bias] = {};
      if (!byBias[bias][type]) byBias[bias][type] = {};
      byBias[bias][type][pid] = shortName || name;
    }
    return byBias;
  },

  getPattern(patternId) {
    return this.MASTER[patternId] || null;
  },
};