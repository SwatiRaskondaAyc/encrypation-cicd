
// 
// import { ThumbsUp, ThumbsDown, MessageCircle, Share, MoreHorizontal, Clock, TrendingUp, ChevronDown, ExternalLink } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({symbol}) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [subCommentFilters, setSubCommentFilters] = useState({});
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '' });

//   // Your actual data converted to React format - MOVED TO TOP
//   const redditData = {
//     keyword: "TCS",
//     timeframe: "1_month",
//     scrape_timestamp: "2025-11-05T12:51:32.464327",
//     subreddits: {
//       IndianStockMarket: {
//         subreddit_name: "IndianStockMarket",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1o8753k",
//                 post_title: "At current price, TCS is one of the top picks in large cap",
//                 post_description: "On almost all parameters, TCS is showing tremendous value. Other than the US tariff issue and the H-1B visa related issues, not much seems to be wrong for a solid large cap pick.",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o8753k/at_current_price_tcs_is_one_of_the_top_picks_in/",
//                 post_upvotes: 102,
//                 post_downvotes: 0,
//                 post_score: 102,
//                 post_upvote_ratio: 0.9,
//                 post_images: [
//                   "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc"
//                 ],
//                 author: "sandyk212",
//                 author_profile: "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc", // Profile picture
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760623721.0,
//                 created_datetime: "2025-10-16T19:38:41",
//                 num_comments: 54,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "njsqv7h",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png", // Reddit bot profile
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760623722.0,
//                       comment_created_datetime: "2025-10-16T19:38:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njtmbga",
//                       comment_body: "also good dividends at this price note that !",
//                       comment_author: "Shotgun_Philosopher",
//                       comment_author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c", // Profile picture
//                       comment_score: 50,
//                       comment_upvotes: 50,
//                       comment_created_utc: 1760633168.0,
//                       comment_created_datetime: "2025-10-16T22:16:08",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njts6zw",
//                       comment_body: "But the overall landscape/sector is not doing well. The general outlook is bad. Unless something changes broadly.",
//                       comment_author: "Healthy-Inspection20",
//                       comment_author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377", // Profile picture
//                       comment_score: 51,
//                       comment_upvotes: 51,
//                       comment_created_utc: 1760634871.0,
//                       comment_created_datetime: "2025-10-16T22:44:31",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     }
//                   ]
//                 }
//               },
//               {
//                 post_id: "1o23vtn",
//                 post_title: "TCS Q2 Results Analysis – Profit Misses, What's Next for the Stock?",
//                 post_description: "TCS just posted its Q2 FY26 numbers:\n\nRevenue: ₹65,799 crore (+2.4% YoY)\n\nNet Profit: ₹12,075 crore (+1.4% YoY, –5.4% QoQ)\n\nExceptional item: ₹1,135 crore restructuring cost\n\nMargin: 25.2% (expanded QoQ)\n\nTCV: $10 billion 💼\n\n📌 Revenue was in line, but profit missed estimates. Still, deal wins and AI/cloud bets support long-term growth.\n\nWhat do you all think? Buy on dips or wait?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o23vtn/tcs_q2_results_analysis_profit_misses_whats_next/",
//                 post_upvotes: 47,
//                 post_downvotes: 0,
//                 post_score: 47,
//                 post_upvote_ratio: 0.95,
//                 post_images: [],
//                 author: "Objective-Letter-665",
//                 author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png", // Default Reddit avatar
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760010864.0,
//                 created_datetime: "2025-10-09T17:24:24",
//                 num_comments: 49,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nikybuk",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760010865.0,
//                       comment_created_datetime: "2025-10-09T17:24:25",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     },
//                     {
//                       comment_id: "nikz5gw",
//                       comment_body: "Honestly, its absurd to me that the stock is trading at 23 P/E levels while revenue and profits have been largely flat for the last 3 quarters, what other signals does the market need to see that the days of IT service industry are over? I guess it takes time for a large company to go down, but go down it will.",
//                       comment_author: "bm_mane8",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png", // Default Reddit avatar
//                       comment_score: 26,
//                       comment_upvotes: 26,
//                       comment_created_utc: 1760011207.0,
//                       comment_created_datetime: "2025-10-09T17:30:07",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     }
//                   ]
//                 }
//               }
//             ]
//           },
//           new: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1on8x7n",
//                 post_title: "From Nasdaq to NSE: Cognizant's homecoming",
//                 post_description: "Source : [Mint](https://www.livemint.com/companies/cognizant-india-listing-initial-public-offering-ipo-plans-stock-exchange-11761749243226.html)\n\nCognizant might finally be coming home.\n\nThe US-based IT giant with over two-thirds of its workforce in India is exploring a listing on Indian stock exchanges, either a full-fledged IPO or a secondary listing of its US shares. Why now? Because the math is too tempting to ignore.\n\nDespite pulling in nearly $20 billion in annual revenue, Cognizant's stock trades at just 13x earnings on the Nasdaq. Compare that to Indian peers like Infosys, TCS, or HCLTech  comfortably sitting above 22x. A domestic listing could help bridge that gap, tap into India's premium valuations, and give the company a long-overdue emotional and financial reconnect with the Indian market.\n\nCFO Jatin Dalal confirmed they're still in the early stages gauging market sentiment, regulatory pathways, and timing. But if it happens, Cognizant could become India's second-largest IT services listing after TCS.\n\nThis move isn't just about valuation. It's symbolic. It acknowledges that India isn't just Cognizant's talent pool  it's the engine.\n\nWould you see this as a strategic homecoming or just a valuation play?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1on8x7n/from_nasdaq_to_nse_cognizants_homecoming/",
//                 post_upvotes: 66,
//                 post_downvotes: 0,
//                 post_score: 66,
//                 post_upvote_ratio: 0.93,
//                 post_images: [
//                   "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377"
//                 ],
//                 author: "HODL_buddy",
//                 author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377", // Profile picture
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1762168114.0,
//                 created_datetime: "2025-11-03T16:38:34",
//                 num_comments: 7,
//                 is_nsfw: false,
//                 link_flair_text: "Discussion",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nmuzuy8",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1762168116.0,
//                       comment_created_datetime: "2025-11-03T16:38:36",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     },
//                     {
//                       comment_id: "nmv8pcd",
//                       comment_body: "LG was a  lucrative homecoming!\nIt's 2025.\nEvery company in the world is Indian!",
//                       comment_author: "WinOverall4447",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png", // Default Reddit avatar
//                       comment_score: 28,
//                       comment_upvotes: 28,
//                       comment_created_utc: 1762172382.0,
//                       comment_created_datetime: "2025-11-03T17:49:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     }
//                   ]
//                 }
//               }
//             ]
//           }
//         }
//       },
//       IndianStocks: {
//         subreddit_name: "IndianStocks",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1oj8xa3",
//                 post_title: "TCS to get a big boost ?",
//                 post_description: "Morning star on weekly time frame support and a bullish divergence.",
//                 post_url: "https://reddit.com/r/IndianStocks/comments/1oj8xa3/tcs_to_get_a_big_boost/",
//                 post_upvotes: 14,
//                 post_downvotes: 0,
//                 post_score: 14,
//                 post_upvote_ratio: 0.79,
//                 post_images: [
//                   "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c"
//                 ],
//                 author: "AltF4Existence",
//                 author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c", // Profile picture
//                 subreddit: "IndianStocks",
//                 created_utc: 1761754713.0,
//                 created_datetime: "2025-10-29T21:48:33",
//                 num_comments: 23,
//                 is_nsfw: false,
//                 link_flair_text: "Chart",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nm2c7vp",
//                       comment_body: "4 year back in bought and i am currently at 0% profit",
//                       comment_author: "jton27662",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png", // Default Reddit avatar
//                       comment_score: 8,
//                       comment_upvotes: 8,
//                       comment_created_utc: 1761766817.0,
//                       comment_created_datetime: "2025-10-30T01:10:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     },
//                     {
//                       comment_id: "nm18sm7",
//                       comment_body: "But no positive news in sight for TCS. Only negative news everywhere",
//                       comment_author: "_kingFatso",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png", // Default Reddit avatar
//                       comment_score: 9,
//                       comment_upvotes: 9,
//                       comment_created_utc: 1761755717.0,
//                       comment_created_datetime: "2025-10-29T22:05:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     }
//                   ]
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//   };

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));

//     // Initialize individual filters when expanding a comment
//     if (!expandedComments[commentId]) {
//       setSubCommentFilters(prev => ({
//         ...prev,
//         [commentId]: {
//           timeFilter: 'All Time',
//           sortFilter: 'Top',
//           showTimeDropdown: false,
//           showSortDropdown: false
//         }
//       }));
//     }
//   };

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const showInteractivePopup = (action) => {
//     const messages = {
//       like: "This is an interactive feature! so you can't like comments.",
//       dislike: "This is an interactive feature! so you can't dislike comments.",
//       share: "This is an interactive feature! so you can't share comments.",
//       comment: "This is an interactive feature! so you can't reply to comments."
//     };

//     setShowPopup({
//       visible: true,
//       message: messages[action] || "This feature is interactive!"
//     });

//     setTimeout(() => {
//       setShowPopup({ visible: false, message: '' });
//     }, 3000);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Recent' },
//     { value: 'Top', label: 'Top' },
//     { value: 'Controversial', label: 'Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'New' },
//     { value: 'Old', label: 'Old' }
//   ];

//   // Function to format timestamp to relative time
//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
//     return `${Math.floor(diffInSeconds / 31536000)} years ago`;
//   };

//   // Function to get profile picture URL - now uses actual profile URLs from data
//   const getProfilePicture = (userData, size = 40) => {
//     // For posts: use author_profile, for comments: use comment_author_profile
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
    
//     if (profileUrl) {
//       return profileUrl;
//     }
    
//     // Fallback to default avatar if no profile picture is provided
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Calculate time filter boundaries for main posts
//   const getTimeFilterBoundary = () => {
//     const now = new Date();
//     switch (timeFilter) {
//       case '1 Week':
//         return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month':
//         return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months':
//         return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months':
//         return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year':
//         return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default:
//         return new Date(0);
//     }
//   };

//   // Calculate time filter boundaries for sub-comments (individual per post)
//   const getSubCommentTimeFilterBoundary = (timeFilterValue) => {
//     const now = new Date();
//     switch (timeFilterValue) {
//       case '1 Week':
//         return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month':
//         return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months':
//         return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months':
//         return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year':
//         return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default:
//         return new Date(0);
//     }
//   };

//   // Update individual sub-comment filters
//   const updateSubCommentFilter = (commentId, filterType, value) => {
//     setSubCommentFilters(prev => ({
//       ...prev,
//       [commentId]: {
//         ...prev[commentId],
//         [filterType]: value
//       }
//     }));
//   };

//   // Process the actual data from your Python response
//   const processRedditData = () => {
//     const allPosts = [];
    
//     // Process IndianStockMarket subreddit
//     const ismData = redditData.subreddits.IndianStockMarket;
//     Object.values(ismData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         // Process comments for this post
//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     // Process IndianStocks subreddit
//     const isData = redditData.subreddits.IndianStocks;
//     Object.values(isData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     return allPosts;
//   };

//   // Filter and sort sub-comments based on individual post filters
//   const getFilteredAndSortedSubComments = (subComments, commentId) => {
//     const filters = subCommentFilters[commentId];
//     if (!filters) return subComments;

//     const timeBoundary = getSubCommentTimeFilterBoundary(filters.timeFilter);
    
//     // Apply time filter
//     let filteredSubComments = subComments.filter(comment => 
//       comment.actualTimestamp >= timeBoundary
//     );

//     // Apply sort filter
//     switch (filters.sortFilter) {
//       case 'Recent':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredSubComments.sort((a, b) => {
//           const aEngagement = a.likes + (a.comment?.length || 0);
//           const bEngagement = b.likes + (b.comment?.length || 0);
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredSubComments.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
//         break;
//       case 'New':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredSubComments.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//     }

//     return filteredSubComments;
//   };

//   // Filter and sort posts based on selected filters
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = getTimeFilterBoundary();

//     // Apply time filter
//     let filteredPosts = allPosts.filter(post => 
//       post.actualTimestamp >= timeBoundary
//     );

//     // Apply sort filter
//     switch (sortFilter) {
//       case 'Recent':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => {
//           const aEngagement = a.totalComments + a.likes;
//           const bEngagement = b.totalComments + b.likes;
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [timeFilter, sortFilter]);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
//       {/* Header Section */}
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-gray-200">What are people saying about  
//           <span className="text-cyan-500 dark:text-cyan-400"> ({symbol}) </span> 
//         </h2>
        
//         {/* Filter Options with Dropdowns */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           {/* Time Filter Dropdown */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Time:</span>
//             <div className="relative">
//               <button
//                 onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                 className="flex items-center gap-2 px-3 py-1 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors min-w-[120px] justify-between"
//               >
//                 {timeFilter}
//                 <ChevronDown className={`w-4 h-4 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//               </button>
              
//               {showTimeDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 dark:bg-gray-700">
//                   {timeOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => {
//                         setTimeFilter(option.value);
//                         setShowTimeDropdown(false);
//                       }}
//                       className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg dark:hover:bg-gray-600 ${
//                         timeFilter === option.value 
//                           ? 'bg-sky-50 text-sky-700 font-medium dark:text-sky-400 dark:bg-gray-700' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* Sort Filter Dropdown */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Sort by:</span>
//             <div className="relative">
//               <button
//                 onClick={() => setShowSortDropdown(!showSortDropdown)}
//                 className="flex items-center gap-2 px-3 py-1 bg-sky-600 text-white text-sm rounded-lg font-medium hover:bg-sky-700 transition-colors min-w-[140px] justify-between"
//               >
//                 {sortFilter}
//                 <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//               </button>
              
//               {showSortDropdown && (
//                 <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10 dark:bg-gray-700">
//                   {sortOptions.map((option) => (
//                     <button
//                       key={option.value}
//                       onClick={() => {
//                         setSortFilter(option.value);
//                         setShowSortDropdown(false);
//                       }}
//                       className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg dark:hover:bg-gray-600 ${
//                         sortFilter === option.value 
//                           ? 'bg-sky-50 text-sky-700 font-medium dark:text-sky-400 dark:bg-gray-700' 
//                           : 'text-gray-700 dark:text-gray-300'
//                       }`}
//                     >
//                       {option.label}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Active Filters Display */}
//         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//           <span>Showing:</span>
//           <span className="font-medium">{timeFilter}</span>
//           <span>•</span>
//           <span className="font-medium">{sortFilter}</span>
//           <span>discussions</span>
//           <span className="text-gray-400">({filteredAndSortedPosts.length} posts)</span>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {filteredAndSortedPosts.length > 0 ? (
//           filteredAndSortedPosts.map((comment) => (
//             <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              
//               <div className="flex gap-3">
//                 <div className="flex-shrink-0">
//                   <img
//                     src={comment.userAvatar}
//                     alt={comment.userName}
//                     className="w-10 h-10 rounded-full border border-gray-300 object-cover"
//                     onError={(e) => {
//                       // Fallback if image fails to load
//                       e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                     }}
//                   />
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 mb-2 flex-wrap">
//                     <span className="font-semibold text-gray-900 text-sm">{comment.userName}</span>
//                     <span className="text-gray-500 text-xs">•</span>
//                     <div className="flex items-center gap-1 text-gray-500 text-xs">
//                       <Clock className="w-3 h-3" />
//                       {comment.timestamp}
//                     </div>
//                     {comment.isRecent && (
//                       <>
//                         <span className="text-gray-500 text-xs">•</span>
//                         <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
//                           Recent
//                         </span>
//                       </>
//                     )}
//                   </div>

//                   {/* Post Title */}
//                   <h3 className="font- text-gray-900 text-sm mb-2">
//                     {comment.title}
//                   </h3>
                  
//                   <p className="text-gray-800 text-sm mb-3 leading-relaxed">
//                     {comment.comment}
//                   </p>
                  
//                   <div className="flex items-center gap-4 flex-wrap">
//                     <button 
//                       className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
//                       onClick={() => showInteractivePopup('like')}
//                     >
//                       <ThumbsUp className="w-4 h-4" />
//                       <span>{comment.likes}</span>
//                     </button>
//                     <button 
//                       className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
//                       onClick={() => showInteractivePopup('dislike')}
//                     >
//                       <ThumbsDown className="w-4 h-4" />
//                       <span>{comment.dislikes}</span>
//                     </button>
//                     <button 
//                       className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
//                       onClick={() => {
//                         toggleCommentExpansion(comment.id);
//                         showInteractivePopup('comment');
//                       }}
//                     >
//                       <MessageCircle className="w-4 h-4" />
//                       <span>{comment.subComments.length}</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {expandedComments[comment.id] && comment.subComments.length > 0 && (
//                 <div className="ml-12 mt-4 space-y-4 border-t border-gray-100 pt-4">
//                   {/* Sub-comment Filters */}
//                   <div className="flex flex-wrap gap-4 mb-4">
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Comments Time:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showTimeDropdown', !subCommentFilters[comment.id]?.showTimeDropdown)}
//                           className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium hover:bg-gray-200 transition-colors min-w-[100px] justify-between"
//                         >
//                           {subCommentFilters[comment.id]?.timeFilter || 'All Time'}
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showTimeDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showTimeDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 dark:bg-gray-700">
//                             {timeOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'timeFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showTimeDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg dark:hover:bg-gray-600 ${
//                                   subCommentFilters[comment.id]?.timeFilter === option.value 
//                                     ? 'bg-sky-50 text-sky-700 font-medium dark:text-sky-400 dark:bg-gray-700' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Sort by:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showSortDropdown', !subCommentFilters[comment.id]?.showSortDropdown)}
//                           className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium hover:bg-gray-200 transition-colors min-w-[110px] justify-between"
//                         >
//                           {subCommentFilters[comment.id]?.sortFilter || 'Top'}
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showSortDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showSortDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-20 dark:bg-gray-700">
//                             {sortOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'sortFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showSortDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg dark:hover:bg-gray-600 ${
//                                   subCommentFilters[comment.id]?.sortFilter === option.value 
//                                     ? 'bg-sky-50 text-sky-700 font-medium dark:text-sky-400 dark:bg-gray-700' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <h4 className="text-sm font-semibold text-gray-700 mb-2">
//                     Top comments ({getFilteredAndSortedSubComments(comment.subComments, comment.id).length} filtered)
//                   </h4>
                  
//                   {getFilteredAndSortedSubComments(comment.subComments, comment.id).map((subComment) => (
//                     <div key={subComment.id} className="flex gap-3">
//                       <div className="flex-shrink-0">
//                         <img
//                           src={subComment.userAvatar}
//                           alt={subComment.userName}
//                           className="w-9 h-9 rounded-full border border-gray-300 object-cover"
//                           onError={(e) => {
//                             // Fallback if image fails to load
//                             e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                           }}
//                         />
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-semibold text-gray-900 text-sm">{subComment.userName}</span>
//                           <span className="text-gray-500 text-xs">•</span>
//                           <div className="flex items-center gap-1 text-gray-500 text-xs">
//                             <Clock className="w-3 h-3" />
//                             {subComment.timestamp}
//                           </div>
//                         </div>
                        
//                         <p className="text-gray-700 text-sm mb-2 leading-relaxed">
//                           {subComment.comment}
//                         </p>
                        
