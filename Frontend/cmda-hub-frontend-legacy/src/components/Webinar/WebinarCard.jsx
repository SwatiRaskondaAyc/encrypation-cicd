import React, { useState } from 'react';
import { Calendar, User, Clock, ChevronRight, Star, Users, Video, Award, Sparkles, CheckCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { trackCMDAHubTools } from '../../utils/tracking';
import { motion } from 'framer-motion';

const WebinarCard = ({ webinar, onSubscribe, onViewDetails, userId, onLoginClick }) => {
    const [isLoading, setIsLoading] = useState(false);

    // Parse date array [year, month, day, hour, minute]
    const formatDate = (dateArray) => {
        if (!dateArray || dateArray.length < 5) return 'Date TBD';
        const [year, month, day, hour, minute] = dateArray;
        const date = new Date(year, month - 1, day, hour, minute);
        return format(date, "EEE, MMM d • h:mm a");
    };

    const getDaysUntil = (dateArray) => {
        if (!dateArray || dateArray.length < 5) return null;
        const [year, month, day, hour, minute] = dateArray;
        const webinarDate = new Date(year, month - 1, day, hour, minute);
        const today = new Date();
        const diffTime = webinarDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays > 0) return `In ${diffDays} days`;
        return 'Past';
    };

    const daysUntil = getDaysUntil(webinar.startDateTime);
    const thumbnailSrc = webinar.thumbnailUrl || webinar.thumbnail ||
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800";

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:bg-slate-800/80"
        >
            {/* Top Interactive Area */}
            <div className="relative aspect-[16/9] overflow-hidden">
                {/* Overlay Badges */}
                <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-10 flex flex-col gap-1.5 sm:gap-2">
                    {webinar.subscribed && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-emerald-500 text-white rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            <CheckCircle size={8} className="sm:w-[10px] sm:h-[10px]" strokeWidth={3} />
                            Enrolled
                        </div>
                    )}

                </div>

                <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-10">
                    <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${daysUntil === 'Today'
                        ? "bg-red-500 text-white border-red-400 shadow-sm"
                        : "bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-white border-slate-200 dark:border-white/10"
                        }`}>
                        {daysUntil || 'Scheduled'}
                    </div>
                </div>

                {/* Thumbnail */}
                <img
                    src={thumbnailSrc}
                    alt={webinar.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800"; }}
                />

                {/* Gradient Wash */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                {/* Meta Header */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/20">
                        <User size={14} className="sm:w-[18px] sm:h-[18px] text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">{webinar.hostName}</div>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-0.5">
                            <ShieldCheck size={8} className="sm:w-[10px] sm:h-[10px]" />
                            Mentor
                        </div>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-1">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 transition-colors">
                        {webinar.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-normal leading-relaxed line-clamp-2">
                        {webinar.description || "Comprehensive strategy breakdown and live market analysis session for advanced traders."}
                    </p>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 py-3 sm:py-4 border-y border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Calendar size={12} className="sm:w-[14px] sm:h-[14px] text-blue-500" />
                        {formatDate(webinar.startDateTime).split('•')[0]}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <Clock size={12} className="sm:w-[14px] sm:h-[14px] text-blue-500" />
                        {formatDate(webinar.startDateTime).split('•')[1]}
                    </div>
                </div>

                {/* Action Footer */}
                <div className="flex gap-1.5 sm:gap-2">
                    {webinar.subscribed && webinar.joinLink ? (
                        <a
                            href={webinar.joinLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-[2] py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                        >
                            <ExternalLink size={12} className="sm:w-[14px] sm:h-[14px]" /> Join Session
                        </a>
                    ) : (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation();
                                setIsLoading(true);
                                try { await onSubscribe(webinar.id); } finally { setIsLoading(false); }
                            }}
                            disabled={webinar.subscribed || isLoading}
                            className={`flex-[2] py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${webinar.subscribed
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                                }`}
                        >
                            {webinar.subscribed ? (
                                <><CheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" /> Enrolled</>
                            ) : isLoading ? (
                                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Enroll Now"
                            )}
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(webinar.id);
                        }}
                        className="flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-[0.98]"
                    >
                        Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default WebinarCard;