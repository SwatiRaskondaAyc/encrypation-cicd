

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createChart } from 'lightweight-charts';

const SAMPLE_DATA = [
  { Date: '2024-06-01', Open: 1400, High: 1420, Low: 1390, Close: 1410, Volume: 1500000 },
  { Date: '2024-06-02', Open: 1410, High: 1425, Low: 1405, Close: 1415, Volume: 1600000 },
  { Date: '2024-06-03', Open: 1415, High: 1430, Low: 1410, Close: 1420, Volume: 1700000 },
  { Date: '2024-06-04', Open: 1420, High: 1435, Low: 1415, Close: 1425, Volume: 1800000 },
  { Date: '2024-06-05', Open: 1425, High: 1440, Low: 1420, Close: 1430, Volume: 1900000 },
  { Date: '2024-06-06', Open: 1430, High: 1445, Low: 1425, Close: 1440, Volume: 2000000 },
  { Date: '2024-06-07', Open: 1445, High: 1450, Low: 1410, Close: 1415, Volume: 2500000 },
  { Date: '2024-06-10', Open: 1415, High: 1420, Low: 1400, Close: 1405, Volume: 2100000 },
  { Date: '2024-06-11', Open: 1405, High: 1410, Low: 1390, Close: 1395, Volume: 2200000 },
  { Date: '2024-06-12', Open: 1395, High: 1400, Low: 1380, Close: 1385, Volume: 2300000 },
  { Date: '2024-06-13', Open: 1385, High: 1390, Low: 1370, Close: 1375, Volume: 2400000 },
  { Date: '2024-06-14', Open: 1375, High: 1380, Low: 1360, Close: 1365, Volume: 2500000 },
  { Date: '2024-06-17', Open: 1365, High: 1370, Low: 1350, Close: 1355, Volume: 2600000 },
  { Date: '2024-06-18', Open: 1350, High: 1380, Low: 1345, Close: 1375, Volume: 2800000 },
  { Date: '2024-06-19', Open: 1375, High: 1390, Low: 1370, Close: 1385, Volume: 2700000 },
  { Date: '2024-06-20', Open: 1385, High: 1400, Low: 1380, Close: 1395, Volume: 2600000 },
  { Date: '2024-06-21', Open: 1395, High: 1410, Low: 1390, Close: 1405, Volume: 2500000 },
  { Date: '2024-06-24', Open: 1405, High: 1420, Low: 1400, Close: 1415, Volume: 2400000 },
  { Date: '2024-06-25', Open: 1415, High: 1430, Low: 1410, Close: 1425, Volume: 2300000 },
  { Date: '2024-06-26', Open: 1425, High: 1440, Low: 1420, Close: 1435, Volume: 2200000 },
  { Date: '2024-06-27', Open: 1435, High: 1470, Low: 1430, Close: 1440, Volume: 2600000 },
  { Date: '2024-06-28', Open: 1440, High: 1445, Low: 1425, Close: 1430, Volume: 2500000 },
  { Date: '2024-07-01', Open: 1430, High: 1435, Low: 1415, Close: 1420, Volume: 2400000 },
  { Date: '2024-07-02', Open: 1420, High: 1425, Low: 1405, Close: 1410, Volume: 2300000 },
  { Date: '2024-07-03', Open: 1410, High: 1415, Low: 1395, Close: 1400, Volume: 2200000 },
  { Date: '2024-07-04', Open: 1400, High: 1405, Low: 1360, Close: 1395, Volume: 2700000 },
  { Date: '2024-07-05', Open: 1395, High: 1410, Low: 1390, Close: 1405, Volume: 2600000 },
  { Date: '2024-07-08', Open: 1405, High: 1420, Low: 1400, Close: 1415, Volume: 2500000 },
];

const PATTERN_CONFIG = {
  bullishEngulfing: { name: 'Bullish Engulfing', bgColor: 'rgba(180, 231, 229, 0.4)', textColor: '#FFFFFF', badgeBg: '#EF5350', annotation: 'BE', type: 'bullish' },
  bearishEngulfing: { name: 'Bearish Engulfing', bgColor: 'rgba(255, 182, 193, 0.4)', textColor: '#FFFFFF', badgeBg: '#EF5350', annotation: 'BE', type: 'bearish' },
  hammer: { name: 'Hammer', bgColor: 'rgba(180, 231, 229, 0.4)', textColor: '#FFFFFF', badgeBg: '#2196F3', annotation: 'H', type: 'bullish' },
  shootingStar: { name: 'Shooting Star', bgColor: 'rgba(255, 182, 193, 0.4)', textColor: '#FFFFFF', badgeBg: '#EF5350', annotation: 'SS', type: 'bearish' },
  doji: { name: 'Doji', bgColor: 'rgba(189, 189, 189, 0.4)', textColor: '#FFFFFF', badgeBg: '#757575', annotation: 'D', type: 'neutral' },
};