//                         <div className="flex items-center gap-4">
//                           <button 
//                             className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
//                             onClick={() => showInteractivePopup('like')}
//                           >
//                             <ThumbsUp className="w-3 h-3" />
//                             <span>{subComment.likes}</span>
//                           </button>
//                           <button 
//                             className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs font-medium"
//                             onClick={() => showInteractivePopup('dislike')}
//                           >
//                             <ThumbsDown className="w-3 h-3" />
//                           </button>
//                           <button 
//                             className="text-gray-500 hover:text-gray-700 text-xs font-medium"
//                             onClick={() => showInteractivePopup('comment')}
//                           >
//                             Reply
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <p>No posts found for the selected filters.</p>
//             <p className="text-sm mt-2">Try adjusting your time or sort filters.</p>
//           </div>
//         )}
//       </div>

//       {/* Interactive Popup */}
//       {showPopup.visible && (
//         <div className="fixed bottom-24 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-xs animate-bounce">
//           <p className="text-sm">{showPopup.message}</p>
//         </div>
//       )}

//       {/* Disclaimer Section */}
//       {showDisclaimer ? (
//         <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg transition-all duration-300">
//           <div className="flex items-start gap-3">
//             <IoWarning className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-sm text-orange-800 font-medium mb-1">
//                 Important Disclaimer
//               </p>
//               <p className="text-xs text-orange-700 leading-relaxed">
//                Please note that these are considered discussions from online forums and should not be considered 
//                 professional investment advice. Always consult with a qualified financial advisor before making 
//                 investment decisions.
//               </p>
//               <p className="text-xs text-orange-600 mt-2 italic">
//                 Interactive features coming soon - you'll be able to engage with these discussions directly.
//               </p>
//             </div>
//             <button 
//               onClick={toggleDisclaimer}
//               className="text-orange-600 hover:text-orange-800 text-sm font-medium flex-shrink-0"
//             >
//               Hide
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-8 flex justify-center">
//           <button 
//             onClick={toggleDisclaimer}
//             className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
//           >
//             <IoWarning className="w-4 h-4" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;




// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [subCommentFilters, setSubCommentFilters] = useState({});
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '' });

//   // Your actual data converted to React format - MOVED TO TOP
//   const redditData = {
//     keyword: "TCS",
//     timeframe: "1_month",
//     scrape_timestamp: "2025-11-05T12:51:32.464327",
//     subreddits: {
//       IndianStockMarket: {
//         subreddit_name: "IndianStockMarket",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1o8753k",
//                 post_title: "At current price, TCS is one of the top picks in large cap",
//                 post_description: "On almost all parameters, TCS is showing tremendous value. Other than the US tariff issue and the H-1B visa related issues, not much seems to be wrong for a solid large cap pick.",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o8753k/at_current_price_tcs_is_one_of_the_top_picks_in/",
//                 post_upvotes: 102,
//                 post_downvotes: 0,
//                 post_score: 102,
//                 post_upvote_ratio: 0.9,
//                 post_images: [
//                   "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc"
//                 ],
//                 author: "sandyk212",
//                 author_profile: "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760623721.0,
//                 created_datetime: "2025-10-16T19:38:41",
//                 num_comments: 54,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "njsqv7h",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760623722.0,
//                       comment_created_datetime: "2025-10-16T19:38:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njtmbga",
//                       comment_body: "also good dividends at this price note that !",
//                       comment_author: "Shotgun_Philosopher",
//                       comment_author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c",
//                       comment_score: 50,
//                       comment_upvotes: 50,
//                       comment_created_utc: 1760633168.0,
//                       comment_created_datetime: "2025-10-16T22:16:08",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njts6zw",
//                       comment_body: "But the overall landscape/sector is not doing well. The general outlook is bad. Unless something changes broadly.",
//                       comment_author: "Healthy-Inspection20",
//                       comment_author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377",
//                       comment_score: 51,
//                       comment_upvotes: 51,
//                       comment_created_utc: 1760634871.0,
//                       comment_created_datetime: "2025-10-16T22:44:31",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     }
//                   ]
//                 }
//               },
//               {
//                 post_id: "1o23vtn",
//                 post_title: "TCS Q2 Results Analysis – Profit Misses, What's Next for the Stock?",
//                 post_description: "TCS just posted its Q2 FY26 numbers:\n\nRevenue: ₹65,799 crore (+2.4% YoY)\n\nNet Profit: ₹12,075 crore (+1.4% YoY, –5.4% QoQ)\n\nExceptional item: ₹1,135 crore restructuring cost\n\nMargin: 25.2% (expanded QoQ)\n\nTCV: $10 billion 💼\n\n📌 Revenue was in line, but profit missed estimates. Still, deal wins and AI/cloud bets support long-term growth.\n\nWhat do you all think? Buy on dips or wait?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o23vtn/tcs_q2_results_analysis_profit_misses_whats_next/",
//                 post_upvotes: 47,
//                 post_downvotes: 0,
//                 post_score: 47,
//                 post_upvote_ratio: 0.95,
//                 post_images: [],
//                 author: "Objective-Letter-665",
//                 author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760010864.0,
//                 created_datetime: "2025-10-09T17:24:24",
//                 num_comments: 49,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nikybuk",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760010865.0,
//                       comment_created_datetime: "2025-10-09T17:24:25",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     },
//                     {
//                       comment_id: "nikz5gw",
//                       comment_body: "Honestly, its absurd to me that the stock is trading at 23 P/E levels while revenue and profits have been largely flat for the last 3 quarters, what other signals does the market need to see that the days of IT service industry are over? I guess it takes time for a large company to go down, but go down it will.",
//                       comment_author: "bm_mane8",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png",
//                       comment_score: 26,
//                       comment_upvotes: 26,
//                       comment_created_utc: 1760011207.0,
//                       comment_created_datetime: "2025-10-09T17:30:07",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     }
//                   ]
//                 }
//               }
//             ]
//           },
//           new: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1on8x7n",
//                 post_title: "From Nasdaq to NSE: Cognizant's homecoming",
//                 post_description: "Source : [Mint](https://www.livemint.com/companies/cognizant-india-listing-initial-public-offering-ipo-plans-stock-exchange-11761749243226.html)\n\nCognizant might finally be coming home.\n\nThe US-based IT giant with over two-thirds of its workforce in India is exploring a listing on Indian stock exchanges, either a full-fledged IPO or a secondary listing of its US shares. Why now? Because the math is too tempting to ignore.\n\nDespite pulling in nearly $20 billion in annual revenue, Cognizant's stock trades at just 13x earnings on the Nasdaq. Compare that to Indian peers like Infosys, TCS, or HCLTech  comfortably sitting above 22x. A domestic listing could help bridge that gap, tap into India's premium valuations, and give the company a long-overdue emotional and financial reconnect with the Indian market.\n\nCFO Jatin Dalal confirmed they're still in the early stages gauging market sentiment, regulatory pathways, and timing. But if it happens, Cognizant could become India's second-largest IT services listing after TCS.\n\nThis move isn't just about valuation. It's symbolic. It acknowledges that India isn't just Cognizant's talent pool  it's the engine.\n\nWould you see this as a strategic homecoming or just a valuation play?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1on8x7n/from_nasdaq_to_nse_cognizants_homecoming/",
//                 post_upvotes: 66,
//                 post_downvotes: 0,
//                 post_score: 66,
//                 post_upvote_ratio: 0.93,
//                 post_images: [
//                   "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377"
//                 ],
//                 author: "HODL_buddy",
//                 author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1762168114.0,
//                 created_datetime: "2025-11-03T16:38:34",
//                 num_comments: 7,
//                 is_nsfw: false,
//                 link_flair_text: "Discussion",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nmuzuy8",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1762168116.0,
//                       comment_created_datetime: "2025-11-03T16:38:36",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     },
//                     {
//                       comment_id: "nmv8pcd",
//                       comment_body: "LG was a  lucrative homecoming!\nIt's 2025.\nEvery company in the world is Indian!",
//                       comment_author: "WinOverall4447",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
//                       comment_score: 28,
//                       comment_upvotes: 28,
//                       comment_created_utc: 1762172382.0,
//                       comment_created_datetime: "2025-11-03T17:49:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     }
//                   ]
//                 }
//               }
//             ]
//           }
//         }
//       },
//       IndianStocks: {
//         subreddit_name: "IndianStocks",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//               {
//                 post_id: "1oj8xa3",
//                 post_title: "TCS to get a big boost ?",
//                 post_description: "Morning star on weekly time frame support and a bullish divergence.",
//                 post_url: "https://reddit.com/r/IndianStocks/comments/1oj8xa3/tcs_to_get_a_big_boost/",
//                 post_upvotes: 14,
//                 post_downvotes: 0,
//                 post_score: 14,
//                 post_upvote_ratio: 0.79,
//                 post_images: [
//                   "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c"
//                 ],
//                 author: "AltF4Existence",
//                 author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c",
//                 subreddit: "IndianStocks",
//                 created_utc: 1761754713.0,
//                 created_datetime: "2025-10-29T21:48:33",
//                 num_comments: 23,
//                 is_nsfw: false,
//                 link_flair_text: "Chart",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nm2c7vp",
//                       comment_body: "4 year back in bought and i am currently at 0% profit",
//                       comment_author: "jton27662",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png",
//                       comment_score: 8,
//                       comment_upvotes: 8,
//                       comment_created_utc: 1761766817.0,
//                       comment_created_datetime: "2025-10-30T01:10:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     },
//                     {
//                       comment_id: "nm18sm7",
//                       comment_body: "But no positive news in sight for TCS. Only negative news everywhere",
//                       comment_author: "_kingFatso",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
//                       comment_score: 9,
//                       comment_upvotes: 9,
//                       comment_created_utc: 1761755717.0,
//                       comment_created_datetime: "2025-10-29T22:05:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     }
//                   ]
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//   };

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));

//     if (!expandedComments[commentId]) {
//       setSubCommentFilters(prev => ({
//         ...prev,
//         [commentId]: {
//           timeFilter: 'All Time',
//           sortFilter: 'Top',
//           showTimeDropdown: false,
//           showSortDropdown: false
//         }
//       }));
//     }
//   };

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const showInteractivePopup = (action) => {
//     const messages = {
//       like: "Engagement features are for demonstration purposes in this prototype.",
//       dislike: "Engagement features are for demonstration purposes in this prototype.",
//       share: "Sharing functionality will be available in the full version.",
//       comment: "Commenting features are interactive demonstrations."
//     };

//     setShowPopup({
//       visible: true,
//       message: messages[action] || "Interactive feature demonstration"
//     });

//     setTimeout(() => {
//       setShowPopup({ visible: false, message: '' });
//     }, 3000);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   // Function to format timestamp to relative time
//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//     return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//   };

//   // Function to get profile picture URL
//   const getProfilePicture = (userData, size = 40) => {
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
    
//     if (profileUrl) {
//       return profileUrl;
//     }
    
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Calculate time filter boundaries
//   const getTimeFilterBoundary = () => {
//     const now = new Date();
//     switch (timeFilter) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const getSubCommentTimeFilterBoundary = (timeFilterValue) => {
//     const now = new Date();
//     switch (timeFilterValue) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const updateSubCommentFilter = (commentId, filterType, value) => {
//     setSubCommentFilters(prev => ({
//       ...prev,
//       [commentId]: {
//         ...prev[commentId],
//         [filterType]: value
//       }
//     }));
//   };

//   // Process data
//   const processRedditData = () => {
//     const allPosts = [];
    
//     // Process IndianStockMarket subreddit
//     const ismData = redditData.subreddits.IndianStockMarket;
//     Object.values(ismData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           subredditName: ismData.subreddit_name,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     // Process IndianStocks subreddit
//     const isData = redditData.subreddits.IndianStocks;
//     Object.values(isData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           subredditName: isData.subreddit_name,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     return allPosts;
//   };

//   // Filter and sort sub-comments
//   const getFilteredAndSortedSubComments = (subComments, commentId) => {
//     const filters = subCommentFilters[commentId];
//     if (!filters) return subComments;

//     const timeBoundary = getSubCommentTimeFilterBoundary(filters.timeFilter);
    
//     let filteredSubComments = subComments.filter(comment => 
//       comment.actualTimestamp >= timeBoundary
//     );

//     switch (filters.sortFilter) {
//       case 'Recent':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredSubComments.sort((a, b) => {
//           const aEngagement = a.likes + (a.comment?.length || 0);
//           const bEngagement = b.likes + (b.comment?.length || 0);
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredSubComments.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
//         break;
//       case 'New':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredSubComments.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//     }

//     return filteredSubComments;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = getTimeFilterBoundary();

//     let filteredPosts = allPosts.filter(post => 
//       post.actualTimestamp >= timeBoundary
//     );

//     switch (sortFilter) {
//       case 'Recent':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => {
//           const aEngagement = a.totalComments + a.likes;
//           const bEngagement = b.totalComments + b.likes;
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [timeFilter, sortFilter]);

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Filter Section */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                     className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                   >
//                     <span>{timeFilter}</span>
//                     <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showTimeDropdown && (
//                     <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                       {timeOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setTimeFilter(option.value);
//                             setShowTimeDropdown(false);
//                           }}
//                           className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                             timeFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowSortDropdown(!showSortDropdown)}
//                     className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                   >
//                     <span>{sortFilter}</span>
//                     <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showSortDropdown && (
//                     <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                       {sortOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setSortFilter(option.value);
//                             setShowSortDropdown(false);
//                           }}
//                           className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                             sortFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//               <Eye className="w-3 h-3" />
//               <span>Showing {filteredAndSortedPosts.length} discussions</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Posts Section */}
//       <div className="space-y-4">
//         {filteredAndSortedPosts.length > 0 ? (
//           filteredAndSortedPosts.map((comment) => (
//             <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
              
//               {/* Post Header */}
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0">
//                   <img
//                     src={comment.userAvatar}
//                     alt={comment.userName}
//                     className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
//                     onError={(e) => {
//                       e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                     }}
//                   />
//                 </div>
                
//                 <div className="flex-1 min-w-0 pt-1">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.userName}</span>
//                     <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                       <div className="flex items-center space-x-1">
//                         <Clock className="w-3 h-3" />
//                         <span>{comment.timestamp}</span>
//                       </div>
//                       {/* Subreddit Badge */}
//                       <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                         <Hash className="w-3 h-3" />
//                         <span className="text-xs font-medium">r/{comment.subredditName}</span>
//                       </div>
//                       {comment.isRecent && (
//                         <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                           Recent
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Post Content */}
//                   <h3 className="text-sm  text-gray-900 dark:text-white mb-2 pt-1 leading-tight">
//                     {comment.title}
//                   </h3>
                  
//                   <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                     {comment.comment}
//                   </p>
                  
