

// import React, { useEffect, useRef, useState } from 'react';

// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
// import { Play, Pause, List, X, Volume2, VolumeX, Maximize2, Volume1, Settings, ChevronRight, Clock, ChevronLeft, SkipForward, SkipBack } from 'lucide-react';

// const SearchTutorial = () => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const [currentVideo, setCurrentVideo] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showPlaylist, setShowPlaylist] = useState(true);
//   const [progress, setProgress] = useState(0);
//   const [volume, setVolume] = useState(1);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [playbackRate, setPlaybackRate] = useState(1);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [showSettings, setShowSettings] = useState(false);
//   const [hoverProgress, setHoverProgress] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');

//   const [playlist] = useState([
//     {
//       id: 1,
//       title: 'Introduction to Search Features',
//       src: '/Tutorials/Search_tutorial.mp4',
//       type: 'video/mp4',
//       thumbnail: '/Tutorials/img1.png',
//       duration: '1:17',
//     },
//     {
//       id: 2,
//       title: 'Market Mood: Delivery Trends and Trading Sentiments',
//       src: '/Tutorials/Market Mood- Delivery trends and trading sentiments.mp4',
//       type: 'video/mp4',
//       thumbnail: '/Tutorials/market_mood.png',
//       duration: '0:59',
//     },
//     {
//       id: 3,
//       title: 'Box Plot Analysis in Different Markets',
//       src: '/Tutorials/BoxPlot-Bear&Bull Market_2.0 (1).mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/box_plot1.png',
//       duration: '0:45',
//     },
//     {
//       id: 4,
//       title: 'Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends',
//       src: '/Tutorials/Trend Tapestry_ Weekly Trade Delivery in Uptrends & Downtrends.mp4',
//       type: 'video/mp4',
//       thumbnail: '/Tutorials/weeklly_trend.png',
//       duration: '0:57',
//     },
//     {
//       id: 5,
//       title: 'Sensex & Stock Fluctuation',
//       src: '/Tutorials/Sensex & Stock Fluctuation.mp4',
//       type: 'video/mp4',
//       thumbnail: '/Tutorials/sensex 2.png',
//       duration: '0:50',
//     },

//     {
//       id: 6,
//       title: 'Sensex Impact Calculator',
//       src: '/Tutorials/Sensex Impact calculator-Final.mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/sensex_calculator1.png',
//       duration: '0:59',
//     },
//         {
//       id: 7,
//       title: 'MACD Indicator Explained',
//       src: '/Tutorials/MACD.mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/macd_plot1.png',
//       duration: '1:21',
//     },      
//      {
//       id: 8,
//       title: 'Sensex Symphony Harmonizing Stock Correlation Trends (TTM)',
//       src: '/Tutorials/Sensex Symphony_ Harmonizing Stock Correlation Trends (TTM).mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/sensex_analylis1.png',
//       duration: '1:01',
//     },

//     {
//       id: 9,
//       title: 'Breach Busters_ Analyzing High and Low Breaches (TTM)',
//       src: '/Tutorials/Breach Busters_ Analyzing High and Low Breaches (TTM).mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/Screenshot 2025-09-24 110817.png',
//       duration: '1:12',
//     },

//     {
//       id: 10,
//       title: 'PE vs EPS vs Book Value_ Gladiators in the Industry Arena',
//       src: '/Tutorials/PE vs EPS vs Book Value_ Gladiators in the Industry Arena.mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/industry_bubble1.png',
//       duration: '1:18',
//     },

//         {
//       id: 11,
//       title: 'Performance HeatMap Visualizing Stock Performance Across Time',
//       src: '/Tutorials/Performance HeatMap.mp4',
//       type: 'video/mp4',
//       thumbnail: '/equityhub_plot/heatmap1.png',
//       duration: '1:15',
//     },

//   ]);

//   const filteredPlaylist = playlist.filter((video) =>
//     video.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   useEffect(() => {
//     if (videoRef.current && !playerRef.current) {
//       playerRef.current = videojs(videoRef.current, {
//         controls: false,
//         autoplay: false,
//         fluid: true,
//         playbackRates: [0.5, 1, 1.5, 2],
//         sources: playlist.length > 0 ? [playlist[0]] : [],
//         responsive: true, // Ensure video.js is responsive
//       });