function calculatePatternScore(pattern, data, startIdx, endIdx) {
  let score = 5;
  if (pattern === 'bullishEngulfing' || pattern === 'bearishEngulfing') {
    const prev = data[startIdx], current = data[endIdx];
    const prevBody = Math.abs(prev.close - prev.open), currBody = Math.abs(current.close - current.open);
    const sizeRatio = currBody / prevBody;
    if (sizeRatio > 2.5) score += 3; else if (sizeRatio > 2.0) score += 2; else if (sizeRatio > 1.5) score += 1;
    if (current.volume > prev.volume * 1.5) score += 2; else if (current.volume > prev.volume * 1.2) score += 1;
  } else if (pattern === 'hammer' || pattern === 'shootingStar') {
    const candle = data[endIdx], body = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const shadowRatio = pattern === 'hammer' ? lowerShadow / body : upperShadow / body;
    if (shadowRatio > 3.5) score += 3; else if (shadowRatio > 3.0) score += 2; else if (shadowRatio > 2.5) score += 1;
  } else if (pattern === 'doji') {
    const candle = data[endIdx], bodySize = Math.abs(candle.close - candle.open), totalRange = candle.high - candle.low;
    const bodyRatio = bodySize / totalRange;
    if (bodyRatio < 0.05) score += 3; else if (bodyRatio < 0.08) score += 2; else if (bodyRatio < 0.1) score += 1;
  }
  return Math.min(10, Math.max(1, score));
}

function detectPatterns(data, enabledPatterns) {
  const backgroundRects = [], detectedPatterns = {};
  let patternId = 1;

  for (let i = 1; i < data.length; i++) {
    const current = data[i], prev = data[i - 1];
    const body = Math.abs(current.close - current.open);
    const lowerShadow = Math.min(current.open, current.close) - current.low;
    const upperShadow = current.high - Math.max(current.open, current.close);

    if (enabledPatterns.bullishEngulfing && prev.close < prev.open && current.close > current.open && current.open <= prev.close && current.close >= prev.open) {
      const score = calculatePatternScore('bullishEngulfing', data, i - 1, i), pid = `Pattern_${patternId++}`;
      backgroundRects.push({ startIndex: i - 1, endIndex: i, ...PATTERN_CONFIG.bullishEngulfing, patternType: 'bullishEngulfing', score, patternId: pid });
      detectedPatterns[pid] = { score, type: 'bullishEngulfing', name: 'Bullish Engulfing' };
    }
    if (enabledPatterns.bearishEngulfing && prev.close > prev.open && current.close < current.open && current.open >= prev.close && current.close <= prev.open) {
      const score = calculatePatternScore('bearishEngulfing', data, i - 1, i), pid = `Pattern_${patternId++}`;
      backgroundRects.push({ startIndex: i - 1, endIndex: i, ...PATTERN_CONFIG.bearishEngulfing, patternType: 'bearishEngulfing', score, patternId: pid });
      detectedPatterns[pid] = { score, type: 'bearishEngulfing', name: 'Bearish Engulfing' };
    }
    if (enabledPatterns.hammer && body > 0 && lowerShadow > body * 2.5 && upperShadow < body * 0.5) {
      const score = calculatePatternScore('hammer', data, i, i), pid = `Pattern_${patternId++}`;
      backgroundRects.push({ startIndex: i, endIndex: i, ...PATTERN_CONFIG.hammer, patternType: 'hammer', score, patternId: pid });
      detectedPatterns[pid] = { score, type: 'hammer', name: 'Hammer' };
    }
    if (enabledPatterns.shootingStar && body > 0 && upperShadow > body * 2.5 && lowerShadow < body * 0.5) {
      const score = calculatePatternScore('shootingStar', data, i, i), pid = `Pattern_${patternId++}`;
      backgroundRects.push({ startIndex: i, endIndex: i, ...PATTERN_CONFIG.shootingStar, patternType: 'shootingStar', score, patternId: pid });
      detectedPatterns[pid] = { score, type: 'shootingStar', name: 'Shooting Star' };
    }
    if (enabledPatterns.doji && Math.abs(current.close - current.open) < (current.high - current.low) * 0.1) {
      const score = calculatePatternScore('doji', data, i, i), pid = `Pattern_${patternId++}`;
      backgroundRects.push({ startIndex: i, endIndex: i, ...PATTERN_CONFIG.doji, patternType: 'doji', score, patternId: pid });
      detectedPatterns[pid] = { score, type: 'doji', name: 'Doji' };
    }
  }
  return { backgroundRects, detectedPatterns };
}