//                   {/* Engagement Metrics */}
//                   <div className="flex items-center space-x-4">
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
//                       onClick={() => showInteractivePopup('like')}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                         <ThumbsUp className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.likes}</span>
//                     </button>
                    
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
//                       onClick={() => showInteractivePopup('dislike')}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                         <ThumbsDown className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.dislikes}</span>
//                     </button>
                    
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                       onClick={() => {
//                         toggleCommentExpansion(comment.id);
//                         showInteractivePopup('comment');
//                       }}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                         <MessageCircle className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.subComments.length}</span>
//                     </button>
                    
//                     <a 
//                       href={comment.postUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                         <ExternalLink className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">Source</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Comments Section */}
//               {expandedComments[comment.id] && comment.subComments.length > 0 && (
//                 <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                   {/* Sub-comment Filters */}
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Filter:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showTimeDropdown', !subCommentFilters[comment.id]?.showTimeDropdown)}
//                           className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[90px] justify-between"
//                         >
//                           <span>{subCommentFilters[comment.id]?.timeFilter || 'All Time'}</span>
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showTimeDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showTimeDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                             {timeOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'timeFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showTimeDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                   subCommentFilters[comment.id]?.timeFilter === option.value 
//                                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Sort:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showSortDropdown', !subCommentFilters[comment.id]?.showSortDropdown)}
//                           className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[100px] justify-between"
//                         >
//                           <span>{subCommentFilters[comment.id]?.sortFilter || 'Top'}</span>
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showSortDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showSortDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                             {sortOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'sortFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showSortDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                   subCommentFilters[comment.id]?.sortFilter === option.value 
//                                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                       {getFilteredAndSortedSubComments(comment.subComments, comment.id).length} comments
//                     </div>
//                   </div>

//                   {/* Comments List */}
//                   <div className="space-y-3">
//                     {getFilteredAndSortedSubComments(comment.subComments, comment.id).map((subComment) => (
//                       <div key={subComment.id} className="flex items-start space-x-2">
//                         <div className="flex-shrink-0">
//                           <img
//                             src={subComment.userAvatar}
//                             alt={subComment.userName}
//                             className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
//                             onError={(e) => {
//                               e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                             }}
//                           />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-2 mb-1">
//                             <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                             <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
//                               <Clock className="w-2 h-2" />
//                               <span>{subComment.timestamp}</span>
//                             </div>
//                           </div>
                          
//                           <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                             {subComment.comment}
//                           </p>
                          
//                           <div className="flex items-center space-x-3">
//                             <button 
//                               className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs"
//                               onClick={() => showInteractivePopup('like')}
//                             >
//                               <ThumbsUp className="w-3 h-3" />
//                               <span>{subComment.likes}</span>
//                             </button>
//                             <button 
//                               className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs"
//                               onClick={() => showInteractivePopup('dislike')}
//                             >
//                               <ThumbsDown className="w-3 h-3" />
                              
//                             </button>
//                             {/* <button 
//                               className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors text-xs"
//                               onClick={() => showInteractivePopup('comment')}
//                             >
//                               Reply
//                             </button> */}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Eye className="w-5 h-5 text-gray-400" />
//             </div>
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm">Try adjusting your filters to see more content.</p>
//           </div>
//         )}
//       </div>

//       {/* Interactive Popup */}
//       {showPopup.visible && (
//         <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 max-w-xs animate-fade-in">
//           <p className="text-xs">{showPopup.message}</p>
//         </div>
//       )}

//       {/* Enhanced Disclaimer Section */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
//                 <IoWarning className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//               <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 italic">
//                 Interactive features are for demonstration purposes.
//               </p>
//             </div>
//             <button 
//               onClick={toggleDisclaimer}
//               className="flex-shrink-0 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={toggleDisclaimer}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;


// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, TrendingUp, Users, BarChart3, Filter, ChevronRight } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [expandedTexts, setExpandedTexts] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [subCommentFilters, setSubCommentFilters] = useState({});
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '' });

//   // Your existing redditData object remains the same...
//   const redditData = {
//     // ... your existing reddit data structure
//     keyword: "TCS",
//     timeframe: "1_month",
//     scrape_timestamp: "2025-11-05T12:51:32.464327",
//     subreddits: {
//       IndianStockMarket: {
//         subreddit_name: "IndianStockMarket",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//  {
//                 post_id: "1o8753k",
//                 post_title: "At current price, TCS is one of the top picks in large cap",
//                 post_description: "On almost all parameters, TCS is showing tremendous value. Other than the US tariff issue and the H-1B visa related issues, not much seems to be wrong for a solid large cap pick.",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o8753k/at_current_price_tcs_is_one_of_the_top_picks_in/",
//                 post_upvotes: 102,
//                 post_downvotes: 0,
//                 post_score: 102,
//                 post_upvote_ratio: 0.9,
//                 post_images: [
//                   "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc"
//                 ],
//                 author: "sandyk212",
//                 author_profile: "https://preview.redd.it/jx8zif19ehvf1.jpeg?auto=webp&s=d5b97ea64ad7083325d7422dd1c3c43b72a222fc",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760623721.0,
//                 created_datetime: "2025-10-16T19:38:41",
//                 num_comments: 54,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "njsqv7h",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760623722.0,
//                       comment_created_datetime: "2025-10-16T19:38:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njtmbga",
//                       comment_body: "also good dividends at this price note that !",
//                       comment_author: "Shotgun_Philosopher",
//                       comment_author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c",
//                       comment_score: 50,
//                       comment_upvotes: 50,
//                       comment_created_utc: 1760633168.0,
//                       comment_created_datetime: "2025-10-16T22:16:08",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     },
//                     {
//                       comment_id: "njts6zw",
//                       comment_body: "But the overall landscape/sector is not doing well. The general outlook is bad. Unless something changes broadly.",
//                       comment_author: "Healthy-Inspection20",
//                       comment_author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377",
//                       comment_score: 51,
//                       comment_upvotes: 51,
//                       comment_created_utc: 1760634871.0,
//                       comment_created_datetime: "2025-10-16T22:44:31",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o8753k"
//                     }
//                   ]
//                 }
//               },
//               {
//                 post_id: "1o23vtn",
//                 post_title: "TCS Q2 Results Analysis – Profit Misses, What's Next for the Stock?",
//                 post_description: "TCS just posted its Q2 FY26 numbers:\n\nRevenue: ₹65,799 crore (+2.4% YoY)\n\nNet Profit: ₹12,075 crore (+1.4% YoY, –5.4% QoQ)\n\nExceptional item: ₹1,135 crore restructuring cost\n\nMargin: 25.2% (expanded QoQ)\n\nTCV: $10 billion 💼\n\n📌 Revenue was in line, but profit missed estimates. Still, deal wins and AI/cloud bets support long-term growth.\n\nWhat do you all think? Buy on dips or wait?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1o23vtn/tcs_q2_results_analysis_profit_misses_whats_next/",
//                 post_upvotes: 47,
//                 post_downvotes: 0,
//                 post_score: 47,
//                 post_upvote_ratio: 0.95,
//                 post_images: [],
//                 author: "Objective-Letter-665",
//                 author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_4.png",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1760010864.0,
//                 created_datetime: "2025-10-09T17:24:24",
//                 num_comments: 49,
//                 is_nsfw: false,
//                 link_flair_text: null,
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nikybuk",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1760010865.0,
//                       comment_created_datetime: "2025-10-09T17:24:25",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     },
//                     {
//                       comment_id: "nikz5gw",
//                       comment_body: "Honestly, its absurd to me that the stock is trading at 23 P/E levels while revenue and profits have been largely flat for the last 3 quarters, what other signals does the market need to see that the days of IT service industry are over? I guess it takes time for a large company to go down, but go down it will.",
//                       comment_author: "bm_mane8",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_7.png",
//                       comment_score: 26,
//                       comment_upvotes: 26,
//                       comment_created_utc: 1760011207.0,
//                       comment_created_datetime: "2025-10-09T17:30:07",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1o23vtn"
//                     }
//                   ]
//                 }
//               }
//    ]
//           },
//           new: {
//             post_count: 5,
//             posts: [
//         {
//                 post_id: "1on8x7n",
//                 post_title: "From Nasdaq to NSE: Cognizant's homecoming",
//                 post_description: "Source : [Mint](https://www.livemint.com/companies/cognizant-india-listing-initial-public-offering-ipo-plans-stock-exchange-11761749243226.html)\n\nCognizant might finally be coming home.\n\nThe US-based IT giant with over two-thirds of its workforce in India is exploring a listing on Indian stock exchanges, either a full-fledged IPO or a secondary listing of its US shares. Why now? Because the math is too tempting to ignore.\n\nDespite pulling in nearly $20 billion in annual revenue, Cognizant's stock trades at just 13x earnings on the Nasdaq. Compare that to Indian peers like Infosys, TCS, or HCLTech  comfortably sitting above 22x. A domestic listing could help bridge that gap, tap into India's premium valuations, and give the company a long-overdue emotional and financial reconnect with the Indian market.\n\nCFO Jatin Dalal confirmed they're still in the early stages gauging market sentiment, regulatory pathways, and timing. But if it happens, Cognizant could become India's second-largest IT services listing after TCS.\n\nThis move isn't just about valuation. It's symbolic. It acknowledges that India isn't just Cognizant's talent pool  it's the engine.\n\nWould you see this as a strategic homecoming or just a valuation play?",
//                 post_url: "https://reddit.com/r/IndianStockMarket/comments/1on8x7n/from_nasdaq_to_nse_cognizants_homecoming/",
//                 post_upvotes: 66,
//                 post_downvotes: 0,
//                 post_score: 66,
//                 post_upvote_ratio: 0.93,
//                 post_images: [
//                   "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377"
//                 ],
//                 author: "HODL_buddy",
//                 author_profile: "https://preview.redd.it/sxrgmlwiy0zf1.jpeg?auto=webp&s=c0ecda4daa635c3ceeff1dbf8a51b97444b4f377",
//                 subreddit: "IndianStockMarket",
//                 created_utc: 1762168114.0,
//                 created_datetime: "2025-11-03T16:38:34",
//                 num_comments: 7,
//                 is_nsfw: false,
//                 link_flair_text: "Discussion",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nmuzuy8",
//                       comment_body: "\nGeneral Guidelines - Buy/Sell, one-liner and Portfolio review posts will be removed.\n\nPlease refer to the [FAQ](https://www.reddit.com/r/IndianStockMarket/wiki/index/) where most common questions have already been answered. Join our Discord server using [Link 1](https://discord.com/invite/fDRj8mA66U) \n\n\n*I am a bot, and this action was performed automatically. Please [contact the moderators of this subreddit](/message/compose/?to=/r/IndianStockMarket) if you have any questions or concerns.*",
//                       comment_author: "AutoModerator",
//                       comment_author_profile: "https://styles.redditmedia.com/t5_2qjpg/styles/communityIcon_5r4l8w9p6yz61.png",
//                       comment_score: 1,
//                       comment_upvotes: 1,
//                       comment_created_utc: 1762168116.0,
//                       comment_created_datetime: "2025-11-03T16:38:36",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     },
//                     {
//                       comment_id: "nmv8pcd",
//                       comment_body: "LG was a  lucrative homecoming!\nIt's 2025.\nEvery company in the world is Indian!",
//                       comment_author: "WinOverall4447",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
//                       comment_score: 28,
//                       comment_upvotes: 28,
//                       comment_created_utc: 1762172382.0,
//                       comment_created_datetime: "2025-11-03T17:49:42",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1on8x7n"
//                     }
//                   ]
//                 }
//               }        ]
//           }
//         }
//       },
//       IndianStocks: {
//         subreddit_name: "IndianStocks",
//         categories: {
//           controversial: {
//             post_count: 5,
//             posts: [
//        {
//                 post_id: "1oj8xa3",
//                 post_title: "TCS to get a big boost ?",
//                 post_description: "Morning star on weekly time frame support and a bullish divergence.",
//                 post_url: "https://reddit.com/r/IndianStocks/comments/1oj8xa3/tcs_to_get_a_big_boost/",
//                 post_upvotes: 14,
//                 post_downvotes: 0,
//                 post_score: 14,
//                 post_upvote_ratio: 0.79,
//                 post_images: [
//                   "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c"
//                 ],
//                 author: "AltF4Existence",
//                 author_profile: "https://preview.redd.it/mge7d6r9t2yf1.png?auto=webp&s=abab2ffbd1808a2e220615e014fcf2b97667af0c",
//                 subreddit: "IndianStocks",
//                 created_utc: 1761754713.0,
//                 created_datetime: "2025-10-29T21:48:33",
//                 num_comments: 23,
//                 is_nsfw: false,
//                 link_flair_text: "Chart",
//                 comments: {
//                   controversial: [
//                     {
//                       comment_id: "nm2c7vp",
//                       comment_body: "4 year back in bought and i am currently at 0% profit",
//                       comment_author: "jton27662",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_3.png",
//                       comment_score: 8,
//                       comment_upvotes: 8,
//                       comment_created_utc: 1761766817.0,
//                       comment_created_datetime: "2025-10-30T01:10:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     },
//                     {
//                       comment_id: "nm18sm7",
//                       comment_body: "But no positive news in sight for TCS. Only negative news everywhere",
//                       comment_author: "_kingFatso",
//                       comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_5.png",
//                       comment_score: 9,
//                       comment_upvotes: 9,
//                       comment_created_utc: 1761755717.0,
//                       comment_created_datetime: "2025-10-29T22:05:17",
//                       comment_images: [],
//                       is_submitter: false,
//                       parent_id: "t3_1oj8xa3"
//                     }
//                   ]
//                 }
//               }            ]
//           }
//         }
//       }
//     }
//   };

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));

//     if (!expandedComments[commentId]) {
//       setSubCommentFilters(prev => ({
//         ...prev,
//         [commentId]: {
//           timeFilter: 'All Time',
//           sortFilter: 'Top',
//           showTimeDropdown: false,
//           showSortDropdown: false
//         }
//       }));
//     }
//   };

//   const toggleTextExpansion = (textId, isSubComment = false) => {
//     setExpandedTexts(prev => ({
//       ...prev,
//       [textId]: !prev[textId]
//     }));
//   };

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const showInteractivePopup = (action) => {
//     const messages = {
//       like: "Engagement features are for demonstration purposes in this prototype.",
//       dislike: "Engagement features are for demonstration purposes in this prototype.",
//       share: "Sharing functionality will be available in the full version.",
//       comment: "Commenting features are interactive demonstrations."
//     };

//     setShowPopup({
//       visible: true,
//       message: messages[action] || "Interactive feature demonstration"
//     });

//     setTimeout(() => {
//       setShowPopup({ visible: false, message: '' });
//     }, 3000);
//   };

//   // Function to truncate text and add read more
//   const truncateText = (text, maxLength = 300, textId) => {
//     if (!text) return { content: '', isTruncated: false };
    
//     const isExpanded = expandedTexts[textId];
    
//     if (isExpanded || text.length <= maxLength) {
//       return { content: text, isTruncated: false };
//     }
    
//     // Find the last space within maxLength to avoid cutting words
//     const truncated = text.substr(0, maxLength);
//     const lastSpace = truncated.lastIndexOf(' ');
//     const finalText = lastSpace > maxLength * 0.7 ? truncated.substr(0, lastSpace) : truncated;
    
//     return { 
//       content: finalText + '...', 
//       isTruncated: true 
//     };
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   // Function to format timestamp to relative time
//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//     return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//   };

//   // Function to get profile picture URL
//   const getProfilePicture = (userData, size = 40) => {
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
    
//     if (profileUrl) {
//       return profileUrl;
//     }
    
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Calculate time filter boundaries
//   const getTimeFilterBoundary = () => {
//     const now = new Date();
//     switch (timeFilter) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const getSubCommentTimeFilterBoundary = (timeFilterValue) => {
//     const now = new Date();
//     switch (timeFilterValue) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const updateSubCommentFilter = (commentId, filterType, value) => {
//     setSubCommentFilters(prev => ({
//       ...prev,
//       [commentId]: {
//         ...prev[commentId],
//         [filterType]: value
//       }
//     }));
//   };

//   // Process data
//   const processRedditData = () => {
//     const allPosts = [];
    
//     // Process IndianStockMarket subreddit
//     const ismData = redditData.subreddits.IndianStockMarket;
//     Object.values(ismData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           subredditName: ismData.subreddit_name,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     // Process IndianStocks subreddit
//     const isData = redditData.subreddits.IndianStocks;
//     Object.values(isData.categories).forEach(category => {
//       category.posts.forEach(post => {
//         const mainComment = {
//           id: `post_${post.post_id}`,
//           userName: post.author,
//           comment: post.post_description || post.post_title,
//           timestamp: formatRelativeTime(post.created_datetime),
//           actualTimestamp: new Date(post.created_datetime),
//           likes: post.post_upvotes || 0,
//           dislikes: post.post_downvotes || 0,
//           userAvatar: getProfilePicture(post),
//           isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//           subComments: [],
//           postUrl: post.post_url,
//           subreddit: post.subreddit,
//           subredditName: isData.subreddit_name,
//           title: post.post_title,
//           totalComments: post.num_comments || 0,
//           score: post.post_score || 0,
//           upvoteRatio: post.post_upvote_ratio || 0
//         };

//         if (post.comments) {
//           Object.values(post.comments).forEach(commentCategory => {
//             commentCategory.forEach(comment => {
//               if (comment.comment_author !== 'AutoModerator') {
//                 mainComment.subComments.push({
//                   id: comment.comment_id,
//                   userName: comment.comment_author,
//                   comment: comment.comment_body,
//                   timestamp: formatRelativeTime(comment.comment_created_datetime),
//                   actualTimestamp: new Date(comment.comment_created_datetime),
//                   likes: comment.comment_upvotes || 0,
//                   userAvatar: getProfilePicture(comment, 36)
//                 });
//               }
//             });
//           });
//         }

//         allPosts.push(mainComment);
//       });
//     });

//     return allPosts;
//   };

//   // Filter and sort sub-comments
//   const getFilteredAndSortedSubComments = (subComments, commentId) => {
//     const filters = subCommentFilters[commentId];
//     if (!filters) return subComments;

//     const timeBoundary = getSubCommentTimeFilterBoundary(filters.timeFilter);
    
//     let filteredSubComments = subComments.filter(comment => 
//       comment.actualTimestamp >= timeBoundary
//     );

//     switch (filters.sortFilter) {
//       case 'Recent':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredSubComments.sort((a, b) => {
//           const aEngagement = a.likes + (a.comment?.length || 0);
//           const bEngagement = b.likes + (b.comment?.length || 0);
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredSubComments.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
//         break;
//       case 'New':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredSubComments.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//     }

//     return filteredSubComments;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = getTimeFilterBoundary();

//     let filteredPosts = allPosts.filter(post => 
//       post.actualTimestamp >= timeBoundary
//     );

//     switch (sortFilter) {
//       case 'Recent':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => {
//           const aEngagement = a.totalComments + a.likes;
//           const bEngagement = b.totalComments + b.likes;
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [timeFilter, sortFilter]);

//   // Calculate engagement metrics
//   const engagementMetrics = useMemo(() => {
//     const posts = processRedditData();
//     return {
//       totalPosts: posts.length,
//       totalComments: posts.reduce((sum, post) => sum + post.subComments.length, 0),
//       totalEngagement: posts.reduce((sum, post) => sum + post.likes + post.subComments.reduce((commentSum, comment) => commentSum + comment.likes, 0), 0),
//       activeSubreddits: [...new Set(posts.map(post => post.subredditName))].length
//     };
//   }, []);

//   // Read More Button Component
//   const ReadMoreButton = ({ isExpanded, onToggle, textId, className = "" }) => (
//     <button
//       onClick={() => onToggle(textId)}
//       className={`inline-flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200 mt-2 ${className}`}
//     >
//       <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
//       <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
//     </button>
//   );

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Analytics Header */}
//       <div className="mb-8">
//         <div className="flex items-center space-x-3 mb-6">
//           <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
//             <TrendingUp className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               Reddit Sentiment Analysis
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">
//               Community discussions and sentiment for <span className="font-semibold text-blue-600 dark:text-blue-400">{symbol}</span>
//             </p>
//           </div>
//         </div>

//         {/* Engagement Metrics */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
//                 <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementMetrics.totalPosts}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
//                 <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementMetrics.totalComments}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
//                 <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementMetrics.totalEngagement}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
//                 <Hash className="w-5 h-5 text-orange-600 dark:text-orange-400" />
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Communities</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white">{engagementMetrics.activeSubreddits}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Filter Section */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             <div className="flex items-center space-x-2">
//               <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
//               <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">FILTERS</span>
//             </div>
            
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                     className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 min-w-[120px] justify-between shadow-sm"
//                   >
//                     <span>{timeFilter}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showTimeDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 py-1">
//                       {timeOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setTimeFilter(option.value);
//                             setShowTimeDropdown(false);
//                           }}
//                           className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                             timeFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowSortDropdown(!showSortDropdown)}
//                     className="flex items-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 min-w-[140px] justify-between shadow-sm"
//                   >
//                     <span>{sortFilter}</span>
//                     <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSortDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showSortDropdown && (
//                     <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-20 py-1">
//                       {sortOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setSortFilter(option.value);
//                             setShowSortDropdown(false);
//                           }}
//                           className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                             sortFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
//               <Eye className="w-4 h-4" />
//               <span>Showing {filteredAndSortedPosts.length} discussions</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Posts Section with Read More */}
//       <div className="space-y-4">
//         {filteredAndSortedPosts.length > 0 ? (
//           filteredAndSortedPosts.map((comment) => {
//             const mainCommentText = truncateText(comment.comment, 300, `main_${comment.id}`);
            
//             return (
//               <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 group">
                
//                 {/* Post Header */}
//                 <div className="flex items-start space-x-4 mb-4">
//                   <div className="flex-shrink-0">
//                     <img
//                       src={comment.userAvatar}
//                       alt={comment.userName}
//                       className="w-12 h-12 rounded-xl border-2 border-white dark:border-gray-700 shadow-md object-cover group-hover:scale-105 transition-transform duration-200"
//                       onError={(e) => {
//                         e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                       }}
//                     />
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex flex-wrap items-center gap-2 mb-3">
//                       <span className="font-semibold text-gray-900 dark:text-white text-base">{comment.userName}</span>
//                       <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
//                         <Clock className="w-3 h-3" />
//                         <span>{comment.timestamp}</span>
//                       </div>
//                       <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
//                         <Hash className="w-3 h-3" />
//                         <span>r/{comment.subredditName}</span>
//                       </div>
//                       {comment.isRecent && (
//                         <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
//                           New
//                         </span>
//                       )}
//                     </div>

//                     {/* Post Content */}
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
//                       {comment.title}
//                     </h3>
                    
//                     {/* Main Comment with Read More */}
//                     <div className="text-gray-700 dark:text-gray-300 text-base mb-4 leading-relaxed">
//                       <div className="whitespace-pre-line">
//                         {mainCommentText.content}
//                       </div>
//                       {mainCommentText.isTruncated && (
//                         <ReadMoreButton 
//                           isExpanded={expandedTexts[`main_${comment.id}`]} 
//                           onToggle={toggleTextExpansion}
//                           textId={`main_${comment.id}`}
//                         />
//                       )}
//                       {expandedTexts[`main_${comment.id}`] && mainCommentText.isTruncated && (
//                         <ReadMoreButton 
//                           isExpanded={true} 
//                           onToggle={toggleTextExpansion}
//                           textId={`main_${comment.id}`}
//                           className="mt-1"
//                         />
//                       )}
//                     </div>
                    
//                     {/* Enhanced Engagement Metrics */}
//                     <div className="flex items-center space-x-6">
//                       <button 
//                         className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group/btn"
//                         onClick={() => showInteractivePopup('like')}
//                       >
//                         <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover/btn:bg-blue-50 dark:group-hover/btn:bg-blue-900/20 transition-colors">
//                           <ThumbsUp className="w-4 h-4" />
//                         </div>
//                         <span className="text-sm font-semibold">{comment.likes}</span>
//                       </button>
                      
//                       <button 
//                         className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group/btn"
//                         onClick={() => showInteractivePopup('dislike')}
//                       >
//                         <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover/btn:bg-red-50 dark:group-hover/btn:bg-red-900/20 transition-colors">
//                           <ThumbsDown className="w-4 h-4" />
//                         </div>
//                         <span className="text-sm font-semibold">{comment.dislikes}</span>
//                       </button>
                      
//                       <button 
//                         className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group/btn"
//                         onClick={() => {
//                           toggleCommentExpansion(comment.id);
//                           showInteractivePopup('comment');
//                         }}
//                       >
//                         <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover/btn:bg-green-50 dark:group-hover/btn:bg-green-900/20 transition-colors">
//                           <MessageCircle className="w-4 h-4" />
//                         </div>
//                         <span className="text-sm font-semibold">{comment.subComments.length}</span>
//                       </button>
                      