//       playerRef.current.on('play', () => setIsPlaying(true));
//       playerRef.current.on('pause', () => setIsPlaying(false));
//       playerRef.current.on('timeupdate', () => {
//         if (playerRef.current) {
//           const newProgress = (playerRef.current.currentTime() / playerRef.current.duration()) * 100;
//           setProgress(newProgress);
//           setCurrentTime(playerRef.current.currentTime());
//           setDuration(playerRef.current.duration());
//         }
//       });
//       playerRef.current.on('loadedmetadata', () => {
//         if (playerRef.current) {
//           setDuration(playerRef.current.duration());
//         }
//       });
//       playerRef.current.on('volumechange', () => {
//         if (playerRef.current) {
//           setVolume(playerRef.current.volume());
//           setIsMuted(playerRef.current.muted());
//         }
//       });
//       playerRef.current.on('fullscreenchange', () => {
//         setIsFullscreen(!!document.fullscreenElement);
//       });

//       if (playlist.length > 0) {
//         setCurrentVideo(playlist[0]);
//       }
//     }

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [playlist]);

//   const handleVideoSelect = (video) => {
//     if (playerRef.current) {
//       playerRef.current.src({ src: video.src, type: video.type });
//       playerRef.current.play();
//       setCurrentVideo(video);
//       setIsPlaying(true);
//     }
//   };

//   const handleNavigation = (direction) => {
//     if (!currentVideo || !playerRef.current) return;

//     const currentIndex = playlist.findIndex((video) => video.id === currentVideo.id);
//     let newIndex;

//     if (direction === 'prev') {
//       newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
//     } else if (direction === 'next') {
//       newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : currentIndex;
//     }

//     if (newIndex !== currentIndex) {
//       const newVideo = playlist[newIndex];
//       handleVideoSelect(newVideo);
//     }
//   };

//   const togglePlay = () => {
//     if (playerRef.current) {
//       if (playerRef.current.paused()) {
//         playerRef.current.play();
//         setIsPlaying(true);
//       } else {
//         playerRef.current.pause();
//         setIsPlaying(false);
//       }
//     }
//   };

