import React, { useMemo } from 'react';

const CandleLoader = () => {
    const CYCLE_DURATION = 1.0;
    const STEP_DURATION = CYCLE_DURATION / 6;

    const getRandomWicks = () => {
        const min = 2;
        const max = 18; // Increased range for radical difference
        return {
            top: Math.floor(Math.random() * (max - min + 1)) + min,
            bottom: Math.floor(Math.random() * (max - min + 1)) + min
        };
    };

    const wicks = useMemo(() => Array.from({ length: 7 }, () => getRandomWicks()), []);

    return (
        <div className="flex items-center justify-center p-4">
            <style>
                {`
                @keyframes shrinkGrowRed {
                    0% { transform-origin: bottom; transform: scaleY(1); }
                    16.66% { transform-origin: bottom; transform: scaleY(0); }
                    16.67% { transform-origin: top; transform: scaleY(0); }
                    33.33% { transform-origin: top; transform: scaleY(1); }
                    33.34% { transform-origin: bottom; transform: scaleY(1); }
                    100% { transform-origin: bottom; transform: scaleY(1); }
                }
                @keyframes shrinkGrowGreen {
                    0% { transform-origin: top; transform: scaleY(1); }
                    16.66% { transform-origin: top; transform: scaleY(0); }
                    16.67% { transform-origin: bottom; transform: scaleY(0); }
                    33.33% { transform-origin: bottom; transform: scaleY(1); }
                    33.34% { transform-origin: top; transform: scaleY(1); }
                    100% { transform-origin: top; transform: scaleY(1); }
                }
                .candle-red {
                    animation: shrinkGrowRed 1s infinite linear; 
                }
                .candle-green {
                    animation: shrinkGrowGreen 1s infinite linear;
                }
                `}
            </style>

            {/* 4 Columns. Gap 4px. */}
            <div className="flex flex-row gap-[4px]">

                {/* Col 1: Candle 5 (Mid Green) */}
                <div className="flex flex-col justify-start pt-[16px]">
                    <Candle
                        height={44}
                        color="#10b981"
                        animationClass="candle-green"
                        delay={STEP_DURATION * 4}
                        wicks={wicks[5]}
                    />
                </div>

                {/* Col 2: Candle 6 (Top) & 4 (Bot) */}
                <div className="flex flex-col justify-between h-[76px]">
                    <Candle
                        height={16}
                        color="#10b981"
                        animationClass="candle-green"
                        delay={STEP_DURATION * 5}
                        wicks={wicks[6]}
                    />
                    <Candle
                        height={16}
                        color="#10b981"
                        animationClass="candle-green"
                        delay={STEP_DURATION * 3}
                        wicks={wicks[4]}
                    />
                </div>

                {/* Col 3: Candle 1 (Top) & 3 (Bot) */}
                <div className="flex flex-col justify-between h-[76px]">
                    <Candle
                        height={16}
                        color="#ef4444"
                        animationClass="candle-red"
                        delay={0}
                        wicks={wicks[1]}
                    />
                    <Candle
                        height={16}
                        color="#ef4444"
                        animationClass="candle-red"
                        delay={STEP_DURATION * 2}
                        wicks={wicks[3]}
                    />
                </div>

                {/* Col 4: Candle 2 (Mid Red) */}
                <div className="flex flex-col justify-start pt-[16px]">
                    <Candle
                        height={44}
                        color="#ef4444"
                        animationClass="candle-red"
                        delay={STEP_DURATION * 1}
                        wicks={wicks[2]}
                    />
                </div>

            </div>
        </div>
    );
};

const Candle = ({ height, color, animationClass, delay, wicks }) => {
    return (
        <div
            className={`w-[16px] relative ${animationClass}`} // Updated width to 16px
            style={{
                height: `${height}px`, // Strictly Body Height
                animationDelay: `${delay}s`,
                backgroundColor: color
            }}
        >
            {/* Top Wick */}
            <div
                className="absolute w-[2px] left-1/2 -translate-x-1/2"
                style={{
                    backgroundColor: color,
                    height: `${wicks?.top || 4}px`,
                    bottom: '100%' // Sits above
                }}
            />

            {/* Bottom Wick */}
            <div
                className="absolute w-[2px] left-1/2 -translate-x-1/2"
                style={{
                    backgroundColor: color,
                    height: `${wicks?.bottom || 4}px`,
                    top: '100%' // Sits below
                }}
            />
        </div>
    );
};

export default CandleLoader;  