function AdvancedChart({ data, enabledPatterns, highlightBackground, onPatternsDetected, drawingMode, onPositionDrawn, drawnPositions, onPositionUpdate }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const positionCanvasRef = useRef(null);
  const highlightRectsRef = useRef([]);
  const draggingInfoRef = useRef(null);
  const positionsRef = useRef(drawnPositions);

  useEffect(() => {
    positionsRef.current = drawnPositions;
  }, [drawnPositions]);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const container = chartContainerRef.current;
    container.innerHTML = '';

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 600,
      layout: {
        background: { color: '#FFFFFF' }, textColor: '#333',
        attributionLogo: false,
      },
      grid: { vertLines: { color: '#f0f0f0' }, horzLines: { color: '#f0f0f0' } },
      crosshair: {
        mode: 1,
        vertLine: { color: '#9598A1', width: 1, style: 3, labelBackgroundColor: '#131722' },
        horzLine: { color: '#9598A1', width: 1, style: 3, labelBackgroundColor: '#131722' },
      },
      rightPriceScale: { borderColor: '#D1D4DC' },
      timeScale: { borderColor: '#D1D4DC', timeVisible: true },
    });

    chartRef.current = chart;
    const { backgroundRects, detectedPatterns } = detectPatterns(data, enabledPatterns);
    if (onPatternsDetected) onPatternsDetected(detectedPatterns);

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderUpColor: '#26a69a',
      borderDownColor: '#ef5350',
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });
    candlestickSeries.setData(data);

    if (drawingMode !== 'none') {
      const handleClick = (param) => {
        if (!param.point || !param.time) return;
        const seriesData = param.seriesData.get(candlestickSeries);
        if (!seriesData) return;

        const price = seriesData.close;
        const timeIndex = data.findIndex(d => d.time === param.time);
        const endTimeIndex = Math.min(timeIndex + 8, data.length - 1);

        if (onPositionDrawn) {
          onPositionDrawn({
            type: drawingMode,
            entryPrice: price,
            entryTime: data[timeIndex].time,
            exitTime: data[endTimeIndex].time,
            stopLoss: drawingMode === 'long' ? price * 0.97 : price * 1.03,
            takeProfit: drawingMode === 'long' ? price * 1.05 : price * 0.95,
            quantity: 12,
          });
        }
      };
      chart.subscribeClick(handleClick);
    }

    // Position canvas
    const positionCanvas = document.createElement('canvas');
    positionCanvas.width = container.clientWidth;
    positionCanvas.height = 600;
    positionCanvas.style.cssText = 'position:absolute;left:0;top:0;z-index:2;pointer-events:none;';
    container.appendChild(positionCanvas);
    positionCanvasRef.current = positionCanvas;

    const posCtx = positionCanvas.getContext('2d');

    const drawPositions = () => {
      posCtx.clearRect(0, 0, positionCanvas.width, positionCanvas.height);

      const timeScale = chart.timeScale();
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const chartMaxPrice = Math.max(...allPrices);
      const chartMinPrice = Math.min(...allPrices);
      const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;

      positionsRef.current.forEach((pos) => {
        const entryIndex = data.findIndex(d => d.time === pos.entryTime);
        const exitIndex = data.findIndex(d => d.time === (pos.exitTime || pos.entryTime));
        if (entryIndex === -1 || exitIndex === -1) return;

        const startX = timeScale.timeToCoordinate(pos.entryTime);
        const endX = timeScale.timeToCoordinate(pos.exitTime || pos.entryTime);
        if (startX === null || endX === null) return;

        const entryY = priceToY(pos.entryPrice);
        const takeProfitY = priceToY(pos.takeProfit);
        const stopLossY = priceToY(pos.stopLoss);
        const boxStartX = Math.min(startX, endX);
        const boxEndX = Math.max(startX, endX);

        const currentPrice = data[exitIndex].close;
        const currentPriceY = priceToY(currentPrice);

        // Light zones (potential profit/loss)
        if (pos.type === 'long') {
          posCtx.fillStyle = 'rgba(180, 231, 229, 0.35)';
          posCtx.fillRect(boxStartX, Math.min(entryY, takeProfitY), boxEndX - boxStartX, Math.abs(entryY - takeProfitY));

          posCtx.fillStyle = 'rgba(255, 182, 193, 0.35)';
          posCtx.fillRect(boxStartX, Math.min(entryY, stopLossY), boxEndX - boxStartX, Math.abs(entryY - stopLossY));
        } else {
          posCtx.fillStyle = 'rgba(180, 231, 229, 0.35)';
          posCtx.fillRect(boxStartX, Math.min(entryY, takeProfitY), boxEndX - boxStartX, Math.abs(entryY - takeProfitY));

          posCtx.fillStyle = 'rgba(255, 182, 193, 0.35)';
          posCtx.fillRect(boxStartX, Math.min(entryY, stopLossY), boxEndX - boxStartX, Math.abs(entryY - stopLossY));
        }

        // Dark zones (current P&L)
        const profitLoss = currentPrice - pos.entryPrice;
        if (pos.type === 'long') {
          if (profitLoss > 0) {
            posCtx.fillStyle = 'rgba(26, 166, 154, 0.5)';
            posCtx.fillRect(boxStartX, Math.min(currentPriceY, entryY), boxEndX - boxStartX, Math.abs(currentPriceY - entryY));
          } else if (profitLoss < 0) {
            posCtx.fillStyle = 'rgba(239, 83, 80, 0.5)';
            posCtx.fillRect(boxStartX, Math.min(entryY, currentPriceY), boxEndX - boxStartX, Math.abs(entryY - currentPriceY));
          }
        } else {
          if (profitLoss < 0) {
            posCtx.fillStyle = 'rgba(26, 166, 154, 0.5)';
            posCtx.fillRect(boxStartX, Math.min(entryY, currentPriceY), boxEndX - boxStartX, Math.abs(entryY - currentPriceY));
          } else if (profitLoss > 0) {
            posCtx.fillStyle = 'rgba(239, 83, 80, 0.5)';
            posCtx.fillRect(boxStartX, Math.min(currentPriceY, entryY), boxEndX - boxStartX, Math.abs(currentPriceY - entryY));
          }
        }

        // Dashed entry line
        posCtx.strokeStyle = '#787B86';
        posCtx.lineWidth = 1.5;
        posCtx.setLineDash([5, 3]);
        posCtx.beginPath();
        posCtx.moveTo(boxStartX, entryY);
        posCtx.lineTo(boxEndX, entryY);
        posCtx.stroke();
        posCtx.setLineDash([]);

        // Target line
        posCtx.strokeStyle = '#26a69a';
        posCtx.lineWidth = 2;
        posCtx.beginPath();
        posCtx.moveTo(boxStartX, takeProfitY);
        posCtx.lineTo(boxEndX, takeProfitY);
        posCtx.stroke();

        // Stop line
        posCtx.strokeStyle = '#EF5350';
        posCtx.lineWidth = 2;
        posCtx.beginPath();
        posCtx.moveTo(boxStartX, stopLossY);
        posCtx.lineTo(boxEndX, stopLossY);
        posCtx.stroke();

        // Labels with rounded rectangles
        const profitPercent = ((pos.takeProfit - pos.entryPrice) / pos.entryPrice * 100).toFixed(2);
        const profitAmount = ((pos.takeProfit - pos.entryPrice) * pos.quantity).toFixed(2);

        posCtx.fillStyle = '#26a69a';
        posCtx.beginPath();
        posCtx.roundRect(boxStartX + 5, takeProfitY - 22, 360, 20, 4);
        posCtx.fill();
        posCtx.fillStyle = '#FFFFFF';
        posCtx.font = 'bold 11px Arial';
        posCtx.fillText(`Target: ${pos.takeProfit.toFixed(2)} (${profitPercent}%), Amount: ${profitAmount}`, boxStartX + 12, takeProfitY - 8);

        const riskReward = (Math.abs((pos.takeProfit - pos.entryPrice) / (pos.entryPrice - pos.stopLoss))).toFixed(2);
        const currentPL = ((currentPrice - pos.entryPrice) / pos.entryPrice * 100 * (pos.type === 'short' ? -1 : 1)).toFixed(2);

        posCtx.fillStyle = '#EF5350';
        posCtx.beginPath();
        posCtx.roundRect(boxStartX + 5, entryY + 3, 350, 20, 4);
        posCtx.fill();
        posCtx.fillStyle = '#FFFFFF';
        posCtx.fillText(`Closed P&L: ${currentPL}, Qty: ${pos.quantity}, Risk/Reward Ratio: ${riskReward}`, boxStartX + 12, entryY + 17);

        const lossPercent = ((pos.stopLoss - pos.entryPrice) / pos.entryPrice * 100).toFixed(2);
        const lossAmount = ((pos.entryPrice - pos.stopLoss) * pos.quantity).toFixed(0);

        posCtx.fillStyle = '#EF5350';
        posCtx.beginPath();
        posCtx.roundRect(boxStartX + 5, stopLossY + 3, 340, 20, 4);
        posCtx.fill();
        posCtx.fillStyle = '#FFFFFF';
        posCtx.fillText(`Stop: ${pos.stopLoss.toFixed(2)} (${lossPercent}%), Amount: ${lossAmount}`, boxStartX + 12, stopLossY + 17);

        // Corner handles (small squares)
        const handleSize = 8;
        posCtx.fillStyle = '#9E9E9E';
        posCtx.fillRect(boxStartX - handleSize / 2, Math.min(takeProfitY, stopLossY) - handleSize / 2, handleSize, handleSize);
        posCtx.fillRect(boxEndX - handleSize / 2, Math.min(takeProfitY, stopLossY) - handleSize / 2, handleSize, handleSize);
        posCtx.fillRect(boxStartX - handleSize / 2, Math.max(takeProfitY, stopLossY) - handleSize / 2, handleSize, handleSize);
        posCtx.fillRect(boxEndX - handleSize / 2, Math.max(takeProfitY, stopLossY) - handleSize / 2, handleSize, handleSize);

        // D badges
        const badgeSize = 30;
        const drawDBadge = (x, y) => {
          posCtx.fillStyle = '#78909C';
          posCtx.beginPath();
          posCtx.roundRect(x - badgeSize / 2, y - badgeSize / 2, badgeSize, badgeSize, 4);
          posCtx.fill();
          posCtx.fillStyle = '#FFFFFF';
          posCtx.font = 'bold 14px Arial';
          posCtx.textAlign = 'center';
          posCtx.textBaseline = 'middle';
          posCtx.fillText('D', x, y);
        };

        const bottomY = Math.max(takeProfitY, stopLossY);
        drawDBadge((boxStartX + boxEndX) / 2 + 120, bottomY + 40);
        drawDBadge((boxStartX + boxEndX) / 2 + 160, bottomY + 50);
      });
    };

    const isOverInteractiveArea = (mx, my) => {
      const timeScale = chart.timeScale();
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const chartMaxPrice = Math.max(...allPrices);
      const chartMinPrice = Math.min(...allPrices);
      const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;

      for (const pos of positionsRef.current) {
        const startX = timeScale.timeToCoordinate(pos.entryTime);
        const endX = timeScale.timeToCoordinate(pos.exitTime || pos.entryTime);
        if (!startX || !endX) continue;

        const boxStartX = Math.min(startX, endX);
        const boxEndX = Math.max(startX, endX);
        const takeProfitY = priceToY(pos.takeProfit);
        const stopLossY = priceToY(pos.stopLoss);

        const handleSize = 14;
        const topY = Math.min(takeProfitY, stopLossY);
        const bottomY = Math.max(takeProfitY, stopLossY);

        if ((Math.abs(mx - boxStartX) < handleSize && Math.abs(my - topY) < handleSize) ||
          (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - topY) < handleSize) ||
          (Math.abs(mx - boxStartX) < handleSize && Math.abs(my - bottomY) < handleSize) ||
          (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - bottomY) < handleSize)) {
          return true;
        }

        if (mx >= boxStartX && mx <= boxEndX && my >= topY && my <= bottomY) {
          return true;
        }
      }
      return false;
    };

    const handleMouseDown = (e) => {
      const bounds = container.getBoundingClientRect();
      const mx = e.clientX - bounds.left;
      const my = e.clientY - bounds.top;

      const timeScale = chart.timeScale();
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const chartMaxPrice = Math.max(...allPrices);
      const chartMinPrice = Math.min(...allPrices);
      const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;

      for (let idx = positionsRef.current.length - 1; idx >= 0; idx--) {
        const pos = positionsRef.current[idx];
        const startX = timeScale.timeToCoordinate(pos.entryTime);
        const endX = timeScale.timeToCoordinate(pos.exitTime || pos.entryTime);
        if (!startX || !endX) continue;

        const boxStartX = Math.min(startX, endX);
        const boxEndX = Math.max(startX, endX);
        const takeProfitY = priceToY(pos.takeProfit);
        const stopLossY = priceToY(pos.stopLoss);
        const topY = Math.min(takeProfitY, stopLossY);
        const bottomY = Math.max(takeProfitY, stopLossY);

        const handleSize = 14;

        if (Math.abs(mx - boxStartX) < handleSize && Math.abs(my - topY) < handleSize) {
          draggingInfoRef.current = { posIdx: idx, type: 'resizeTopLeft' };
          e.stopPropagation();
          return;
        }
        if (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - topY) < handleSize) {
          draggingInfoRef.current = { posIdx: idx, type: 'resizeTopRight' };
          e.stopPropagation();
          return;
        }
        if (Math.abs(mx - boxStartX) < handleSize && Math.abs(my - bottomY) < handleSize) {
          draggingInfoRef.current = { posIdx: idx, type: 'resizeBottomLeft' };
          e.stopPropagation();
          return;
        }
        if (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - bottomY) < handleSize) {
          draggingInfoRef.current = { posIdx: idx, type: 'resizeBottomRight' };
          e.stopPropagation();
          return;
        }

        if (mx >= boxStartX && mx <= boxEndX && my >= topY && my <= bottomY) {
          draggingInfoRef.current = {
            posIdx: idx,
            type: 'move',
            startMouseX: mx,
            startMouseY: my,
            startEntry: pos.entryPrice,
            startTP: pos.takeProfit,
            startSL: pos.stopLoss,
            startEntryTime: pos.entryTime,
            startExitTime: pos.exitTime || pos.entryTime
          };
          e.stopPropagation();
          return;
        }
      }
    };

    const handleMouseMove = (e) => {
      if (!draggingInfoRef.current || !onPositionUpdate) return;

      const bounds = container.getBoundingClientRect();
      const mx = e.clientX - bounds.left;
      const my = e.clientY - bounds.top;

      const timeScale = chart.timeScale();
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const chartMaxPrice = Math.max(...allPrices);
      const chartMinPrice = Math.min(...allPrices);
      const yToPrice = (y) => chartMinPrice + (1 - ((y - 45) / (600 * 0.85))) * (chartMaxPrice - chartMinPrice);

      const updated = [...positionsRef.current];
      const pos = { ...updated[draggingInfoRef.current.posIdx] };

      if (draggingInfoRef.current.type === 'resizeTopLeft' || draggingInfoRef.current.type === 'resizeBottomLeft') {
        const newTime = timeScale.coordinateToTime(mx);
        if (newTime) pos.entryTime = newTime;
      } else if (draggingInfoRef.current.type === 'resizeTopRight' || draggingInfoRef.current.type === 'resizeBottomRight') {
        const newTime = timeScale.coordinateToTime(mx);
        if (newTime) pos.exitTime = newTime;
      } else if (draggingInfoRef.current.type === 'move') {
        const deltaY = my - draggingInfoRef.current.startMouseY;
        const deltaX = mx - draggingInfoRef.current.startMouseX;

        const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;
        const startEntryY = priceToY(draggingInfoRef.current.startEntry);
        const newEntryY = startEntryY + deltaY;
        const priceDelta = yToPrice(newEntryY) - draggingInfoRef.current.startEntry;

        pos.entryPrice = draggingInfoRef.current.startEntry + priceDelta;
        pos.takeProfit = draggingInfoRef.current.startTP + priceDelta;
        pos.stopLoss = draggingInfoRef.current.startSL + priceDelta;

        const startTimeCoord = timeScale.timeToCoordinate(draggingInfoRef.current.startEntryTime);
        const endTimeCoord = timeScale.timeToCoordinate(draggingInfoRef.current.startExitTime);

        if (startTimeCoord !== null && endTimeCoord !== null) {
          const newStartTime = timeScale.coordinateToTime(startTimeCoord + deltaX);
          const newEndTime = timeScale.coordinateToTime(endTimeCoord + deltaX);

          if (newStartTime) pos.entryTime = newStartTime;
          if (newEndTime) pos.exitTime = newEndTime;
        }
      }

      updated[draggingInfoRef.current.posIdx] = pos;
      positionsRef.current = updated;
      drawPositions();
      onPositionUpdate(updated);
    };

    const handleMouseUp = () => draggingInfoRef.current = null;

    const handleMouseMoveHover = (e) => {
      const bounds = container.getBoundingClientRect();
      const mx = e.clientX - bounds.left;
      const my = e.clientY - bounds.top;

      if (isOverInteractiveArea(mx, my) || draggingInfoRef.current) {
        positionCanvas.style.pointerEvents = 'auto';
      } else {
        positionCanvas.style.pointerEvents = 'none';
      }

      if (draggingInfoRef.current) return;

      let cursorStyle = 'default';

      const timeScale = chart.timeScale();
      const allPrices = data.flatMap(d => [d.high, d.low]);
      const chartMaxPrice = Math.max(...allPrices);
      const chartMinPrice = Math.min(...allPrices);
      const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;

      for (const pos of positionsRef.current) {
        const startX = timeScale.timeToCoordinate(pos.entryTime);
        const endX = timeScale.timeToCoordinate(pos.exitTime || pos.entryTime);
        if (!startX || !endX) continue;

        const boxStartX = Math.min(startX, endX);
        const boxEndX = Math.max(startX, endX);
        const takeProfitY = priceToY(pos.takeProfit);
        const stopLossY = priceToY(pos.stopLoss);
        const topY = Math.min(takeProfitY, stopLossY);
        const bottomY = Math.max(takeProfitY, stopLossY);

        const handleSize = 14;

        if ((Math.abs(mx - boxStartX) < handleSize && Math.abs(my - topY) < handleSize) ||
          (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - topY) < handleSize) ||
          (Math.abs(mx - boxStartX) < handleSize && Math.abs(my - bottomY) < handleSize) ||
          (Math.abs(mx - boxEndX) < handleSize && Math.abs(my - bottomY) < handleSize)) {
          cursorStyle = 'nwse-resize';
          break;
        }
        if (mx >= boxStartX && mx <= boxEndX && my >= topY && my <= bottomY) {
          cursorStyle = 'move';
          break;
        }
      }

      positionCanvas.style.cursor = cursorStyle;
    };

    container.addEventListener('mousemove', handleMouseMoveHover);
    positionCanvas.addEventListener('mousedown', handleMouseDown);
    positionCanvas.addEventListener('mousemove', handleMouseMove);
    positionCanvas.addEventListener('mouseup', handleMouseUp);
    positionCanvas.addEventListener('mouseleave', handleMouseUp);

    drawPositions();
    chart.timeScale().subscribeVisibleLogicalRangeChange(drawPositions);

    // Pattern highlighting
    if (highlightBackground && backgroundRects.length > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = container.clientWidth;
      canvas.height = 600;
      canvas.style.cssText = 'position:absolute;left:0;top:0;z-index:1;pointer-events:none;';
      container.appendChild(canvas);
      canvasRef.current = canvas;

      const ctx = canvas.getContext('2d');

      const drawHighlights = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        highlightRectsRef.current = [];

        const timeScale = chart.timeScale();
        const allPrices = data.flatMap(d => [d.high, d.low]);
        const chartMaxPrice = Math.max(...allPrices);
        const chartMinPrice = Math.min(...allPrices);
        const priceToY = (price) => 600 * (1 - (price - chartMinPrice) / (chartMaxPrice - chartMinPrice)) * 0.85 + 45;

        backgroundRects.forEach(rect => {
          const startData = data[rect.startIndex];
          const endData = data[rect.endIndex];
          if (!startData || !endData) return;

          let maxPrice = Math.max(...data.slice(rect.startIndex, rect.endIndex + 1).map(d => d.high));
          let minPrice = Math.min(...data.slice(rect.startIndex, rect.endIndex + 1).map(d => d.low));

          const x1 = timeScale.timeToCoordinate(startData.time);
          const x2 = timeScale.timeToCoordinate(endData.time);

          if (x1 !== null && x2 !== null) {
            const padding = (maxPrice - minPrice) * 0.15;

            const y1 = priceToY(maxPrice + padding);
            const y2 = priceToY(minPrice - padding);
            const boxX = x1 - 25;
            const boxWidth = Math.max(50, x2 - x1 + 50);
            const boxY = y1;
            const boxHeight = y2 - y1;

            highlightRectsRef.current.push({ x: boxX, y: boxY, width: boxWidth, height: boxHeight, rect, maxPrice, minPrice });

            ctx.fillStyle = rect.bgColor;
            ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

            // Badge at top
            const badgeSize = 28;
            const badgeX = boxX + boxWidth / 2 - badgeSize / 2;
            const badgeY = boxY - badgeSize - 8;

            ctx.fillStyle = rect.badgeBg;
            ctx.beginPath();
            ctx.roundRect(badgeX, badgeY, badgeSize, badgeSize, 4);
            ctx.fill();

            ctx.fillStyle = rect.textColor;
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(rect.annotation, badgeX + badgeSize / 2, badgeY + badgeSize / 2);
          }
        });
      };

      drawHighlights();
      chart.timeScale().subscribeVisibleLogicalRangeChange(drawHighlights);
    }

    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data, enabledPatterns, highlightBackground, onPatternsDetected, drawingMode, drawnPositions, onPositionUpdate]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: '600px', position: 'relative', background: '#FFF', borderRadius: '8px', border: '1px solid #E0E0E0' }} />;
}

