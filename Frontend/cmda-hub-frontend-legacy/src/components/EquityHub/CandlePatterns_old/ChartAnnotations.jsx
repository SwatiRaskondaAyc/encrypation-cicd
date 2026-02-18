import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';

const ChartAnnotations = ({
    chart,
    series,
    data,
    activeTool, // 'line', 'gann', 'gannFan', 'fib', 'text', 'eraser', null
    onDrawingComplete,
    drawings,
    setDrawings
}) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const textInputRef = useRef(null);
    const [currentLine, setCurrentLine] = useState(null);
    const [snappedPoint, setSnappedPoint] = useState(null);
    const [textInput, setTextInput] = useState(null); // { point, x, y, text }

    // Map time -> index for fast lookup
    const timeToIndex = useMemo(() => {
        if (!data) return new Map();
        const map = new Map();
        data.forEach((item, index) => {
            map.set(item.time, index);
        });
        return map;
    }, [data]);

    // Get chart area bounds
    const getChartBounds = useCallback(() => {
        if (!chart) return { left: 0, right: 0, width: 0, height: 0 };
        const leftPriceScaleWidth = chart.priceScale('left').width();
        const rightPriceScaleWidth = chart.priceScale('right').width();
        const container = containerRef.current?.parentElement;
        if (!container) return { left: leftPriceScaleWidth, right: rightPriceScaleWidth, width: 0, height: 0 };

        return {
            left: leftPriceScaleWidth,
            right: container.clientWidth - rightPriceScaleWidth,
            width: container.clientWidth - leftPriceScaleWidth - rightPriceScaleWidth,
            height: container.clientHeight - chart.timeScale().height()
        };
    }, [chart]);

    // Convert Time/Price to Coordinates
    const getCoords = useCallback((point) => {
        if (!chart || !series || !point) return null;
        const timeScale = chart.timeScale();
        const index = timeToIndex.get(point.time);
        if (index === undefined) return null;

        const x = timeScale.logicalToCoordinate(index);
        const y = series.priceToCoordinate(point.price);
        if (x === null || y === null) return null;

        return { x, y };
    }, [chart, series, timeToIndex]);

    // Convert Coordinates to Time/Price (for mouse input)
    const getPoint = useCallback((clientX, clientY) => {
        if (!chart || !series || !data || !containerRef.current) return null;

        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const timeScale = chart.timeScale();
        const bounds = getChartBounds();

        // Adjust x for left price scale offset
        const chartX = x - bounds.left;
        const logical = timeScale.coordinateToLogical(chartX);
        if (logical === null) return null;

        const index = Math.round(logical);
        if (index < 0 || index >= data.length) return null;

        const item = data[index];
        if (!item) return null;

        let price = series.coordinateToPrice(y);
        if (price === null) return null;

        // Magnet snap to OHLC
        const snapThreshold = 50;
        const prices = [
            { val: item.high, y: series.priceToCoordinate(item.high), label: 'High' },
            { val: item.low, y: series.priceToCoordinate(item.low), label: 'Low' },
            { val: item.open, y: series.priceToCoordinate(item.open), label: 'Open' },
            { val: item.close, y: series.priceToCoordinate(item.close), label: 'Close' }
        ];

        let bestPrice = price;
        let minDist = snapThreshold;
        let snapped = null;

        for (const p of prices) {
            if (p.y !== null) {
                const dist = Math.abs(p.y - y);
                if (dist < minDist) {
                    minDist = dist;
                    bestPrice = p.val;
                    snapped = { x: timeScale.logicalToCoordinate(index) + bounds.left, y: p.y, label: p.label };
                }
            }
        }

        setSnappedPoint(snapped);
        return { time: item.time, price: bestPrice };
    }, [chart, series, data, getChartBounds]);

    // Drawing functions
    const drawLine = (ctx, start, end, color = "#2962FF") => {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const drawHorizontalLine = (ctx, y, bounds, color = "#00E676") => {
        ctx.beginPath();
        ctx.moveTo(bounds.left, y);
        ctx.lineTo(bounds.right, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const drawVerticalLine = (ctx, x, bounds, color = "#FF6D00") => {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, bounds.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
    };

    const drawGannBox = (ctx, start, end, color = "#8b5cf6") => {
        const x = Math.min(start.x, end.x);
        const y = Math.min(start.y, end.y);
        const w = Math.abs(end.x - start.x);
        const h = Math.abs(end.y - start.y);

        ctx.fillStyle = color + '1A';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);

        ctx.setLineDash([2, 2]);
        [0.25, 0.5, 0.75].forEach(pct => {
            ctx.beginPath();
            ctx.moveTo(x + w * pct, y);
            ctx.lineTo(x + w * pct, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y + h * pct);
            ctx.lineTo(x + w, y + h * pct);
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Diagonals
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y + h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y + h);
        ctx.lineTo(x + w, y);
        ctx.stroke();
    };

    const drawGannSquare = (ctx, start, end, color = "#7c3aed") => {
        const size = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));
        const x = start.x;
        const y = start.y - size / 2;

        ctx.fillStyle = color + '0D';
        ctx.fillRect(x, y, size, size);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);

        // Square of Nine grid
        const divisions = 8;
        for (let i = 1; i < divisions; i++) {
            const pos = (i / divisions) * size;
            ctx.beginPath();
            ctx.moveTo(x + pos, y);
            ctx.lineTo(x + pos, y + size);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y + pos);
            ctx.lineTo(x + size, y + pos);
            ctx.stroke();
        }

        // Diagonals and cross
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y + size);
        ctx.moveTo(x, y + size);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    const drawFibRetracement = (ctx, start, end, color = "#f59e0b") => {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const dy = end.y - start.y;
        const x1 = Math.min(start.x, end.x);
        const x2 = Math.max(start.x, end.x);

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);

        levels.forEach(level => {
            const y = start.y + dy * level;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = level === 0 || level === 1 ? 2 : 1;
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.font = '10px sans-serif';
            ctx.fillText((level * 100).toFixed(1) + '%', x1 + 2, y - 2);
        });
    };

    const drawFibExtension = (ctx, start, end, color = "#ff9800") => {
        const levels = [0, 0.618, 1, 1.272, 1.618, 2, 2.618];
        const dy = end.y - start.y;
        const x1 = Math.min(start.x, end.x);
        const x2 = Math.max(start.x, end.x) + 50;

        levels.forEach(level => {
            const y = start.y + dy * level;
            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.strokeStyle = level > 1 ? color : color + '80';
            ctx.lineWidth = level === 1 || level === 1.618 ? 2 : 1;
            ctx.stroke();
            ctx.fillStyle = color;
            ctx.font = '10px sans-serif';
            ctx.fillText((level * 100).toFixed(1) + '%', x2 - 40, y - 2);
        });
    };

    const drawFibChannel = (ctx, start, end, color = "#ffc107") => {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const perpX = -dy * 0.5;
        const perpY = dx * 0.5;

        levels.forEach(level => {
            const offsetX = perpX * (level - 0.5) * 2;
            const offsetY = perpY * (level - 0.5) * 2;
            ctx.beginPath();
            ctx.moveTo(start.x + offsetX, start.y + offsetY);
            ctx.lineTo(end.x + offsetX, end.y + offsetY);
            ctx.strokeStyle = color;
            ctx.lineWidth = level === 0 || level === 1 || level === 0.5 ? 2 : 1;
            ctx.stroke();
        });
    };

    const drawFibCircles = (ctx, start, end, color = "#009688") => {
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const levels = [0.236, 0.382, 0.5, 0.618, 0.786, 1];

        levels.forEach(level => {
            ctx.beginPath();
            ctx.arc(start.x, start.y, radius * level, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = level === 0.618 || level === 1 ? 2 : 1;
            ctx.stroke();
        });
    };

    const drawFibArcs = (ctx, start, end, color = "#03a9f4") => {
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        const levels = [0.382, 0.5, 0.618];

        levels.forEach(level => {
            ctx.beginPath();
            ctx.arc(start.x, start.y, radius * level, angle - Math.PI / 2, angle + Math.PI / 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    const drawFibSpiral = (ctx, start, end, color = "#00bcd4") => {
        const phi = 1.618033988749895; // Golden ratio
        const baseRadius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const startAngle = Math.atan2(end.y - start.y, end.x - start.x);

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        // Draw the golden spiral
        const turns = 4; // Number of quarter turns
        const points = 100;

        for (let i = 0; i <= points * turns; i++) {
            const angle = startAngle + (i / points) * (Math.PI / 2);
            const turnIndex = Math.floor(i / points);
            const progress = (i % points) / points;

            // Scale radius using Fibonacci sequence approximation
            const scale = Math.pow(phi, -(turnIndex + progress));
            const r = baseRadius * scale;

            const x = start.x + r * Math.cos(angle);
            const y = start.y + r * Math.sin(angle);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Draw golden rectangle guides
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.5;

        let size = baseRadius;
        let cx = start.x;
        let cy = start.y;

        for (let i = 0; i < 5; i++) {
            ctx.strokeRect(cx - size / 2, cy - size / 2, size, size);
            size /= phi;
        }

        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
    };

    const drawFibWedge = (ctx, start, end, color = "#2196f3") => {
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        const midX = (start.x + end.x) / 2;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, start.y);
        ctx.lineTo(midX, end.y);
        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = color + '1A';
        ctx.fill();

        levels.forEach(level => {
            const y = start.y + (end.y - start.y) * level;
            const width = (end.x - start.x) * (1 - level);
            ctx.beginPath();
            ctx.moveTo(midX - width / 2, y);
            ctx.lineTo(midX + width / 2, y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    const drawPitchfan = (ctx, start, end, color = "#9c27b0") => {
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;

        // Main lines
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fan lines from start point
        const angles = [-0.25, -0.5, 0.25, 0.5];
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        angles.forEach(a => {
            const fanEndX = start.x + dx * 2;
            const fanEndY = start.y + dy * 2 + dy * a * 2;
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(fanEndX, fanEndY);
            ctx.strokeStyle = color + '80';
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    };

    const drawGannFan = (ctx, startCoords, endCoords, p1, p2, color = "#14b8a6") => {
        if (!chart || !series || !p1 || !p2) return;

        const index1 = timeToIndex.get(p1.time);
        const index2 = timeToIndex.get(p2.time);
        if (index1 === undefined || index2 === undefined) return;

        const deltaIndex = index2 - index1;
        const deltaPrice = p2.price - p1.price;
        if (deltaIndex === 0) return;

        const baseSlope = deltaPrice / deltaIndex;
        const ratios = [0.125, 0.25, 0.333, 0.5, 1, 2, 3, 4, 8];
        const direction = deltaIndex >= 0 ? 1 : -1;
        const timeScale = chart.timeScale();
        const bounds = getChartBounds();

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(startCoords.x, startCoords.y);
        ctx.lineTo(endCoords.x, endCoords.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);

        ratios.forEach(r => {
            const lineSlope = baseSlope * r;
            const targetIndex = index1 + (500 * direction);
            const targetPrice = p1.price + (lineSlope * (targetIndex - index1));

            const x2 = timeScale.logicalToCoordinate(targetIndex);
            const y2 = series.priceToCoordinate(targetPrice);

            if (x2 !== null && y2 !== null) {
                ctx.beginPath();
                ctx.moveTo(startCoords.x, startCoords.y);
                ctx.lineTo(x2 + bounds.left, y2);
                ctx.strokeStyle = color;
                ctx.lineWidth = r === 1 ? 2 : 1;
                ctx.stroke();

                const labelX = x2 + bounds.left > startCoords.x ? x2 + bounds.left - 25 : x2 + bounds.left + 5;
                ctx.fillStyle = color;
                ctx.font = '10px sans-serif';
                const label = r === 1 ? '1x1' : r < 1 ? `1x${Math.round(1 / r)}` : `${r}x1`;
                ctx.fillText(label, labelX, y2 - 5);
            }
        });
    };

    const drawElliottWave = (ctx, start, end, pattern, color) => {
        const labels = pattern === 'impulse' ? ['1', '2', '3', '4', '5'] :
            pattern === 'correction' ? ['A', 'B', 'C'] :
                pattern === 'triangle' ? ['A', 'B', 'C', 'D', 'E'] :
                    ['W', 'X', 'Y'];

        const dx = (end.x - start.x) / (labels.length);
        const amplitude = (end.y - start.y);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);

        labels.forEach((label, i) => {
            const x = start.x + dx * (i + 1);
            const isUp = pattern === 'impulse' ? i % 2 === 0 : i % 2 === 1;
            const y = isUp ? start.y + amplitude * (i % 2 === 0 ? 1 : 0.5) :
                start.y + amplitude * (i % 2 === 1 ? 0 : 0.7);

            ctx.lineTo(x, y);

            // Label
            ctx.fillStyle = color;
            ctx.font = 'bold 12px sans-serif';
            ctx.fillText(label, x - 5, y + (isUp ? -10 : 15));
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    };

    // Main render function
    const renderDrawings = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current?.parentElement;
        if (!canvas || !container || !chart || !series) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = container.clientWidth * dpr;
        canvas.height = container.clientHeight * dpr;

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, container.clientWidth, container.clientHeight);

        const bounds = getChartBounds();

        // Clip to chart area
        ctx.save();
        ctx.beginPath();
        ctx.rect(bounds.left, 0, bounds.width, bounds.height);
        ctx.clip();

        // Draw saved drawings
        drawings.forEach(d => {
            const start = getCoords(d.p1);
            const end = getCoords(d.p2);

            if (start && end) {
                const offsetStart = { x: start.x + bounds.left, y: start.y };
                const offsetEnd = { x: end.x + bounds.left, y: end.y };

                // Text annotation
                if (d.type === 'text' && d.text) {
                    ctx.font = 'bold 12px sans-serif';
                    const textMetrics = ctx.measureText(d.text);
                    const padding = 6;
                    const boxWidth = textMetrics.width + padding * 2;
                    const boxHeight = 20;
                    ctx.fillStyle = '#1e293b';
                    ctx.beginPath();
                    ctx.roundRect(offsetStart.x - padding, offsetStart.y - boxHeight / 2, boxWidth, boxHeight, 4);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(d.text, offsetStart.x, offsetStart.y);
                }
                // Line tools
                else if (d.type === 'line') {
                    drawLine(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'horizontalLine') {
                    drawHorizontalLine(ctx, offsetStart.y, bounds);
                }
                else if (d.type === 'verticalLine') {
                    drawVerticalLine(ctx, offsetStart.x, bounds);
                }
                // Fibonacci tools
                else if (d.type === 'fibRetracement') {
                    drawFibRetracement(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibExtension') {
                    drawFibExtension(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibChannel') {
                    drawFibChannel(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibCircles') {
                    drawFibCircles(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibArcs') {
                    drawFibArcs(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibWedge') {
                    drawFibWedge(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'fibSpiral') {
                    drawFibSpiral(ctx, offsetStart, offsetEnd);
                }
                else if (['fibTimeZone', 'fibTimeBased', 'fibSpeedFan'].includes(d.type)) {
                    drawFibRetracement(ctx, offsetStart, offsetEnd, '#cddc39');
                }
                // Gann tools
                else if (d.type === 'gannBox') {
                    drawGannBox(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'gannSquare' || d.type === 'gannSquareFixed') {
                    drawGannSquare(ctx, offsetStart, offsetEnd);
                }
                else if (d.type === 'gannFan') {
                    drawGannFan(ctx, offsetStart, offsetEnd, d.p1, d.p2);
                }
                else if (d.type === 'pitchfan') {
                    drawPitchfan(ctx, offsetStart, offsetEnd);
                }
                // Elliott Wave patterns
                else if (d.type === 'elliottImpulse') {
                    drawElliottWave(ctx, offsetStart, offsetEnd, 'impulse', '#ec4899');
                }
                else if (d.type === 'elliottCorrection') {
                    drawElliottWave(ctx, offsetStart, offsetEnd, 'correction', '#f43f5e');
                }
                else if (d.type === 'elliottTriangle') {
                    drawElliottWave(ctx, offsetStart, offsetEnd, 'triangle', '#ef4444');
                }
                else if (d.type === 'elliottCombo') {
                    drawElliottWave(ctx, offsetStart, offsetEnd, 'combo', '#f97316');
                }
                // Fallback
                else {
                    drawLine(ctx, offsetStart, offsetEnd, '#607D8B');
                }
            }
        });

        // Draw current line being drawn
        if (currentLine) {
            const start = getCoords(currentLine.p1);
            const end = getCoords(currentLine.p2);

            if (start && end) {
                const offsetStart = { x: start.x + bounds.left, y: start.y };
                const offsetEnd = { x: end.x + bounds.left, y: end.y };

                ctx.globalAlpha = 0.7;
                // Line-based tools
                if (['line', 'ray', 'extendedLine', 'horizontalLine', 'verticalLine', 'parallelChannel', 'arrow'].includes(currentLine.type)) {
                    drawLine(ctx, offsetStart, offsetEnd);
                }
                // Gann tools
                else if (currentLine.type === 'gann' || currentLine.type === 'gannSquare' || currentLine.type === 'rectangle') {
                    drawGannBox(ctx, offsetStart, offsetEnd);
                }
                // Fibonacci tools
                else if (['fib', 'fibExtension', 'fibFan', 'fibArc', 'fibTimeZone'].includes(currentLine.type)) {
                    drawFibRetracement(ctx, offsetStart, offsetEnd);
                }
                else if (currentLine.type === 'gannFan') {
                    drawGannFan(ctx, offsetStart, offsetEnd, currentLine.p1, currentLine.p2);
                }
                // Fallback: render as line
                else {
                    drawLine(ctx, offsetStart, offsetEnd, '#607D8B');
                }
                ctx.globalAlpha = 1;
            }
        }

        ctx.restore();

        // Draw price level markers on the right edge (outside clipping)
        const drawPriceMarker = (price, color) => {
            const y = series.priceToCoordinate(price);
            if (y === null || y < 0 || y > bounds.height) return;

            const rightEdge = bounds.right;
            const markerWidth = 60;
            const markerHeight = 18;

            // Draw marker background
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(rightEdge + 2, y - markerHeight / 2, markerWidth, markerHeight, 3);
            ctx.fill();

            // Draw arrow pointing to chart
            ctx.beginPath();
            ctx.moveTo(rightEdge + 2, y);
            ctx.lineTo(rightEdge - 4, y - 4);
            ctx.lineTo(rightEdge - 4, y + 4);
            ctx.closePath();
            ctx.fill();

            // Draw price text
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(price.toFixed(2), rightEdge + 2 + markerWidth / 2, y);
        };

        // Draw markers for all drawings
        drawings.forEach(d => {
            const color = d.type === 'fib' ? '#f59e0b' :
                d.type === 'gannFan' ? '#14b8a6' :
                    d.type === 'gann' ? '#8b5cf6' : '#2962FF';

            if (d.p1?.price) drawPriceMarker(d.p1.price, color);
            if (d.p2?.price && d.p2.price !== d.p1.price) drawPriceMarker(d.p2.price, color);
        });

        // Draw markers for current line being drawn
        if (currentLine) {
            const color = '#2962FF';
            if (currentLine.p1?.price) drawPriceMarker(currentLine.p1.price, color + '99');
            if (currentLine.p2?.price && currentLine.p2.price !== currentLine.p1.price) {
                drawPriceMarker(currentLine.p2.price, color + '99');
            }
        }
    }, [chart, series, drawings, currentLine, snappedPoint, activeTool, getCoords, getChartBounds]);

    // Subscribe to chart changes and re-render
    useEffect(() => {
        if (!chart) return;

        const handleRedraw = () => requestAnimationFrame(renderDrawings);

        chart.timeScale().subscribeVisibleLogicalRangeChange(handleRedraw);

        // Also redraw on any price scale change
        const interval = setInterval(handleRedraw, 50); // Smooth updates

        return () => {
            chart.timeScale().unsubscribeVisibleLogicalRangeChange(handleRedraw);
            clearInterval(interval);
        };
    }, [chart, renderDrawings]);

    // Redraw when drawings change
    useEffect(() => {
        renderDrawings();
    }, [renderDrawings]);

    // Mouse handlers
    const handleMouseDown = (e) => {
        if (!activeTool || activeTool === 'eraser' || activeTool === 'text') return;

        const point = getPoint(e.clientX, e.clientY);
        if (point && point.time) {
            setCurrentLine({ p1: point, p2: point, type: activeTool });
        }
    };

    const handleMouseMove = (e) => {
        // Update snap point even when not drawing
        if (activeTool && activeTool !== 'eraser') {
            getPoint(e.clientX, e.clientY);
        }

        if (!currentLine) return;

        const point = getPoint(e.clientX, e.clientY);
        if (point) {
            setCurrentLine(prev => ({ ...prev, p2: point }));
        }
    };

    const handleMouseUp = () => {
        if (currentLine) {
            const newDrawing = {
                id: Date.now(),
                p1: currentLine.p1,
                p2: currentLine.p2,
                type: currentLine.type
            };
            setDrawings(prev => [...prev, newDrawing]);
            setCurrentLine(null);
            setSnappedPoint(null);
            if (onDrawingComplete) onDrawingComplete();
        }
    };

    const handleClick = (e) => {
        if (activeTool !== 'eraser' || !chart || !series) return;

        const bounds = getChartBounds();
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Find drawing near click point
        const hitRadius = 10;
        const hitDrawingIndex = drawings.findIndex(d => {
            const start = getCoords(d.p1);
            const end = getCoords(d.p2);
            if (!start || !end) return false;

            const sx = start.x + bounds.left;
            const sy = start.y;
            const ex = end.x + bounds.left;
            const ey = end.y;

            // Simple line distance check
            const lineLen = Math.sqrt((ex - sx) ** 2 + (ey - sy) ** 2);
            if (lineLen === 0) return Math.sqrt((clickX - sx) ** 2 + (clickY - sy) ** 2) < hitRadius;

            const t = Math.max(0, Math.min(1, ((clickX - sx) * (ex - sx) + (clickY - sy) * (ey - sy)) / (lineLen ** 2)));
            const projX = sx + t * (ex - sx);
            const projY = sy + t * (ey - sy);
            const dist = Math.sqrt((clickX - projX) ** 2 + (clickY - projY) ** 2);

            return dist < hitRadius;
        });

        if (hitDrawingIndex !== -1) {
            setDrawings(prev => prev.filter((_, i) => i !== hitDrawingIndex));
        }
    };

    const handleMouseLeave = () => {
        setSnappedPoint(null);
    };

    // Handle text tool click
    const handleTextClick = (e) => {
        if (activeTool !== 'text') return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const point = getPoint(e.clientX, e.clientY);

        if (point) {
            setTextInput({ point, x, y, text: '' });
            setTimeout(() => textInputRef.current?.focus(), 10);
        }
    };

    const handleTextSubmit = () => {
        if (textInput && textInput.text.trim()) {
            const newDrawing = {
                id: Date.now(),
                p1: textInput.point,
                p2: textInput.point,
                type: 'text',
                text: textInput.text.trim()
            };
            setDrawings(prev => [...prev, newDrawing]);
        }
        setTextInput(null);
    };

    const handleTextKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleTextSubmit();
        } else if (e.key === 'Escape') {
            setTextInput(null);
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-full z-20"
            style={{
                pointerEvents: activeTool ? 'auto' : 'none',
                cursor: activeTool === 'eraser' ? 'cell' : (activeTool === 'text' ? 'text' : (activeTool ? 'crosshair' : 'default'))
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
                handleClick(e);
                handleTextClick(e);
            }}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
            />

            {/* Text Input Popup */}
            {textInput && (
                <div
                    className="absolute z-50"
                    style={{ left: textInput.x, top: textInput.y - 40 }}
                >
                    <input
                        ref={textInputRef}
                        type="text"
                        value={textInput.text}
                        onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
                        onKeyDown={handleTextKeyDown}
                        onBlur={handleTextSubmit}
                        placeholder="Type text..."
                        className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                    />
                </div>
            )}
        </div>
    );
};

export default ChartAnnotations;