import {
    SMA, EMA, WMA, WEMA, BollingerBands, RSI, MACD, ADX, ATR, CCI, ROC,
    Stochastic, WilliamsR, MFI, OBV, TRIX, ForceIndex, PSAR, AwesomeOscillator, IchimokuCloud,
    ADL
} from 'technicalindicators';




// --- Manual Implementations for Missing/Unstable Lib Indicators ---

const calculateVWAP = (data) => {
    let cumVol = 0;
    let cumVolPrice = 0;
    return data.map(d => {
        const avgPrice = (d.high + d.low + d.close) / 3;
        cumVol += d.volume;
        cumVolPrice += avgPrice * d.volume;
        return cumVol === 0 ? 0 : cumVolPrice / cumVol;
    });
};

const calculateHeikenAshi = (data) => {
    if (!data || data.length === 0) return [];
    const results = [];
    let prevOpen = data[0].open;
    let prevClose = data[0].close;

    data.forEach(d => {
        const haClose = (d.open + d.high + d.low + d.close) / 4;
        const haOpen = (prevOpen + prevClose) / 2;
        const haHigh = Math.max(d.high, haOpen, haClose);
        const haLow = Math.min(d.low, haOpen, haClose);
        results.push({ open: haOpen, high: haHigh, low: haLow, close: haClose });
        prevOpen = haOpen;
        prevClose = haClose;
    });
    return results;
};

const calculateSuperTrend = (data, period, multiplier) => {
    // 1. Calculate ATR
    const input = {
        high: data.map(d => d.high),
        low: data.map(d => d.low),
        close: data.map(d => d.close),
        period: period
    };
    const atr = ATR.calculate(input);

    // Pad ATR result to match data length (ATR starts after period)
    const atrFull = new Array(period).fill(0).concat(atr);

    const results = [];
    let trend = 1; // 1: Up, -1: Down
    let upperBand = 0;
    let lowerBand = 0;

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        const hl2 = (d.high + d.low) / 2;
        const currentATR = atrFull[i] || 0;

        let basicUpper = hl2 + (multiplier * currentATR);
        let basicLower = hl2 - (multiplier * currentATR);

        // Previous bands
        const prevUpper = i > 0 ? results[i - 1].upperBand : basicUpper;
        const prevLower = i > 0 ? results[i - 1].lowerBand : basicLower;
        const prevClose = i > 0 ? data[i - 1].close : d.close;
        const prevTrend = i > 0 ? results[i - 1].trend : 1;

        // Final Bands
        let finalUpper = (basicUpper < prevUpper || prevClose > prevUpper) ? basicUpper : prevUpper;
        let finalLower = (basicLower > prevLower || prevClose < prevLower) ? basicLower : prevLower;

        // Trend
        let currentTrend = prevTrend;
        if (prevTrend === 1 && d.close < finalLower) currentTrend = -1;
        else if (prevTrend === -1 && d.close > finalUpper) currentTrend = 1;

        results.push({
            trend: currentTrend,
            value: currentTrend === 1 ? finalLower : finalUpper, // The line to plot
            upperBand: finalUpper,
            lowerBand: finalLower
        });
    }
    return results;
};

const calculateStochRSI = (values, rsiPeriod, stochPeriod, kPeriod, dPeriod) => {
    // 1. RSI
    const rsi = RSI.calculate({ values, period: rsiPeriod });
    // 2. Stochastic of RSI
    // Pad RSI to match input length for alignment? No, lib handles it.
    // But Stochastic expects high, low, close. For StochRSI, we use RSI as all three.
    const stochInput = {
        high: rsi,
        low: rsi,
        close: rsi,
        period: stochPeriod,
        signalPeriod: kPeriod
    };
    const stoch = Stochastic.calculate(stochInput);
    // stoch returns { k, d }
    // We need to align. RSI removes 'rsiPeriod' elements. Stoch removes 'stochPeriod-1'.
    // Total offset = rsiPeriod + stochPeriod - 1 roughly.
    return stoch;
};

const calculateDonchian = (data, period) => {
    const results = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            results.push({ upper: null, lower: null, middle: null });
            continue;
        }
        const slice = data.slice(i - period + 1, i + 1);
        const max = Math.max(...slice.map(d => d.high));
        const min = Math.min(...slice.map(d => d.low));
        results.push({ upper: max, lower: min, middle: (max + min) / 2 });
    }
    return results;
};