export default function AdvancedPriceAction() {
  const [allData, setAllData] = useState([]);
  const [enabledPatterns, setEnabledPatterns] = useState({
    bullishEngulfing: true,
    bearishEngulfing: true,
    hammer: true,
    shootingStar: true,
    doji: true
  });
  const [highlightBackground, setHighlightBackground] = useState(true);
  const [detectedPatterns, setDetectedPatterns] = useState(null);
  const [showPatternSelector, setShowPatternSelector] = useState(false);
  const [drawingMode, setDrawingMode] = useState('none');
  const [drawnPositions, setDrawnPositions] = useState([]);
  const [showPositionMenu, setShowPositionMenu] = useState(false);

  const loadSampleData = () => {
    const chartData = SAMPLE_DATA.map(r => ({ time: r.Date, open: r.Open, high: r.High, low: r.Low, close: r.Close, volume: r.Volume })).sort((a, b) => a.time.localeCompare(b.time));
    setAllData(chartData);
  };

  const handlePositionDrawn = useCallback((position) => {
    setDrawnPositions(prev => [...prev, position]);
    setDrawingMode('none');
  }, []);

  const handlePositionUpdate = useCallback((updatedPositions) => {
    setDrawnPositions(updatedPositions);
  }, []);

  const patternCount = detectedPatterns ? Object.keys(detectedPatterns).length : 0;
  const bullishPatterns = [['bullishEngulfing', PATTERN_CONFIG.bullishEngulfing], ['hammer', PATTERN_CONFIG.hammer]];
  const bearishPatterns = [['bearishEngulfing', PATTERN_CONFIG.bearishEngulfing], ['shootingStar', PATTERN_CONFIG.shootingStar]];

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '20px' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '20px' }}>📊 Advanced Trading Chart</h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={loadSampleData} style={{ padding: '10px 20px', background: '#2196F3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Load Data
          </button>

          {allData.length > 0 && (
            <>
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowPositionMenu(!showPositionMenu)}
                  style={{ padding: '10px 20px', background: drawingMode === 'long' ? '#26a69a' : drawingMode === 'short' ? '#ef5350' : '#9E9E9E', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                >
                  {drawingMode === 'long' ? 'LONG' : drawingMode === 'short' ? 'SHORT' : 'Position'} ▼
                </button>

                {showPositionMenu && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: '#fff', border: '1px solid #E0E0E0', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, minWidth: '180px', overflow: 'hidden' }}>
                    <div onClick={() => { setDrawingMode('long'); setShowPositionMenu(false); }} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }} onMouseEnter={(e) => e.target.style.background = '#f0f0f0'} onMouseLeave={(e) => e.target.style.background = '#fff'}>
                      📈 Long Position
                    </div>
                    <div onClick={() => { setDrawingMode('short'); setShowPositionMenu(false); }} style={{ padding: '12px', cursor: 'pointer' }} onMouseEnter={(e) => e.target.style.background = '#f0f0f0'} onMouseLeave={(e) => e.target.style.background = '#fff'}>
                      📉 Short Position
                    </div>
                    {drawingMode !== 'none' && (
                      <div onClick={() => { setDrawingMode('none'); setShowPositionMenu(false); }} style={{ padding: '12px', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }} onMouseEnter={(e) => e.target.style.background = '#f0f0f0'} onMouseLeave={(e) => e.target.style.background = '#fff'}>
                        ❌ Cancel
                      </div>
                    )}
                  </div>
                )}
              </div>

              {drawnPositions.length > 0 && (
                <button onClick={() => setDrawnPositions([])} style={{ padding: '10px 20px', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                  Clear All ({drawnPositions.length})
                </button>
              )}

              <button onClick={() => setShowPatternSelector(!showPatternSelector)} style={{ padding: '10px 20px', background: '#9C27B0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                Patterns {showPatternSelector ? '▲' : '▼'}
              </button>

              <label style={{ display: 'flex', gap: '8px', padding: '10px 18px', background: highlightBackground ? '#e8f5e9' : '#ffebee', border: `2px solid ${highlightBackground ? '#4caf50' : '#f44336'}`, borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                <input type="checkbox" checked={highlightBackground} onChange={(e) => setHighlightBackground(e.target.checked)} style={{ width: '18px', height: '18px' }} />
                {highlightBackground ? '✅ ON' : '❌ OFF'}
              </label>

              <div style={{ marginLeft: 'auto', padding: '10px 20px', background: '#2196F3', borderRadius: '6px', fontWeight: '700', color: '#fff' }}>
                Patterns: {patternCount}
              </div>
            </>
          )}
        </div>

        {showPatternSelector && allData.length > 0 && (
          <div style={{ marginBottom: '20px', padding: '20px', background: '#f9f9f9', borderRadius: '6px', border: '1px solid #E0E0E0' }}>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button onClick={() => setEnabledPatterns({ bullishEngulfing: true, bearishEngulfing: true, hammer: true, shootingStar: true, doji: true })} style={{ padding: '8px 16px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>✅ All</button>
              <button onClick={() => setEnabledPatterns({ bullishEngulfing: true, bearishEngulfing: false, hammer: true, shootingStar: false, doji: false })} style={{ padding: '8px 16px', background: '#26a69a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>🟢 Bullish</button>
              <button onClick={() => setEnabledPatterns({ bullishEngulfing: false, bearishEngulfing: true, hammer: false, shootingStar: true, doji: false })} style={{ padding: '8px 16px', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>🔴 Bearish</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', background: '#fff', borderRadius: '6px', border: '1px solid #26a69a' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#26a69a', marginBottom: '10px' }}>🟢 BULLISH</h3>
                {bullishPatterns.map(([key, config]) => (
                  <label key={key} style={{ display: 'flex', gap: '8px', padding: '6px', cursor: 'pointer', marginBottom: '4px', background: enabledPatterns[key] ? '#e8f5e9' : 'transparent', borderRadius: '4px' }}>
                    <input type="checkbox" checked={enabledPatterns[key]} onChange={() => setEnabledPatterns(p => ({ ...p, [key]: !p[key] }))} style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: enabledPatterns[key] ? '#26a69a' : '#666' }}>{config.name}</span>
                  </label>
                ))}
              </div>

              <div style={{ padding: '14px', background: '#fff', borderRadius: '6px', border: '1px solid #ef5350' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#ef5350', marginBottom: '10px' }}>🔴 BEARISH</h3>
                {bearishPatterns.map(([key, config]) => (
                  <label key={key} style={{ display: 'flex', gap: '8px', padding: '6px', cursor: 'pointer', marginBottom: '4px', background: enabledPatterns[key] ? '#ffebee' : 'transparent', borderRadius: '4px' }}>
                    <input type="checkbox" checked={enabledPatterns[key]} onChange={() => setEnabledPatterns(p => ({ ...p, [key]: !p[key] }))} style={{ width: '16px', height: '16px' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: enabledPatterns[key] ? '#ef5350' : '#666' }}>{config.name}</span>
                  </label>
                ))}
              </div>

              <div style={{ padding: '14px', background: '#fff', borderRadius: '6px', border: '1px solid #9E9E9E' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#757575', marginBottom: '10px' }}>⚪ NEUTRAL</h3>
                <label style={{ display: 'flex', gap: '8px', padding: '6px', cursor: 'pointer', background: enabledPatterns.doji ? '#f5f5f5' : 'transparent', borderRadius: '4px' }}>
                  <input type="checkbox" checked={enabledPatterns.doji} onChange={() => setEnabledPatterns(p => ({ ...p, doji: !p.doji }))} style={{ width: '16px', height: '16px' }} />
                  <span style={{ fontSize: '12px', fontWeight: '600', color: enabledPatterns.doji ? '#757575' : '#666' }}>Doji</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {allData.length > 0 ? (
          <AdvancedChart
            data={allData}
            enabledPatterns={enabledPatterns}
            highlightBackground={highlightBackground}
            onPatternsDetected={setDetectedPatterns}
            drawingMode={drawingMode}
            onPositionDrawn={handlePositionDrawn}
            drawnPositions={drawnPositions}
            onPositionUpdate={handlePositionUpdate}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '80px', border: '2px dashed #E0E0E0', borderRadius: '8px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Ready to Start</h3>
            <p style={{ color: '#666' }}>Click "Load Data" to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}