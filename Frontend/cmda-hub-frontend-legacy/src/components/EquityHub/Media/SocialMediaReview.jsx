


// import React, { useState } from 'react';
// import { MessageCircle, Newspaper, MessageSquare, Clock, Users, Menu, X } from 'lucide-react';
// import Review from './Review';
// import GoogleNews from './GoogleNews';

// function SocialMediaReview({ symbol, compact = false }) {
//   const [activeTab, setActiveTab] = useState('reddit');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const tabs = [
//     {
//       id: 'reddit',
//       name: 'Reddit',
//       fullName: 'Reddit Discussions',
//       icon: <MessageCircle className="w-3 h-3 xs:w-4 xs:h-4" />,
//       component: <Review symbol={symbol} compact={compact} />,
//       enabled: true,
//     },
//     {
//       id: 'google-news',
//       name: 'News',
//       fullName: 'Google News',
//       icon: <Newspaper className="w-3 h-3 xs:w-4 xs:h-4" />,
//       component: <GoogleNews symbol={symbol} compact={compact} />,
//       enabled: true,
//     },
//     {
//       id: 'discord',
//       name: 'Discord',
//       fullName: 'Discord Communities',
//       icon: <Users className="w-3 h-3 xs:w-4 xs:h-4" />,
//       component: <ComingSoonTab 
//         title="Discord Community Insights"
//         description="Analyze discussions from investment communities and trading groups"
//         timeline="Q2 2024"
//         features={[
//           'Community sentiment tracking',
//           'Influencer impact analysis',
//           'Discussion volume metrics',
//           'Cross-community comparison'
//         ]}
//         compact={compact}
//       />,
//       enabled: false,
//     },
//     {
//       id: 'whatsapp',
//       name: 'WhatsApp',
//       fullName: 'WhatsApp Channels',
//       icon: <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4" />,
//       component: <ComingSoonTab 
//         title="WhatsApp Channel Analytics"
//         description="Private group discussion analysis with privacy-compliant insights"
//         timeline="Q3 2024"
//         features={[
//           'Encrypted insights (privacy-first)',
//           'Group sentiment trends',
//           'Message volume analysis',
//           'Topic clustering'
//         ]}
//         compact={compact}
//       />,
//       enabled: false,
//     }
//   ];

//   return (
//     <div className={`${compact ? 'max-w-full' : 'max-w-7xl'} mx-auto px-2 xs:px-3 sm:px-4 lg:px-6 py-2 xs:py-3 sm:py-4`}>
//       {/* Compact Tab Navigation */}
//       <div className={`bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-3 xs:mb-4 sm:mb-6 overflow-hidden ${
//         compact ? 'max-w-full' : ''
//       }`}>
//         {/* Mobile Menu Button - Only show in compact mode or small screens */}
//         {(compact || window.innerWidth < 1024) && (
//           <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-2 xs:p-3">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="flex items-center justify-between w-full p-2 xs:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
//             >
//               <div className="flex items-center space-x-2 xs:space-x-3">
//                 <div className="p-1.5 xs:p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
//                   {tabs.find(tab => tab.id === activeTab)?.icon}
//                 </div>
//                 <span className="font-semibold text-gray-900 dark:text-white text-xs xs:text-sm">
//                   {tabs.find(tab => tab.id === activeTab)?.name}
//                 </span>
//               </div>
//               {mobileMenuOpen ? <X className="w-4 h-4 xs:w-5 xs:h-5" /> : <Menu className="w-4 h-4 xs:w-5 xs:h-5" />}
//             </button>
//           </div>
//         )}

