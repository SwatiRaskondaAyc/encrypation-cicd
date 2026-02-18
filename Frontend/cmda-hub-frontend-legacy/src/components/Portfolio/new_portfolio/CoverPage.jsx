import React from "react";
import { TrendingUp, BarChart3, PieChart } from "lucide-react";

const CoverPage = ({
    portfolioName,
    companyLogo = "/equityhub_plot/CMDALOGO.png",
    generatedDate = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}) => {
    return (
        <div className="cover-page min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col items-center justify-center p-12 relative overflow-hidden page-break-after">

            {/* Corner Logos */}
            <div className="absolute top-10 left-10 z-20">
                <img
                    src="/ayclogo2.png"
                    alt="aYc Analytics"
                    className="h-20 w-auto object-contain filter drop-shadow-xl bg-white/10 p-2 rounded-lg backdrop-blur-sm"
                />
            </div>
            <div className="absolute top-10 right-10 z-20">
                <img
                    src="/CMDA LOGO (1).png"
                    alt="CMDA HUB"
                    className="h-20 w-auto object-contain filter drop-shadow-xl"
                />
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-8 max-w-4xl">

                {/* Main Title */}
                <div className="space-y-6">
                    <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
                        <span className="bg-gradient-to-r from-blue-300 via-cyan-200 to-purple-300 bg-clip-text text-transparent">
                            PORTFOLIO
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-white via-blue-100 to-slate-300 bg-clip-text text-transparent">
                            ANALYSIS
                        </span>
                    </h1>

                    <div className="h-1.5 w-48 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
                </div>

                {/* Portfolio Name Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] p-12 mt-16 shadow-2xl relative overflow-hidden group hover:border-white/40 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <p className="text-sm uppercase tracking-[0.3em] text-blue-300 mb-4 font-bold">
                        Portfolio Name
                    </p>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                        {portfolioName || "My Portfolio"}
                    </h2>
                </div>

                {/* Date and Report Info */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-16 text-slate-300">
                    <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                        <span className="text-sm font-medium tracking-wide">Generated on {generatedDate}</span>
                    </div>
                    <div className="hidden md:block w-px h-8 bg-white/20"></div>
                    <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                        <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                        <span className="text-sm font-medium tracking-wide">Comprehensive Analysis Report</span>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-20 pt-10 border-t border-white/10">
                    <p className="text-base text-slate-400 italic max-w-2xl mx-auto leading-relaxed font-light">
                        This report provides a deep-dive analysis of your portfolio performance,
                        risk exposure, and key market insights powered by CMDA Analytics.
                    </p>
                </div>
            </div>

            {/* Decorative Corner Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 border-l-[3px] border-t-[3px] border-blue-500/20 rounded-tl-[4rem]"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-[3px] border-b-[3px] border-purple-500/20 rounded-br-[4rem]"></div>
        </div>
    );
};

export default CoverPage;
