
export const PatternRegistry = {
    patterns: {
        // Single Candlestick Patterns
        "MICRO-S-001": { name: "Bullish Marubozu", shortName: "BM", bias: "bullish" },
        "MICRO-S-002": { name: "Bearish Marubozu", shortName: "BM", bias: "bearish" },
        "MICRO-S-003": { name: "Doji", shortName: "DJ", bias: "neutral" },
        "MICRO-S-004": { name: "Spinning Top", shortName: "ST", bias: "neutral" },
        "MICRO-S-005": { name: "Hammer", shortName: "HM", bias: "bullish" },
        "MICRO-S-006": { name: "Hanging Man", shortName: "HGM", bias: "bearish" },
        "MICRO-S-007": { name: "Shooting Star", shortName: "SS", bias: "bearish" },
        "MICRO-S-008": { name: "Inverted Hammer", shortName: "IH", bias: "bullish" },
        "MICRO-S-009": { name: "Dragonfly Doji", shortName: "DD", bias: "bullish" },
        "MICRO-S-010": { name: "Gravestone Doji", shortName: "GD", bias: "bearish" },

        // Two-Candlestick Patterns
        "MICRO-D-001": { name: "Bullish Engulfing", shortName: "BE", bias: "bullish" },
        "MICRO-D-002": { name: "Bearish Engulfing", shortName: "BrE", bias: "bearish" },
        "MICRO-D-003": { name: "Bullish Harami", shortName: "BH", bias: "bullish" },
        "MICRO-D-004": { name: "Bearish Harami", shortName: "BrH", bias: "bearish" },
        "MICRO-D-005": { name: "Piercing Pattern", shortName: "PP", bias: "bullish" },
        "MICRO-D-006": { name: "Dark Cloud Cover", shortName: "DCC", bias: "bearish" },
        "MICRO-D-007": { name: "Tweezer Bottom", shortName: "TB", bias: "bullish" },
        "MICRO-D-008": { name: "Tweezer Top", shortName: "TT", bias: "bearish" },

        // Three-Candlestick Patterns
        "MICRO-T-001": { name: "Morning Star", shortName: "MS", bias: "bullish" },
        "MICRO-T-002": { name: "Evening Star", shortName: "ES", bias: "bearish" },
        "MICRO-T-003": { name: "Three White Soldiers", shortName: "TWS", bias: "bullish" },
        "MICRO-T-004": { name: "Three Black Crows", shortName: "TBC", bias: "bearish" },
        "MICRO-T-005": { name: "Three Inside Up", shortName: "TIU", bias: "bullish" },
        "MICRO-T-006": { name: "Three Inside Down", shortName: "TID", bias: "bearish" },
        "MICRO-T-007": { name: "Abandoned Baby Bottom", shortName: "ABB", bias: "bullish" },
        "MICRO-T-008": { name: "Abandoned Baby Top", shortName: "ABT", bias: "bearish" },
    },

    getPattern: function (id) {
        return this.patterns[id] || { name: id, shortName: id?.substring(0, 3) || 'UNK', bias: 'neutral' };
    }
};