//   const toggleMute = () => {
//     if (playerRef.current) {
//       playerRef.current.muted(!isMuted);
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleVolumeChange = (e) => {
//     const newVolume = parseFloat(e.target.value);
//     if (playerRef.current) {
//       playerRef.current.volume(newVolume);
//       setVolume(newVolume);
//       setIsMuted(newVolume === 0);
//     }
//   };

//   const toggleFullscreen = () => {
//     if (playerRef.current) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen();
//       } else {
//         videoRef.current.requestFullscreen();
//       }
//     }
//   };

//   const changePlaybackRate = (rate) => {
//     if (playerRef.current) {
//       playerRef.current.playbackRate(rate);
//       setPlaybackRate(rate);
//       setShowSettings(false);
//     }
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleProgressHover = (e) => {
//     if (playerRef.current) {
//       const rect = e.currentTarget.getBoundingClientRect();
//       const percent = (e.clientX - rect.left) / rect.width;
//       setHoverProgress(percent * duration);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
//       <style>
//         {`
//           .no-scrollbar::-webkit-scrollbar {
//             display: none;
//           }
//           .no-scrollbar {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//           }
//           .video-container {
//             width: 100%;
//             max-width: 100vw;
//           }
//           @media (max-width: 640px) {
//             .video-container {
//               max-height: 40vh;
//             }
//           }
//           input[type='range'].slider {
//             -webkit-appearance: none;
//             height: 6px;
//             border-radius: 3px;
//             transition: all 0.2s ease;
//           }
//           input[type='range'].slider::-webkit-slider-thumb {
//             -webkit-appearance: none;
//             width: 16px;
//             height: 16px;
//             border-radius: 50%;
//             background: #ffffff;
//             cursor: pointer;
//             border: 2px solid #22D3EE;
//             box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//             transition: transform 0.2s ease;
//           }
//           input[type='range'].slider::-webkit-slider-thumb:hover {
//             transform: scale(1.3);
//           }
//           input[type='range'].slider::-moz-range-thumb {
//             width: 16px;
//             height: 16px;
//             border-radius: 50%;
//             background: #ffffff;
//             cursor: pointer;
//             border: 2px solid #22D3EE;
//             box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
//             transition: transform 0.2s ease;
//           }
//           input[type='range'].slider::-moz-range-thumb:hover {
//             transform: scale(1.2);
//           }
//           button {
//             transition: all 0.3s ease;
//           }
//           @keyframes pulse {
//             0% { transform: scaleY(0.3); }
//             50% { transform: scaleY(1); }
//             100% { transform: scaleY(0.3); }
//           }
//           .animate-pulse {
//             animation: pulse 1s infinite;
//           }
//         `}
//       </style>
//       <div className="w-full max-w-[100vw] sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
//         <header className="mb-6 sm:mb-8 text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-900 dark:text-sky-400 mb-2 sm:mb-3 tracking-tight">
//             Tutorials
//           </h1>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-200 font-medium">
//             Explore our search features with beautifully crafted tutorials
//           </p>
//         </header>

//         <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50">
//           {/* Video Player Section */}
//           <div className="flex-1 video-container">
//             <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-200/50 dark:border-gray-700/50">
//               <div data-vjs-player className="relative group">
//                 <video
//                   ref={videoRef}
//                   className="video-js w-full aspect-video rounded-t-xl"
//                   poster={currentVideo?.thumbnail}
//                 />
//                 {!isPlaying && (
//                   <button
//                     onClick={togglePlay}
//                     className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-b from-black/50 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//                   >
//                     <div className="p-4 sm:p-6 rounded-full bg-white/30 backdrop-blur-lg shadow-lg transform transition-transform hover:scale-110 dark:bg-slate-800/30">
//                       <Play size={40} sm:size={56} className="text-white fill-current" />
//                     </div>
//                   </button>
//                 )}
//               </div>

//               {/* Custom Controls */}
//               <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-t from-gray-900 to-gray-800 rounded-b-xl">
//                 <div
//                   className="h-2 sm:h-3 bg-gray-950/50 rounded-full mb-3 sm:mb-5 cursor-pointer relative group"
//                   onClick={(e) => {
//                     if (playerRef.current) {
//                       const rect = e.currentTarget.getBoundingClientRect();
//                       const percent = (e.clientX - rect.left) / rect.width;
//                       playerRef.current.currentTime(percent * playerRef.current.duration());
//                     }
//                   }}
//                   onMouseMove={handleProgressHover}
//                   onMouseLeave={() => setHoverProgress(null)}
//                 >
//                   <div
//                     className="h-full bg-gradient-to-r from-cyan-400 to-gray-500 rounded-full transition-all duration-300 absolute shadow-[0_0_8px_rgba(59,130,246,0.5)]"
//                     style={{ width: `${progress}%` }}
//                   ></div>
//                   <div
//                     className="absolute top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-white dark:bg-slate-800 rounded-full border border-gray-300 shadow-md transition-transform group-hover:scale-125"
//                     style={{ left: `calc(${progress}% - 8px)` }}
//                   ></div>
//                   {hoverProgress !== null && (
//                     <div
//                       className="absolute -top-8 sm:-top-10 transform -translate-x-1/2 bg-gray-900/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm text-white font-medium shadow-lg"
//                       style={{ left: `${(hoverProgress / duration) * 100}%` }}
//                     >
//                       {formatTime(hoverProgress)}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-between items-center mb-3 sm:mb-5 text-gray-200 font-medium">
//                   <span className="text-xs sm:text-sm">{formatTime(currentTime)}</span>
//                   <span className="text-xs sm:text-sm">{formatTime(duration)}</span>
//                 </div>

//                 <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <button
//                       onClick={() => handleNavigation('prev')}
//                       disabled={currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === 0}
//                       className={`p-2 sm:p-3 rounded-full transition-all duration-200 text-gray-200 hover:text-white ${currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === 0
//                           ? 'opacity-50 cursor-not-allowed'
//                           : 'hover:bg-gray-700/50'
//                         }`}
//                       aria-label="Previous video"
//                     >
//                       <SkipBack size={20} sm:size={24} />
//                     </button>
//                     <button
//                       onClick={togglePlay}
//                       className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500 to-gray-500 hover:from-cyan-400 hover:to-gray-400 transition-all duration-300 text-white shadow-lg transform hover:scale-105 min-w-[48px]"
//                       aria-label={isPlaying ? 'Pause' : 'Play'}
//                     >
//                       {isPlaying ? <Pause size={24} sm:size={28} /> : <Play size={24} sm:size={28} className="ml-0.5" />}
//                     </button>
//                     <button
//                       onClick={() => handleNavigation('next')}
//                       disabled={currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === playlist.length - 1}
//                       className={`p-2 sm:p-3 rounded-full transition-all duration-200 text-gray-200 hover:text-white ${currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === playlist.length - 1
//                           ? 'opacity-50 cursor-not-allowed'
//                           : 'hover:bg-gray-700/50'
//                         }`}
//                       aria-label="Next video"
//                     >
//                       <SkipForward size={20} sm:size={24} />
//                     </button>
//                   </div>
//                   <div className="flex items-center space-x-2 sm:space-x-3">
//                     <div className="flex items-center space-x-2 sm:space-x-3">
//                       <button
//                         onClick={toggleMute}
//                         className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
//                         aria-label={isMuted ? 'Unmute' : 'Mute'}
//                       >
//                         {isMuted ? (
//                           <VolumeX size={20} sm:size={24} />
//                         ) : volume > 0.5 ? (
//                           <Volume2 size={20} sm:size={24} />
//                         ) : (
//                           <Volume1 size={20} sm:size={24} />
//                         )}
//                       </button>
//                       <input
//                         type="range"
//                         min={0}
//                         max={1}
//                         step={0.01}
//                         value={volume}
//                         onChange={handleVolumeChange}
//                         className="w-16 sm:w-24 h-1 sm:h-2 bg-gray-950/50 rounded-lg appearance-none cursor-pointer slider"
//                         style={{
//                           background: `linear-gradient(to right, #22D3EE ${volume * 100}%, #4B5563 ${volume * 100}%)`,
//                         }}
//                       />
//                     </div>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSettings(!showSettings)}
//                         className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
//                         aria-label="Playback speed"
//                       >
//                         <Settings size={20} sm:size={24} />
//                       </button>
//                       {showSettings && (
//                         <div className="absolute bottom-10 sm:bottom-12 right-0 bg-gray-900/95 backdrop-blur-md rounded-lg p-2 sm:p-3 shadow-xl z-10 min-w-[100px] sm:min-w-[120px] border border-gray-700/50">
//                           <p className="text-xs sm:text-sm text-white mb-1 sm:mb-2">Speed</p>
//                           {[0.5, 1, 1.5, 2].map((rate) => (
//                             <button
//                               key={rate}
//                               onClick={() => changePlaybackRate(rate)}
//                               className={`block w-full text-left px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 ${playbackRate === rate
//                                   ? 'bg-cyan-500/30 text-white font-medium'
//                                   : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
//                                 }`}
//                             >
//                               {rate}x
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <button
//                       onClick={toggleFullscreen}
//                       className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
//                       aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
//                     >
//                       <Maximize2 size={20} sm:size={24} />
//                     </button>
//                     <button
//                       onClick={() => setShowPlaylist(!showPlaylist)}
//                       className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px] lg:hidden"
//                       aria-label="Toggle playlist"
//                     >
//                       {showPlaylist ? <X size={20} sm:size={24} /> : <List size={20} sm:size={24} />}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {currentVideo && (
//               <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 rounded-xl bg-white/80 dark:bg-slate-800 backdrop-blur-md shadow-md border border-gray-200/50 dark:border-gray-700/50">
//                 <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-2 sm:mb-3 tracking-tight truncate">
//                   {currentVideo.title}
//                 </h2>
//                 <div className="flex items-center text-gray-600 dark:text-gray-200 text-xs sm:text-sm">
//                   <Clock size={16} sm:size={18} className="mr-1 sm:mr-2" />
//                   <span className="font-medium mr-2 sm:mr-4">Duration: {currentVideo.duration}</span>
//                   <span className="font-medium">Playback speed: {playbackRate}x</span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Playlist Section */}
//           {/* Playlist Section */}
//           <div className={`lg:w-80 xl:w-96 transition-all duration-500 ease-in-out ${showPlaylist ? 'block' : 'hidden lg:block'}`}>
//             <div className="rounded-xl p-3 sm:p-4 md:p-6 bg-white/80 dark:bg-slate-800 backdrop-blur-md shadow-md border border-gray-200/50 dark:border-gray-700/50 h-full">
//               <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
//                 <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 flex items-center">
//                   <List size={18} sm:size={22} className="mr-1 sm:mr-2" />
//                   Tutorial Playlist
//                 </h2>
//                 <span className="text-xs sm:text-sm bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-200 px-2 sm:px-3 py-1 rounded-full font-medium">
//                   {filteredPlaylist.length} videos
//                 </span>
//               </div>

//               <div className="mb-4 sm:mb-6">
//                 <input
//                   type="text"
//                   placeholder="Search tutorials..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
//                 />
//               </div>

//               <ul className="space-y-3 sm:space-y-4 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto">
//                 {filteredPlaylist.length > 0 ? (
//                   filteredPlaylist.map((video) => (
//                     <li
//                       key={video.id}
//                       className={`rounded-lg cursor-pointer transition-all duration-300 overflow-hidden border ${currentVideo?.id === video.id
//                           ? 'bg-gradient-to-r from-cyan-50/50 to-gray-50/50 border-cyan-200 shadow-lg dark:border-cyan-700/50 dark:bg-slate-700/50'
//                           : 'bg-white border-gray-200 dark:bg-slate-800 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/50'
//                         }`}
//                       onClick={() => handleVideoSelect(video)}
//                     >
//                       <div className="flex p-2 sm:p-3 group">
//                         <div className="relative flex-shrink-0 w-20 sm:w-24 h-12 sm:h-14">
//                           <img
//                             src={video.thumbnail}
//                             alt={video.title}
//                             className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
//                           />
//                           {currentVideo?.id === video.id && isPlaying && (
//                             <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
//                               <div className="flex space-x-1">
//                                 <div
//                                   className="w-1 h-4 bg-cyan-400 animate-pulse"
//                                   style={{ animationDelay: '0ms' }}
//                                 ></div>
//                                 <div
//                                   className="w-1 h-4 bg-cyan-400 animate-pulse"
//                                   style={{ animationDelay: '150ms' }}
//                                 ></div>
//                                 <div
//                                   className="w-1 h-4 bg-cyan-400 animate-pulse"
//                                   style={{ animationDelay: '300ms' }}
//                                 ></div>
//                               </div>
//                             </div>
//                           )}
//                           <div className="absolute bottom-1 right-1 bg-gray-900/80 text-xs text-white px-1 sm:px-1.5 py-0.5 rounded font-medium">
//                             {video.duration}
//                           </div>
//                         </div>
//                         <div className="flex-1 ml-2 sm:ml-4 min-w-0">
//                           <p
//                             className={`font-semibold text-xs sm:text-sm truncate ${currentVideo?.id === video.id ? 'text-cyan-700 dark:text-white' : 'text-gray-800 dark:text-white'
//                               }`}
//                           >
//                             {video.title}
//                           </p>
//                           <div className="flex items-center mt-1">
//                             <div
//                               className={`text-xs font-medium ${currentVideo?.id === video.id ? 'text-cyan-600 dark:text-white' : 'text-gray-500 dark:text-white'
//                                 }`}
//                             >
//                               Click to play
//                             </div>
//                             {currentVideo?.id === video.id && (
//                               <ChevronRight size={14} sm:size={16} className="text-cyan-500 ml-1 sm:ml-1.5" />
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   ))
//                 ) : (
//                   <div
//                     role="alert"
//                     className="flex justify-center w-full max-w-md mx-auto px-3 sm:px-4 py-2 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-xs sm:text-sm font-medium text-center"
//                   >
//                     No tutorials found
//                   </div>
//                 )}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchTutorial;


