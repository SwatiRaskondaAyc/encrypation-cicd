import React from "react";

const SectorTicker = ({ sectors }) => {
    if (!sectors || sectors.length === 0) return null;

    // Convert to Crores with 2 decimals
    const formatToCrores = (value) => {
        if (value == null || isNaN(value)) return "N/A";
        return `${(value / 1e7).toFixed(2)} Cr`;
    };

    return (
        <div className="w-full overflow-hidden bg-gray-900 text-white border-b border-gray-700">
            {/* Outer flex duplicated for seamless loop */}
            <div className="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, loopIndex) =>
                    sectors.map((sector, index) => (
                        <div
                            key={`${loopIndex}-${index}`}
                            className="px-6 py-2 flex items-center gap-3 border-r border-gray-700"
                        >
                            <span className="font-semibold">{sector.Sector}</span>
                            <span
                                className={`text-sm ${sector.SectorMarketCap >= 0 ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                MCap: {formatToCrores(sector.SectorMarketCap)}
                            </span>
                            <span
                                className={`text-sm ${sector.SectorCAGR_1Y_MCap >= 0
                                        ? "text-green-400"
                                        : "text-red-400"
                                    }`}
                            >
                                CAGR: {sector.SectorCAGR_1Y_MCap?.toFixed(2)}%
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SectorTicker;