//                       <a 
//                         href={comment.postUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group/btn"
//                       >
//                         <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-700 group-hover/btn:bg-purple-50 dark:group-hover/btn:bg-purple-900/20 transition-colors">
//                           <ExternalLink className="w-4 h-4" />
//                         </div>
//                         <span className="text-sm font-semibold">View Source</span>
//                       </a>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Enhanced Comments Section with Read More */}
//                 {expandedComments[comment.id] && comment.subComments.length > 0 && (
//                   <div className="ml-16 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
//                     {/* Sub-comment Filters */}
//                     <div className="flex flex-wrap items-center gap-4 mb-6">
//                       <div className="flex items-center space-x-3">
//                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Comments:</span>
//                         <div className="flex flex-wrap gap-2">
//                           <div className="relative">
//                             <button
//                               onClick={() => updateSubCommentFilter(comment.id, 'showTimeDropdown', !subCommentFilters[comment.id]?.showTimeDropdown)}
//                               className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[100px] justify-between"
//                             >
//                               <span>{subCommentFilters[comment.id]?.timeFilter || 'All Time'}</span>
//                               <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showTimeDropdown ? 'rotate-180' : ''}`} />
//                             </button>
                            
//                             {subCommentFilters[comment.id]?.showTimeDropdown && (
//                               <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30">
//                                 {timeOptions.map((option) => (
//                                   <button
//                                     key={option.value}
//                                     onClick={() => {
//                                       updateSubCommentFilter(comment.id, 'timeFilter', option.value);
//                                       updateSubCommentFilter(comment.id, 'showTimeDropdown', false);
//                                     }}
//                                     className={`w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                       subCommentFilters[comment.id]?.timeFilter === option.value 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                         : 'text-gray-700 dark:text-gray-300'
//                                     }`}
//                                   >
//                                     {option.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
                          
//                           <div className="relative">
//                             <button
//                               onClick={() => updateSubCommentFilter(comment.id, 'showSortDropdown', !subCommentFilters[comment.id]?.showSortDropdown)}
//                               className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                             >
//                               <span>{subCommentFilters[comment.id]?.sortFilter || 'Top'}</span>
//                               <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showSortDropdown ? 'rotate-180' : ''}`} />
//                             </button>
                            
//                             {subCommentFilters[comment.id]?.showSortDropdown && (
//                               <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30">
//                                 {sortOptions.map((option) => (
//                                   <button
//                                     key={option.value}
//                                     onClick={() => {
//                                       updateSubCommentFilter(comment.id, 'sortFilter', option.value);
//                                       updateSubCommentFilter(comment.id, 'showSortDropdown', false);
//                                     }}
//                                     className={`w-full px-3 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                       subCommentFilters[comment.id]?.sortFilter === option.value 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                         : 'text-gray-700 dark:text-gray-300'
//                                     }`}
//                                   >
//                                     {option.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
                      
//                       <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg">
//                         {getFilteredAndSortedSubComments(comment.subComments, comment.id).length} comments
//                       </div>
//                     </div>

//                     {/* Enhanced Comments List with Read More */}
//                     <div className="space-y-4">
//                       {getFilteredAndSortedSubComments(comment.subComments, comment.id).map((subComment) => {
//                         const subCommentText = truncateText(subComment.comment, 200, `sub_${subComment.id}`);
                        
//                         return (
//                           <div key={subComment.id} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
//                             <div className="flex-shrink-0">
//                               <img
//                                 src={subComment.userAvatar}
//                                 alt={subComment.userName}
//                                 className="w-8 h-8 rounded-lg border border-gray-300 dark:border-gray-600 object-cover"
//                                 onError={(e) => {
//                                   e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                                 }}
//                               />
//                             </div>
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center space-x-3 mb-2">
//                                 <span className="font-semibold text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                                 <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
//                                   <Clock className="w-3 h-3" />
//                                   <span>{subComment.timestamp}</span>
//                                 </div>
//                               </div>
                              
//                               {/* Sub-comment with Read More */}
//                               <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                                 <div className="whitespace-pre-line">
//                                   {subCommentText.content}
//                                 </div>
//                                 {subCommentText.isTruncated && (
//                                   <ReadMoreButton 
//                                     isExpanded={expandedTexts[`sub_${subComment.id}`]} 
//                                     onToggle={toggleTextExpansion}
//                                     textId={`sub_${subComment.id}`}
//                                   />
//                                 )}
//                                 {expandedTexts[`sub_${subComment.id}`] && subCommentText.isTruncated && (
//                                   <ReadMoreButton 
//                                     isExpanded={true} 
//                                     onToggle={toggleTextExpansion}
//                                     textId={`sub_${subComment.id}`}
//                                     className="mt-1"
//                                   />
//                                 )}
//                               </div>
                              
//                               <div className="flex items-center space-x-4">
//                                 <button 
//                                   className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs font-medium"
//                                   onClick={() => showInteractivePopup('like')}
//                                 >
//                                   <ThumbsUp className="w-3 h-3" />
//                                   <span>{subComment.likes}</span>
//                                 </button>
//                                 <button 
//                                   className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs font-medium"
//                                   onClick={() => showInteractivePopup('dislike')}
//                                 >
//                                   <ThumbsDown className="w-3 h-3" />
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
//               <Eye className="w-6 h-6 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No discussions found</h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
//               Try adjusting your filters or explore different time ranges to see community discussions.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Enhanced Interactive Popup */}
//       {showPopup.visible && (
//         <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl z-50 max-w-sm animate-fade-in-up border border-gray-700">
//           <div className="flex items-center space-x-2">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <p className="text-sm font-medium">{showPopup.message}</p>
//           </div>
//         </div>
//       )}

//       {/* Professional Disclaimer Section */}
//       {showDisclaimer ? (
//         <div className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 p-6 shadow-sm">
//           <div className="flex items-start space-x-4">
//             <div className="flex-shrink-0">
//               <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
//                 <IoWarning className="w-6 h-6 text-orange-600 dark:text-orange-400" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-base font-semibold text-orange-800 dark:text-orange-300">
//                   Investment Disclaimer
//                 </h4>
//                 <button 
//                   onClick={toggleDisclaimer}
//                   className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-sm font-semibold px-3 py-1 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30"
//                 >
//                   Dismiss
//                 </button>
//               </div>
//               <p className="text-sm text-orange-700 dark:text-orange-400 leading-relaxed mb-2">
//                 These discussions are sourced from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//               <p className="text-xs text-orange-600 dark:text-orange-500 italic">
//                 Note: Interactive features are for demonstration purposes in this prototype.
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-8 flex justify-center">
//           <button 
//             onClick={toggleDisclaimer}
//             className="flex items-center space-x-2 px-4 py-2.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-xl hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-all duration-200 shadow-sm"
//           >
//             <IoWarning className="w-4 h-4" />
//             <span className="text-sm font-semibold">Show Investment Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;

// import React, { useState, useEffect } from 'react';
// import { Clock, ChevronDown, Eye, MessageCircle, ExternalLink } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   return (
//     <div className="max-w-6xl mx-auto">

//    <div className="bg-white dark:bg-gray-800  dark:border-gray-700 p-24 text-center">
//         <div className="max-w-md mx-auto">
//           <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MessageCircle className="w-8 h-8 text-sky-600 dark:text-sky-400" />
//           </div>
          
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//             Reddit Discussions Coming Soon
//           </h3>
          
//           <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
//             We're working on integrating  Reddit discussions and community sentiment analysis. 
//             This feature will show you what investors are saying about {symbol || 'this stock'} across various subreddits.
//           </p>
          
//           {/* <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
//             <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
//               <div className="flex items-center space-x-1">
//                 <MessageCircle className="w-3 h-3" />
//                 <span>Live Discussions</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <Clock className="w-3 h-3" />
//                 <span>Real-time Updates</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <ExternalLink className="w-3 h-3" />
//                 <span>Source Links</span>
//               </div>
//             </div>
//           </div> */}
// {/*           
//           <p className="text-xs text-gray-500 dark:text-gray-400 italic">
//             Expected launch: Q1 2024 • Stay tuned for updates!
//           </p> */}
//         </div>
//       </div>



      
//     </div>
//   );
// }

// export default Review;


// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [subCommentFilters, setSubCommentFilters] = useState({});
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '' });
//   const [redditData, setRedditData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   // API integration
//   const fetchRedditData = async () => {
//     if (!symbol) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Convert time filter to API timeframe format
//       const timeframeMap = {
//         '1 Week': '1_week',
//         '1 Month': '1_month',
//         '3 Months': '3_months',
//         '6 Months': '6_months',
//         '1 Year': '1_year',
//         'All Time': 'all_time'
//       };
      
//       const timeframe = timeframeMap[timeFilter] || '1_month';
//       const apiUrl = `http://127.0.0.1:3000/reddit_scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
//       console.log('Fetching from:', apiUrl);
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         throw new Error(`API request failed with status ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('API response received:', result);
      
//       // Extract data from the nested structure
//       if (result.status === 'success' && result.data) {
//         setRedditData(result.data);
//       } else {
//         throw new Error('Invalid API response structure');
//       }
      
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching Reddit data:', err);
//       setError(err.message);
      
//       // Fallback to sample data structure
//       const fallbackData = getFallbackData(symbol);
//       setRedditData(fallbackData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fallback data when API fails
//   const getFallbackData = (symbol) => {
//     return {
//       keyword: symbol,
//       timeframe: "1_month",
//       scrape_timestamp: new Date().toISOString(),
//       subreddits: {
//         IndianStockMarket: {
//           subreddit_name: "IndianStockMarket",
//           categories: {
//             controversial: {
//               post_count: 2,
//               posts: [
//                 {
//                   post_id: "fallback_1",
//                   post_title: `${symbol} Discussion - Sample Data`,
//                   post_description: `This is sample data showing how ${symbol} discussions would appear. The API server appears to be unavailable. Please ensure the server is running at http://127.0.0.1:3000`,
//                   post_url: "#",
//                   post_upvotes: 15,
//                   post_downvotes: 2,
//                   post_score: 13,
//                   post_upvote_ratio: 0.88,
//                   post_images: [],
//                   author: "sample_user",
//                   author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png",
//                   subreddit: "IndianStockMarket",
//                   created_utc: Date.now() / 1000 - 86400, // 1 day ago
//                   created_datetime: new Date(Date.now() - 86400000).toISOString(),
//                   num_comments: 3,
//                   is_nsfw: false,
//                   link_flair_text: null,
//                   comments: {
//                     controversial: [
//                       {
//                         comment_id: "fallback_comment_1",
//                         comment_body: "This is a sample comment. The Reddit API server needs to be running to fetch real data.",
//                         comment_author: "commenter_1",
//                         comment_author_profile: "https://www.redditstatic.com/avatars/defaults/v2/avatar_default_2.png",
//                         comment_score: 8,
//                         comment_upvotes: 8,
//                         comment_created_utc: Date.now() / 1000 - 43200, // 12 hours ago
//                         comment_created_datetime: new Date(Date.now() - 43200000).toISOString(),
//                         comment_images: [],
//                         is_submitter: false,
//                         parent_id: "t3_fallback_1"
//                       }
//                     ]
//                   }
//                 }
//               ]
//             }
//           }
//         }
//       }
//     };
//   };

//   useEffect(() => {
//     fetchRedditData();
//   }, [symbol, timeFilter, retryCount]);

//   const handleRetry = () => {
//     setRetryCount(prev => prev + 1);
//   };

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));

//     if (!expandedComments[commentId]) {
//       setSubCommentFilters(prev => ({
//         ...prev,
//         [commentId]: {
//           timeFilter: 'All Time',
//           sortFilter: 'Top',
//           showTimeDropdown: false,
//           showSortDropdown: false
//         }
//       }));
//     }
//   };

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const showInteractivePopup = (action) => {
//     const messages = {
//       like: "Engagement features are for demonstration purposes in this prototype.",
//       dislike: "Engagement features are for demonstration purposes in this prototype.",
//       share: "Sharing functionality will be available in the full version.",
//       comment: "Commenting features are interactive demonstrations."
//     };

//     setShowPopup({
//       visible: true,
//       message: messages[action] || "Interactive feature demonstration"
//     });

//     setTimeout(() => {
//       setShowPopup({ visible: false, message: '' });
//     }, 3000);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   // Function to format timestamp to relative time
//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//     return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//   };

//   // Function to get profile picture URL
//   const getProfilePicture = (userData, size = 40) => {
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
    
//     if (profileUrl && profileUrl.includes('redditstatic.com')) {
//       return profileUrl;
//     }
    
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Calculate time filter boundaries
//   const getTimeFilterBoundary = () => {
//     const now = new Date();
//     switch (timeFilter) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const getSubCommentTimeFilterBoundary = (timeFilterValue) => {
//     const now = new Date();
//     switch (timeFilterValue) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const updateSubCommentFilter = (commentId, filterType, value) => {
//     setSubCommentFilters(prev => ({
//       ...prev,
//       [commentId]: {
//         ...prev[commentId],
//         [filterType]: value
//       }
//     }));
//   };

//   // Process data from API - FIXED to handle the nested structure
//   const processRedditData = () => {
//     if (!redditData || !redditData.subreddits) {
//       console.log('No reddit data available:', redditData);
//       return [];
//     }
    
//     const allPosts = [];
    
//     // Process each subreddit
//     Object.values(redditData.subreddits).forEach(subredditData => {
//       console.log('Processing subreddit:', subredditData.subreddit_name);
      
//       Object.values(subredditData.categories || {}).forEach(category => {
//         console.log('Processing category with posts:', category.posts?.length || 0);
        
//         (category.posts || []).forEach(post => {
//           console.log('Processing post:', post.post_title);
          
//           const mainComment = {
//             id: `post_${post.post_id}`,
//             userName: post.author,
//             comment: post.post_description || post.post_title,
//             timestamp: formatRelativeTime(post.created_datetime),
//             actualTimestamp: new Date(post.created_datetime),
//             likes: post.post_upvotes || 0,
//             dislikes: post.post_downvotes || 0,
//             userAvatar: getProfilePicture(post),
//             isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//             subComments: [],
//             postUrl: post.post_url,
//             subreddit: post.subreddit,
//             subredditName: subredditData.subreddit_name,
//             title: post.post_title,
//             totalComments: post.num_comments || 0,
//             score: post.post_score || 0,
//             upvoteRatio: post.post_upvote_ratio || 0
//           };

//           // Process comments
//           if (post.comments) {
//             Object.values(post.comments).forEach(commentCategory => {
//               (commentCategory || []).forEach(comment => {
//                 if (comment.comment_author !== 'AutoModerator') {
//                   mainComment.subComments.push({
//                     id: comment.comment_id,
//                     userName: comment.comment_author,
//                     comment: comment.comment_body,
//                     timestamp: formatRelativeTime(comment.comment_created_datetime),
//                     actualTimestamp: new Date(comment.comment_created_datetime),
//                     likes: comment.comment_upvotes || 0,
//                     userAvatar: getProfilePicture(comment, 36)
//                   });
//                 }
//               });
//             });
//           }

//           allPosts.push(mainComment);
//         });
//       });
//     });

//     console.log('Total posts processed:', allPosts.length);
//     return allPosts;
//   };

//   // Filter and sort sub-comments
//   const getFilteredAndSortedSubComments = (subComments, commentId) => {
//     const filters = subCommentFilters[commentId];
//     if (!filters) return subComments;

//     const timeBoundary = getSubCommentTimeFilterBoundary(filters.timeFilter);
    
//     let filteredSubComments = subComments.filter(comment => 
//       comment.actualTimestamp >= timeBoundary
//     );

//     switch (filters.sortFilter) {
//       case 'Recent':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredSubComments.sort((a, b) => {
//           const aEngagement = a.likes + (a.comment?.length || 0);
//           const bEngagement = b.likes + (b.comment?.length || 0);
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredSubComments.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
//         break;
//       case 'New':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredSubComments.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//     }

//     return filteredSubComments;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = getTimeFilterBoundary();

//     let filteredPosts = allPosts.filter(post => 
//       post.actualTimestamp >= timeBoundary
//     );

//     switch (sortFilter) {
//       case 'Recent':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => {
//           const aEngagement = a.totalComments + a.likes;
//           const bEngagement = b.totalComments + b.likes;
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [redditData, timeFilter, sortFilter]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Header with search info and retry button */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Reddit Discussions for {symbol}
//               </h2>
//               {redditData && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Data scraped {formatRelativeTime(redditData.scrape_timestamp)}
//                   {error && <span className="ml-2 text-amber-600">• Using fallback data</span>}
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center space-x-3">
//               {error && (
//                 <button
//                   onClick={handleRetry}
//                   className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   <span>Retry API</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Banner */}
//       {error && (
//         <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
//           <div className="flex items-start space-x-3">
//             <IoWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
//                 API Connection Issue
//               </h4>
//               <p className="text-sm text-amber-700 dark:text-amber-400">
//                 {error}. Using sample data. Please ensure the API server is running at <code className="bg-amber-100 dark:bg-amber-900/30 px-1 rounded">http://127.0.0.1:3000</code>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Debug Info - Remove in production */}
//       {redditData && (
//         <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
//           <strong>Debug Info:</strong> Found {Object.keys(redditData.subreddits || {}).length} subreddits, {filteredAndSortedPosts.length} posts
//         </div>
//       )}

//       {/* Rest of your component remains the same */}
//       {/* Filter Section */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                     className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                   >
//                     <span>{timeFilter}</span>
//                     <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showTimeDropdown && (
//                     <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                       {timeOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setTimeFilter(option.value);
//                             setShowTimeDropdown(false);
//                           }}
//                           className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                             timeFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowSortDropdown(!showSortDropdown)}
//                     className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                   >
//                     <span>{sortFilter}</span>
//                     <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                   </button>
                  
//                   {showSortDropdown && (
//                     <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                       {sortOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setSortFilter(option.value);
//                             setShowSortDropdown(false);
//                           }}
//                           className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                             sortFilter === option.value 
//                               ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                               : 'text-gray-700 dark:text-gray-300'
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//               <Eye className="w-3 h-3" />
//               <span>Showing {filteredAndSortedPosts.length} discussions</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Posts Section */}
//       <div className="space-y-4">
//         {filteredAndSortedPosts.length > 0 ? (
//           filteredAndSortedPosts.map((comment) => (
//             <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
              
//               {/* Post Header */}
//               <div className="flex items-start space-x-3">
//                 <div className="flex-shrink-0">
//                   <img
//                     src={comment.userAvatar}
//                     alt={comment.userName}
//                     className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
//                     onError={(e) => {
//                       e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                     }}
//                   />
//                 </div>
                
//                 <div className="flex-1 min-w-0 pt-1">
//                   <div className="flex items-center space-x-2 mb-2">
//                     <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.userName}</span>
//                     <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                       <div className="flex items-center space-x-1">
//                         <Clock className="w-3 h-3" />
//                         <span>{comment.timestamp}</span>
//                       </div>
//                       {/* Subreddit Badge */}
//                       <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                         <Hash className="w-3 h-3" />
//                         <span className="text-xs font-medium">r/{comment.subredditName}</span>
//                       </div>
//                       {comment.isRecent && (
//                         <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                           Recent
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Post Content */}
//                   <h3 className="text-sm  text-gray-900 dark:text-white mb-2 pt-1 leading-tight">
//                     {comment.title}
//                   </h3>
                  
//                   <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                     {comment.comment}
//                   </p>
                  