//         {/* Tab Headers - Compact layout */}
//         <div className={`border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 ${
//           mobileMenuOpen ? 'block' : 'hidden lg:block'
//         }`}>
//           <nav className={`flex flex-col lg:flex-row ${
//             compact ? 'px-1 xs:px-2' : 'px-2 xs:px-3 sm:px-4'
//           }`}>
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => {
//                   tab.enabled && setActiveTab(tab.id);
//                   setMobileMenuOpen(false);
//                 }}
//                 className={`
//                   relative group py-2 xs:py-3 lg:py-3 px-2 xs:px-3 transition-all duration-200
//                   border-b-0 lg:border-b-2
//                   ${activeTab === tab.id
//                     ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 lg:bg-transparent shadow-sm lg:shadow-none'
//                     : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
//                   }
//                   ${!tab.enabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/30'}
//                   ${compact ? 'lg:flex-none' : 'lg:flex-1 lg:min-w-0'}
//                 `}
//                 disabled={!tab.enabled}
//               >
//                 {/* Active tab indicator for desktop */}
//                 {activeTab === tab.id && (
//                   <div className="hidden lg:block absolute inset-x-1 xs:inset-x-2 -bottom-px h-0.5 bg-sky-500 rounded-t" />
//                 )}
                
//                 <div className="flex items-center space-x-2 xs:space-x-3 w-full justify-center lg:justify-start">
//                   <div className={`
//                     p-1.5 xs:p-2 rounded-lg transition-colors duration-200 flex-shrink-0
//                     ${activeTab === tab.id 
//                       ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' 
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
//                     }
//                   `}>
//                     {tab.icon}
//                   </div>
                  
//                   <div className={`flex flex-col items-start min-w-0 ${
//                     compact ? 'hidden lg:flex' : 'flex'
//                   }`}>
//                     <div className="font-semibold text-lg xs:text-sm whitespace-nowrap">
//                       {/* Show short name always in compact mode */}
//                       {compact ? tab.name : (
//                         <>
//                           <span className="lg:hidden">{tab.name}</span>
//                           <span className="hidden lg:inline">{tab.fullName || tab.name}</span>
//                         </>
//                       )}
//                     </div>
//                   </div>

//                   {/* Status indicator for disabled tabs */}
//                   {!tab.enabled && (
//                     <div className="hidden lg:flex flex-shrink-0">
//                       <Clock className="w-3 h-3 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Tab Content Area */}
//         <div className={`bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900 ${
//           compact ? 'min-h-[300px] xs:min-h-[350px]' : 'min-h-[400px] sm:min-h-[500px]'
//         }`}>
//           {tabs.find(tab => tab.id === activeTab)?.component}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Compact ComingSoonTab Component
// function ComingSoonTab({ title, description, timeline, features, compact = false }) {
//   if (compact) {
//     return (
//       <div className="py-4 xs:py-6 sm:py-8 px-3 xs:px-4 sm:px-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Compact Header */}
//           <div className="text-center mb-4 xs:mb-6">
//             <div className="w-12 h-12 xs:w-14 xs:h-14 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 xs:mb-4 shadow-lg">
//               <Clock className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
//             </div>
//             <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 xs:mb-3">
//               {title}
//             </h2>
//             <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
//               {description}
//             </p>
//           </div>

//           {/* Compact Features List */}
//           <div className="space-y-2 xs:space-y-3 mb-4 xs:mb-6">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className="flex items-center space-x-3 p-2 xs:p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
//               >
//                 <div className="w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
//                   <span className="text-white font-bold text-xs">{index + 1}</span>
//                 </div>
//                 <span className="text-xs xs:text-sm font-medium text-gray-900 dark:text-white">
//                   {feature}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Compact Timeline */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-3 xs:p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
//                 <span className="text-xs xs:text-sm font-medium text-gray-600 dark:text-gray-400">
//                   Coming {timeline}
//                 </span>
//               </div>
//               <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-2 xs:px-3 py-1 rounded-lg font-bold text-xs xs:text-sm">
//                 {timeline}
//               </div>
//             </div>
            
//             {/* Compact Progress Bar */}
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-sky-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
//                 style={{ width: '45%' }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Full version for non-compact mode
//   return (
//     <div className="py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-6 sm:mb-8 lg:mb-12">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
//             <Clock className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//             {title}
//           </h2>
//           <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
//             {description}
//           </p>
//         </div>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="group bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-sky-200 dark:hover:border-sky-800"
//             >
//               <div className="flex items-start space-x-4 sm:space-x-6">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
//                     <span className="text-white font-bold text-sm sm:text-lg">{index + 1}</span>
//                   </div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 text-base sm:text-lg">
//                     {feature}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
//                     Advanced analytics and machine learning insights for comprehensive market understanding.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Timeline and Status Card */}
//         <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 border border-gray-200 dark:border-gray-700 shadow-lg">
//           <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex-1">
//               <h4 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl mb-3 sm:mb-4">
//                 Development Timeline
//               </h4>
//               <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
//                 Estimated completion and deployment schedule for this feature
//               </p>
//             </div>
//             <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
//               <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg shadow-lg text-center">
//                 {timeline}
//               </div>
//               <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base justify-center sm:justify-start">
//                 <div className="w-2 h-2 sm:w-3 sm:h-3 bg-sky-500 rounded-full animate-pulse"></div>
//                 <span className="text-gray-600 dark:text-gray-400 font-medium">In Development</span>
//               </div>
//             </div>
//           </div>
          
      
//         </div>

    
//       </div>
//     </div>
//   );
// }

// export default SocialMediaReview;

import React, { useState, useEffect } from 'react';
import { MessageCircle, Newspaper, MessageSquare, Clock, Users, Menu, X } from 'lucide-react';
import Review from './Review';
import GoogleNews from './GoogleNews';

function SocialMediaReview({ symbol, compact = false }) {
  const [activeTab, setActiveTab] = useState('reddit');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const tabs = [
    {
      id: 'reddit',
      name: 'Reddit',
      fullName: 'Reddit Discussions',
      icon: <MessageCircle className="w-4 h-4" />,
      component: <Review symbol={symbol} compact={compact} />,
      enabled: true,
    },
    {
      id: 'google-news',
      name: 'News',
      fullName: 'Google News',
      icon: <Newspaper className="w-4 h-4" />,
      component: <GoogleNews symbol={symbol} compact={compact} />,
      enabled: true,
    },
    {
      id: 'discord',
      name: 'Discord',
      fullName: 'Discord Communities',
      icon: <Users className="w-4 h-4" />,
      component: <ComingSoonTab 
        title="Discord Community Insights"
        description="Analyze discussions from investment communities and trading groups"
        timeline="Q2 2024"
        
        compact={compact}
      />,
      enabled: false,
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      fullName: 'WhatsApp Channels',
      icon: <MessageSquare className="w-4 h-4" />,
      component: <ComingSoonTab 
        title="WhatsApp Channel Analytics"
        description="Private group discussion analysis with privacy-compliant insights"
        timeline="Q3 2024"
     
        compact={compact}
      />,
      enabled: false,
    }
  ];

  return (
    <div className={`${compact ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}>
      {/* Main Container */}
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden ${
        compact ? 'max-w-full' : ''
      }`}>
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <div className="lg:hidden border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-between w-full p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                  {tabs.find(tab => tab.id === activeTab)?.icon}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-base">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </span>
              </div>
              {mobileMenuOpen ? 
                <X className="w-5 h-5" /> : 
                <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        )}

        {/* Tab Headers - Simplified responsive design */}
        <div className={`bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 ${
          mobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <nav className="flex flex-col lg:flex-row">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.enabled) {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`
                  flex items-center space-x-3 px-4 py-3 lg:py-4 transition-all duration-200
                  border-b-0 lg:border-b-2
                  ${activeTab === tab.id
                    ? 'border-sky-500 text-sky-600 dark:text-sky-400 bg-white dark:bg-gray-800 lg:bg-transparent'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                  ${!tab.enabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-white/50 dark:hover:bg-gray-700/30'}
                  flex-1 lg:flex-none lg:min-w-0
                `}
                disabled={!tab.enabled}
              >
                {/* Active tab indicator for desktop */}
                {activeTab === tab.id && (
                  <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
                )}
                
                <div className={`
                  p-2 rounded-lg transition-colors duration-200 flex-shrink-0
                  ${activeTab === tab.id 
                    ? 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {tab.icon}
                </div>
                
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 dark:text-white text-left whitespace-nowrap">
                    {/* Show appropriate text based on screen size */}
                    <span className="lg:hidden xl:hidden">{tab.name}</span>
                    <span className="hidden lg:inline xl:hidden">{tab.name}</span>
                    <span className="hidden xl:inline">{compact ? tab.name : tab.fullName}</span>
                  </div>
                  
                  {/* Subtitle - only show on large screens in non-compact mode */}
                  {!compact && (
                    <div className="hidden lg:block">
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {tab.id === 'reddit' && 'Community discussions'}
                        {tab.id === 'google-news' && 'Latest news updates'}
                        {tab.id === 'discord' && 'Community insights'}
                        {tab.id === 'whatsapp' && 'Channel analytics'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status indicator for disabled tabs */}
                {/* {!tab.enabled && (
                  <div className="flex-shrink-0">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                )} */}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Area */}
        <div className={`bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900 ${
          compact ? 'min-h-[400px]' : 'min-h-[600px] lg:min-h-[700px]'
        }`}>
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}

// ComingSoonTab Component (keep your existing implementation)
function ComingSoonTab({ title, description, timeline, features, compact = false }) {
  if (compact) {
    return (
      <div className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Compact Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          {/* Compact Features List */}
          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <span className="text-white font-bold text-base">{index + 1}</span>
                </div>
                <span className="text-base font-medium text-gray-900 dark:text-white flex-1">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Compact Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse"></div>
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                  Coming {timeline}
                </span>
              </div>
              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl font-bold text-base shadow-lg text-center">
                {timeline}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version for non-compact mode
  return (
    <div className="py-12 lg:py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="w-24 h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-8 lg:mb-10 shadow-xl">
            <Clock className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
          </div>
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12 lg:mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-xl lg:text-2xl">
                    {feature}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    Advanced analytics and machine learning insights for comprehensive market understanding.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 lg:p-10 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 mb-6 lg:mb-0">
              <h4 className="font-bold text-gray-900 dark:text-white text-2xl lg:text-3xl mb-4">
                Development Timeline
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-lg lg:text-xl">
                Estimated completion and deployment schedule for this feature
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg text-center min-w-[120px]">
                {timeline}
              </div>
              <div className="flex items-center space-x-4 text-lg justify-center sm:justify-start">
                <div className="w-4 h-4 bg-sky-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">In Development</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-cyan-500 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: '45%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMediaReview;



// import React, { useState } from 'react';
// import { MessageCircle, Newspaper, MessageSquare, Clock, Users } from 'lucide-react';
// import Review from './Review';
// import GoogleNews from './GoogleNews';

// function SocialMediaReview({ symbol, compact = false, comparisonMode = false }) {
//   const [activeTab, setActiveTab] = useState('reddit');

//   const tabs = [
//     {
//       id: 'reddit',
//       name: 'Reddit',
//       fullName: 'Reddit Discussions',
//       icon: <MessageCircle className="w-4 h-4" />,
//       component: <Review symbol={symbol} compact={compact} comparisonMode={comparisonMode} />,
//       enabled: true,
//     },
//     {
//       id: 'google-news',
//       name: 'News',
//       fullName: 'Google News',
//       icon: <Newspaper className="w-4 h-4" />,
//       component: <GoogleNews symbol={symbol} compact={compact} comparisonMode={comparisonMode} />,
//       enabled: true,
//     },
//     {
//       id: 'discord',
//       name: 'Discord',
//       fullName: 'Discord Communities',
//       icon: <Users className="w-4 h-4" />,
//       component: <ComingSoonTab 
//         title="Discord Community Insights"
//         description="Analyze discussions from investment communities and trading groups"
//         timeline="Q2 2024"
//         features={[
//           'Community sentiment tracking',
//           'Influencer impact analysis',
//           'Discussion volume metrics',
//           'Cross-community comparison'
//         ]}
//         compact={compact}
//         comparisonMode={comparisonMode}
//       />,
//       enabled: false,
//     },
//     {
//       id: 'whatsapp',
//       name: 'WhatsApp',
//       fullName: 'WhatsApp Channels',
//       icon: <MessageSquare className="w-4 h-4" />,
//       component: <ComingSoonTab 
//         title="WhatsApp Channel Analytics"
//         description="Private group discussion analysis with privacy-compliant insights"
//         timeline="Q3 2024"
//         features={[
//           'Encrypted insights (privacy-first)',
//           'Group sentiment trends',
//           'Message volume analysis',
//           'Topic clustering'
//         ]}
//         compact={compact}
//         comparisonMode={comparisonMode}
//       />,
//       enabled: false,
//     }
//   ];

//   // Adjust layout based on comparison mode
//   const containerClass = comparisonMode 
//     ? 'w-full h-full' 
//     : `${compact ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6`;

//   const contentClass = comparisonMode
//     ? 'h-full flex flex-col'
//     : '';

//   return (
//     <div className={`${containerClass} ${contentClass}`}>
//       {/* Tab Navigation */}
//       <div className={`${comparisonMode ? 'px-3 py-2' : 'flex justify-center mb-6 md:mb-8'}`}>
//         <div className={`
//           w-full bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 
//           rounded-xl border border-gray-200 dark:border-slate-700
//           ${comparisonMode 
//             ? 'p-1 shadow-sm' 
//             : 'p-1 shadow-inner max-w-6xl'
//           }
//         `}>
//           <div className="flex">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => tab.enabled && setActiveTab(tab.id)}
//                 className={`
//                   relative flex items-center justify-center gap-2 transition-all duration-200 whitespace-nowrap
//                   flex-1 min-w-0
//                   ${comparisonMode 
//                     ? 'px-3 py-2 text-xs rounded-lg' 
//                     : 'px-4 py-3 text-sm rounded-lg'
//                   }
//                   ${activeTab === tab.id
//                     ? "text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 shadow-sm border border-blue-200 dark:border-blue-800"
//                     : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50 border border-transparent"
//                   }
//                   ${!tab.enabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
//                   first:rounded-l-lg last:rounded-r-lg
//                 `}
//                 disabled={!tab.enabled}
//               >
//                 <div className={`${comparisonMode ? 'p-1.5' : 'p-2'} rounded-lg flex-shrink-0 ${
//                   activeTab === tab.id 
//                     ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
//                     : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
//                 }`}>
//                   {tab.icon}
//                 </div>
                
//                 <span className={`font-semibold truncate ${
//                   comparisonMode ? 'hidden xs:inline' : 'inline'
//                 }`}>
//                   {comparisonMode ? tab.name : tab.name}
//                 </span>

//                 {!tab.enabled && (
//                   <Clock className={`text-gray-400 flex-shrink-0 ${
//                     comparisonMode ? 'w-3 h-3' : 'w-4 h-4'
//                   }`} />
//                 )}

//                 {activeTab === tab.id && (
//                   <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full ${
//                     comparisonMode ? 'w-3/4 h-1' : 'w-1/2 h-1'
//                   }`}></div>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Tabs - Only show on small screens in non-comparison mode */}
//       {!comparisonMode && (
//         <div className="sm:hidden flex justify-center mb-4">
//           <div className="w-full max-w-6xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-1 shadow-inner border border-gray-200 dark:border-slate-700">
//             <div className="flex overflow-x-auto scrollbar-hide">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => tab.enabled && setActiveTab(tab.id)}
//                   className={`
//                     relative flex items-center justify-center gap-2 px-3 py-2 text-xs 
//                     transition-all duration-200 whitespace-nowrap flex-shrink-0 min-w-[70px]
//                     rounded-md mx-0.5 first:ml-0 last:mr-0
//                     ${activeTab === tab.id
//                       ? "text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 shadow-sm"
//                       : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/50 dark:hover:bg-slate-700/50"
//                     }
//                     ${!tab.enabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
//                   `}
//                   disabled={!tab.enabled}
//                 >
//                   <div className={`p-1 rounded flex-shrink-0 ${
//                     activeTab === tab.id 
//                       ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
//                       : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
//                   }`}>
//                     {tab.icon}
//                   </div>
                  
//                   <span className="font-semibold truncate text-xs">
//                     {tab.name}
//                   </span>

//                   {activeTab === tab.id && (
//                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tab Content Area */}
//       <div className={`
//         bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
//         ${comparisonMode 
//           ? 'flex-1 rounded-lg overflow-hidden mx-2 mb-2' 
//           : 'rounded-xl shadow-sm overflow-hidden'
//         }
//         ${compact ? 'max-w-full' : ''}
//       `}>
//         <div className={`
//           bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900
//           ${comparisonMode 
//             ? 'h-full' 
//             : compact ? 'min-h-[300px]' : 'min-h-[400px] sm:min-h-[500px]'
//           }
//         `}>
//           {tabs.find(tab => tab.id === activeTab)?.component}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Updated ComingSoonTab for comparison mode
// function ComingSoonTab({ title, description, timeline, features, compact = false, comparisonMode = false }) {
//   if (comparisonMode || compact) {
//     return (
//       <div className={`${comparisonMode ? 'p-3 h-full flex flex-col' : 'py-6 px-4'}`}>
//         <div className={`${comparisonMode ? 'flex-1' : 'max-w-4xl mx-auto'}`}>
//           {/* Compact Header */}
//           <div className={`text-center ${comparisonMode ? 'mb-4' : 'mb-6'}`}>
//             <div className={`
//               bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg
//               ${comparisonMode ? 'w-10 h-10' : 'w-12 h-12'}
//             `}>
//               <Clock className={`text-white ${comparisonMode ? 'w-4 h-4' : 'w-5 h-5'}`} />
//             </div>
//             <h2 className={`
//               font-bold text-gray-900 dark:text-white mb-2
//               ${comparisonMode ? 'text-sm' : 'text-lg'}
//             `}>
//               {title}
//             </h2>
//             <p className={`
//               text-gray-600 dark:text-gray-400 mx-auto leading-relaxed
//               ${comparisonMode 
//                 ? 'text-xs max-w-xs' 
//                 : 'text-sm max-w-md'
//               }
//             `}>
//               {description}
//             </p>
//           </div>

//           {/* Compact Features List */}
//           <div className={`space-y-2 ${comparisonMode ? 'mb-4' : 'mb-6'}`}>
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className={`
//                   flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm
//                   ${comparisonMode ? 'p-2' : 'p-3'}
//                 `}
//               >
//                 <div className={`
//                   bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0
//                   ${comparisonMode ? 'w-6 h-6' : 'w-8 h-8'}
//                 `}>
//                   <span className={`text-white font-bold ${comparisonMode ? 'text-xs' : 'text-sm'}`}>
//                     {index + 1}
//                   </span>
//                 </div>
//                 <span className={`
//                   font-medium text-gray-900 dark:text-white flex-1
//                   ${comparisonMode ? 'text-xs' : 'text-sm'}
//                 `}>
//                   {feature}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* Compact Timeline */}
//           <div className={`
//             bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm
//             ${comparisonMode ? 'p-3' : 'p-4'}
//           `}>
//             <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
//               comparisonMode ? 'space-y-2 mb-3' : 'space-y-2 mb-4'
//             }`}>
//               <div className="flex items-center space-x-2">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className={`
//                   font-medium text-gray-600 dark:text-gray-400
//                   ${comparisonMode ? 'text-xs' : 'text-sm'}
//                 `}>
//                   Coming {timeline}
//                 </span>
//               </div>
//               <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg font-bold text-xs shadow-lg text-center">
//                 {timeline}
//               </div>
//             </div>
            
//             {/* Progress Bar */}
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
//                 style={{ width: '45%' }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Full version for non-compact, non-comparison mode
//   return (
//     <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8 sm:mb-12">
//           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//             <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
//           </div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//             {title}
//           </h2>
//           <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
//             {description}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
//             >
//               <div className="flex items-start space-x-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
//                     <span className="text-white font-bold text-lg">{index + 1}</span>
//                   </div>
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
//                     {feature}
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
//                     Advanced analytics and machine learning insights for comprehensive market understanding.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex-1 mb-4 lg:mb-0">
//               <h4 className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl mb-2">
//                 Development Timeline
//               </h4>
//               <p className="text-gray-600 dark:text-gray-400 text-base">
//                 Estimated completion and deployment schedule
//               </p>
//             </div>
//             <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
//               <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg text-center">
//                 {timeline}
//               </div>
//               <div className="flex items-center space-x-2 text-base justify-center sm:justify-start">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                 <span className="text-gray-600 dark:text-gray-400 font-medium">In Development</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="mt-6">
//             <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
//               <div 
//                 className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
//                 style={{ width: '45%' }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SocialMediaReview;