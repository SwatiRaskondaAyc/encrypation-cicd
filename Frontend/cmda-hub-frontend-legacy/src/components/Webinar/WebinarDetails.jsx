import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiClient } from '../../utils/apiClient';
import {
    Calendar, Clock, User, Monitor, CheckCircle, ExternalLink,
    Linkedin, Twitter, Instagram, FileText, ArrowRight,
    ChevronLeft, Lock, Sparkles, Award, Play, Share2, Info, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../Navbar';
import { useAuth } from '../AuthContext';
import { trackCMDAHubTools, trackAction } from '../../utils/tracking';

const WebinarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, userId } = useAuth();

    const [webinar, setWebinar] = useState(location.state?.webinar || null);
    const [isEnrolled, setIsEnrolled] = useState(location.state?.webinar?.subscribed || false);
    const [loading, setLoading] = useState(!location.state?.webinar);
    const [error, setError] = useState(null);
    const [subscribing, setSubscribing] = useState(false);

    useEffect(() => {
        if (location.state?.enrollmentSuccess) {
            toast.success("Registration Successful!");
            setIsEnrolled(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apiClient.get(`/user/webinars/${id}`);
                setWebinar(prev => ({
                    ...(prev || {}),
                    ...data,
                    title: data.webinarTitle || data.title || prev?.title,
                    id: data.webinarId || data.id || prev?.id,
                    thumbnail: data.thumbnail || data.thumbnailUrl || prev?.thumbnail
                }));

                if (isLoggedIn) {
                    const subsData = await apiClient.get('/register/user');
                    const mySub = subsData?.find(s => {
                        const subWebId = s.webinar?.id || s.webinarId || s.entityId;
                        const hasStatus = s.status === "ENROLLED" || s.status === "SUCCESS";
                        return parseInt(subWebId) === parseInt(id) && hasStatus;
                    });
                    if (mySub) {
                        setIsEnrolled(true);
                        setWebinar(prev => ({
                            ...prev,
                            joinLink: mySub.joinLink || mySub.webinarLink,
                            registrationStatus: mySub.status
                        }));
                    }
                }
            } catch (err) {
                setError("Failed to load session details.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isLoggedIn]);

    const handleSubscribe = async () => {
        if (!isLoggedIn) {
            toast.warn("Please login to enroll in this masterclass.");
            navigate("/login", { state: { from: location.pathname } });
            return;
        }
        setSubscribing(true);
        try {
            const res = await apiClient.post('/register', {
                entityId: parseInt(id),
                entityType: "WEB",
                status: "ENROLLED",
                paymentReferenceId: "N/A",
                amountPaid: 0,
            });

            setIsEnrolled(true);
            setWebinar(prev => ({
                ...prev,
                joinLink: res.joinLink || res.webinarLink
            }));
            toast.success("Successfully enrolled in session!");
        } catch (error) {
            const msg = error?.message || error?.toString() || "";
            if (msg.toLowerCase().includes("already registered") || msg.toLowerCase().includes("already enrolled")) {
                setIsEnrolled(true);
                toast.info("You're already enrolled in this session.");
                setWebinar(prev => ({ ...prev, subscribed: true }));
            } else {
                toast.error(msg || "Enrollment failed.");
            }
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error || !webinar) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center p-10">
            <Navbar />
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Info size={40} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{error || "Webinar not found"}</h1>
            <button onClick={() => navigate('/education')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors">
                Back to Library
            </button>
        </div>
    );

    const startDate = webinar.startDateTime ? new Date(webinar.startDateTime[0], webinar.startDateTime[1] - 1, webinar.startDateTime[2], webinar.startDateTime[3], webinar.startDateTime[4]) : new Date();
    const thumbnailSrc = webinar.thumbnail || webinar.thumbnailUrl || "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=1200";

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 font-sans text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Immersive Hero Header - Responsive heights for all devices */}
            <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px]  xl:min-h-[550px] overflow-hidden">
                <img src={thumbnailSrc} className="absolute inset-0 w-full h-full object-cover object-center" alt="" />
                {/* Multiple gradient overlays for better text readability */}
                <div className="absolute inset-0 bg-slate-950/60" /> {/* Base dark overlay */}
                {/* Bottom fade */}

                <div className="relative max-w-[1400px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col pt-20 sm:pt-28 md:pt-32">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-auto max-w-4xl space-y-3 sm:space-y-4">
                        <button onClick={() => navigate('/education')} className="group inline-flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-colors mb-2 sm:mb-4 bg-white/10 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10">
                            <ChevronLeft size={12} className="sm:w-[14px] sm:h-[14px] group-hover:-translate-x-1 transition-transform" />
                            Back to Library
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="px-2.5 sm:px-3 py-1 bg-blue-600 text-white rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                Expert Masterclass
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                            {webinar.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 py-2">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-blue-400">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-wider">Schedule</div>
                                    <div className="text-xs sm:text-sm font-bold text-white">{format(startDate, "MMMM d, yyyy")}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-blue-400">
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <div className="text-[9px] sm:text-[10px] font-bold text-white/50 uppercase tracking-wider">Time (IST)</div>
                                    <div className="text-xs sm:text-sm font-bold text-white">{format(startDate, "h:mm a")}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <main className="relative max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10 items-start">

                    {/* Left Column - 8 Columns */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8 md:space-y-12">

                        {/* Summary & Access Pass Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-sm space-y-6 sm:space-y-8 md:space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2 sm:space-y-3">
                                        <h3 className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider">Description</h3>
                                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed">
                                            {webinar.description || "Deep dive into advanced market methodologies with real-time data analysis and strategic frameworks."}
                                        </p>
                                    </div>

                                    {webinar.agenda && (
                                        <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-100 dark:border-white/5">
                                            <h3 className="text-[10px] sm:text-[11px] font-bold text-blue-600 uppercase tracking-wider">Key Takeaways</h3>
                                            <ul className="space-y-2 sm:space-y-3">
                                                {(Array.isArray(webinar.agenda) ? webinar.agenda : webinar.agenda.split('\n')).map((item, i) => (
                                                    <li key={i} className="flex gap-2 sm:gap-3 group">
                                                        <div className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-blue-50 dark:bg-blue-600/10 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                                            <CheckCircle className="w-2 h-2 sm:w-2.5 sm:h-2.5" strokeWidth={3} />
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    {/* Control Board */}
                                    <div className="bg-slate-900 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white space-y-4 sm:space-y-6 border border-white/5">
                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <span className="text-[9px] sm:text-[10px] font-bold text-white/40 uppercase tracking-wider">Enrollment Status</span>
                                            <div className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${isEnrolled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"}`}>
                                                <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${isEnrolled ? "bg-emerald-500" : "bg-orange-500 animate-pulse"}`} />
                                                {isEnrolled ? "Enrolled" : "Open"}
                                            </div>
                                        </div>

                                        {!isEnrolled ? (
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="space-y-1">
                                                    <h4 className="text-lg sm:text-xl font-bold tracking-tight">Register Now</h4>
                                                    <p className="text-[10px] sm:text-xs text-slate-400">Get access to premium materials and live Q&A.</p>
                                                </div>
                                                <button
                                                    onClick={handleSubscribe}
                                                    disabled={subscribing}
                                                    className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50"
                                                >
                                                    {subscribing ? <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Enroll Today <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" /></>}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 sm:space-y-6">
                                                <div className="space-y-2 sm:space-y-3">
                                                    <div className="flex items-center gap-2 sm:gap-3 text-emerald-400">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </div>
                                                        <h4 className="text-base sm:text-lg font-bold">You're In!</h4>
                                                    </div>
                                                    <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-relaxed">The meeting link will be active shortly before the start time.</p>
                                                </div>

                                                {webinar.joinLink || webinar.webinarLink ? (
                                                    <a href={webinar.joinLink || webinar.webinarLink} target="_blank" rel="noreferrer" className="w-full py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider transition-all text-center block shadow-lg shadow-emerald-500/20">
                                                        Join Session Now <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 inline ml-1" />
                                                    </a>
                                                ) : (
                                                    <div className="w-full py-3 sm:py-3.5 bg-slate-800 text-slate-500 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider text-center border border-white/5">
                                                        Meeting Link Available Soon
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-[8px] sm:text-[9px] text-white/20 font-bold uppercase tracking-wider text-center">Standard enrollment rules apply</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 4 Columns */}
                    <aside className="lg:col-span-4 space-y-6 sm:space-y-8 md:space-y-10">

                        {/* Faculty Profile */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-sm">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-600/10 rounded-lg text-blue-600 dark:text-blue-400">
                                    <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                                </div>
                                <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Host Profile</h3>
                            </div>

                            <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-white/10">
                                        <img src={webinar.host?.photoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 bg-blue-600 text-white p-1.5 sm:p-2 rounded-lg border-2 border-white dark:border-slate-900">
                                        <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" strokeWidth={3} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{webinar.hostName}</h4>
                                    <p className="text-[9px] sm:text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{webinar.host?.role || "Market Strategist"}</p>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed px-1 sm:px-2">
                                    "{webinar.host?.bio || "Empowering traders with rigorous analytical frameworks and real-time execution excellence."}"
                                </p>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-slate-100 dark:border-white/5">
                                <div className="p-3 sm:p-4 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl text-center space-y-0.5">
                                    <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Experience</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white">{webinar.host?.experience || "10+ Years"}</div>
                                </div>
                                <div className="p-3 sm:p-4 bg-slate-50 dark:bg-white/5 rounded-xl sm:rounded-2xl text-center space-y-0.5">
                                    <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Languages</div>
                                    <div className="text-[10px] sm:text-xs font-bold text-slate-900 dark:text-white truncate" title={webinar.languages || webinar.host?.languages}>
                                        {webinar.languages || webinar.host?.languages || "English"}
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Links - Only show if URLs are present */}
                            {(webinar.host?.linkedin || webinar.host?.twitter || webinar.host?.instagram) && (
                                <div className="flex justify-center gap-2 pt-2">
                                    {webinar.host?.linkedin && (
                                        <a
                                            href={webinar.host.linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-50 dark:bg-white/5 hover:bg-blue-600 text-slate-400 hover:text-white rounded-full transition-all flex items-center justify-center"
                                            title="LinkedIn"
                                        >
                                            <Linkedin size={14} className="sm:w-4 sm:h-4" />
                                        </a>
                                    )}
                                    {webinar.host?.twitter && (
                                        <a
                                            href={webinar.host.twitter}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-50 dark:bg-white/5 hover:bg-sky-500 text-slate-400 hover:text-white rounded-full transition-all flex items-center justify-center"
                                            title="Twitter"
                                        >
                                            <Twitter size={14} className="sm:w-4 sm:h-4" />
                                        </a>
                                    )}
                                    {webinar.host?.instagram && (
                                        <a
                                            href={webinar.host.instagram}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-50 dark:bg-white/5 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 text-slate-400 hover:text-white rounded-full transition-all flex items-center justify-center"
                                            title="Instagram"
                                        >
                                            <Instagram size={14} className="sm:w-4 sm:h-4" />
                                        </a>
                                    )}
                                </div>
                            )}


                        </div>
                    </aside>
                </div>
            </main>

        </div>
        </>
    );
};

export default WebinarDetails;