//                   {/* Engagement Metrics */}
//                   <div className="flex items-center space-x-4">
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
//                       onClick={() => showInteractivePopup('like')}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                         <ThumbsUp className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.likes}</span>
//                     </button>
                    
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
//                       onClick={() => showInteractivePopup('dislike')}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                         <ThumbsDown className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.dislikes}</span>
//                     </button>
                    
//                     <button 
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                       onClick={() => {
//                         toggleCommentExpansion(comment.id);
//                         showInteractivePopup('comment');
//                       }}
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                         <MessageCircle className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">{comment.subComments.length}</span>
//                     </button>
                    
//                     <a 
//                       href={comment.postUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                     >
//                       <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                         <ExternalLink className="w-3 h-3" />
//                       </div>
//                       <span className="text-sm font-medium">Source</span>
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Comments Section */}
//               {expandedComments[comment.id] && comment.subComments.length > 0 && (
//                 <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                   {/* Sub-comment Filters */}
//                   <div className="flex items-center space-x-3 mb-4">
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Filter:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showTimeDropdown', !subCommentFilters[comment.id]?.showTimeDropdown)}
//                           className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[90px] justify-between"
//                         >
//                           <span>{subCommentFilters[comment.id]?.timeFilter || 'All Time'}</span>
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showTimeDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showTimeDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                             {timeOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'timeFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showTimeDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                   subCommentFilters[comment.id]?.timeFilter === option.value 
//                                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Sort:</span>
//                       <div className="relative">
//                         <button
//                           onClick={() => updateSubCommentFilter(comment.id, 'showSortDropdown', !subCommentFilters[comment.id]?.showSortDropdown)}
//                           className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[100px] justify-between"
//                         >
//                           <span>{subCommentFilters[comment.id]?.sortFilter || 'Top'}</span>
//                           <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showSortDropdown ? 'rotate-180' : ''}`} />
//                         </button>
                        
//                         {subCommentFilters[comment.id]?.showSortDropdown && (
//                           <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                             {sortOptions.map((option) => (
//                               <button
//                                 key={option.value}
//                                 onClick={() => {
//                                   updateSubCommentFilter(comment.id, 'sortFilter', option.value);
//                                   updateSubCommentFilter(comment.id, 'showSortDropdown', false);
//                                 }}
//                                 className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                   subCommentFilters[comment.id]?.sortFilter === option.value 
//                                     ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                     : 'text-gray-700 dark:text-gray-300'
//                                 }`}
//                               >
//                                 {option.label}
//                               </button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>
                    
//                     <div className="text-xs text-gray-500 dark:text-gray-400">
//                       {getFilteredAndSortedSubComments(comment.subComments, comment.id).length} comments
//                     </div>
//                   </div>

//                   {/* Comments List */}
//                   <div className="space-y-3">
//                     {getFilteredAndSortedSubComments(comment.subComments, comment.id).map((subComment) => (
//                       <div key={subComment.id} className="flex items-start space-x-2">
//                         <div className="flex-shrink-0">
//                           <img
//                             src={subComment.userAvatar}
//                             alt={subComment.userName}
//                             className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
//                             onError={(e) => {
//                               e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                             }}
//                           />
//                         </div>
                        
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center space-x-2 mb-1">
//                             <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                             <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
//                               <Clock className="w-2 h-2" />
//                               <span>{subComment.timestamp}</span>
//                             </div>
//                           </div>
                          
//                           <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                             {subComment.comment}
//                           </p>
                          
//                           <div className="flex items-center space-x-3">
//                             <button 
//                               className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs"
//                               onClick={() => showInteractivePopup('like')}
//                             >
//                               <ThumbsUp className="w-3 h-3" />
//                               <span>{subComment.likes}</span>
//                             </button>
//                             <button 
//                               className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs"
//                               onClick={() => showInteractivePopup('dislike')}
//                             >
//                               <ThumbsDown className="w-3 h-3" />
                              
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-8">
//             <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//               <Eye className="w-5 h-5 text-gray-400" />
//             </div>
//             <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//             <p className="text-gray-600 dark:text-gray-400 text-sm">
//               {redditData ? 'No Reddit discussions found for this symbol in the selected time range.' : 'Unable to load data.'}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Interactive Popup */}
//       {showPopup.visible && (
//         <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 max-w-xs animate-fade-in">
//           <p className="text-xs">{showPopup.message}</p>
//         </div>
//       )}

//       {/* Enhanced Disclaimer Section */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
//                 <IoWarning className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//               <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 italic">
//                 Interactive features are for demonstration purposes.
//               </p>
//             </div>
//             <button 
//               onClick={toggleDisclaimer}
//               className="flex-shrink-0 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={toggleDisclaimer}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;



// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [subCommentFilters, setSubCommentFilters] = useState({});
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [showPopup, setShowPopup] = useState({ visible: false, message: '' });
//   const [redditData, setRedditData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);

//   // API integration
//   const fetchRedditData = async () => {
//     if (!symbol) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Convert time filter to API timeframe format
//       const timeframeMap = {
//         '1 Week': '1_week',
//         '1 Month': '1_month',
//         '3 Months': '3_months',
//         '6 Months': '6_months',
//         '1 Year': '1_year',
//         'All Time': 'all_time'
//       };
      
//       const timeframe = timeframeMap[timeFilter] || '1_month';
//       const apiUrl = `http://168.231.121.219:8083/api/reddit/scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
//       console.log('Fetching from:', apiUrl);
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//         },
//       });
      
//       if (!response.ok) {
//         // throw new Error(`API request failed with status ${response.status}`);
//       }
      
//       const result = await response.json();
//       console.log('API response received:', result);
      
//       // Extract data from the nested structure
//       if (result.status === 'success' && result.data) {
//         setRedditData(result.data);
//       } else {
//         throw new Error('No data available from API');
//       }
      
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching Reddit data:', err);
//       setError(err.message);
//       setRedditData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRedditData();
//   }, [symbol, timeFilter, retryCount]);

//   const handleRetry = () => {
//     setRetryCount(prev => prev + 1);
//   };

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowDisclaimer(false);
//     }, 20000);

//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));

//     if (!expandedComments[commentId]) {
//       setSubCommentFilters(prev => ({
//         ...prev,
//         [commentId]: {
//           timeFilter: 'All Time',
//           sortFilter: 'Top',
//           showTimeDropdown: false,
//           showSortDropdown: false
//         }
//       }));
//     }
//   };

//   const toggleDisclaimer = () => {
//     setShowDisclaimer(!showDisclaimer);
//   };

//   const showInteractivePopup = (action) => {
//     const messages = {
//       like: "Engagement features are for demonstration purposes in this prototype.",
//       dislike: "Engagement features are for demonstration purposes in this prototype.",
//       share: "Sharing functionality will be available in the full version.",
//       comment: "Commenting features are interactive demonstrations."
//     };

//     setShowPopup({
//       visible: true,
//       message: messages[action] || "Interactive feature demonstration"
//     });

//     setTimeout(() => {
//       setShowPopup({ visible: false, message: '' });
//     }, 3000);
//   };

//   const timeOptions = [
//     { value: '1 Week', label: '1 Week' },
//     { value: '1 Month', label: '1 Month' },
//     { value: '3 Months', label: '3 Months' },
//     { value: '6 Months', label: '6 Months' },
//     { value: '1 Year', label: '1 Year' },
//     { value: 'All Time', label: 'All Time' }
//   ];

//   const sortOptions = [
//     { value: 'Recent', label: 'Most Recent' },
//     { value: 'Top', label: 'Top Voted' },
//     { value: 'Controversial', label: 'Most Controversial' },
//     { value: 'Most Discussed', label: 'Most Discussed' },
//     { value: 'New', label: 'Newest' },
//     { value: 'Old', label: 'Oldest' }
//   ];

//   // Function to format timestamp to relative time
//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//     return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//   };

//   // Function to get profile picture URL
//   const getProfilePicture = (userData, size = 40) => {
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
    
//     if (profileUrl && profileUrl.includes('redditstatic.com')) {
//       return profileUrl;
//     }
    
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Calculate time filter boundaries
//   const getTimeFilterBoundary = () => {
//     const now = new Date();
//     switch (timeFilter) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const getSubCommentTimeFilterBoundary = (timeFilterValue) => {
//     const now = new Date();
//     switch (timeFilterValue) {
//       case '1 Week': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//       case '1 Month': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       case '3 Months': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//       case '6 Months': return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
//       case '1 Year': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
//       case 'All Time':
//       default: return new Date(0);
//     }
//   };

//   const updateSubCommentFilter = (commentId, filterType, value) => {
//     setSubCommentFilters(prev => ({
//       ...prev,
//       [commentId]: {
//         ...prev[commentId],
//         [filterType]: value
//       }
//     }));
//   };

//   // Process data from API - FIXED to handle multiple comment categories
//   const processRedditData = () => {
//     if (!redditData || !redditData.subreddits) {
//       console.log('No reddit data available:', redditData);
//       return [];
//     }
    
//     const allPosts = [];
    
//     // Process each subreddit
//     Object.values(redditData.subreddits).forEach(subredditData => {
//       console.log('Processing subreddit:', subredditData.subreddit_name);
      
//       Object.values(subredditData.categories || {}).forEach(category => {
//         console.log('Processing category with posts:', category.posts?.length || 0);
        
//         (category.posts || []).forEach(post => {
//           console.log('Processing post:', post.post_title);
          
//           const mainComment = {
//             id: `post_${post.post_id}`,
//             userName: post.author,
//             comment: post.post_description || post.post_title,
//             timestamp: formatRelativeTime(post.created_datetime),
//             actualTimestamp: new Date(post.created_datetime),
//             likes: post.post_upvotes || 0,
//             dislikes: post.post_downvotes || 0,
//             userAvatar: getProfilePicture(post),
//             isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//             subComments: [],
//             postUrl: post.post_url,
//             subreddit: post.subreddit,
//             subredditName: subredditData.subreddit_name,
//             title: post.post_title,
//             totalComments: post.num_comments || 0,
//             score: post.post_score || 0,
//             upvoteRatio: post.post_upvote_ratio || 0
//           };

//           // Process comments from ALL categories (new, top, best, controversial, etc.)
//           if (post.comments) {
//             const allComments = [];
            
//             // Collect comments from all categories
//             Object.values(post.comments).forEach(commentCategory => {
//               (commentCategory || []).forEach(comment => {
//                 if (comment.comment_author !== 'AutoModerator') {
//                   allComments.push({
//                     id: comment.comment_id,
//                     userName: comment.comment_author,
//                     comment: comment.comment_body,
//                     timestamp: formatRelativeTime(comment.comment_created_datetime),
//                     actualTimestamp: new Date(comment.comment_created_datetime),
//                     likes: comment.comment_upvotes || 0,
//                     userAvatar: getProfilePicture(comment, 36)
//                   });
//                 }
//               });
//             });

//             // Remove duplicate comments (same comment_id)
//             const uniqueComments = allComments.filter((comment, index, self) => 
//               index === self.findIndex(c => c.id === comment.id)
//             );

//             mainComment.subComments = uniqueComments;
//           }

//           allPosts.push(mainComment);
//         });
//       });
//     });

//     console.log('Total posts processed:', allPosts.length);
//     return allPosts;
//   };

//   // Filter and sort sub-comments
//   const getFilteredAndSortedSubComments = (subComments, commentId) => {
//     const filters = subCommentFilters[commentId];
//     if (!filters) return subComments;

//     const timeBoundary = getSubCommentTimeFilterBoundary(filters.timeFilter);
    
//     let filteredSubComments = subComments.filter(comment => 
//       comment.actualTimestamp >= timeBoundary
//     );

//     switch (filters.sortFilter) {
//       case 'Recent':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredSubComments.sort((a, b) => {
//           const aEngagement = a.likes + (a.comment?.length || 0);
//           const bEngagement = b.likes + (b.comment?.length || 0);
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredSubComments.sort((a, b) => (b.comment?.length || 0) - (a.comment?.length || 0));
//         break;
//       case 'New':
//         filteredSubComments.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredSubComments.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredSubComments.sort((a, b) => b.likes - a.likes);
//     }

//     return filteredSubComments;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = getTimeFilterBoundary();

//     let filteredPosts = allPosts.filter(post => 
//       post.actualTimestamp >= timeBoundary
//     );

//     switch (sortFilter) {
//       case 'Recent':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => {
//           const aEngagement = a.totalComments + a.likes;
//           const bEngagement = b.totalComments + b.likes;
//           return bEngagement - aEngagement;
//         });
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [redditData, timeFilter, sortFilter]);

//   // Loading state
//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Header with search info and retry button */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Reddit Discussions for {symbol}
//               </h2>
//               {redditData && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Data scraped {formatRelativeTime(redditData.scrape_timestamp)}
//                 </p>
//               )}
//             </div>
//             <div className="flex items-center space-x-3">
//               {error && (
//                 <button
//                   onClick={handleRetry}
//                   className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//                 >
//                   <RefreshCw className="w-4 h-4" />
//                   <span>Retry</span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Single Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
//             <IoWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load data</h3>
//           <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
//           <button
//             onClick={handleRetry}
//             className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Retry Loading Data</span>
//           </button>
//         </div>
//       )}

//       {/* Only show content if we have data and no error */}
//       {!error && redditData && (
//         <>
//           {/* Filter Section */}
//           <div className="mb-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex items-center space-x-3">
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                       >
//                         <span>{timeFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showTimeDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {timeOptions.map((option) => (
//                             <button
//                               key={option.value}
//                               onClick={() => {
//                                 setTimeFilter(option.value);
//                                 setShowTimeDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                                 timeFilter === option.value 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option.label}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSortDropdown(!showSortDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                       >
//                         <span>{sortFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showSortDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {sortOptions.map((option) => (
//                             <button
//                               key={option.value}
//                               onClick={() => {
//                                 setSortFilter(option.value);
//                                 setShowSortDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors ${
//                                 sortFilter === option.value 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option.label}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                   <Eye className="w-3 h-3" />
//                   <span>Showing {filteredAndSortedPosts.length} discussions</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Posts Section */}
//           <div className="space-y-4">
//             {filteredAndSortedPosts.length > 0 ? (
//               filteredAndSortedPosts.map((comment) => (
//                 <div key={comment.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  
//                   {/* Post Header */}
//                   <div className="flex items-start space-x-3">
//                     <div className="flex-shrink-0">
//                       <img
//                         src={comment.userAvatar}
//                         alt={comment.userName}
//                         className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
//                         onError={(e) => {
//                           e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                         }}
//                       />
//                     </div>
                    
//                     <div className="flex-1 min-w-0 pt-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.userName}</span>
//                         <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                           <div className="flex items-center space-x-1">
//                             <Clock className="w-3 h-3" />
//                             <span>{comment.timestamp}</span>
//                           </div>
//                           {/* Subreddit Badge */}
//                           <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                             <Hash className="w-3 h-3" />
//                             <span className="text-xs font-medium">r/{comment.subredditName}</span>
//                           </div>
//                           {comment.isRecent && (
//                             <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                               Recent
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Post Content */}
//                       <h3 className="text-sm  text-gray-900 dark:text-white mb-2 pt-1 leading-tight">
//                         {comment.title}
//                       </h3>
                      
//                       <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                         {comment.comment}
//                       </p>
                      
//                       {/* Engagement Metrics */}
//                       <div className="flex items-center space-x-4">
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
//                           onClick={() => showInteractivePopup('like')}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                             <ThumbsUp className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{comment.likes}</span>
//                         </button>
                        
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group"
//                           onClick={() => showInteractivePopup('dislike')}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                             <ThumbsDown className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{comment.dislikes}</span>
//                         </button>
                        
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                           onClick={() => {
//                             toggleCommentExpansion(comment.id);
//                             showInteractivePopup('comment');
//                           }}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                             <MessageCircle className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{comment.subComments.length}</span>
//                         </button>
                        
//                         <a 
//                           href={comment.postUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                             <ExternalLink className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">Source</span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Comments Section */}
//                   {expandedComments[comment.id] && comment.subComments.length > 0 && (
//                     <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                       {/* Sub-comment Filters */}
//                       <div className="flex items-center space-x-3 mb-4">
//                         <div className="flex items-center space-x-2">
//                           <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Filter:</span>
//                           <div className="relative">
//                             <button
//                               onClick={() => updateSubCommentFilter(comment.id, 'showTimeDropdown', !subCommentFilters[comment.id]?.showTimeDropdown)}
//                               className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[90px] justify-between"
//                             >
//                               <span>{subCommentFilters[comment.id]?.timeFilter || 'All Time'}</span>
//                               <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showTimeDropdown ? 'rotate-180' : ''}`} />
//                             </button>
                            
//                             {subCommentFilters[comment.id]?.showTimeDropdown && (
//                               <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                                 {timeOptions.map((option) => (
//                                   <button
//                                     key={option.value}
//                                     onClick={() => {
//                                       updateSubCommentFilter(comment.id, 'timeFilter', option.value);
//                                       updateSubCommentFilter(comment.id, 'showTimeDropdown', false);
//                                     }}
//                                     className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                       subCommentFilters[comment.id]?.timeFilter === option.value 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                         : 'text-gray-700 dark:text-gray-300'
//                                     }`}
//                                   >
//                                     {option.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center space-x-2">
//                           <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Sort:</span>
//                           <div className="relative">
//                             <button
//                               onClick={() => updateSubCommentFilter(comment.id, 'showSortDropdown', !subCommentFilters[comment.id]?.showSortDropdown)}
//                               className="flex items-center space-x-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-[100px] justify-between"
//                             >
//                               <span>{subCommentFilters[comment.id]?.sortFilter || 'Top'}</span>
//                               <ChevronDown className={`w-3 h-3 transition-transform ${subCommentFilters[comment.id]?.showSortDropdown ? 'rotate-180' : ''}`} />
//                             </button>
                            
//                             {subCommentFilters[comment.id]?.showSortDropdown && (
//                               <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-20">
//                                 {sortOptions.map((option) => (
//                                   <button
//                                     key={option.value}
//                                     onClick={() => {
//                                       updateSubCommentFilter(comment.id, 'sortFilter', option.value);
//                                       updateSubCommentFilter(comment.id, 'showSortDropdown', false);
//                                     }}
//                                     className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t last:rounded-b transition-colors ${
//                                       subCommentFilters[comment.id]?.sortFilter === option.value 
//                                         ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                         : 'text-gray-700 dark:text-gray-300'
//                                     }`}
//                                   >
//                                     {option.label}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="text-xs text-gray-500 dark:text-gray-400">
//                           {getFilteredAndSortedSubComments(comment.subComments, comment.id).length} comments
//                         </div>
//                       </div>

//                       {/* Comments List */}
//                       <div className="space-y-3">
//                         {getFilteredAndSortedSubComments(comment.subComments, comment.id).map((subComment) => (
//                           <div key={subComment.id} className="flex items-start space-x-2">
//                             <div className="flex-shrink-0">
//                               <img
//                                 src={subComment.userAvatar}
//                                 alt={subComment.userName}
//                                 className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
//                                 onError={(e) => {
//                                   e.target.src = `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//                                 }}
//                               />
//                             </div>
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                                 <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
//                                   <Clock className="w-2 h-2" />
//                                   <span>{subComment.timestamp}</span>
//                                 </div>
//                               </div>
                              
//                               <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                                 {subComment.comment}
//                               </p>
                              
//                               <div className="flex items-center space-x-3">
//                                 <button 
//                                   className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs"
//                                   onClick={() => showInteractivePopup('like')}
//                                 >
//                                   <ThumbsUp className="w-3 h-3" />
//                                   <span>{subComment.likes}</span>
//                                 </button>
//                                 <button 
//                                   className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs"
//                                   onClick={() => showInteractivePopup('dislike')}
//                                 >
//                                   <ThumbsDown className="w-3 h-3" />
                                  
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Eye className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   No Reddit discussions found for {symbol} in the selected time range.
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Interactive Popup */}
//       {showPopup.visible && (
//         <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 max-w-xs animate-fade-in">
//           <p className="text-xs">{showPopup.message}</p>
//         </div>
//       )}

//       {/* Enhanced Disclaimer Section */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded flex items-center justify-center">
//                 <IoWarning className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//               </div>
//             </div>
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//               <p className="text-xs text-orange-600 dark:text-orange-500 mt-1 italic">
//                 Interactive features are for demonstration purposes.
//               </p>
//             </div>
//             <button 
//               onClick={toggleDisclaimer}
//               className="flex-shrink-0 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={toggleDisclaimer}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;



// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [expandedPosts, setExpandedPosts] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [redditData, setRedditData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//    const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   // API integration
//   const fetchRedditData = async () => {
//     if (!symbol) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const timeframeMap = {
//         '1 Week': '1_week',
//         '1 Month': '1_month',
//         '3 Months': '3_months',
//         '6 Months': '6_months',
//         '1 Year': '1_year',
//         'All Time': 'all_time'
//       };
      
//       const timeframe = timeframeMap[timeFilter] || '1_month';
//       const apiUrl = `${API_BASE}/reddit/scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: { 'Accept': 'application/json' },
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch data');
      
//       const result = await response.json();
      
//       if (result.status === 'success' && result.data) {
//         setRedditData(result.data);
//       } else {
//         throw new Error('No data available');
//       }
      
//     } catch (err) {
//       setError(err.message);
//       setRedditData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRedditData();
//   }, [symbol, timeFilter]);

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => setShowDisclaimer(false), 20000);
//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));
//   };

