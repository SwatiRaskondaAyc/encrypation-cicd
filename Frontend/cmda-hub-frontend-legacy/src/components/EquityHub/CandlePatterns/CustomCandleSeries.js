/**
 * CustomCandleSeries - TradingView-style candle renderer
 *
 * Key features:
 * - Proportional gap between candles (never touching)
 * - Smooth scaling at all zoom levels
 * - Configurable body width and gap ratios
 */

const DEFAULT_OPTIONS = {
  candleType: "candles", // "candles" | "hollow" | "bar"
  colorBy: "closeOpen", // "closeOpen" | "prevClose"
  upColor: "#26a69a",
  downColor: "#ef5350",
  bodyOpacity: 1,
  // Body takes 35% of bar spacing, leaving 65% for gaps
  bodyWidthRatio: 0.35,
  // Minimum gap on each side (15px * 2 = 30px total between candles)
  minGapPx: 15,
  borderUpColor: "#26a69a",
  borderDownColor: "#ef5350",
  borderVisible: true,
  borderOpacity: 1,
  borderWidthPx: 1,
  wickUpColor: "#26a69a",
  wickDownColor: "#ef5350",
  wickVisible: true,
  wickOpacity: 1,
  wickWidthPx: 1,
  minBodyHeight: 1,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const resolveOptions = (options = {}) => ({
  ...DEFAULT_OPTIONS,
  ...options,
});

class CustomCandleRenderer {
  update(data, options) {
    this._data = data;
    this._options = resolveOptions(options);
  }

  draw(target, priceConverter) {
    if (!this._data || !this._data.bars) return;

    const data = this._data;
    const opts = this._options;

    target.useBitmapCoordinateSpace(
      ({ context: ctx, horizontalPixelRatio, verticalPixelRatio }) => {
        const bars = data.bars;
        const barSpacing = (data.barSpacing || 6) * horizontalPixelRatio;

        // FIXED GAP APPROACH: Always subtract fixed pixels for gap, regardless of zoom
        // This ensures consistent visual separation at all zoom levels
        const fixedGapPx = opts.minGapPx * horizontalPixelRatio; // Gap on each side
        const totalGap = fixedGapPx * 2; // Total gap (left + right)

        // Body width = bar spacing minus fixed gap, with minimum of 1px
        let bodyWidth = Math.max(1, Math.floor(barSpacing - totalGap));

        // Make odd for crisp center alignment
        if (bodyWidth > 1 && bodyWidth % 2 === 0) bodyWidth -= 1;

        const halfBody = Math.floor(bodyWidth / 2);

        // Wick is always 1 device pixel (or minGapPx scaled)
        const wickWidth = Math.max(1, Math.round(1 * horizontalPixelRatio));

        // Border width
        const borderWidth = Math.max(
          1,
          Math.round(opts.borderWidthPx * horizontalPixelRatio),
        );

        const visibleRange = data.visibleRange;
        const from = Math.max(0, Math.floor(visibleRange?.from ?? 0));
        const to = Math.min(
          bars.length - 1,
          Math.ceil(visibleRange?.to ?? bars.length - 1),
        );

        for (let i = from; i <= to; i++) {
          const bar = bars[i];
          if (!bar || !Number.isFinite(bar.x)) continue;

          const item = bar.originalData;
          if (!item) continue;

          const { open, high, low, close } = item;
          if (
            open === undefined ||
            high === undefined ||
            low === undefined ||
            close === undefined
          )
            continue;

          const x = Math.round(bar.x * horizontalPixelRatio);
          const openY = priceConverter(open);
          const highY = priceConverter(high);
          const lowY = priceConverter(low);
          const closeY = priceConverter(close);

          if (
            openY === null ||
            highY === null ||
            lowY === null ||
            closeY === null
          )
            continue;

          const yOpen = Math.round(openY * verticalPixelRatio);
          const yClose = Math.round(closeY * verticalPixelRatio);
          const yHigh = Math.round(highY * verticalPixelRatio);
          const yLow = Math.round(lowY * verticalPixelRatio);

          // Determine if bullish
          let isUp = close >= open;
          if (opts.colorBy === "prevClose") {
            const prev = bars[i - 1]?.originalData;
            if (typeof prev?.close === "number") {
              isUp = close >= prev.close;
            }
          }

          // Body bounds
          const bodyTop = Math.min(yOpen, yClose);
          const bodyBottom = Math.max(yOpen, yClose);
          let bodyHeight = Math.max(opts.minBodyHeight, bodyBottom - bodyTop);

          // Colors
          const wickColor = isUp ? opts.wickUpColor : opts.wickDownColor;
          const bodyColor = isUp ? opts.upColor : opts.downColor;
          const borderColor = isUp ? opts.borderUpColor : opts.borderDownColor;

          // === BAR (OHLC) STYLE ===
          if (opts.candleType === "bar") {
            ctx.save();
            ctx.strokeStyle = wickColor;
            ctx.lineWidth = wickWidth;
            ctx.globalAlpha = clamp(opts.wickOpacity, 0, 1);

            // Vertical line (high to low)
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();

            // Left tick (open)
            ctx.beginPath();
            ctx.moveTo(x - halfBody, yOpen);
            ctx.lineTo(x, yOpen);
            ctx.stroke();

            // Right tick (close)
            ctx.beginPath();
            ctx.moveTo(x, yClose);
            ctx.lineTo(x + halfBody, yClose);
            ctx.stroke();

            ctx.restore();
            continue;
          }

          // === CANDLE STYLE ===
          // Draw wick first (behind body)
          if (opts.wickVisible) {
            ctx.save();
            ctx.strokeStyle = wickColor;
            ctx.lineWidth = wickWidth;
            ctx.globalAlpha = clamp(opts.wickOpacity, 0, 1);
            ctx.beginPath();
            ctx.moveTo(x, yHigh);
            ctx.lineTo(x, yLow);
            ctx.stroke();
            ctx.restore();
          }

          // Draw body
          const isHollow = opts.candleType === "hollow" && isUp;
          const bodyLeft = x - halfBody;

          if (!isHollow) {
            // Filled body
            ctx.save();
            ctx.fillStyle = bodyColor;
            ctx.globalAlpha = clamp(opts.bodyOpacity, 0, 1);
            ctx.fillRect(bodyLeft, bodyTop, bodyWidth, bodyHeight);
            ctx.restore();
          }

          // Draw border
          if (opts.borderVisible || isHollow) {
            ctx.save();
            ctx.strokeStyle = isHollow ? bodyColor : borderColor;
            ctx.lineWidth = borderWidth;
            ctx.globalAlpha = clamp(opts.borderOpacity, 0, 1);
            ctx.strokeRect(bodyLeft, bodyTop, bodyWidth, bodyHeight);
            ctx.restore();
          }
        }
      },
    );
  }
}

export class CustomCandleSeries {
  constructor() {
    this._renderer = new CustomCandleRenderer();
  }

  renderer() {
    return this._renderer;
  }

  update(data, options) {
    this._renderer.update(data, options);
  }

  priceValueBuilder(plotRow) {
    if (!plotRow) return [0];
    const high =
      plotRow.high ?? plotRow.close ?? plotRow.value ?? plotRow.open ?? 0;
    const low =
      plotRow.low ?? plotRow.close ?? plotRow.value ?? plotRow.open ?? 0;
    const close = plotRow.close ?? plotRow.value ?? plotRow.open ?? high;
    return [high, low, close];
  }

  isWhitespace(data) {
    return (
      data === undefined ||
      data === null ||
      data.open === undefined ||
      data.high === undefined ||
      data.low === undefined ||
      data.close === undefined
    );
  }

  defaultOptions() {
    return { ...DEFAULT_OPTIONS };
  }
}