const calculateHMA = (data, period) => {
    if (data.length < period) return [];
    const close = data.map(d => d.close);
    const wma1 = WMA.calculate({ values: close, period: Math.floor(period / 2) });
    const wma2 = WMA.calculate({ values: close, period: period });
    const diff = period - Math.floor(period / 2);
    const wma1Sliced = wma1.slice(diff);
    const rawHMA = [];
    for (let i = 0; i < wma2.length; i++) {
        rawHMA.push(2 * wma1Sliced[i] - wma2[i]);
    }
    const sqrtPeriod = Math.floor(Math.sqrt(period));
    return WMA.calculate({ values: rawHMA, period: sqrtPeriod });
};

const calculateTEMA = (data, period) => {
    if (data.length < period * 3) return [];
    const close = data.map(d => d.close);
    const ema1 = EMA.calculate({ values: close, period });
    const ema2 = EMA.calculate({ values: ema1, period });
    const ema3 = EMA.calculate({ values: ema2, period });
    const offset1 = ema1.length - ema3.length;
    const offset2 = ema2.length - ema3.length;
    const results = [];
    for (let i = 0; i < ema3.length; i++) {
        results.push(3 * ema1[i + offset1] - 3 * ema2[i + offset2] + ema3[i]);
    }
    return results;
};

const calculateDeM = (data, period) => {
    if (data.length < period) return [];
    const deMax = [];
    const deMin = [];
    for (let i = 1; i < data.length; i++) {
        const h = data[i].high;
        const l = data[i].low;
        const ph = data[i - 1].high;
        const pl = data[i - 1].low;
        deMax.push(h > ph ? h - ph : 0);
        deMin.push(pl > l ? pl - l : 0);
    }
    const smaMax = SMA.calculate({ values: deMax, period });
    const smaMin = SMA.calculate({ values: deMin, period });
    const results = [];
    for (let i = 0; i < smaMax.length; i++) {
        const num = smaMax[i];
        const den = smaMax[i] + smaMin[i];
        results.push(den === 0 ? 0 : num / den);
    }
    return results;
};

const calculateCMF = (data, period) => {
    if (data.length < period) return [];
    const mfv = data.map(d => {
        const range = d.high - d.low;
        if (range === 0) return 0;
        const mfm = ((d.close - d.low) - (d.high - d.close)) / range;
        return mfm * d.volume;
    });
    const vol = data.map(d => d.volume);
    const results = [];
    for (let i = period - 1; i < mfv.length; i++) {
        const sumMfv = mfv.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        const sumVol = vol.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        results.push(sumVol === 0 ? 0 : sumMfv / sumVol);
    }
    return results;
};

const calculateUO = (data) => {
    if (data.length < 28) return [];
    const bp = [];
    const tr = [];
    for (let i = 1; i < data.length; i++) {
        const c = data[i].close;
        const l = data[i].low;
        const h = data[i].high;
        const pc = data[i - 1].close;
        const minLPC = Math.min(l, pc);
        const maxHPC = Math.max(h, pc);
        bp.push(c - minLPC);
        tr.push(maxHPC - minLPC);
    }

    const results = [];
    // Need 28 data points for first calc (index 27 in bp/tr)
    // bp/tr length is N-1.
    for (let i = 27; i < bp.length; i++) {
        const sumBP7 = bp.slice(i - 6, i + 1).reduce((a, b) => a + b, 0);
        const sumTR7 = tr.slice(i - 6, i + 1).reduce((a, b) => a + b, 0);
        const sumBP14 = bp.slice(i - 13, i + 1).reduce((a, b) => a + b, 0);
        const sumTR14 = tr.slice(i - 13, i + 1).reduce((a, b) => a + b, 0);
        const sumBP28 = bp.slice(i - 27, i + 1).reduce((a, b) => a + b, 0);
        const sumTR28 = tr.slice(i - 27, i + 1).reduce((a, b) => a + b, 0);

        const avg7 = sumTR7 === 0 ? 0 : sumBP7 / sumTR7;
        const avg14 = sumTR14 === 0 ? 0 : sumBP14 / sumTR14;
        const avg28 = sumTR28 === 0 ? 0 : sumBP28 / sumTR28;

        results.push(100 * (4 * avg7 + 2 * avg14 + avg28) / 7);
    }
    return results;
};