//   const togglePostExpansion = (postId) => {
//     setExpandedPosts(prev => ({
//       ...prev,
//       [postId]: !prev[postId]
//     }));
//   };

//   const formatRelativeTime = (timestamp) => {
//     const now = new Date();
//     const postTime = new Date(timestamp);
//     const diffInSeconds = Math.floor((now - postTime) / 1000);
    
//     if (diffInSeconds < 60) return 'just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
//     if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//     return `${Math.floor(diffInSeconds / 31536000)}y ago`;
//   };

//   const getProfilePicture = (userData) => {
//     const profileUrl = userData.author_profile || userData.comment_author_profile;
//     if (profileUrl && profileUrl.includes('redditstatic.com')) return profileUrl;
//     return `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`;
//   };

//   // Process and truncate text with "Read More" functionality
//   const truncateText = (text, maxLength, postId) => {
//     if (!text || text.length <= maxLength) return text;
    
//     const truncated = text.slice(0, maxLength) + '...';
//     return (
//       <div>
//         <span>{expandedPosts[postId] ? text : truncated}</span>
//         <button
//           onClick={() => togglePostExpansion(postId)}
//           className="ml-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
//         >
//           {expandedPosts[postId] ? 'Show Less' : 'Read More'}
//         </button>
//       </div>
//     );
//   };

//   const truncateComment = (text, maxLength, commentId) => {
//     if (!text || text.length <= maxLength) return text;
    
//     const truncated = text.slice(0, maxLength) + '...';
//     return (
//       <div>
//         <span>{expandedComments[commentId] ? text : truncated}</span>
//         <button
//           onClick={() => toggleCommentExpansion(commentId)}
//           className="ml-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
//         >
//           {expandedComments[commentId] ? 'Show Less' : 'Read More'}
//         </button>
//       </div>
//     );
//   };

//   // Process Reddit data
//   const processRedditData = () => {
//     if (!redditData?.subreddits) return [];
    
//     const allPosts = [];
    
//     Object.values(redditData.subreddits).forEach(subredditData => {
//       Object.values(subredditData.categories || {}).forEach(category => {
//         (category.posts || []).forEach(post => {
//           const mainComment = {
//             id: `post_${post.post_id}`,
//             userName: post.author,
//             comment: post.post_description || post.post_title,
//             timestamp: formatRelativeTime(post.created_datetime),
//             actualTimestamp: new Date(post.created_datetime),
//             likes: post.post_upvotes || 0,
//             dislikes: post.post_downvotes || 0,
//             userAvatar: getProfilePicture(post),
//             isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//             subComments: [],
//             postUrl: post.post_url,
//             subredditName: subredditData.subreddit_name,
//             title: post.post_title,
//             totalComments: post.num_comments || 0,
//           };

//           // Process comments
//           if (post.comments) {
//             const allComments = [];
//             Object.values(post.comments).forEach(commentCategory => {
//               (commentCategory || []).forEach(comment => {
//                 if (comment.comment_author !== 'AutoModerator') {
//                   allComments.push({
//                     id: comment.comment_id,
//                     userName: comment.comment_author,
//                     comment: comment.comment_body,
//                     timestamp: formatRelativeTime(comment.comment_created_datetime),
//                     actualTimestamp: new Date(comment.comment_created_datetime),
//                     likes: comment.comment_upvotes || 0,
//                     userAvatar: getProfilePicture(comment, 36)
//                   });
//                 }
//               });
//             });

//             // Remove duplicates
//             const uniqueComments = allComments.filter((comment, index, self) => 
//               index === self.findIndex(c => c.id === comment.id)
//             );
//             mainComment.subComments = uniqueComments;
//           }

//           allPosts.push(mainComment);
//         });
//       });
//     });

//     return allPosts;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = new Date();
    
//     switch (timeFilter) {
//       case '1 Week': timeBoundary.setDate(timeBoundary.getDate() - 7); break;
//       case '1 Month': timeBoundary.setMonth(timeBoundary.getMonth() - 1); break;
//       case '3 Months': timeBoundary.setMonth(timeBoundary.getMonth() - 3); break;
//       case '6 Months': timeBoundary.setMonth(timeBoundary.getMonth() - 6); break;
//       case '1 Year': timeBoundary.setFullYear(timeBoundary.getFullYear() - 1); break;
//       default: timeBoundary.setTime(0);
//     }

//     let filteredPosts = allPosts.filter(post => post.actualTimestamp >= timeBoundary);

//     switch (sortFilter) {
//       case 'Recent':
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => b.likes - a.likes);
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => (b.totalComments + b.likes) - (a.totalComments + a.likes));
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => b.totalComments - a.totalComments);
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => a.actualTimestamp - b.actualTimestamp);
//         break;
//       default:
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//     }

//     return filteredPosts;
//   }, [redditData, timeFilter, sortFilter]);

//   const timeOptions = ['1 Week', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'];
//   const sortOptions = ['Recent', 'Top', 'Controversial', 'Most Discussed', 'New', 'Old'];

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Reddit Discussions for {symbol}
//               </h2>
//               {redditData && (
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                   Data scraped {formatRelativeTime(redditData.scrape_timestamp)}
//                 </p>
//               )}
//             </div>
//             {error && (
//               <button
//                 onClick={fetchRedditData}
//                 className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Retry</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
//             <IoWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load data</h3>
//           <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
//           <button
//             onClick={fetchRedditData}
//             className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Retry Loading Data</span>
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       {!error && redditData && (
//         <>
//           {/* Filters */}
//           <div className="mb-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex items-center space-x-3">
//                   {/* Time Filter */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                       >
//                         <span>{timeFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showTimeDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {timeOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setTimeFilter(option);
//                                 setShowTimeDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 timeFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Sort Filter */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSortDropdown(!showSortDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                       >
//                         <span>{sortFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showSortDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {sortOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setSortFilter(option);
//                                 setShowSortDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 sortFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                   <Eye className="w-3 h-3" />
//                   <span>Showing {filteredAndSortedPosts.length} discussions</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Posts */}
//           <div className="space-y-4">
//             {filteredAndSortedPosts.length > 0 ? (
//               filteredAndSortedPosts.map((post) => (
//                 <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  
//                   {/* Post Header */}
//                   <div className="flex items-start space-x-3">
//                     <img
//                       src={post.userAvatar}
//                       alt={post.userName}
//                       className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover"
//                     />
                    
//                     <div className="flex-1 min-w-0 pt-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.userName}</span>
//                         <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                           <div className="flex items-center space-x-1">
//                             <Clock className="w-3 h-3" />
//                             <span>{post.timestamp}</span>
//                           </div>
//                           <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                             <Hash className="w-3 h-3" />
//                             <span className="text-xs font-medium">r/{post.subredditName}</span>
//                           </div>
//                           {post.isRecent && (
//                             <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                               Recent
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Post Content */}
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pt-1">
//                         {post.title}
//                       </h3>
                      
//                       <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                         {truncateText(post.comment, 300, post.id)}
//                       </div>
                      
//                       {/* Engagement Metrics */}
//                       <div className="flex items-center space-x-4">
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                             <ThumbsUp className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.likes}</span>
//                         </button>
                        
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                             <ThumbsDown className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.dislikes}</span>
//                         </button>
                        
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                           onClick={() => toggleCommentExpansion(post.id)}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                             <MessageCircle className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.subComments.length}</span>
//                         </button>
                        
//                         <a 
//                           href={post.postUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                             <ExternalLink className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">Source</span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Comments Section */}
//                   {expandedComments[post.id] && post.subComments.length > 0 && (
//                     <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                         {post.subComments.length} comments
//                       </div>

//                       {/* Comments List */}
//                       <div className="space-y-3">
//                         {post.subComments.map((subComment) => (
//                           <div key={subComment.id} className="flex items-start space-x-2">
//                             <img
//                               src={subComment.userAvatar}
//                               alt={subComment.userName}
//                               className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
//                             />
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                                 <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 text-xs">
//                                   <Clock className="w-2 h-2" />
//                                   <span>{subComment.timestamp}</span>
//                                 </div>
//                               </div>
                              
//                               <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                                 {truncateComment(subComment.comment, 200, subComment.id)}
//                               </div>
                              
//                               <div className="flex items-center space-x-3">
//                                 <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs">
//                                   <ThumbsUp className="w-3 h-3" />
//                                   <span>{subComment.likes}</span>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Eye className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   No Reddit discussions found for {symbol} in the selected time range.
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Disclaimer */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <IoWarning className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//             </div>
//             <button 
//               onClick={() => setShowDisclaimer(false)}
//               className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={() => setShowDisclaimer(true)}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;

// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw, User, Image as ImageIcon, Calendar } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [expandedPosts, setExpandedPosts] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [redditData, setRedditData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // API integration
//   const fetchRedditData = async () => {
//     if (!symbol) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const timeframeMap = {
//         '1 Week': '1_week',
//         '1 Month': '1_month',
//         '3 Months': '3_months',
//         '6 Months': '6_months',
//         '1 Year': '1_year',
//         'All Time': 'all_time'
//       };
      
//       const timeframe = timeframeMap[timeFilter] || '1_month';
//       const apiUrl = `${API_BASE}/reddit/scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: { 'Accept': 'application/json' },
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch data');
      
//       const result = await response.json();
      
//       if (result.status === 'success' && result.data) {
//         setRedditData(result.data);
//       } else {
//         throw new Error('No data available');
//       }
      
//     } catch (err) {
//       setError(err.message);
//       setRedditData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRedditData();
//   }, [symbol, timeFilter]);

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => setShowDisclaimer(false), 20000);
//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));
//   };

//   const togglePostExpansion = (postId) => {
//     setExpandedPosts(prev => ({
//       ...prev,
//       [postId]: !prev[postId]
//     }));
//   };

//   // Enhanced datetime formatting
//   const formatDateTime = (timestamp) => {
//     if (!timestamp) return { relative: 'Unknown time', full: 'Date not available' };
    
//     try {
//       const date = new Date(timestamp);
      
//       if (isNaN(date.getTime())) {
//         return { relative: 'Invalid date', full: 'Invalid date' };
//       }

//       // Relative time (like before)
//       const now = new Date();
//       const diffInSeconds = Math.floor((now - date) / 1000);
      
//       let relativeTime;
//       if (diffInSeconds < 60) relativeTime = 'just now';
//       else if (diffInSeconds < 3600) relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
//       else if (diffInSeconds < 86400) relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
//       else if (diffInSeconds < 2592000) relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;
//       else if (diffInSeconds < 31536000) relativeTime = `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//       else relativeTime = `${Math.floor(diffInSeconds / 31536000)}y ago`;

//       // Full formatted date and time
//       const fullDateTime = date.toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });

//       // Date only for tooltip
//       const dateOnly = date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });

//       // Time only
//       const timeOnly = date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });

//       return {
//         relative: relativeTime,
//         full: fullDateTime,
//         date: dateOnly,
//         time: timeOnly,
//         iso: timestamp
//       };
//     } catch (error) {
//       return { relative: 'Date error', full: 'Date format error' };
//     }
//   };

//   // Improved profile picture function
//   const getProfilePicture = (userData) => {
//     if (!userData) {
//       return null;
//     }

//     const profileUrl = userData.author_profile || 
//                       userData.comment_author_profile || 
//                       userData.profile_picture ||
//                       userData.author_avatar;

//     if (profileUrl && 
//         (profileUrl.includes('redditstatic.com') || 
//          profileUrl.includes('redd.it') ||
//          profileUrl.startsWith('https://'))) {
//       return profileUrl;
//     }

//     return null;
//   };

//   // Format text with proper spacing and line breaks
//   const formatText = (text) => {
//     if (!text) return null;
    
//     let formattedText = text
//       .replace(/\n\n/g, '</p><p>')
//       .replace(/\n/g, '<br>')
//       .replace(/\s+/g, ' ')
//       .trim();

//     if (!formattedText.startsWith('<p>')) {
//       formattedText = `<p>${formattedText}</p>`;
//     }

//     return (
//       <div 
//         className="whitespace-pre-wrap break-words"
//         dangerouslySetInnerHTML={{ __html: formattedText }}
//       />
//     );
//   };

//   // Process and truncate text with "Read More" functionality
//   const truncateText = (text, maxLength, postId) => {
//     if (!text) return 'No content available';
    
//     const isExpanded = expandedPosts[postId];
//     const shouldTruncate = text.length > maxLength && !isExpanded;
    
//     const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
//     return (
//       <div className="space-y-2">
//         <div className="whitespace-pre-wrap break-words leading-relaxed">
//           {formatText(displayText)}
//         </div>
//         {text.length > maxLength && (
//           <button
//             onClick={() => togglePostExpansion(postId)}
//             className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
//           >
//             {isExpanded ? 'Show Less' : 'Read More'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   const truncateComment = (text, maxLength, commentId) => {
//     if (!text) return 'No comment content';
    
//     const isExpanded = expandedComments[commentId];
//     const shouldTruncate = text.length > maxLength && !isExpanded;
    
//     const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
//     return (
//       <div className="space-y-2">
//         <div className="whitespace-pre-wrap break-words leading-relaxed">
//           {formatText(displayText)}
//         </div>
//         {text.length > maxLength && (
//           <button
//             onClick={() => toggleCommentExpansion(commentId)}
//             className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
//           >
//             {isExpanded ? 'Show Less' : 'Read More'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   // Profile picture component with fallback
//   const ProfilePicture = ({ userData, size = 10, className = "" }) => {
//     const profileUrl = getProfilePicture(userData);
//     const [imgError, setImgError] = useState(false);

//     if (profileUrl && !imgError) {
//       return (
//         <img
//           src={profileUrl}
//           alt={userData?.author || userData?.comment_author || 'User'}
//           className={`w-${size} h-${size} rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover ${className}`}
//           onError={() => setImgError(true)}
//         />
//       );
//     }

//     return (
//       <div className={`w-${size} h-${size} rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-700 flex items-center justify-center ${className}`}>
//         <User className={`w-${size - 4} h-${size - 4} text-gray-500 dark:text-gray-400`} />
//       </div>
//     );
//   };

//   // Image gallery component for post and comment images
//   const ImageGallery = ({ images, className = "" }) => {
//     if (!images || images.length === 0) return null;

//     return (
//       <div className={`mt-3 ${className}`}>
//         <div className="flex flex-wrap gap-2">
//           {images.map((imageUrl, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={imageUrl}
//                 alt={`Post image ${index + 1}`}
//                 className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600 object-cover cursor-pointer hover:opacity-90 transition-opacity"
//                 onClick={() => window.open(imageUrl, '_blank')}
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
//                 <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // DateTime display component with tooltip
//   const DateTimeDisplay = ({ timestamp, type = "post", showFull = false }) => {
//     const datetimeInfo = formatDateTime(timestamp);
    
//     return (
//       <div className="flex items-center space-x-1 group relative">
//         <Clock className="w-3 h-3 text-gray-400" />
//         <span 
//           className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
//           title={`${datetimeInfo.date} at ${datetimeInfo.time}`}
//         >
//           {showFull ? datetimeInfo.full : datetimeInfo.relative}
//         </span>
        
//         {/* Enhanced tooltip on hover */}
//         <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-center">
//           <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-50 whitespace-nowrap">
//             <div className="flex items-center space-x-1 mb-1">
//               <Calendar className="w-3 h-3" />
//               <span className="font-medium">{datetimeInfo.date}</span>
//             </div>
//             <div className="text-gray-300">
//               {datetimeInfo.time}
//             </div>
//             {type === "scrape" && (
//               <div className="mt-1 pt-1 border-t border-gray-600 text-gray-400">
//                 Data collection time
//               </div>
//             )}
//           </div>
//           <div className="w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 transform -mt-2"></div>
//         </div>
//       </div>
//     );
//   };

//   // Improved Reddit data processing
//   const processRedditData = () => {
//     if (!redditData?.subreddits) return [];
    
//     const allPosts = [];
    
//     try {
//       Object.values(redditData.subreddits).forEach(subredditData => {
//         if (!subredditData) return;
        
//         Object.values(subredditData.categories || {}).forEach(category => {
//           if (!category?.posts) return;
          
//           category.posts.forEach(post => {
//             if (!post) return;

//             const mainComment = {
//               id: `post_${post.post_id || Math.random()}`,
//               userName: post.author || 'Unknown User',
//               comment: post.post_description || post.post_title || 'No content',
//               timestamp: post.created_datetime,
//               actualTimestamp: new Date(post.created_datetime),
//               likes: post.post_upvotes || 0,
//               dislikes: post.post_downvotes || 0,
//               userData: post,
//               isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//               subComments: [],
//               postUrl: post.post_url,
//               subredditName: subredditData.subreddit_name || 'Unknown Subreddit',
//               title: post.post_title || 'Untitled',
//               totalComments: post.num_comments || 0,
//               postImages: post.post_images || [],
//               commentImages: post.comment_images || []
//             };

//             // Process comments with images
//             if (post.comments) {
//               const allComments = [];
              
//               Object.values(post.comments).forEach(commentCategory => {
//                 if (Array.isArray(commentCategory)) {
//                   commentCategory.forEach(comment => {
//                     if (comment && comment.comment_author !== 'AutoModerator') {
//                       allComments.push({
//                         id: comment.comment_id || `comment_${Math.random()}`,
//                         userName: comment.comment_author || 'Unknown User',
//                         comment: comment.comment_body || 'No comment content',
//                         timestamp: comment.comment_created_datetime,
//                         actualTimestamp: new Date(comment.comment_created_datetime),
//                         likes: comment.comment_upvotes || 0,
//                         userData: comment,
//                         commentImages: comment.comment_images || []
//                       });
//                     }
//                   });
//                 }
//               });

//               // Remove duplicates based on comment ID
//               const uniqueComments = allComments.filter((comment, index, self) => 
//                 index === self.findIndex(c => c.id === comment.id)
//               );
              
