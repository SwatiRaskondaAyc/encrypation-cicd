import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import {
  CheckCircle, ChevronLeft, ChevronRight, Video, Search,
  Sparkles, Award, Calendar as CalendarIcon, Clock, User,
  FileText, ArrowRight, Monitor, ExternalLink, Linkedin, Twitter, Instagram
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "../Navbar";
import WebinarCard from "./WebinarCard";
import { useAuth } from "../AuthContext";
import { apiClient } from "../../utils/apiClient";
import { trackCMDAHubTools, trackAction } from "../../utils/tracking";

/* ---------------- Calendar Component ---------------- */

const WebinarCalendar = ({ webinars = [], userId, selectedDate, onDateClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayCounts, setDayCounts] = useState([]);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const loadCalendar = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const data = await apiClient.get(
          `/register/user/webinars/calendar?userId=${userId}&year=${year}&month=${month}`
        );
        setDayCounts(data || []);
      } catch (e) {
        console.error("Calendar error:", e);
      }
    };
    loadCalendar();
  }, [currentMonth, userId]);

  const monthStart = startOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(endOfMonth(monthStart)),
  });

  const countForDay = (date) => {
    const key = format(date, "yyyy-MM-dd");
    const apiCount = dayCounts.find(d => d.date === key)?.count || 0;
    const webinarCount = webinars.filter(w => {
      if (!w.startDateTime) return false;
      const [y, m, d] = w.startDateTime;
      return isSameDay(new Date(y, m - 1, d), date);
    }).length;
    return Math.max(apiCount, webinarCount);
  };

  const getWebinarsForDate = (date) => {
    return webinars.filter(w => {
      if (!w.startDateTime) return false;
      const [y, m, d] = w.startDateTime;
      return isSameDay(new Date(y, m - 1, d), date);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100 dark:border-white/5">
        <span className="font-bold text-xs uppercase tracking-wider text-slate-400">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={16} className="text-slate-500" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[9px] font-bold text-center text-slate-300 dark:text-slate-600 py-3 border-b border-slate-50 dark:border-white/5 uppercase tracking-wider">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
          <div key={`day-${idx}`}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 p-2">
        {days.map(day => {
          const active = isSameDay(day, selectedDate);
          const today = isSameDay(day, new Date());
          const inMonth = isSameMonth(day, monthStart);
          const count = countForDay(day);
          const isHovered = hoveredDate && isSameDay(day, hoveredDate);
          const dayWebinars = getWebinarsForDate(day);

          return (
            <div key={day.toString()} className="relative aspect-square">
              <button
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
                onClick={() => onDateClick(active ? null : day)}
                className={`
                  w-full h-full rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative
                  ${!inMonth ? "text-slate-300 dark:text-slate-800" : "text-slate-600 dark:text-slate-400"}
                  ${today ? "ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-slate-900" : ""}
                  ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105 z-10"
                    : "hover:bg-slate-50 dark:hover:bg-white/5 hover:scale-105 hover:z-10"
                  }
                `}
              >
                {format(day, "d")}
                {count > 0 && (
                  <div className={`
                    absolute bottom-1.5 w-1.5 h-1.5 rounded-full transition-all
                    ${active ? "bg-white" : "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"}
                  `} />
                )}
              </button>

              <AnimatePresence>
                {isHovered && dayWebinars.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[11px] rounded-xl p-3 shadow-xl border border-slate-100 dark:border-white/10 w-48"
                  >
                    <div className="space-y-2">
                      {dayWebinars.map((w, idx) => {
                        const [y, m, d, h, min] = w.startDateTime;
                        const dateObj = new Date(y, m - 1, d, h, min);
                        return (
                          <div key={idx} className="pb-2 last:pb-0 border-b last:border-0 border-slate-100 dark:border-white/5">
                            <p className="font-bold text-blue-600 dark:text-blue-400 leading-tight mb-1">
                              {w.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                              <Clock size={8} />
                              {format(dateObj, "hh:mm a")}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- Main Webinar Page ---------------- */

const Webinar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userId } = useAuth();
  console.log("isLoggedIn:", isLoggedIn, "userId:", userId);

  const [webinars, setWebinars] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [enrollingWebinarIds, setEnrollingWebinarIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showEnrolledOnly, setShowEnrolledOnly] = useState(false);

  useEffect(() => {
    trackCMDAHubTools.webinar.viewList();
  }, []);

  useEffect(() => {
    if (location.state?.enrollmentSuccess) {
      toast.success("Successfully enrolled!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get("/user/webinars");
        setWebinars(
          (data || []).map(w => ({
            ...w,
            id: w.webinarId || w.id,
            title: w.webinarTitle || w.title,
          }))
        );
      } catch (e) {
        console.error("Error loading webinars:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadSubscriptions = async () => {
      if (!isLoggedIn) {
        setSubscriptions([]);
        return;
      }
      try {
        const subs = await apiClient.get(`/register/user`);
        // Normalize subscriptions for reliable ID matching and include joinLink
        const enrolledSubs = (Array.isArray(subs) ? subs : [])
          .filter(s => s.status === "ENROLLED" || s.status === "SUCCESS")
          .map(s => {
            const wid = s.webinar?.id || s.webinarId || s.entityId;
            console.log(`Enrollment Detection: Reg ${s.registrationId || s.id} links to Webinar ${wid}`);
            return {
              ...s,
              actualWebinarId: wid,
              webinarLink: s.joinLink || s.webinarLink // Normalize link field
            };
          });
        setSubscriptions(enrolledSubs);
      } catch (e) {
        console.error("Failed to fetch user subscriptions:", e);
        setSubscriptions([]);
      }
    };
    loadSubscriptions();
  }, [isLoggedIn]);

  const handleSubscribe = async (webId) => {
    if (!isLoggedIn) {
      toast.warn("Please login to enroll in this session.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (enrollingWebinarIds.has(webId)) return;

    const alreadySubbed = subscriptions.some(s =>
      parseInt(s.actualWebinarId) === parseInt(webId)
    );

    if (alreadySubbed) {
      toast.success("You are already enrolled!");
      return;
    }

    try {
      setEnrollingWebinarIds(prev => new Set(prev).add(webId));
      const response = await apiClient.post("/register", {
        entityId: parseInt(webId),
        entityType: "WEB",
        status: "ENROLLED",
        paymentReferenceId: "N/A",
        amountPaid: 0,
      });

      // Update local state immediately with a normalized subscription object
      const newSub = {
        ...response,
        actualWebinarId: parseInt(webId),
        webinar: { id: parseInt(webId) },
        status: "ENROLLED",
        webinarLink: response.joinLink || response.webinarLink
      };
      setSubscriptions(prev => {
        // Prevent duplicates
        if (prev.some(s => parseInt(s.actualWebinarId) === parseInt(webId))) return prev;
        return [...prev, newSub];
      });
      toast.success("Successfully enrolled!");
      setTimeout(() => {
        navigate(`/education/${webId}`, { state: { enrollmentSuccess: true } });
      }, 500);
    } catch (error) {
      const msg = error?.message || error?.toString() || "";
      if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already enrolled")) {
        toast.info("You are already enrolled in this session.");

        // Update local state so the button changes immediately
        const alreadySub = {
          actualWebinarId: parseInt(webId),
          status: "ENROLLED"
        };
        setSubscriptions(prev => {
          if (prev.some(s => parseInt(s.actualWebinarId) === parseInt(webId))) return prev;
          return [...prev, alreadySub];
        });

        setTimeout(() => {
          navigate(`/education/${webId}`, { state: { webinar: { ...webinars.find(w => w.id === webId), subscribed: true } } });
        }, 500);
      } else {
        toast.error(msg || "Enrollment failed.");
      }
    } finally {
      setEnrollingWebinarIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(webId);
        return newSet;
      });
    }
  };

  const filteredWebinars = webinars.filter(w => {
    const isEnrolled = subscriptions.some(s =>
      parseInt(s.actualWebinarId) === parseInt(w.id)
    );

    const matchesEnrolled = !showEnrolledOnly || isEnrolled;
    const matchesDate = !selectedDate || !w.startDateTime || isSameDay(new Date(w.startDateTime[0], w.startDateTime[1] - 1, w.startDateTime[2]), selectedDate);
    const matchesSearch = !searchQuery || w.title.toLowerCase().includes(searchQuery.toLowerCase()) || w.hostName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEnrolled && matchesDate && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-20 h-20 relative">
            <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      {/* Navbar Protection Tint - Ensures visibility on scroll and against hero images */}
      <div className="fixed top-0 left-0 right-0 h-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl z-[45] border-b border-slate-200/50 dark:border-white/5" />

      {/* Visual Background Accent */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />

      <main className="relative max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20">

        {/* Header Section */}
        <div className="max-w-4xl mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
            <div className="h-[1px] w-6 sm:w-8 bg-blue-600 rounded-full" />
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-blue-600 dark:text-blue-400">Master the Markets. Led by Experts.</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
            Education Masterclasses
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-5 md:mt-6">
            <button
              onClick={() => setShowEnrolledOnly(false)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all ${!showEnrolledOnly ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
              All Sessions
            </button>
            <button
              onClick={() => setShowEnrolledOnly(true)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all ${showEnrolledOnly ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'}`}
            >
              My Enrolled
            </button>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          {/* Content Area - 9 Columns */}
          <div className="lg:col-span-9 order-2 lg:order-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-5 md:mb-6">
              <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest flex items-center gap-2 sm:gap-3">
                <div className="h-[1px] w-6 sm:w-8 bg-blue-600/30 rounded-full" />
                {selectedDate ? `Sessions on ${format(selectedDate, "MMM d, yyyy")}` : "Available Sessions"}
              </h3>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {filteredWebinars.length > 0 ? (
                filteredWebinars.map(w => {
                  const mySub = subscriptions.find(s =>
                    parseInt(s.actualWebinarId) === parseInt(w.id)
                  );
                  const isEnrolled = !!mySub;
                  return (
                    <WebinarCard
                      key={w.id}
                      webinar={{
                        ...w,
                        subscribed: isEnrolled || enrollingWebinarIds.has(w.id),
                        joinLink: mySub?.webinarLink || mySub?.joinLink
                      }}
                      onSubscribe={handleSubscribe}
                      onViewDetails={() => navigate(`/education/${w.id}`, { state: { webinar: { ...w, subscribed: isEnrolled, joinLink: mySub?.webinarLink || mySub?.joinLink } } })}
                    />
                  );
                })
              ) : (
                <div className="col-span-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900/40 rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4 sm:mb-5 md:mb-6">
                    <Video size={32} className="sm:w-9 sm:h-9 md:w-10 md:h-10" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight">
                    {!isLoggedIn && showEnrolledOnly
                      ? "Login to View Enrollments"
                      : showEnrolledOnly
                        ? "You haven't enrolled yet"
                        : "No sessions found"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal max-w-xs sm:max-w-sm mb-5 sm:mb-6 md:mb-8">
                    {!isLoggedIn && showEnrolledOnly
                      ? "Please log in to see your personalized schedule and enrolled masterclasses."
                      : showEnrolledOnly
                        ? "Explore our masterclasses and enroll to see them here."
                        : "Try adjusting your search or check other dates on the learning calendar."}
                  </p>
                  <button
                    onClick={() => {
                      if (!isLoggedIn && showEnrolledOnly) navigate("/login", { state: { from: location.pathname } });
                      else if (showEnrolledOnly) setShowEnrolledOnly(false);
                      else { setSearchQuery(""); setSelectedDate(null); }
                    }}
                    className="px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all hover:bg-slate-800 dark:hover:bg-slate-100"
                  >
                    {!isLoggedIn && showEnrolledOnly
                      ? "Login Now"
                      : showEnrolledOnly
                        ? "Explore Masterclasses"
                        : "Explore All"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area - 3 Columns (Right Side) */}
          <aside className="lg:col-span-3 space-y-6 sm:space-y-8 lg:space-y-9 lg:sticky lg:top-24 h-fit order-1 lg:order-2">
            <WebinarCalendar
              webinars={webinars}
              userId={userId}
              selectedDate={selectedDate}
              onDateClick={setSelectedDate}
            />

            {/* Premium Benefits Card - Hidden on small mobile, shown on larger screens */}
            <div className="hidden sm:block bg-slate-900 dark:bg-slate-900 border border-white/5 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white space-y-4 sm:space-y-5 md:space-y-6 relative overflow-hidden group">
              <div className="space-y-3 sm:space-y-4 relative z-10">
                <div className="p-2 sm:p-2.5 bg-blue-600 rounded-lg sm:rounded-xl w-fit">
                  <Award size={18} className="sm:w-5 sm:h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-bold leading-tight">Elite Mentor Experience</h4>
              </div>
              <ul className="space-y-2 sm:space-y-3 relative z-10">
                {["Live Strategy Breakdown", "Post-Session Q&A", "Verified Course Material"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-bold">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                      <CheckCircle size={8} className="sm:w-2.5 sm:h-2.5" strokeWidth={4} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Webinar;