const calculateChaikinOsc = (data) => {
    // Uses ADL from lib
    const input = {
        high: data.map(d => d.high),
        low: data.map(d => d.low),
        close: data.map(d => d.close),
        volume: data.map(d => d.volume)
    };
    const adl = ADL.calculate(input);
    const ema3 = EMA.calculate({ values: adl, period: 3 });
    const ema10 = EMA.calculate({ values: adl, period: 10 });
    // Align
    // ema3 len: N - 2
    // ema10 len: N - 9
    // diff = 7
    const results = [];
    const offset = ema3.length - ema10.length;
    for (let i = 0; i < ema10.length; i++) {
        results.push(ema3[i + offset] - ema10[i]);
    }
    return results;
};

const calculateKlinger = (data) => {
    // Simplified Klinger: EMA(Vol * Direction, 34) - EMA(Vol * Direction, 55)
    // Direction = 1 if Typical Price > Prev TP, else -1
    const volForce = [];
    for (let i = 1; i < data.length; i++) {
        const tp = (data[i].high + data[i].low + data[i].close) / 3;
        const ptp = (data[i - 1].high + data[i - 1].low + data[i - 1].close) / 3;
        const dir = tp > ptp ? 1 : -1;
        volForce.push(data[i].volume * dir);
    }
    const ema34 = EMA.calculate({ values: volForce, period: 34 });
    const ema55 = EMA.calculate({ values: volForce, period: 55 });
    const offset = ema34.length - ema55.length;
    const results = [];
    for (let i = 0; i < ema55.length; i++) {
        results.push(ema34[i + offset] - ema55[i]);
    }
    return results;
};

const calculateChaikinVol = (data) => {
    // HL = H-L
    // EMA(HL, 10)
    // ROC(EMA, 10)
    const hl = data.map(d => d.high - d.low);
    const ema = EMA.calculate({ values: hl, period: 10 });
    // ROC of EMA over 10 periods
    // ROC = (Current - Ago) / Ago * 100
    const results = [];
    const rocPeriod = 10;
    for (let i = rocPeriod; i < ema.length; i++) {
        const current = ema[i];
        const ago = ema[i - rocPeriod];
        results.push(ago === 0 ? 0 : ((current - ago) / ago) * 100);
    }
    return results;
};

const calculateEOM = (data) => {
    const results = [];
    const period = 14;
    const eomRaw = [];
    for (let i = 1; i < data.length; i++) {
        const d = data[i];
        const pd = data[i - 1];
        const dist = ((d.high + d.low) / 2) - ((pd.high + pd.low) / 2);
        const box = (d.volume / 100000000) / (d.high - d.low === 0 ? 1 : d.high - d.low);
        eomRaw.push(box === 0 ? 0 : dist / box);
    }
    return SMA.calculate({ values: eomRaw, period });
};

const calculateHistoricalVolatility = (data, period) => {

    if (data.length < period + 1) return [];
    const logReturns = [];
    for (let i = 1; i < data.length; i++) {
        const current = data[i].close;
        const prev = data[i - 1].close;
        logReturns.push(Math.log(current / prev));
    }

    const results = [];
    for (let i = 0; i < logReturns.length; i++) {
        if (i < period - 1) {
            results.push(null);
            continue;
        }
        const slice = logReturns.slice(i - period + 1, i + 1);
        const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
        const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (slice.length - 1);
        const stdDev = Math.sqrt(variance);
        const annualizedVol = stdDev * Math.sqrt(252) * 100; // Annualized
        results.push(annualizedVol);
    }
    // Pad with nulls for the first 'period' points (1 for return calc + period-1 for window)
    // Actually logReturns is length N-1.
    // results is length N-1.
    // We need to align with data (length N).
    // The first point has no return.
    // So we prepend one null?
    const final = [null, ...results];

    return final;
};

