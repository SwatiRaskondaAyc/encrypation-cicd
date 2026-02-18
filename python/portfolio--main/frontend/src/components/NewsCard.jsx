import React, { useState } from 'react';
import {
  Clock,
  TrendingUp,
  Newspaper,
  ArrowUpCircle,
  ArrowDownCircle,
  ExternalLink
} from 'lucide-react';

const NewsCard = ({ article }) => {
  const [imgError, setImgError] = useState(false);

  const hasMatches = article?.matched_symbols && article.matched_symbols.length > 0;
  const isBullish = article?.sentiment === 'Bullish';
  const isBearish = article?.sentiment === 'Bearish';

  // Pastel Colors
  let cardClass = 'border-slate-200 hover:border-slate-300';
  let tagClass = 'bg-slate-100 text-slate-600';
  
  if (isBullish) {
      cardClass = 'border-emerald-200 bg-emerald-50/30 hover:border-emerald-300';
      tagClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
  } else if (isBearish) {
      cardClass = 'border-rose-200 bg-rose-50/30 hover:border-rose-300';
      tagClass = 'bg-rose-100 text-rose-700 border-rose-200';
  } else if (hasMatches) {
      cardClass = 'border-amber-200 bg-amber-50/30 hover:border-amber-300';
      tagClass = 'bg-amber-100 text-amber-800 border-amber-200';
  }

  return (
    <a
      href={article.article_link || article.link || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        flex flex-col h-full bg-white rounded-2xl overflow-hidden border
        ${cardClass}
        shadow-sm hover:shadow-lg hover:-translate-y-1
        transition-all duration-300 ease-out
        group
      `}
    >
      {/* Top Image Section */}
      <div className="w-full h-48 relative bg-slate-100 border-b border-slate-100">
        {article.image_url && !imgError ? (
          <img
            src={article.image_url}
            alt={article.headline}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <Newspaper className="w-10 h-10 mb-2" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}
        
        {/* Date Badge Overlay */}
        {(article.published_date) && (
             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-white/20 flex items-center gap-1">
                 <Clock className="w-3 h-3 text-slate-400" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                     {article.published_date}
                 </span>
             </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
         {/* Source */}
         {article.source && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {article.source}
            </div>
         )}

         {/* Title */}
         <h3 className="text-base font-bold text-slate-800 leading-snug mb-3 group-hover:text-blue-600 transition-colors">
            {article.headline}
         </h3>

         {/* Subtitle / Snippet (Added as requested) */}
         {article.subtitle && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                {article.subtitle}
            </p>
         )}

         {/* Spacer to push tags to bottom */}
         <div className="flex-1"></div>

         {/* Footer Tags (Sentiment + Symbol & Price) */}
         <div className="pt-4 mt-2 border-t border-slate-100/50 flex flex-wrap items-center gap-2">
            
            {isBullish && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${tagClass}`}>
                    <ArrowUpCircle className="w-3 h-3" /> BULLISH
                </span>
            )}
            {isBearish && (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${tagClass}`}>
                    <ArrowDownCircle className="w-3 h-3" /> BEARISH
                </span>
            )}

            {/* Symbol & Price Tag */}
            {hasMatches && (
                <div className="flex gap-1">
                    {article.matched_symbols.slice(0, 2).map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shadow-sm">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            {m.symbol}
                            {/* Show Price if available */}
                            {m.current_price && (
                                <span className="text-slate-400 ml-0.5 font-normal">
                                    ₹{m.current_price}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            )}
            
            <div className="ml-auto text-slate-300 group-hover:text-slate-400">
                <ExternalLink className="w-4 h-4" />
            </div>
         </div>
      </div>
    </a>
  );
};

export default NewsCard;