//               mainComment.subComments = uniqueComments;
//             }

//             allPosts.push(mainComment);
//           });
//         });
//       });
//     } catch (error) {
//       console.error('Error processing Reddit data:', error);
//     }

//     return allPosts;
//   };

//   // Filter and sort posts
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
//     const timeBoundary = new Date();
    
//     switch (timeFilter) {
//       case '1 Week': timeBoundary.setDate(timeBoundary.getDate() - 7); break;
//       case '1 Month': timeBoundary.setMonth(timeBoundary.getMonth() - 1); break;
//       case '3 Months': timeBoundary.setMonth(timeBoundary.getMonth() - 3); break;
//       case '6 Months': timeBoundary.setMonth(timeBoundary.getMonth() - 6); break;
//       case '1 Year': timeBoundary.setFullYear(timeBoundary.getFullYear() - 1); break;
//       default: timeBoundary.setTime(0);
//     }

//     let filteredPosts = allPosts.filter(post => {
//       if (!post.actualTimestamp || isNaN(post.actualTimestamp.getTime())) {
//         return false;
//       }
//       return post.actualTimestamp >= timeBoundary;
//     });

//     switch (sortFilter) {
//       case 'Recent':
//       case 'New':
//         filteredPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         filteredPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
//         break;
//       case 'Controversial':
//         filteredPosts.sort((a, b) => 
//           ((b.totalComments || 0) + (b.likes || 0)) - ((a.totalComments || 0) + (a.likes || 0))
//         );
//         break;
//       case 'Most Discussed':
//         filteredPosts.sort((a, b) => (b.totalComments || 0) - (a.totalComments || 0));
//         break;
//       case 'Old':
//         filteredPosts.sort((a, b) => (a.actualTimestamp || 0) - (b.actualTimestamp || 0));
//         break;
//       default:
//         filteredPosts.sort((a, b) => (b.actualTimestamp || 0) - (a.actualTimestamp || 0));
//     }

//     return filteredPosts;
//   }, [redditData, timeFilter, sortFilter]);

//   const timeOptions = ['1 Week', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'];
//   const sortOptions = ['Recent', 'Top', 'Controversial', 'Most Discussed', 'New', 'Old'];

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Reddit Discussions for {symbol}
//               </h2>
//               {redditData && (
//                 <div className="flex items-center space-x-2 mt-1">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">Data scraped</span>
//                   <DateTimeDisplay timestamp={redditData.scrape_timestamp} type="scrape" showFull={true} />
//                 </div>
//               )}
//             </div>
//             {error && (
//               <button
//                 onClick={fetchRedditData}
//                 className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Retry</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
//             <IoWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load data</h3>
//           <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
//           <button
//             onClick={fetchRedditData}
//             className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Retry Loading Data</span>
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       {!error && redditData && (
//         <>
//           {/* Filters */}
//           <div className="mb-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex items-center space-x-3">
//                   {/* Time Filter */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                       >
//                         <span>{timeFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showTimeDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {timeOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setTimeFilter(option);
//                                 setShowTimeDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 timeFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* Sort Filter */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSortDropdown(!showSortDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                       >
//                         <span>{sortFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showSortDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {sortOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setSortFilter(option);
//                                 setShowSortDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 sortFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                   <Eye className="w-3 h-3" />
//                   <span>Showing {filteredAndSortedPosts.length} discussions</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Posts */}
//           <div className="space-y-4">
//             {filteredAndSortedPosts.length > 0 ? (
//               filteredAndSortedPosts.map((post) => (
//                 <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  
//                   {/* Post Header */}
//                   <div className="flex items-start space-x-3">
//                     <ProfilePicture userData={post.userData} size={10} />
                    
//                     <div className="flex-1 min-w-0 pt-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.userName}</span>
//                         <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                           <DateTimeDisplay timestamp={post.timestamp} type="post" />
//                           <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                             <Hash className="w-3 h-3" />
//                             <span className="text-xs font-medium">r/{post.subredditName}</span>
//                           </div>
//                           {post.isRecent && (
//                             <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                               Recent
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Post Content */}
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pt-1">
//                         {post.title}
//                       </h3>
                      
//                       <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                         {truncateText(post.comment, 300, post.id)}
//                       </div>

//                       {/* Post Images */}
//                       <ImageGallery images={post.postImages} />

//                       {/* Engagement Metrics */}
//                       <div className="flex items-center space-x-4 mt-4">
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                             <ThumbsUp className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.likes}</span>
//                         </button>
                        
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                             <ThumbsDown className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.dislikes}</span>
//                         </button>
                        
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                           onClick={() => toggleCommentExpansion(post.id)}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                             <MessageCircle className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.subComments.length}</span>
//                         </button>
                        
//                         <a 
//                           href={post.postUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                             <ExternalLink className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">Source</span>
//                         </a>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Comments Section */}
//                   {expandedComments[post.id] && post.subComments.length > 0 && (
//                     <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                         {post.subComments.length} comments
//                       </div>

//                       {/* Comments List */}
//                       <div className="space-y-4">
//                         {post.subComments.map((subComment) => (
//                           <div key={subComment.id} className="flex items-start space-x-2">
//                             <ProfilePicture userData={subComment.userData} size={6} />
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                                 <DateTimeDisplay timestamp={subComment.timestamp} type="comment" />
//                               </div>
                              
//                               <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                                 {truncateComment(subComment.comment, 200, subComment.id)}
//                               </div>

//                               {/* Comment Images */}
//                               <ImageGallery images={subComment.commentImages} className="!mt-2" />
                              
//                               <div className="flex items-center space-x-3 mt-2">
//                                 <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs">
//                                   <ThumbsUp className="w-3 h-3" />
//                                   <span>{subComment.likes}</span>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Eye className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   No Reddit discussions found for {symbol} in the selected time range.
//                 </p>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Disclaimer */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <IoWarning className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//             </div>
//             <button 
//               onClick={() => setShowDisclaimer(false)}
//               className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={() => setShowDisclaimer(true)}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;




// import React, { useState, useEffect, useMemo } from 'react';
// import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw, User, Image as ImageIcon, Calendar } from 'lucide-react';
// import { IoWarning } from 'react-icons/io5';

// function Review({ symbol }) {
//   const [expandedComments, setExpandedComments] = useState({});
//   const [expandedPosts, setExpandedPosts] = useState({});
//   const [timeFilter, setTimeFilter] = useState('1 Month');
//   const [sortFilter, setSortFilter] = useState('Recent');
//   const [showTimeDropdown, setShowTimeDropdown] = useState(false);
//   const [showSortDropdown, setShowSortDropdown] = useState(false);
//   const [showDisclaimer, setShowDisclaimer] = useState(true);
//   const [redditData, setRedditData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   // API integration
//   const fetchRedditData = async () => {
//     if (!symbol) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       const timeframeMap = {
//         '1 Week': '1_week',
//         '15 Days': '15_days', 
//         '1 Month': '1_month',
//         '3 Months': '3_months',
//         '6 Months': '6_months',
//         '1 Year': '1_year',
//         'All Time': 'all_time'
//       };
      
//       const timeframe = timeframeMap[timeFilter] || '1_month';
//       const apiUrl = `${API_BASE}/reddit/scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
//       console.log('Fetching data with timeframe:', timeframe, 'URL:', apiUrl);
      
//       const response = await fetch(apiUrl, {
//         method: 'GET',
//         headers: { 'Accept': 'application/json' },
//       });
      
//       if (!response.ok) throw new Error('Failed to fetch data');
      
//       const result = await response.json();
      
//       if (result.status === 'success' && result.data) {
//         setRedditData(result.data);
//         console.log('Data received:', result.data);
//       } else {
//         throw new Error('No data available');
//       }
      
//     } catch (err) {
//       console.error('API Error:', err);
//       setError(err.message);
//       setRedditData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRedditData();
//   }, [symbol, timeFilter]);

//   // Auto-hide disclaimer after 20 seconds
//   useEffect(() => {
//     const timer = setTimeout(() => setShowDisclaimer(false), 20000);
//     return () => clearTimeout(timer);
//   }, []);

//   const toggleCommentExpansion = (commentId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [commentId]: !prev[commentId]
//     }));
//   };

//   const togglePostExpansion = (postId) => {
//     setExpandedPosts(prev => ({
//       ...prev,
//       [postId]: !prev[postId]
//     }));
//   };

//   // Enhanced datetime formatting
//   const formatDateTime = (timestamp) => {
//     if (!timestamp) return { relative: 'Unknown time', full: 'Date not available' };
    
//     try {
//       const date = new Date(timestamp);
      
//       if (isNaN(date.getTime())) {
//         return { relative: 'Invalid date', full: 'Invalid date' };
//       }

//       // Relative time
//       const now = new Date();
//       const diffInSeconds = Math.floor((now - date) / 1000);
      
//       let relativeTime;
//       if (diffInSeconds < 60) relativeTime = 'just now';
//       else if (diffInSeconds < 3600) relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
//       else if (diffInSeconds < 86400) relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
//       else if (diffInSeconds < 2592000) relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;
//       else if (diffInSeconds < 31536000) relativeTime = `${Math.floor(diffInSeconds / 2592000)}mo ago`;
//       else relativeTime = `${Math.floor(diffInSeconds / 31536000)}y ago`;

//       // Full formatted date and time
//       const fullDateTime = date.toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });

//       // Date only for tooltip
//       const dateOnly = date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       });

//       // Time only
//       const timeOnly = date.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true
//       });

//       return {
//         relative: relativeTime,
//         full: fullDateTime,
//         date: dateOnly,
//         time: timeOnly,
//         iso: timestamp,
//         rawDate: date
//       };
//     } catch (error) {
//       return { relative: 'Date error', full: 'Date format error' };
//     }
//   };

//   // Improved profile picture function
//   const getProfilePicture = (userData) => {
//     if (!userData) {
//       return null;
//     }

//     const profileUrl = userData.author_profile || 
//                       userData.comment_author_profile || 
//                       userData.profile_picture ||
//                       userData.author_avatar;

//     if (profileUrl && 
//         (profileUrl.includes('redditstatic.com') || 
//          profileUrl.includes('redd.it') ||
//          profileUrl.startsWith('https://'))) {
//       return profileUrl;
//     }

//     return null;
//   };

//   // Format text with proper spacing and line breaks
//   const formatText = (text) => {
//     if (!text) return null;
    
//     let formattedText = text
//       .replace(/\n\n/g, '</p><p>')
//       .replace(/\n/g, '<br>')
//       .replace(/\s+/g, ' ')
//       .trim();

//     if (!formattedText.startsWith('<p>')) {
//       formattedText = `<p>${formattedText}</p>`;
//     }

//     return (
//       <div 
//         className="whitespace-pre-wrap break-words"
//         dangerouslySetInnerHTML={{ __html: formattedText }}
//       />
//     );
//   };

//   // Process and truncate text with "Read More" functionality
//   const truncateText = (text, maxLength, postId) => {
//     if (!text) return 'No content available';
    
//     const isExpanded = expandedPosts[postId];
//     const shouldTruncate = text.length > maxLength && !isExpanded;
    
//     const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
//     return (
//       <div className="space-y-2">
//         <div className="whitespace-pre-wrap break-words leading-relaxed">
//           {formatText(displayText)}
//         </div>
//         {text.length > maxLength && (
//           <button
//             onClick={() => togglePostExpansion(postId)}
//             className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
//           >
//             {isExpanded ? 'Show Less' : 'Read More'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   const truncateComment = (text, maxLength, commentId) => {
//     if (!text) return 'No comment content';
    
//     const isExpanded = expandedComments[commentId];
//     const shouldTruncate = text.length > maxLength && !isExpanded;
    
//     const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
//     return (
//       <div className="space-y-2">
//         <div className="whitespace-pre-wrap break-words leading-relaxed">
//           {formatText(displayText)}
//         </div>
//         {text.length > maxLength && (
//           <button
//             onClick={() => toggleCommentExpansion(commentId)}
//             className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
//           >
//             {isExpanded ? 'Show Less' : 'Read More'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   // Profile picture component with fallback
//   const ProfilePicture = ({ userData, size = 10, className = "" }) => {
//     const profileUrl = getProfilePicture(userData);
//     const [imgError, setImgError] = useState(false);

//     if (profileUrl && !imgError) {
//       return (
//         <img
//           src={profileUrl}
//           alt={userData?.author || userData?.comment_author || 'User'}
//           className={`w-${size} h-${size} rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover ${className}`}
//           onError={() => setImgError(true)}
//         />
//       );
//     }

//     return (
//       <div className={`w-${size} h-${size} rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-700 flex items-center justify-center ${className}`}>
//         <User className={`w-${size - 4} h-${size - 4} text-gray-500 dark:text-gray-400`} />
//       </div>
//     );
//   };

//   // Image gallery component for post and comment images
//   const ImageGallery = ({ images, className = "" }) => {
//     if (!images || images.length === 0) return null;

//     return (
//       <div className={`mt-3 ${className}`}>
//         <div className="flex flex-wrap gap-2">
//           {images.map((imageUrl, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={imageUrl}
//                 alt={`Post image ${index + 1}`}
//                 className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600 object-cover cursor-pointer hover:opacity-90 transition-opacity"
//                 onClick={() => window.open(imageUrl, '_blank')}
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
//                 <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // DateTime display component with tooltip
//   const DateTimeDisplay = ({ timestamp, type = "post", showFull = false }) => {
//     const datetimeInfo = formatDateTime(timestamp);
    
//     return (
//       <div className="flex items-center space-x-1 group relative">
//         <Clock className="w-3 h-3 text-gray-400" />
//         <span 
//           className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
//           title={`${datetimeInfo.date} at ${datetimeInfo.time}`}
//         >
//           {showFull ? datetimeInfo.full : datetimeInfo.relative}
//         </span>
        
//         {/* Enhanced tooltip on hover */}
//         <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-center">
//           <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-50 whitespace-nowrap">
//             <div className="flex items-center space-x-1 mb-1">
//               <Calendar className="w-3 h-3" />
//               <span className="font-medium">{datetimeInfo.date}</span>
//             </div>
//             <div className="text-gray-300">
//               {datetimeInfo.time}
//             </div>
//             {type === "scrape" && (
//               <div className="mt-1 pt-1 border-t border-gray-600 text-gray-400">
//                 Data collection time
//               </div>
//             )}
//           </div>
//           <div className="w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 transform -mt-2"></div>
//         </div>
//       </div>
//     );
//   };

//   // Improved Reddit data processing
//   const processRedditData = () => {
//     if (!redditData?.subreddits) {
//       console.log('No subreddits data available');
//       return [];
//     }
    
//     const allPosts = [];
    
//     try {
//       Object.values(redditData.subreddits).forEach(subredditData => {
//         if (!subredditData) return;
        
//         console.log('Processing subreddit:', subredditData.subreddit_name);
        
//         Object.values(subredditData.categories || {}).forEach(category => {
//           if (!category?.posts) return;
          
//           console.log(`Processing ${category.posts.length} posts in category`);
          
//           category.posts.forEach(post => {
//             if (!post) return;

//             const mainComment = {
//               id: `post_${post.post_id || Math.random()}`,
//               userName: post.author || 'Unknown User',
//               comment: post.post_description || post.post_title || 'No content',
//               timestamp: post.created_datetime,
//               actualTimestamp: new Date(post.created_datetime),
//               likes: post.post_upvotes || 0,
//               dislikes: post.post_downvotes || 0,
//               userData: post,
//               isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//               subComments: [],
//               postUrl: post.post_url,
//               subredditName: subredditData.subreddit_name || 'Unknown Subreddit',
//               title: post.post_title || 'Untitled',
//               totalComments: post.num_comments || 0,
//               postImages: post.post_images || [],
//               commentImages: post.comment_images || []
//             };

//             // Process comments with images and proper datetime
//             if (post.comments) {
//               const allComments = [];
              
//               Object.values(post.comments).forEach(commentCategory => {
//                 if (Array.isArray(commentCategory)) {
//                   commentCategory.forEach(comment => {
//                     if (comment && comment.comment_author !== 'AutoModerator') {
//                       allComments.push({
//                         id: comment.comment_id || `comment_${Math.random()}`,
//                         userName: comment.comment_author || 'Unknown User',
//                         comment: comment.comment_body || 'No comment content',
//                         timestamp: comment.comment_created_datetime, // Use the actual datetime from backend
//                         actualTimestamp: new Date(comment.comment_created_datetime),
//                         likes: comment.comment_upvotes || 0,
//                         userData: comment,
//                         commentImages: comment.comment_images || []
//                       });
//                     }
//                   });
//                 }
//               });

//               // Remove duplicates based on comment ID
//               const uniqueComments = allComments.filter((comment, index, self) => 
//                 index === self.findIndex(c => c.id === comment.id)
//               );
              
//               console.log(`Found ${uniqueComments.length} unique comments for post`);
//               mainComment.subComments = uniqueComments;
//             }

//             allPosts.push(mainComment);
//           });
//         });
//       });
//     } catch (error) {
//       console.error('Error processing Reddit data:', error);
//     }

//     console.log(`Total posts processed: ${allPosts.length}`);
//     return allPosts;
//   };

//   // Filter and sort posts - Now just sorts since backend handles time filtering
//   const filteredAndSortedPosts = useMemo(() => {
//     const allPosts = processRedditData();
    
//     console.log(`Sorting ${allPosts.length} posts by: ${sortFilter}`);

//     let sortedPosts = [...allPosts];

//     switch (sortFilter) {
//       case 'Recent':
//       case 'New':
//         sortedPosts.sort((a, b) => b.actualTimestamp - a.actualTimestamp);
//         break;
//       case 'Top':
//         sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
//         break;
//       case 'Controversial':
//         sortedPosts.sort((a, b) => 
//           ((b.totalComments || 0) + (b.likes || 0)) - ((a.totalComments || 0) + (a.likes || 0))
//         );
//         break;
//       case 'Most Discussed':
//         sortedPosts.sort((a, b) => (b.totalComments || 0) - (a.totalComments || 0));
//         break;
//       case 'Old':
//         sortedPosts.sort((a, b) => (a.actualTimestamp || 0) - (b.actualTimestamp || 0));
//         break;
//       default:
//         sortedPosts.sort((a, b) => (b.actualTimestamp || 0) - (a.actualTimestamp || 0));
//     }

//     console.log(`Sorted posts: ${sortedPosts.length}`);
//     return sortedPosts;
//   }, [redditData, sortFilter]);

//   const timeOptions = ['1 Week', '15 Days', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'];
//   const sortOptions = ['Recent', 'Top', 'Controversial', 'Most Discussed', 'New', 'Old'];

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
//           <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Time range: {timeFilter}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
//                 Reddit Discussions for {symbol}
//               </h2>
//               {redditData && (
//                 <div className="flex items-center space-x-2 mt-1">
//                   <span className="text-sm text-gray-600 dark:text-gray-400">Data scraped</span>
//                   <DateTimeDisplay timestamp={redditData.scrape_timestamp} type="scrape" showFull={true} />
//                   <span className="text-sm text-gray-500 dark:text-gray-500">• Filter: {timeFilter}</span>
//                 </div>
//               )}
//             </div>
//             {error && (
//               <button
//                 onClick={fetchRedditData}
//                 className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 <span>Retry</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
//           <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
//             <IoWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load data</h3>
//           <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
//           <button
//             onClick={fetchRedditData}
//             className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
//           >
//             <RefreshCw className="w-4 h-4" />
//             <span>Retry Loading Data</span>
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       {!error && redditData && (
//         <>
//           {/* Filters */}
//           <div className="mb-6">
//             <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//               <div className="flex flex-wrap items-center justify-between gap-3">
//                 <div className="flex items-center space-x-3">
//                   {/* Time Filter */}
//                   {/* <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowTimeDropdown(!showTimeDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
//                       >
//                         <span>{timeFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showTimeDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {timeOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setTimeFilter(option);
//                                 setShowTimeDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 timeFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div> */}
                  
//                   {/* Sort Filter */}
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
//                     <div className="relative">
//                       <button
//                         onClick={() => setShowSortDropdown(!showSortDropdown)}
//                         className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
//                       >
//                         <span>{sortFilter}</span>
//                         <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
//                       </button>
                      
//                       {showSortDropdown && (
//                         <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                           {sortOptions.map((option) => (
//                             <button
//                               key={option}
//                               onClick={() => {
//                                 setSortFilter(option);
//                                 setShowSortDropdown(false);
//                               }}
//                               className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
//                                 sortFilter === option 
//                                   ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
//                                   : 'text-gray-700 dark:text-gray-300'
//                               }`}
//                             >
//                               {option}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
//                   <Eye className="w-3 h-3" />
//                   <span>Showing {filteredAndSortedPosts.length} discussions</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Posts */}
//           <div className="space-y-4">
//             {filteredAndSortedPosts.length > 0 ? (
//               filteredAndSortedPosts.map((post) => (
//                 <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  
//                   {/* Post Header */}
//                   <div className="flex items-start space-x-3">
//                     <ProfilePicture userData={post.userData} size={10} />
                    
//                     <div className="flex-1 min-w-0 pt-1">
//                       <div className="flex items-center space-x-2 mb-2">
//                         <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.userName}</span>
//                         <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
//                           <DateTimeDisplay timestamp={post.timestamp} type="post" />
//                           {/* <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
//                             <Hash className="w-3 h-3" />
//                             <span className="text-xs font-medium">r/{post.subredditName}</span>
//                           </div> */}
//                           {post.isRecent && (
//                             <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
//                               Recent
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* Post Content */}
//                       <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pt-1">
//                         {post.title}
//                       </h3>
                      
//                       <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
//                         {truncateText(post.comment, 300, post.id)}
//                       </div>

//                       {/* Post Images */}
//                       <ImageGallery images={post.postImages} />

//                       {/* Engagement Metrics */}
//                       <div className="flex items-center space-x-4 mt-4">
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
//                             <ThumbsUp className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.likes}</span>
//                         </button>
                        
//                         <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
//                             <ThumbsDown className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.dislikes}</span>
//                         </button>
                        
//                         <button 
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
//                           onClick={() => toggleCommentExpansion(post.id)}
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
//                             <MessageCircle className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">{post.subComments.length}</span>
//                         </button>
// {/*                         
//                         <a 
//                           href={post.postUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
//                         >
//                           <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
//                             <ExternalLink className="w-3 h-3" />
//                           </div>
//                           <span className="text-sm font-medium">Source</span>
//                         </a> */}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Comments Section */}
//                   {expandedComments[post.id] && post.subComments.length > 0 && (
//                     <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
//                       <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
//                         {post.subComments.length} comments
//                       </div>

//                       {/* Comments List */}
//                       <div className="space-y-4">
//                         {post.subComments.map((subComment) => (
//                           <div key={subComment.id} className="flex items-start space-x-2">
//                             <ProfilePicture userData={subComment.userData} size={6} />
                            
//                             <div className="flex-1 min-w-0">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
//                                 <DateTimeDisplay timestamp={subComment.timestamp} type="comment" />
//                               </div>
                              
//                               <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
//                                 {truncateComment(subComment.comment, 200, subComment.id)}
//                               </div>

//                               {/* Comment Images */}
//                               <ImageGallery images={subComment.commentImages} className="!mt-2" />
                              
//                               <div className="flex items-center space-x-3 mt-2">
//                                 <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs">
//                                   <ThumbsUp className="w-3 h-3" />
//                                   <span>{subComment.likes}</span>
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
//                   <Eye className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
//                 <p className="text-gray-600 dark:text-gray-400 text-sm">
//                   No Reddit discussions found for {symbol} in the {timeFilter.toLowerCase()} time range.
//                 </p>
//                 <button
//                   onClick={() => setTimeFilter('All Time')}
//                   className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
//                 >
//                   Try "All Time" filter
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Disclaimer */}
//       {showDisclaimer ? (
//         <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
//           <div className="flex items-start space-x-3">
//             <IoWarning className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
//             <div className="flex-1">
//               <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
//                 Investment Disclaimer
//               </h4>
//               <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
//                 These discussions are from online forums and should not be considered professional investment advice. 
//                 Always consult with qualified financial advisors before making investment decisions.
//               </p>
//             </div>
//             <button 
//               onClick={() => setShowDisclaimer(false)}
//               className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
//             >
//               Dismiss
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="mt-6 flex justify-center">
//           <button 
//             onClick={() => setShowDisclaimer(true)}
//             className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
//           >
//             <IoWarning className="w-3 h-3" />
//             <span className="text-sm font-medium">Show Disclaimer</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Review;


import React, { useState, useEffect, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Clock, ChevronDown, ExternalLink, Eye, Hash, RefreshCw, User, Image as ImageIcon, Calendar } from 'lucide-react';
import { IoWarning } from 'react-icons/io5';

function Review({ symbol }) {
  const [expandedComments, setExpandedComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [timeFilter, setTimeFilter] = useState('1 Month');
  const [sortFilter, setSortFilter] = useState('Recent');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [redditData, setRedditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  // API integration
  const fetchRedditData = async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const timeframeMap = {
        '1 Week': '1_week',
        '15 Days': '15_days', 
        '1 Month': '1_month',
        '3 Months': '3_months',
        '6 Months': '6_months',
        '1 Year': '1_year',
        'All Time': 'all_time'
      };
      
      const timeframe = timeframeMap[timeFilter] || '1_month';
      const apiUrl = `${API_BASE}/reddit/scrape?keyword=${encodeURIComponent(symbol)}&timeframe=${timeframe}`;
      
      console.log('Fetching data with timeframe:', timeframe, 'URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setRedditData(result.data);
        console.log('Data received:', result.data);
      } else {
        throw new Error('No data available');
      }
      
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      setRedditData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedditData();
  }, [symbol, timeFilter]);

  // Auto-hide disclaimer after 20 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowDisclaimer(false), 20000);
    return () => clearTimeout(timer);
  }, []);

  const toggleCommentExpansion = (commentId) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Enhanced datetime formatting
  const formatDateTime = (timestamp) => {
    if (!timestamp) return { relative: 'Unknown time', full: 'Date not available' };
    
    try {
      const date = new Date(timestamp);
      
      if (isNaN(date.getTime())) {
        return { relative: 'Invalid date', full: 'Invalid date' };
      }

      // Relative time
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      let relativeTime;
      if (diffInSeconds < 60) relativeTime = 'just now';
      else if (diffInSeconds < 3600) relativeTime = `${Math.floor(diffInSeconds / 60)}m ago`;
      else if (diffInSeconds < 86400) relativeTime = `${Math.floor(diffInSeconds / 3600)}h ago`;
      else if (diffInSeconds < 2592000) relativeTime = `${Math.floor(diffInSeconds / 86400)}d ago`;
      else if (diffInSeconds < 31536000) relativeTime = `${Math.floor(diffInSeconds / 2592000)}mo ago`;
      else relativeTime = `${Math.floor(diffInSeconds / 31536000)}y ago`;

      // Full formatted date and time
      const fullDateTime = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Date only for tooltip
      const dateOnly = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Time only
      const timeOnly = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      return {
        relative: relativeTime,
        full: fullDateTime,
        date: dateOnly,
        time: timeOnly,
        iso: timestamp,
        rawDate: date
      };
    } catch (error) {
      return { relative: 'Date error', full: 'Date format error' };
    }
  };

  // Improved profile picture function
  const getProfilePicture = (userData) => {
    if (!userData) {
      return null;
    }

    const profileUrl = userData.author_profile || 
                      userData.comment_author_profile || 
                      userData.profile_picture ||
                      userData.author_avatar;

    if (profileUrl && 
        (profileUrl.includes('redditstatic.com') || 
         profileUrl.includes('redd.it') ||
         profileUrl.startsWith('https://'))) {
      return profileUrl;
    }

    return null;
  };

  // Format text with proper spacing and line breaks
  const formatText = (text) => {
    if (!text) return null;
    
    let formattedText = text
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/\s+/g, ' ')
      .trim();

    if (!formattedText.startsWith('<p>')) {
      formattedText = `<p>${formattedText}</p>`;
    }

    return (
      <div 
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  // Process and truncate text with "Read More" functionality
  const truncateText = (text, maxLength, postId) => {
    if (!text) return 'No content available';
    
    const isExpanded = expandedPosts[postId];
    const shouldTruncate = text.length > maxLength && !isExpanded;
    
    const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
    return (
      <div className="space-y-2">
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {formatText(displayText)}
        </div>
        {text.length > maxLength && (
          <button
            onClick={() => togglePostExpansion(postId)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  };

  const truncateComment = (text, maxLength, commentId) => {
    if (!text) return 'No comment content';
    
    const isExpanded = expandedComments[commentId];
    const shouldTruncate = text.length > maxLength && !isExpanded;
    
    const displayText = shouldTruncate ? text.slice(0, maxLength) + '...' : text;
    
    return (
      <div className="space-y-2">
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {formatText(displayText)}
        </div>
        {text.length > maxLength && (
          <button
            onClick={() => toggleCommentExpansion(commentId)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>
    );
  };

  // Profile picture component with fallback
  const ProfilePicture = ({ userData, size = 10, className = "" }) => {
    const profileUrl = getProfilePicture(userData);
    const [imgError, setImgError] = useState(false);

    if (profileUrl && !imgError) {
      return (
        <img
          src={profileUrl}
          alt={userData?.author || userData?.comment_author || 'User'}
          className={`w-${size} h-${size} rounded-full border-2 border-white dark:border-gray-700 shadow-sm object-cover ${className}`}
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div className={`w-${size} h-${size} rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-700 flex items-center justify-center ${className}`}>
        <User className={`w-${size - 4} h-${size - 4} text-gray-500 dark:text-gray-400`} />
      </div>
    );
  };

  // Image gallery component for post and comment images
  const ImageGallery = ({ images, className = "" }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className={`mt-3 ${className}`}>
        <div className="flex flex-wrap gap-2">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={imageUrl}
                alt={`Post image ${index + 1}`}
                className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-600 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(imageUrl, '_blank')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // DateTime display component with tooltip
  const DateTimeDisplay = ({ timestamp, type = "post", showFull = false }) => {
    const datetimeInfo = formatDateTime(timestamp);
    
    return (
      <div className="flex items-center space-x-1 group relative">
        <Clock className="w-3 h-3 text-gray-400" />
        <span 
          className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
          title={`${datetimeInfo.date} at ${datetimeInfo.time}`}
        >
          {showFull ? datetimeInfo.full : datetimeInfo.relative}
        </span>
        
        {/* Enhanced tooltip on hover */}
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex flex-col items-center">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 shadow-lg z-50 whitespace-nowrap">
            <div className="flex items-center space-x-1 mb-1">
              <Calendar className="w-3 h-3" />
              <span className="font-medium">{datetimeInfo.date}</span>
            </div>
            <div className="text-gray-300">
              {datetimeInfo.time}
            </div>
            {type === "scrape" && (
              <div className="mt-1 pt-1 border-t border-gray-600 text-gray-400">
                Data collection time
              </div>
            )}
          </div>
          <div className="w-3 h-3 bg-gray-900 dark:bg-gray-700 rotate-45 transform -mt-2"></div>
        </div>
      </div>
    );
  };

  // Improved Reddit data processing
  const processRedditData = () => {
    if (!redditData?.subreddits) {
      console.log('No subreddits data available');
      return [];
    }
    
    const allPosts = [];
    
    try {
      Object.values(redditData.subreddits).forEach(subredditData => {
        if (!subredditData) return;
        
        console.log('Processing subreddit:', subredditData.subreddit_name);
        
        Object.values(subredditData.categories || {}).forEach(category => {
          if (!category?.posts) return;
          
          console.log(`Processing ${category.posts.length} posts in category`);
          
          category.posts.forEach(post => {
            if (!post) return;

            const mainComment = {
              id: `post_${post.post_id || Math.random()}`,
              userName: post.author || 'Unknown User',
              comment: post.post_description || post.post_title || 'No content',
              timestamp: post.created_datetime,
              actualTimestamp: new Date(post.created_datetime),
              likes: post.post_upvotes || 0,
              dislikes: post.post_downvotes || 0,
              userData: post,
              isRecent: new Date(post.created_datetime) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              subComments: [],
              postUrl: post.post_url,
              subredditName: subredditData.subreddit_name || 'Unknown Subreddit',
              title: post.post_title || 'Untitled',
              totalComments: post.num_comments || 0,
              postImages: post.post_images || [],
              commentImages: post.comment_images || []
            };

            // Process comments with images and proper datetime
            if (post.comments) {
              const allComments = [];
              
              Object.values(post.comments).forEach(commentCategory => {
                if (Array.isArray(commentCategory)) {
                  commentCategory.forEach(comment => {
                    if (comment && comment.comment_author !== 'AutoModerator') {
                      allComments.push({
                        id: comment.comment_id || `comment_${Math.random()}`,
                        userName: comment.comment_author || 'Unknown User',
                        comment: comment.comment_body || 'No comment content',
                        timestamp: comment.comment_created_datetime, // Use the actual datetime from backend
                        actualTimestamp: new Date(comment.comment_created_datetime),
                        likes: comment.comment_upvotes || 0,
                        userData: comment,
                        commentImages: comment.comment_images || []
                      });
                    }
                  });
                }
              });

              // Remove duplicates based on comment ID
              const uniqueComments = allComments.filter((comment, index, self) => 
                index === self.findIndex(c => c.id === comment.id)
              );
              
              console.log(`Found ${uniqueComments.length} unique comments for post`);
              mainComment.subComments = uniqueComments;
            }

            allPosts.push(mainComment);
          });
        });
      });
    } catch (error) {
      console.error('Error processing Reddit data:', error);
    }

    console.log(`Total posts processed: ${allPosts.length}`);
    return allPosts;
  };

  // Fixed sort function - properly handles all sort options
  const filteredAndSortedPosts = useMemo(() => {
    const allPosts = processRedditData();
    
    console.log(`Sorting ${allPosts.length} posts by: ${sortFilter}`);

    let sortedPosts = [...allPosts];

    switch (sortFilter) {
      case 'Recent':
        sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'Top':
        sortedPosts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      case 'Controversial':
        sortedPosts.sort((a, b) => {
          const aScore = (a.likes || 0) - (a.dislikes || 0);
          const bScore = (b.likes || 0) - (b.dislikes || 0);
          return Math.abs(aScore) - Math.abs(bScore);
        });
        break;
      case 'Most Discussed':
        sortedPosts.sort((a, b) => (b.totalComments || 0) - (a.totalComments || 0));
        break;
      case 'New':
        sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'Old':
        sortedPosts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      default:
        sortedPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    console.log(`Sorted ${sortedPosts.length} posts by ${sortFilter}`);
    return sortedPosts;
  }, [redditData, sortFilter]);

  const timeOptions = ['1 Week', '15 Days', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'];
  const sortOptions = ['Recent', 'Top', 'Controversial', 'Most Discussed', 'New', 'Old'];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Reddit discussions for {symbol}...</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Time range: {timeFilter}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reddit Discussions for {symbol}
              </h2>
              {redditData && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data scraped</span>
                  <DateTimeDisplay timestamp={redditData.scrape_timestamp} type="scrape" showFull={true} />
                  <span className="text-sm text-gray-500 dark:text-gray-500">• Filter: {timeFilter} • Sort: {sortFilter}</span>
                </div>
              )}
            </div>
            {error && (
              <button
                onClick={fetchRedditData}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <IoWarning className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">Failed to load data</h3>
          <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRedditData}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading Data</span>
          </button>
        </div>
      )}

      {/* Content */}
      {!error && redditData && (
        <>
          {/* Filters */}
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {/* Time Filter - UNCOMMENTED */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range:</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[110px] justify-between"
                      >
                        <span>{timeFilter}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showTimeDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                          {timeOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setTimeFilter(option);
                                setShowTimeDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                                timeFilter === option 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Sort Filter */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
                    <div className="relative">
                      <button
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-[130px] justify-between"
                      >
                        <span>{sortFilter}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showSortDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                          {sortOptions.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSortFilter(option);
                                setShowSortDropdown(false);
                              }}
                              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                                sortFilter === option 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium' 
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>Showing {filteredAndSortedPosts.length} discussions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.map((post) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200">
                  
                  {/* Post Header */}
                  <div className="flex items-start space-x-3">
                    <ProfilePicture userData={post.userData} size={10} />
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.userName}</span>
                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                          <DateTimeDisplay timestamp={post.timestamp} type="post" />
                          {/* <div className="flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                            <Hash className="w-3 h-3" />
                            <span className="text-xs font-medium">r/{post.subredditName}</span>
                          </div> */}
                          {post.isRecent && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                              Recent
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Post Content */}
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 pt-1">
                        {post.title}
                      </h3>
                      
                      <div className="text-gray-700 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                        {truncateText(post.comment, 300, post.id)}
                      </div>

                      {/* Post Images */}
                      <ImageGallery images={post.postImages} />

                      {/* Engagement Metrics */}
                      <div className="flex items-center space-x-4 mt-4">
                        <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group">
                          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium">{post.dislikes}</span>
                        </button>
                        
                        <button 
                          className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors group"
                          onClick={() => toggleCommentExpansion(post.id)}
                        >
                          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                            <MessageCircle className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium">{post.subComments.length}</span>
                        </button>
                        
                        {/* <a 
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                        >
                          <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                            <ExternalLink className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium">Source</span>
                        </a> */}
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedComments[post.id] && post.subComments.length > 0 && (
                    <div className="ml-12 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {post.subComments.length} comments
                      </div>

                      {/* Comments List */}
                      <div className="space-y-4">
                        {post.subComments.map((subComment) => (
                          <div key={subComment.id} className="flex items-start space-x-2">
                            <ProfilePicture userData={subComment.userData} size={6} />
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white text-sm">{subComment.userName}</span>
                                <DateTimeDisplay timestamp={subComment.timestamp} type="comment" />
                              </div>
                              
                              <div className="text-gray-700 dark:text-gray-300 text-sm mb-2 leading-relaxed">
                                {truncateComment(subComment.comment, 200, subComment.id)}
                              </div>

                              {/* Comment Images */}
                              <ImageGallery images={subComment.commentImages} className="!mt-2" />
                              
                              <div className="flex items-center space-x-3 mt-2">
                                <button className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs">
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>{subComment.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">No discussions found</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No Reddit discussions found for {symbol} in the {timeFilter.toLowerCase()} time range.
                </p>
                <button
                  onClick={() => setTimeFilter('All Time')}
                  className="mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Try "All Time" filter
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Disclaimer */}
      {showDisclaimer ? (
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-4">
          <div className="flex items-start space-x-3">
            <IoWarning className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300 mb-1">
                Investment Disclaimer
              </h4>
              <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                These discussions are from online forums and should not be considered professional investment advice. 
                Always consult with qualified financial advisors before making investment decisions.
              </p>
            </div>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 transition-colors text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex justify-center">
          <button 
            onClick={() => setShowDisclaimer(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded hover:bg-orange-200 dark:hover:bg-orange-900/30 transition-colors"
          >
            <IoWarning className="w-3 h-3" />
            <span className="text-sm font-medium">Show Disclaimer</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Review;