// Helper to calculate indicator data
export const calculateIndicatorData = (indicatorId, data, params) => {
    if (!data || data.length === 0) return [];

    const closePrices = data.map(d => d.close);
    const highPrices = data.map(d => d.high);
    const lowPrices = data.map(d => d.low);
    const volumes = data.map(d => d.volume || 0);

    const input = {
        values: closePrices,
        open: data.map(d => d.open),
        high: highPrices,
        low: lowPrices,
        close: closePrices,
        volume: volumes,
        period: params.period,
        stdDev: params.stdDev,
        fastPeriod: params.fastPeriod,
        slowPeriod: params.slowPeriod,
        signalPeriod: params.signalPeriod,
        step: params.step,
        max: params.max,
        multiplier: params.multiplier,
    };

    let results = [];
    let offset = 0;

    try {
        switch (indicatorId) {
            case 'SMA': results = SMA.calculate(input); offset = params.period - 1; break;
            case 'EMA': results = EMA.calculate(input); offset = params.period - 1; break;
            case 'WMA': results = WMA.calculate(input); offset = params.period - 1; break;
            case 'WEMA': results = WEMA.calculate(input); offset = params.period - 1; break;
            case 'BB': results = BollingerBands.calculate(input); offset = params.period - 1; break;
            case 'RSI': results = RSI.calculate(input); offset = params.period; break;
            case 'MACD': results = MACD.calculate(input); offset = params.slowPeriod - 1; break;
            case 'ADX': results = ADX.calculate(input); offset = params.period - 1; break;
            case 'ATR': results = ATR.calculate(input); offset = params.period - 1; break;
            case 'CCI': results = CCI.calculate(input); offset = params.period - 1; break;
            case 'ROC': results = ROC.calculate(input); offset = params.period; break;
            case 'STOCH': results = Stochastic.calculate(input); offset = params.period - 1; break;
            case 'WILLR': results = WilliamsR.calculate(input); offset = params.period - 1; break;
            case 'MFI': results = MFI.calculate(input); offset = params.period - 1; break;
            case 'OBV': results = OBV.calculate(input); offset = 0; break;
            case 'AO': results = AwesomeOscillator.calculate(input); offset = 0; break;
            case 'TRIX': results = TRIX.calculate(input); offset = (params.period * 3) - 1; break;
            case 'FI': results = ForceIndex.calculate(input); offset = params.period; break;
            case 'Ichimoku':
                results = IchimokuCloud.calculate(input);
                offset = params.basePeriod;
                break;
            case 'PSAR': results = PSAR.calculate(input); offset = 0; break;

            case 'HMA': results = calculateHMA(data, params.period); offset = params.period; break;
            case 'TEMA': results = calculateTEMA(data, params.period); offset = params.period * 3; break;
            case 'UO': results = calculateUO(data); offset = 28; break;
            case 'ChaikinOsc': results = calculateChaikinOsc(data); offset = 10; break;
            case 'DeM': results = calculateDeM(data, params.period); offset = params.period; break;
            case 'Klinger': results = calculateKlinger(data); offset = 55; break;
            case 'ChaikinVol': results = calculateChaikinVol(data); offset = 19; break;
            case 'AD': results = ADL.calculate(input); offset = 0; break;
            case 'CMF': results = calculateCMF(data, params.period); offset = params.period; break;
            case 'EOM': results = calculateEOM(data); offset = 14; break;
            case 'DC': // Donchian
                console.log('Calculating DC with period:', params.period);
                results = calculateDonchian(data, params.period);
                console.log('DC Results sample:', results.slice(0, 5));
                offset = 0;
                break;
            // ...
            case 'DMI':
                console.log('Calculating ADX/DMI with period:', params.period);
                results = ADX.calculate(input);
                console.log('ADX Results sample:', results.slice(0, 5));
                offset = params.period - 1;
                break;
            case 'HV':
                results = calculateHistoricalVolatility(data, params.period);
                offset = params.period; // Aligned with nulls, so offset is the period itself
                break;

            // --- Manual / Custom ---
            case 'VWAP':
                results = calculateVWAP(data);
                offset = 0;
                break;
            case 'SuperTrend':
                results = calculateSuperTrend(data, params.period, params.multiplier);
                offset = 0;
                break;
            case 'HeikenAshi':
                results = calculateHeikenAshi(data);
                offset = 0;
                break;
            case 'StochRSI':
                results = calculateStochRSI(closePrices, params.rsiPeriod, params.stochasticPeriod, params.kPeriod, params.dPeriod);
                offset = params.rsiPeriod + params.stochasticPeriod;
                break;

            case 'GMMA': // Guppy
                // Multiple EMAs
                // params: shortPeriods: [], longPeriods: []
                const shorts = params.shortPeriods.map(p => EMA.calculate({ ...input, period: p }));
                const longs = params.longPeriods.map(p => EMA.calculate({ ...input, period: p }));

                // Align to longest period (max of longs)
                const maxPeriod = Math.max(...params.longPeriods);
                results = [];
                // Input length
                const len = closePrices.length;
                for (let i = 0; i < len; i++) {
                    const row = {};
                    let valid = true;
                    // Map short values
                    params.shortPeriods.forEach((p, idx) => {
                        const serie = shorts[idx];
                        // EMA offset is p-1
                        const serieIdx = i - (p - 1); // Incorrect alignment logic? 
                        // EMA.calculate returns array of length N - (period-1).
                        // So index j in output corresponds to input index j + (period-1).
                        // We want value for input index 'i'.
                        // index in output = i - (p-1).
                        if (serieIdx < 0) valid = false;
                        else row[`short${p}`] = serie[serieIdx];
                    });
                    params.longPeriods.forEach((p, idx) => {
                        const serie = longs[idx];
                        const serieIdx = i - (p - 1);
                        if (serieIdx < 0) valid = false;
                        else row[`long${p}`] = serie[serieIdx];
                    });

                    if (valid) results.push(row);
                    else results.push(null);
                }
                offset = 0; // We handled alignment manually by pushing nulls/values for each input index
                break;

            case 'VolOsc': // Volume Oscillator
                // (ShortEMA - LongEMA) / LongEMA * 100
                const vShort = EMA.calculate({ values: volumes, period: params.shortPeriod });
                const vLong = EMA.calculate({ values: volumes, period: params.longPeriod });

                results = [];
                // Align
                // vShort len: N - (short-1)
                // vLong len: N - (long-1)
                // We want to loop input i
                for (let i = 0; i < volumes.length; i++) {
                    const sIdx = i - (params.shortPeriod - 1);
                    const lIdx = i - (params.longPeriod - 1);
                    if (sIdx >= 0 && lIdx >= 0) {
                        const sVal = vShort[sIdx];
                        const lVal = vLong[lIdx];
                        if (lVal !== 0) results.push(((sVal - lVal) / lVal) * 100);
                        else results.push(0);
                    } else {
                        results.push(null);
                    }
                }
                offset = 0;
                break;

            case 'KC': // Keltner (Simplified: EMA +/- ATR)
                // Need EMA and ATR
                const ema = EMA.calculate(input);
                const atr = ATR.calculate(input);
                // Align them
                // EMA offset: period-1. ATR offset: period-1.
                // We can map from period-1 index.
                results = [];
                for (let i = 0; i < ema.length; i++) {
                    // atr is same length usually if period same?
                    // technicalindicators output lengths might vary slightly.
                    // Let's assume alignment for now or use safe access.
                    const eVal = ema[i];
                    const aVal = atr[i]; // Might need index adjustment if lengths differ
                    if (eVal && aVal) {
                        results.push({ upper: eVal + params.multiplier * aVal, lower: eVal - params.multiplier * aVal, middle: eVal });
                    }
                }
                offset = params.period - 1;
                break;

            default:
                console.warn(`Indicator ${indicatorId} not implemented`);
                return [];
        }
    } catch (e) {
        console.error(`Error calculating ${indicatorId}:`, e);
        return [];
    }

    // Map results to chart data format
    return results.map((val, i) => {
        const dataIndex = i + offset;
        if (dataIndex >= data.length) return null;
        if (val === null) return null; // Filter out null values (e.g. from HV padding)

        const time = data[dataIndex].time;

        if (indicatorId === 'BB' || indicatorId === 'DC' || indicatorId === 'KC') {
            if (val.upper == null || val.lower == null || val.middle == null) return null;
            return { time, value: val.upper, lower: val.lower, middle: val.middle };
        }
        if (indicatorId === 'MACD') {
            return { time, value: val.MACD, signal: val.signal, histogram: val.histogram };
        }
        if (indicatorId === 'STOCH' || indicatorId === 'StochRSI') {
            return { time, value: val.k, d: val.d };
        }
        if (indicatorId === 'SuperTrend') {
            return { time, value: val.value, trend: val.trend }; // Value is the line to plot
        }
        if (indicatorId === 'HeikenAshi') {
            return { time, open: val.open, high: val.high, low: val.low, close: val.close };
        }
        if (indicatorId === 'Ichimoku') {
            return {
                time,
                conversion: val.conversion,
                base: val.base,
                spanA: val.spanA,
                spanB: val.spanB,
                lagging: val.lagging
            };
        }
        if (indicatorId === 'DMI') {
            return { time, pdi: val.pdi, mdi: val.mdi, adx: val.adx };
        }
        if (indicatorId === 'ADX') {
            return { time, value: val.adx };
        }
        if (indicatorId === 'PSAR') {
            return { time, value: val };
        }
        if (indicatorId === 'GMMA') {
            // val is already { shortX: ..., longY: ... }
            return { time, ...val };
        }

        return { time, value: val };
    }).filter(item => item !== null);
};