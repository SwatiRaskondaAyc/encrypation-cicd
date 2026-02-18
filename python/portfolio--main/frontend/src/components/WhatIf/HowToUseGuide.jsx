import React from "react";
import { HelpCircle, X, Zap } from "lucide-react";

const HowToUseGuide = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-indigo-100 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Mastering the Simulator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                1
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                  Select an Asset to Modify
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Hover over any stock in your new{" "}
                  <strong>Holdings List</strong> and click the
                  <span className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-md align-middle">
                    <Zap className="w-3 h-3 fill-current" /> Swap / Adjust
                  </span>
                  button.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                2
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                  Find a Better Alternative
                </h3>
                <p className="text-slate-600 mb-2 text-sm">
                  Our new <strong>Hierarchy Browser</strong> helps you find the
                  perfect replacement.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600">
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Explore entire sectors or drill down into industries.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      Compare prices instantly before selecting a target.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                3
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                  Draft Your Transaction
                </h3>
                <p className="text-slate-600 mb-3 text-sm">
                  Use the <strong>Transaction Ticket</strong> to fine-tune the
                  deal:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="bg-white border border-slate-200 p-2 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-xs text-indigo-600 uppercase mb-1">
                      Swap All
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Sell everything, buy max target.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-xs text-indigo-600 uppercase mb-1">
                      Partial
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Sell a specific amount of source.
                    </p>
                  </div>
                  <div className="bg-white border border-slate-200 p-2 rounded-lg text-center shadow-sm">
                    <div className="font-bold text-xs text-indigo-600 uppercase mb-1">
                      Add Funds
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Keep source, inject fresh capital.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4 group">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-110 transition-transform">
                4
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">
                  Analyze Impact
                </h3>
                <p className="text-slate-600 text-sm">
                  Hit <strong>Simulate</strong> to see the future. The dashboard
                  will instantly compare your
                  <strong> "Before vs After"</strong> metrics, showing exactly
                  how Risk, Return, and Dividends are affected.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 p-4 z-10">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.99]"
          >
            I'm Ready to Optimize
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowToUseGuide;