import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Play, Pause, List, X, Volume2, VolumeX, Maximize2, Volume1, Settings, ChevronRight, Clock, ChevronLeft, SkipForward, SkipBack } from 'lucide-react';
import EquityTutorialRating from '../RatingFile/EquityTutorialRating';

const SearchTutorial = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [playlist] = useState([
    {
      id: 1,
      title: 'Introduction to Search Features',
      src: '/Tutorials/Search_tutorial.mp4',
      type: 'video/mp4',
      thumbnail: '/Tutorials/img1.png',
      duration: '1:17',
    },
      {
      id: 13,
      title: 'Price Spread Over Time Analysis',
      src: '/Tutorials/Price Spread Over Time.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/candle_spread1.png',
      duration: '2:20',
    },
    {
      id: 2,
      title: 'Market Mood: Delivery Trends and Trading Sentiments',
      src: '/Tutorials/Market Mood- Delivery trends and trading sentiments.mp4',
      type: 'video/mp4',
      thumbnail: '/Tutorials/market_mood.png',
      duration: '0:59',
    },
    {
      id: 3,
      title: 'Box Plot Analysis in Different Markets',
      src: '/Tutorials/BoxPlot-Bear&Bull Market_2.0 (1).mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/box_plot1.png',
      duration: '0:45',
    },
    {
      id: 4,
      title: 'Trend Tapestry: Weekly Trade Delivery in Uptrends & Downtrends',
      src: '/Tutorials/Trend Tapestry_ Weekly Trade Delivery in Uptrends & Downtrends.mp4',
      type: 'video/mp4',
      thumbnail: '/Tutorials/weeklly_trend.png',
      duration: '0:57',
    },
    {
      id: 5,
      title: 'Sensex & Stock Fluctuation',
      src: '/Tutorials/Sensex & Stock Fluctuation.mp4',
      type: 'video/mp4',
      thumbnail: '/Tutorials/sensex 2.png',
      duration: '0:50',
    },
    {
      id: 6,
      title: 'Sensex Impact Calculator',
      src: '/Tutorials/Sensex Impact calculator-Final.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/sensex_calculator1.png',
      duration: '0:59',
    },
    {
      id: 7,
      title: 'MACD Indicator Explained',
      src: '/Tutorials/MACD.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/macd_plot1.png',
      duration: '1:21',
    },
    {
      id: 8,
      title: 'Sensex Symphony Harmonizing Stock Correlation Trends (TTM)',
      src: '/Tutorials/Sensex Symphony_ Harmonizing Stock Correlation Trends (TTM).mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/sensex_analylis1.png',
      duration: '1:01',
    },
    {
      id: 9,
      title: 'Breach Busters_ Analyzing High and Low Breaches (TTM)',
      src: '/Tutorials/Breach Busters_ Analyzing High and Low Breaches (TTM).mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/Screenshot 2025-09-24 110817.png',
      duration: '1:12',
    },
    {
      id: 10,
      title: 'PE vs EPS vs Book Value_ Gladiators in the Industry Arena',
      src: '/Tutorials/PE vs EPS vs Book Value_ Gladiators in the Industry Arena.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/industry_bubble1.png',
      duration: '1:18',
    },
    {
      id: 11,
      title: 'Performance HeatMap Visualizing Stock Performance Across Time',
      src: '/Tutorials/Performance HeatMap.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/heatmap1.png',
      duration: '1:15',
    },
    {
      id: 12,
      title: 'Pegy-Worm Plot Analysis Visualize',
      src: '/Tutorials/PEGY worm plot.mp4',
      type: 'video/mp4',
      thumbnail: '/equityhub_plot/pegyplot.png',
      duration: '1:17',
    },  
    
  ]);

  const filteredPlaylist = playlist.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: false,
        fluid: true,
        playbackRates: [0.5, 1, 1.5, 2],
        sources: playlist.length > 0 ? [playlist[0]] : [],
        responsive: true,
      });

      playerRef.current.on('play', () => setIsPlaying(true));
      playerRef.current.on('pause', () => setIsPlaying(false));
      playerRef.current.on('timeupdate', () => {
        if (playerRef.current) {
          const newProgress = (playerRef.current.currentTime() / playerRef.current.duration()) * 100;
          setProgress(newProgress);
          setCurrentTime(playerRef.current.currentTime());
          setDuration(playerRef.current.duration());
        }
      });
      playerRef.current.on('loadedmetadata', () => {
        if (playerRef.current) {
          setDuration(playerRef.current.duration());
        }
      });
      playerRef.current.on('volumechange', () => {
        if (playerRef.current) {
          setVolume(playerRef.current.volume());
          setIsMuted(playerRef.current.muted());
        }
      });
      playerRef.current.on('fullscreenchange', () => {
        setIsFullscreen(!!document.fullscreenElement);
      });

      if (playlist.length > 0) {
        setCurrentVideo(playlist[0]);
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [playlist]);

  const handleVideoSelect = (video) => {
    if (playerRef.current) {
      playerRef.current.src({ src: video.src, type: video.type });
      playerRef.current.play();
      setCurrentVideo(video);
      setIsPlaying(true);
    }
  };

  const handleNavigation = (direction) => {
    if (!currentVideo || !playerRef.current) return;

    const currentIndex = playlist.findIndex((video) => video.id === currentVideo.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    } else if (direction === 'next') {
      newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : currentIndex;
    }

    if (newIndex !== currentIndex) {
      const newVideo = playlist[newIndex];
      handleVideoSelect(newVideo);
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (playerRef.current.paused()) {
        playerRef.current.play();
        setIsPlaying(true);
      } else {
        playerRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (playerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const changePlaybackRate = (rate) => {
    if (playerRef.current) {
      playerRef.current.playbackRate(rate);
      setPlaybackRate(rate);
      setShowSettings(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressHover = (e) => {
    if (playerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setHoverProgress(percent * duration);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .video-container {
            width: 100%;
            max-width: 100vw;
          }
          @media (max-width: 640px) {
            .video-container {
              max-height: 40vh;
            }
          }
          input[type='range'].slider {
            -webkit-appearance: none;
            height: 6px;
            border-radius: 3px;
            transition: all 0.2s ease;
          }
          input[type='range'].slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 2px solid #22D3EE;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }
          input[type='range'].slider::-webkit-slider-thumb:hover {
            transform: scale(1.3);
          }
          input[type='range'].slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
            border: 2px solid #22D3EE;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease;
          }
          input[type='range'].slider::-moz-range-thumb:hover {
            transform: scale(1.2);
          }
          button {
            transition: all 0.3s ease;
          }
          @keyframes pulse {
            0% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
            100% { transform: scaleY(0.3); }
          }
          .animate-pulse {
            animation: pulse 1s infinite;
          }
        `}
      </style>
      <div className="w-full max-w-[100vw] sm:max-w-2xl md:max-w-4xl lg:max-w-7xl mx-auto px-2 sm:px-4 md:px-8">
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-sky-900 dark:text-sky-400 mb-2 sm:mb-3 tracking-tight">
            Tutorials
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-200 font-medium">
            Explore our search features with beautifully crafted tutorials
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-2xl border border-gray-300/50 dark:border-gray-700/50">
          {/* Video Player Section */}
          <div className="flex-1 video-container">
            <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md border border-gray-200/50 dark:border-gray-700/50">
              <div data-vjs-player className="relative group">
                <video
                  ref={videoRef}
                  className="video-js w-full aspect-video rounded-t-xl"
                  poster={currentVideo?.thumbnail}
                />
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center w-full h-full bg-gradient-to-b from-black/50 to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="p-4 sm:p-6 rounded-full bg-white/30 backdrop-blur-lg shadow-lg transform transition-transform hover:scale-110 dark:bg-slate-800/30">
                      <Play size={40} sm:size={56} className="text-white fill-current" />
                    </div>
                  </button>
                )}
              </div>

              {/* Custom Controls */}
              <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-t from-gray-900 to-gray-800 rounded-b-xl">
                <div
                  className="h-2 sm:h-3 bg-gray-950/50 rounded-full mb-3 sm:mb-5 cursor-pointer relative group"
                  onClick={(e) => {
                    if (playerRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      playerRef.current.currentTime(percent * playerRef.current.duration());
                    }
                  }}
                  onMouseMove={handleProgressHover}
                  onMouseLeave={() => setHoverProgress(null)}
                >
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-gray-500 rounded-full transition-all duration-300 absolute shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 sm:w-4 h-3 sm:h-4 bg-white dark:bg-slate-800 rounded-full border border-gray-300 shadow-md transition-transform group-hover:scale-125"
                    style={{ left: `calc(${progress}% - 8px)` }}
                  ></div>
                  {hoverProgress !== null && (
                    <div
                      className="absolute -top-8 sm:-top-10 transform -translate-x-1/2 bg-gray-900/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm text-white font-medium shadow-lg"
                      style={{ left: `${(hoverProgress / duration) * 100}%` }}
                    >
                      {formatTime(hoverProgress)}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-3 sm:mb-5 text-gray-200 font-medium">
                  <span className="text-xs sm:text-sm">{formatTime(currentTime)}</span>
                  <span className="text-xs sm:text-sm">{formatTime(duration)}</span>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <button
                      onClick={() => handleNavigation('prev')}
                      disabled={currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === 0}
                      className={`p-2 sm:p-3 rounded-full transition-all duration-200 text-gray-200 hover:text-white ${currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-700/50'
                        }`}
                      aria-label="Previous video"
                    >
                      <SkipBack size={20} sm:size={24} />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-cyan-500 to-gray-500 hover:from-cyan-400 hover:to-gray-400 transition-all duration-300 text-white shadow-lg transform hover:scale-105 min-w-[48px]"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={24} sm:size={28} /> : <Play size={24} sm:size={28} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={() => handleNavigation('next')}
                      disabled={currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === playlist.length - 1}
                      className={`p-2 sm:p-3 rounded-full transition-all duration-200 text-gray-200 hover:text-white ${currentVideo && playlist.findIndex((video) => video.id === currentVideo.id) === playlist.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-gray-700/50'
                        }`}
                      aria-label="Next video"
                    >
                      <SkipForward size={20} sm:size={24} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button
                        onClick={toggleMute}
                        className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX size={20} sm:size={24} />
                        ) : volume > 0.5 ? (
                          <Volume2 size={20} sm:size={24} />
                        ) : (
                          <Volume1 size={20} sm:size={24} />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 sm:w-24 h-1 sm:h-2 bg-gray-950/50 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #22D3EE ${volume * 100}%, #4B5563 ${volume * 100}%)`,
                        }}
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
                        aria-label="Playback speed"
                      >
                        <Settings size={20} sm:size={24} />
                      </button>
                      {showSettings && (
                        <div className="absolute bottom-10 sm:bottom-12 right-0 bg-gray-900/95 backdrop-blur-md rounded-lg p-2 sm:p-3 shadow-xl z-10 min-w-[100px] sm:min-w-[120px] border border-gray-700/50">
                          <p className="text-xs sm:text-sm text-white mb-1 sm:mb-2">Speed</p>
                          {[0.5, 1, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`block w-full text-left px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-all duration-200 ${playbackRate === rate
                                ? 'bg-cyan-500/30 text-white font-medium'
                                : 'text-gray-200 hover:bg-gray-700/50 hover:text-white'
                                }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={toggleFullscreen}
                      className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px]"
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                      <Maximize2 size={20} sm:size={24} />
                    </button>
                    <button
                      onClick={() => setShowPlaylist(!showPlaylist)}
                      className="p-2 sm:p-3 rounded-full hover:bg-gray-700/50 transition-all duration-200 text-gray-200 hover:text-white min-w-[40px] lg:hidden"
                      aria-label="Toggle playlist"
                    >
                      {showPlaylist ? <X size={20} sm:size={24} /> : <List size={20} sm:size={24} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* {currentVideo && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 rounded-xl bg-white/80 dark:bg-slate-800 backdrop-blur-md shadow-md border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-2 sm:mb-3 tracking-tight truncate">
                  {currentVideo.title}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-200 text-xs sm:text-sm mb-3">
                  <Clock size={16} sm:size={18} className="mr-1 sm:mr-2" />
                  <span className="font-medium mr-2 sm:mr-4">Duration: {currentVideo.duration}</span>
                  <span className="font-medium">Playback speed: {playbackRate}x</span>
                </div>

                {/* Rating Component Integrated Here *
                <EquityTutorialRating
                  tutorialId={currentVideo.id}
                  tutorialTitle={currentVideo.title}
                />
              </div>
            )} */}
            {currentVideo && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 md:p-6 rounded-xl bg-white/80 dark:bg-slate-800 backdrop-blur-md shadow-md border border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 mb-2 sm:mb-3 tracking-tight truncate">
                  {currentVideo.title}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-200 text-xs sm:text-sm mb-3">
                  <Clock size={16} sm:size={18} className="mr-1 sm:mr-2" />
                  <span className="font-medium mr-2 sm:mr-4">Duration: {currentVideo.duration}</span>
                  <span className="font-medium">Playback speed: {playbackRate}x</span>
                </div>

                {/* Rating Component Integrated Here */}
                <EquityTutorialRating
                  tutorialId={currentVideo.id}
                  tutorialTitle={currentVideo.title}
                />
              </div>
            )}
          </div>

          {/* Playlist Section */}
          <div className={`lg:w-80 xl:w-96 transition-all duration-500 ease-in-out ${showPlaylist ? 'block' : 'hidden lg:block'}`}>
            <div className="rounded-xl p-3 sm:p-4 md:p-6 bg-white/80 dark:bg-slate-800 backdrop-blur-md shadow-md border border-gray-200/50 dark:border-gray-700/50 h-full">
              <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-200 flex items-center">
                  <List size={18} sm:size={22} className="mr-1 sm:mr-2" />
                  Tutorial Playlist
                </h2>
                <span className="text-xs sm:text-sm bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-200 px-2 sm:px-3 py-1 rounded-full font-medium">
                  {filteredPlaylist.length} videos
                </span>
              </div>

              <div className="mb-4 sm:mb-6">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>

              <ul className="space-y-3 sm:space-y-4 max-h-[80vh] sm:max-h-[70vh] overflow-y-auto no-scrollbar">
                {filteredPlaylist.length > 0 ? (
                  filteredPlaylist.map((video) => (
                    <li
                      key={video.id}
                      className={`rounded-lg cursor-pointer transition-all duration-300 overflow-hidden border ${currentVideo?.id === video.id
                        ? 'bg-gradient-to-r from-cyan-50/50 to-gray-50/50 border-cyan-200 shadow-lg dark:border-cyan-700/50 dark:bg-slate-700/50'
                        : 'bg-white border-gray-200 dark:bg-slate-800 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-slate-700/50'
                        }`}
                      onClick={() => handleVideoSelect(video)}
                    >
                      <div className="flex p-2 sm:p-3 group">
                        <div className="relative flex-shrink-0 w-20 sm:w-24 h-12 sm:h-14">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                          />
                          {currentVideo?.id === video.id && isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                              <div className="flex space-x-1">
                                <div
                                  className="w-1 h-4 bg-cyan-400 animate-pulse"
                                  style={{ animationDelay: '0ms' }}
                                ></div>
                                <div
                                  className="w-1 h-4 bg-cyan-400 animate-pulse"
                                  style={{ animationDelay: '150ms' }}
                                ></div>
                                <div
                                  className="w-1 h-4 bg-cyan-400 animate-pulse"
                                  style={{ animationDelay: '300ms' }}
                                ></div>
                              </div>
                            </div>
                          )}
                          <div className="absolute bottom-1 right-1 bg-gray-900/80 text-xs text-white px-1 sm:px-1.5 py-0.5 rounded font-medium">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 ml-2 sm:ml-4 min-w-0">
                          <p
                            className={`font-semibold text-xs sm:text-sm truncate ${currentVideo?.id === video.id ? 'text-cyan-700 dark:text-white' : 'text-gray-800 dark:text-white'
                              }`}
                          >
                            {video.title}
                          </p>
                          <div className="flex items-center mt-1">
                            <div
                              className={`text-xs font-medium ${currentVideo?.id === video.id ? 'text-cyan-600 dark:text-white' : 'text-gray-500 dark:text-white'
                                }`}
                            >
                              Click to play
                            </div>
                            {currentVideo?.id === video.id && (
                              <ChevronRight size={14} sm:size={16} className="text-cyan-500 ml-1 sm:ml-1.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div
                    role="alert"
                    className="flex justify-center w-full max-w-md mx-auto px-3 sm:px-4 py-2 rounded-md bg-red-50 border border-red-400 text-red-700 shadow-sm text-xs sm:text-sm font-medium text-center"
                  >
                    No tutorials found
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTutorial;