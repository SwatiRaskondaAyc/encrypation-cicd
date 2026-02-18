




// import React, { useState, useRef, useEffect } from 'react'
// import Navbar from '../Navbar'
// import { TrendingUp, Search, X, Plus, ExternalLink, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

// function BrokerageCalculator() {
//   const [formData, setFormData] = useState({
//     quantity: '',
//     buyPrice: '',
//     sellPrice: '',
//     exchange: 'NSE',
//     equityType: 'Delivery',
//     broker: '',
//     gender: ''
//   });

//   const [results, setResults] = useState(null);
//   const [comparisonResults, setComparisonResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [compareLoading, setCompareLoading] = useState(false);
//   const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
//   const [showCompareDropdown, setShowCompareDropdown] = useState(false);
//   const [selectedBrokers, setSelectedBrokers] = useState([]);
//   const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
//   const [brokerSearch, setBrokerSearch] = useState('');
//   const [focusedBrokerIndex, setFocusedBrokerIndex] = useState(-1);

//   const brokerDropdownRef = useRef(null);
//   const brokerInputRef = useRef(null);
//   const compareDropdownRef = useRef(null);
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

//   const brokersList = [
//     { id: 'GROWW', name: 'GROWW', calculatorUrl: 'https://groww.in/calculators/brokerage-calculator' },
//     { id: 'ZERODHA', name: 'ZERODHA', calculatorUrl: 'https://zerodha.com/brokerage-calculator' },
//     { id: 'ANGELONE', name: 'ANGEL ONE', calculatorUrl: 'https://angelone.in/brokerage-calculator' },
//     { id: 'UPSTOX', name: 'UPSTOX', calculatorUrl: 'https://upstox.com/brokerage-calculator' },
//     { id: 'SHAREKHAN', name: 'Sharekhan', calculatorUrl: 'https://sharekhan.com/brokerage-calculator' },
//     { id: '5PAISA', name: '5paisa', calculatorUrl: 'https://5paisa.com/brokerage-calculator' },
//     { id: 'SAMCO', name: 'SAMCO', calculatorUrl: 'https://samco.in/brokerage-calculator' },
//   ];

//   // Filter brokers based on search
//   const filteredBrokers = brokersList.filter(broker =>
//     broker.name.toLowerCase().includes(brokerSearch.toLowerCase())
//   );

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (brokerDropdownRef.current && !brokerDropdownRef.current.contains(event.target)) {
//         setShowBrokerDropdown(false);
//         setFocusedBrokerIndex(-1);
//       }
//       if (compareDropdownRef.current && !compareDropdownRef.current.contains(event.target)) {
//         setShowCompareDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Handle keyboard navigation for broker dropdown
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!showBrokerDropdown) return;

//       if (e.key === 'ArrowDown') {
//         e.preventDefault();
//         setFocusedBrokerIndex(prev => 
//           prev < filteredBrokers.length - 1 ? prev + 1 : 0
//         );
//       } else if (e.key === 'ArrowUp') {
//         e.preventDefault();
//         setFocusedBrokerIndex(prev => 
//           prev > 0 ? prev - 1 : filteredBrokers.length - 1
//         );
//       } else if (e.key === 'Enter' && focusedBrokerIndex >= 0) {
//         e.preventDefault();
//         handleBrokerSelect(filteredBrokers[focusedBrokerIndex].id);
//       } else if (e.key === 'Escape') {
//         setShowBrokerDropdown(false);
//         setFocusedBrokerIndex(-1);
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     return () => document.removeEventListener('keydown', handleKeyDown);
//   }, [showBrokerDropdown, focusedBrokerIndex, filteredBrokers]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleBrokerSelect = (brokerId) => {
//     setFormData(prev => ({
//       ...prev,
//       broker: brokerId
//     }));
//     setShowBrokerDropdown(false);
//     setBrokerSearch('');
//     setFocusedBrokerIndex(-1);
//   };

//   const handleBrokerSearchChange = (e) => {
//     setBrokerSearch(e.target.value);
//     setFocusedBrokerIndex(-1);
//     if (!showBrokerDropdown) {
//       setShowBrokerDropdown(true);
//     }
//   };

//   const toggleBrokerDropdown = () => {
//     setShowBrokerDropdown(!showBrokerDropdown);
//     setFocusedBrokerIndex(-1);
//     if (!showBrokerDropdown) {
//       setBrokerSearch('');
//     }
//   };

//   const showToastMessage = (message, type = 'success') => {
//     setShowToast({ show: true, message, type });
//     setTimeout(() => {
//       setShowToast({ show: false, message: '', type: 'success' });
//     }, 3000);
//   };

//   const calculateBrokerage = async (broker = null) => {
//     const currentBroker = broker || formData.broker;
    
//     // More specific validation
//     const missingFields = [];
//     if (!formData.quantity) missingFields.push('Quantity');
//     if (!formData.buyPrice) missingFields.push('Buy Price');
//     if (!formData.sellPrice) missingFields.push('Sell Price');
//     if (!currentBroker) missingFields.push('Broker');
//     if (!formData.gender) missingFields.push('Gender');
    
//     if (missingFields.length > 0) {
//       if (!broker) { // Only show toast for single calculation, not for comparison
//         showToastMessage(`Please fill in: ${missingFields.join(', ')}`, 'error');
//       }
//       return null;
//     }

//     const loadingState = broker ? setCompareLoading : setLoading;
//     loadingState(true);

//     try {
//       const requestBody = {
//         exchange: formData.exchange,
//         buyPrice: parseFloat(formData.buyPrice),
//         sellPrice: parseFloat(formData.sellPrice),
//         gender: formData.gender,
//         quantity: parseInt(formData.quantity),
//         broker: currentBroker,
//         timeframe: formData.equityType
//       };

//       const response = await fetch(`${API_BASE}/brokerage/calculate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestBody)
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to calculate brokerage');
//       }

//       const data = await response.json();
      
//       if (data.status === 'success') {
//         if (broker) {
//           return data.data;
//         } else {
//           setResults(data.data);
//           showToastMessage('Brokerage calculated successfully!');
//           return data.data;
//         }
//       } else {
//         throw new Error(data.message || 'Calculation failed');
//       }
//     } catch (err) {
//       console.error('API Error:', err);
//       let errorMessage = 'Something went wrong';
      
//       if (err.message.includes('Failed to fetch')) {
//         errorMessage = 'Unable to connect to the server. Please check your connection.';
//       } else if (err.message.includes('Calculation failed')) {
//         errorMessage = 'Brokerage calculation failed. Please check your input values.';
//       }
      
//       if (!broker) {
//         showToastMessage(errorMessage, 'error');
//       }
//       return null;
//     } finally {
//       loadingState(false);
//     }
//   };

//   const handleCompare = async () => {
//     if (selectedBrokers.length === 0) {
//       showToastMessage('Please select at least one broker to compare', 'error');
//       return;
//     }

//     // Add validation for required fields before proceeding
//     const missingFields = [];
//     if (!formData.quantity) missingFields.push('Quantity');
//     if (!formData.buyPrice) missingFields.push('Buy Price');
//     if (!formData.sellPrice) missingFields.push('Sell Price');
//     if (!formData.gender) missingFields.push('Gender');
    
//     if (missingFields.length > 0) {
//       showToastMessage(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
//       return;
//     }

//     setCompareLoading(true);

//     try {
//       const comparisonPromises = selectedBrokers.map(brokerId => 
//         calculateBrokerage(brokerId)
//       );

//       const results = await Promise.all(comparisonPromises);
//       const validResults = results.filter(result => result !== null);
      
//       setComparisonResults(validResults);
//       setShowCompareDropdown(false);
      
//       // Only show success message if we actually have results
//       if (validResults.length > 0) {
//         showToastMessage(`Compared ${validResults.length} broker(s) successfully!`);
//       } else {
//         showToastMessage('No valid results to compare. Please check your input values.', 'error');
//       }
//     } catch (err) {
//       showToastMessage('Failed to compare brokers', 'error');
//     } finally {
//       setCompareLoading(false);
//     }
//   };

//   const addBrokerToCompare = (brokerId) => {
//     if (selectedBrokers.length >= 3) {
//       showToastMessage('Maximum 3 brokers can be compared', 'error');
//       return;
//     }
    
//     if (!selectedBrokers.includes(brokerId)) {
//       setSelectedBrokers(prev => [...prev, brokerId]);
//     }
//   };

//   const removeBrokerFromCompare = (brokerId) => {
//     setSelectedBrokers(prev => prev.filter(id => id !== brokerId));
//   };

//   const resetCalculator = () => {
//     setFormData({
//       quantity: '',
//       buyPrice: '',
//       sellPrice: '',
//       exchange: 'NSE',
//       equityType: 'Delivery',
//       broker: '',
//       gender: ''
//     });
//     setResults(null);
//     setComparisonResults([]);
//     setSelectedBrokers([]);
//     setBrokerSearch('');
//   };

//   const calculateTurnover = () => {
//     if (!formData.quantity || !formData.buyPrice || !formData.sellPrice) return null;
    
//     const quantity = parseFloat(formData.quantity);
//     const buyPrice = parseFloat(formData.buyPrice);
//     const sellPrice = parseFloat(formData.sellPrice);
    
//     const buyTurnover = quantity * buyPrice;
//     const sellTurnover = quantity * sellPrice;
//     const totalTurnover = buyTurnover + sellTurnover;
//     const grossPL = sellTurnover - buyTurnover;
    
//     return {
//       buyTurnover,
//       sellTurnover,
//       totalTurnover,
//       grossPL
//     };
//   };

//   const turnover = calculateTurnover();

//   const calculateCombinedCharges = (resultData) => {
//     if (!resultData) return null;

//     const allCharges = new Set([
//       ...Object.keys(resultData.Buy_Leg || {}),
//       ...Object.keys(resultData.Sell_Leg || {})
//     ]);

//     const combinedCharges = {};
//     allCharges.forEach(chargeName => {
//       const buyCharge = parseFloat(resultData.Buy_Leg[chargeName] || 0);
//       const sellCharge = parseFloat(resultData.Sell_Leg[chargeName] || 0);
//       combinedCharges[chargeName] = buyCharge + sellCharge;
//     });

//     return combinedCharges;
//   };

//   const getBrokerName = (brokerId) => {
//     const broker = brokersList.find(b => b.id === brokerId);
//     return broker ? broker.name : brokerId;
//   };

//   const getBrokerCalculatorUrl = (brokerId) => {
//     const broker = brokersList.find(b => b.id === brokerId);
//     return broker ? broker.calculatorUrl : '#';
//   };

//   const getAllChargeTypes = (resultsArray) => {
//     const allCharges = new Set();
//     resultsArray.forEach(result => {
//       if (result.Buy_Leg) {
//         Object.keys(result.Buy_Leg).forEach(charge => allCharges.add(charge));
//       }
//       if (result.Sell_Leg) {
//         Object.keys(result.Sell_Leg).forEach(charge => allCharges.add(charge));
//       }
//     });
//     return Array.from(allCharges);
//   };

//   const getAllNetChargeTypes = (resultsArray) => {
//     const allCharges = new Set();
//     resultsArray.forEach(result => {
//       const combined = calculateCombinedCharges(result);
//       if (combined) {
//         Object.keys(combined).forEach(charge => allCharges.add(charge));
//       }
//     });
//     return Array.from(allCharges);
//   };

//   // Color coding helper functions
//   const getValueColor = (values, currentIndex) => {
//     const currentValue = parseFloat(values[currentIndex]);
//     const minValue = Math.min(...values.map(v => parseFloat(v)));
//     const maxValue = Math.max(...values.map(v => parseFloat(v)));
    
//     if (currentValue === minValue && currentValue === maxValue) {
//       return 'text-green-600'; // All values are equal - green
//     } else if (currentValue === minValue) {
//       return 'text-green-600 font-bold'; // Lowest value - green and bold
//     } else if (currentValue === maxValue) {
//       return 'text-red-600'; // Highest value - red
//     }
//     return 'text-gray-700'; // Middle values - default
//   };

//   // Special color coding for Net P&L - higher is better (green), lower is worse (red)
//   const getNetPLColor = (values, currentIndex) => {
//     const currentValue = parseFloat(values[currentIndex]);
//     const maxValue = Math.max(...values.map(v => parseFloat(v)));
//     const minValue = Math.min(...values.map(v => parseFloat(v)));
    
//     if (currentValue === maxValue && currentValue === minValue) {
//       return currentValue >= 0 ? 'text-green-600' : 'text-red-600'; // All values equal
//     } else if (currentValue === maxValue) {
//       return 'text-green-600 font-bold'; // Highest Net P&L - green and bold
//     } else if (currentValue === minValue) {
//       return 'text-red-600'; // Lowest Net P&L - red
//     }
//     return currentValue >= 0 ? 'text-green-500' : 'text-red-500'; // Middle values with profit/loss indication
//   };

//   // Enhanced color coding for Breakeven Points - lower is better
//   const getBreakevenColor = (values, currentIndex) => {
//     // Filter out non-numeric values for comparison
//     const numericValues = values
//       .map(v => {
//         if (v === 'N/A' || v === null || v === undefined) return Infinity;
//         const num = parseFloat(v);
//         return isNaN(num) ? Infinity : num;
//       })
//       .filter(v => v !== Infinity);
    
//     if (numericValues.length === 0) return 'text-gray-700';
    
//     const currentValue = parseFloat(values[currentIndex]) || Infinity;
//     const minValue = Math.min(...numericValues);
//     const maxValue = Math.max(...numericValues);
    
//     if (currentValue === minValue && currentValue === maxValue) {
//       return 'text-green-600'; // All values equal
//     } else if (currentValue === minValue) {
//       return 'text-green-600 font-bold'; // Lowest breakeven - best
//     } else if (currentValue === maxValue) {
//       return 'text-red-600'; // Highest breakeven - worst
//     }
//     return 'text-yellow-600'; // Middle values
//   };

//   const getChargeValues = (resultsArray, chargeType, leg = 'Buy_Leg') => {
//     return resultsArray.map(result => parseFloat(result[leg]?.[chargeType] || 0));
//   };

//   const getNetChargeValues = (resultsArray, chargeType) => {
//     return resultsArray.map(result => {
//       const combined = calculateCombinedCharges(result);
//       return parseFloat(combined?.[chargeType] || 0);
//     });
//   };

//   const getTotalChargeValues = (resultsArray, leg = 'Buy_Leg') => {
//     return resultsArray.map(result => 
//       Object.values(result[leg] || {}).reduce((sum, charge) => sum + parseFloat(charge), 0)
//     );
//   };

//   const getRoundTripChargeValues = (resultsArray) => {
//     return resultsArray.map(result => 
//       parseFloat(result.Round_Trip?.Total_Round_Trip_Charges || 0)
//     );
//   };

//   const getNetPLValues = (resultsArray) => {
//     return resultsArray.map(result => 
//       parseFloat(result.Round_Trip?.['Net_P&L'] || 0)
//     );
//   };

//   const getBreakevenValues = (resultsArray) => {
//     return resultsArray.map(result => 
//       result.Points_to_Breakeven || 'N/A'
//     );
//   };

//   // Get AMC values for comparison
//   const getAMCValues = (resultsArray) => {
//     return resultsArray.map(result => result.AMC || 'N/A');
//   };

//   // Get ACC values for comparison
//   const getACCValues = (resultsArray) => {
//     return resultsArray.map(result => result.ACC || 'N/A');
//   };

//   // Check if required fields are filled for comparison
//   const areRequiredFieldsFilled = formData.quantity && formData.buyPrice && formData.sellPrice && formData.gender;

//   return (
//     <>
//       <Navbar />
      
//       {showToast.show && (
//         <div className="fixed top-20 right-4 z-50 dark:bg-gray-900">
//           <div className={`${
//             showToast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
//           } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`}>
//             <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//               {showToast.type === 'error' ? (
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               ) : (
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               )}
//             </svg>
//             <span className="font-medium">{showToast.message}</span>
//           </div>
//         </div>
//       )}

//       <div className='pt-20 px-4 max-w-9xl mx-auto dark:bg-gray-900 min-h-screen '>
//         {/* Header Section */}
//         <div className="mb-6 max-w-4xl mx-auto flex items-start gap-4">
//           <div className="flex-shrink-0 mt-1 bg-blue-100 p-3 rounded-lg">
//             <TrendingUp className="w-10 h-10 text-blue-600" aria-hidden="true" />
//           </div>
//           <div className="text-left">
//             <h1 className="text-4xl font-bold text-gray-900 mb-1 dark:text-sky-400">Brokerage Comparator</h1>
//             <p className="text-gray-600 text-lg max-w-2xl dark:text-gray-300">
//               Calculate exact brokerage charges and compare across different brokers
//             </p>
//           </div>
//         </div>

//         {/* Main Calculator Card */}
//         <div className='bg-white rounded-xl max-w-4xl mx-auto shadow-lg border border-gray-100 p-4 mb-2 dark:bg-gray-800 dark:border-gray-700'>
//           {/* Calculator Type Selection */}
//           <div className='mb-8'>
//             <h3 className='text-sm font-semibold text-gray-500  uppercase tracking-wide mb-2 dark:text-gray-300'>Calculator Type</h3>
//             <div className='flex flex-wrap gap-4'>
//               <button className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors'>
//                 Equity
//               </button>
//               <button className='px-6 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed'>
//                 F&O (Coming Soon)
//               </button>
//             </div>
//           </div>

//           {/* Equity Type Selection */}
//           <div className='mb-4'>
//             <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-300'>Trade Type</h3>
//             <div className='flex gap-3'>
//               <button 
//                 className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
//                   formData.equityType === 'Intraday' 
//                     ? 'bg-green-600 text-white shadow-sm' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => setFormData({...formData, equityType: 'Intraday'})}
//               >
//                 Intraday
//               </button>
//               <button 
//                 className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
//                   formData.equityType === 'Delivery' 
//                     ? 'bg-green-600 text-white shadow-sm' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//                 onClick={() => setFormData({...formData, equityType: 'Delivery'})}
//               >
//                 Delivery
//               </button>
//             </div>
//           </div>

//           {/* Input Section */}
//           <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
//             {/* Left Column */}
//             <div className='space-y-6'>
//               <div>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Quantity *</label>
//                 <input 
//                   type="number"
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleInputChange}
//                   className='w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
//                   placeholder="Enter quantity"
//                 />
//               </div>
              
//               <div>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Exchange</label>
//                 <select 
//                   name="exchange"
//                   value={formData.exchange}
//                   onChange={handleInputChange}
//                   className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
//                 >
//                   <option value="NSE">NSE</option>
//                   <option value="BSE">BSE</option>
//                 </select>
//               </div>
//             </div>

//             {/* Middle Column */}
//             <div className='space-y-6'>
//               <div>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Buy Price *</label>
//                 <input 
//                   type="number"
//                   name="buyPrice"
//                   value={formData.buyPrice}
//                   onChange={handleInputChange}
//                   className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
//                   placeholder="0.00"
//                 />
//               </div>
              
//               <div>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Select Gender *</label>
//                 <select 
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleInputChange}
//                   className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
//                   required
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="MALE">Male</option>
//                   <option value="FEMALE">Female</option>
//                 </select>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className='space-y-6'>
//               <div>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Sell Price *</label>
//                 <div className='relative'>
//                   <input 
//                     type="number"
//                     name="sellPrice"
//                     value={formData.sellPrice}
//                     onChange={handleInputChange}
//                     className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>
              
//               <div className="relative" ref={brokerDropdownRef}>
//                 <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Select Broker *</label>
//                 <div className="relative">
//                   <input 
//                     type="text"
//                     value={brokerSearch || (formData.broker ? getBrokerName(formData.broker) : '')}
//                     onChange={handleBrokerSearchChange}
//                     onFocus={() => setShowBrokerDropdown(true)}
//                     placeholder="Search or select broker..."
//                     className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12'
//                     ref={brokerInputRef}
//                   />
//                   <button
//                     type="button"
//                     onClick={toggleBrokerDropdown}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showBrokerDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//                   </button>
//                 </div>

//                 {/* Broker Dropdown */}
//                 {showBrokerDropdown && (
//                   <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-700">
//                     {/* Search Header */}
//                     <div className="p-3 border-b border-gray-200">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                         <input
//                           type="text"
//                           value={brokerSearch}
//                           onChange={handleBrokerSearchChange}
//                           placeholder="Search brokers..."
//                           className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           autoFocus
//                         />
//                       </div>
//                     </div>

//                     {/* Broker List */}
//                     <div className="py-1">
//                       {filteredBrokers.length > 0 ? (
//                         filteredBrokers.map((broker, index) => (
//                           <div
//                             key={broker.id}
//                             className={`px-4 py-3 cursor-pointer transition-colors ${
//                               formData.broker === broker.id
//                                 ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400'
//                                 : focusedBrokerIndex === index
//                                 ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
//                                 : 'text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
//                             }`}
//                             onClick={() => handleBrokerSelect(broker.id)}
//                             onMouseEnter={() => setFocusedBrokerIndex(index)}
//                           >
//                             <div className="flex items-center justify-between">
//                               <span className="font-medium">{broker.name}</span>
//                               {formData.broker === broker.id && (
//                                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
//                               )}
//                             </div>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="px-4 py-3 text-gray-500 text-center">
//                           No brokers found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className='flex gap-4 pt-4'>
//             <button
//               onClick={() => calculateBrokerage()}
//               disabled={loading}
//               className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
//             >
//               {loading ? (
//                 <div className='flex items-center justify-center gap-2'>
//                   <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
//                   Calculating...
//                 </div>
//               ) : (
//                 'Calculate Brokerage'
//               )}
//             </button>

//             {/* Compare Button with Dropdown */}
//             <div className="relative" ref={compareDropdownRef}>
//               <button
//                 onClick={() => setShowCompareDropdown(!showCompareDropdown)}
//                 disabled={compareLoading || !areRequiredFieldsFilled}
//                 className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
//               >
//                 <Search className="w-4 h-4" />
//                 {compareLoading ? 'Comparing...' : 'Compare'}
//                 {selectedBrokers.length > 0 && (
//                   <span className="bg-green-800 text-xs px-2 py-1 rounded-full">
//                     {selectedBrokers.length}
//                   </span>
//                 )}
//               </button>

//               {showCompareDropdown && (
//                 <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
//                   <div className="p-4">
//                     <div className="flex justify-between items-center mb-3">
//                       <h3 className="font-semibold text-gray-900">Compare Brokers</h3>
//                       <span className="text-sm text-gray-500">
//                         {selectedBrokers.length}/3 selected
//                       </span>
//                     </div>

//                     {/* Selected Brokers */}
//                     <div className="mb-4">
//                       <div className="flex flex-wrap gap-2 mb-3">
//                         {selectedBrokers.map(brokerId => (
//                           <div key={brokerId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
//                             {getBrokerName(brokerId)}
//                             <button
//                               onClick={() => removeBrokerFromCompare(brokerId)}
//                               className="hover:text-blue-600"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Broker Search and List */}
//                     <div className="space-y-2 max-h-60 overflow-y-auto">
//                       {brokersList.map(broker => (
//                         <div
//                           key={broker.id}
//                           className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
//                             selectedBrokers.includes(broker.id)
//                               ? 'bg-blue-50 border-blue-200'
//                               : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
//                           }`}
//                           onClick={() => addBrokerToCompare(broker.id)}
//                         >
//                           <div className="flex items-center gap-3">
//                             <div className={`w-4 h-4 rounded border flex items-center justify-center ${
//                               selectedBrokers.includes(broker.id)
//                                 ? 'bg-blue-600 border-blue-600'
//                                 : 'border-gray-400'
//                             }`}>
//                               {selectedBrokers.includes(broker.id) && (
//                                 <div className="w-2 h-2 bg-white rounded-sm"></div>
//                               )}
//                             </div>
//                             <span className="font-medium text-gray-900">{broker.name}</span>
//                           </div>
//                           {selectedBrokers.includes(broker.id) && (
//                             <Plus className="w-4 h-4 text-blue-600 rotate-45" />
//                           )}
//                         </div>
//                       ))}
//                     </div>

//                     {/* Compare Action Button */}
//                     <button
//                       onClick={handleCompare}
//                       disabled={selectedBrokers.length === 0 || compareLoading || !areRequiredFieldsFilled}
//                       className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {compareLoading ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Comparing...
//                         </div>
//                       ) : (
//                         `Compare ${selectedBrokers.length} Broker${selectedBrokers.length !== 1 ? 's' : ''}`
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={resetCalculator}
//               className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors'
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         {/* Single Broker Results */}
//         {results && !loading && comparisonResults.length === 0 && (
//           <div className='space-y-8 '>
//             {/* Charges Breakdown - Side by Side */}
//             <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700'>
//               <h3 className='text-2xl font-bold text-gray-900 mb-8 text-center dark:text-gray-200'>Charges Breakdown - {getBrokerName(results.Broker)}</h3>
              
//               <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
//                 {/* Buy Leg Charges */}
//                 <div className='bg-blue-50 rounded-xl p-6 border-2 border-blue-200 '>
//                   <h4 className='text-xl font-bold text-blue-900 mb-6 text-center'>Buy Leg Charges</h4>
                  
//                   {/* Turnover Display */}
//                   {turnover && (
//                     <div className='mb-4 p-3 bg-blue-100 rounded-lg'>
//                       <div className='flex justify-between items-center'>
//                         <span className='text-blue-800 font-semibold'>Turnover</span>
//                         <span className='text-blue-900 font-bold'>₹{turnover.buyTurnover.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className='space-y-4'>
//                     {results.Buy_Leg && Object.entries(results.Buy_Leg).map(([key, value]) => (
//                       <div key={key} className='flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0'>
//                         <span className='text-blue-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
//                         <span className='text-blue-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Sell Leg Charges */}
//                 <div className='bg-green-50 rounded-xl p-6 border-2 border-green-200'>
//                   <h4 className='text-xl font-bold text-green-900 mb-6 text-center'>Sell Leg Charges</h4>
                  
//                   {/* Turnover Display */}
//                   {turnover && (
//                     <div className='mb-4 p-3 bg-green-100 rounded-lg'>
//                       <div className='flex justify-between items-center'>
//                         <span className='text-green-800 font-semibold'>Turnover</span>
//                         <span className='text-green-900 font-bold'>₹{turnover.sellTurnover.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className='space-y-4'>
//                     {results.Sell_Leg && Object.entries(results.Sell_Leg).map(([key, value]) => (
//                       <div key={key} className='flex justify-between items-center py-2 border-b border-green-200 last:border-b-0'>
//                         <span className='text-green-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
//                         <span className='text-green-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Net Charges */}
//                 <div className='bg-purple-50 rounded-xl p-6 border-2 border-purple-200'>
//                   <h4 className='text-xl font-bold text-purple-900 mb-6 text-center'>Net Charges</h4>
                  
//                   {/* Total Turnover Display */}
//                   {turnover && (
//                     <div className='mb-4 p-3 bg-purple-100 rounded-lg'>
//                       <div className='flex justify-between items-center'>
//                         <span className='text-purple-800 font-semibold'>Total Turnover</span>
//                         <span className='text-purple-900 font-bold'>₹{turnover.totalTurnover.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   )}
                  
//                   <div className='space-y-4'>
//                     {calculateCombinedCharges(results) && Object.entries(calculateCombinedCharges(results)).map(([key, value]) => (
//                       <div key={key} className='flex justify-between items-center py-2 border-b border-purple-200 last:border-b-0'>
//                         <span className='text-purple-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
//                         <span className='text-purple-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Total Charges Only */}
//                   <div className='border-t-2 border-purple-300 pt-3 mt-4'>
//                     <div className='flex justify-between items-center'>
//                       <span className='text-purple-900 font-bold text-lg'>Total Charges</span>
//                       <span className='text-purple-900 font-bold text-lg'>
//                         ₹{results.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Final Summary Section */}
//             <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-8'>
//               <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Trade Summary - {getBrokerName(results.Broker)}</h3>
              
//               <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
//                 {/* Trade Details */}
//                 <div className='space-y-6'>
//                   <h4 className='text-lg font-semibold text-gray-900'>Transaction Details</h4>
//                   <div className='grid grid-cols-2 gap-4'>
//                     <div>
//                       <p className='text-sm text-gray-600'>Exchange</p>
//                       <p className='font-semibold'>{results.Exchange}</p>
//                     </div>
//                     <div>
//                       <p className='text-sm text-gray-600'>Broker</p>
//                       <p className='font-semibold'>{getBrokerName(results.Broker)}</p>
//                     </div>
//                     <div>
//                       <p className='text-sm text-gray-600'>Trade Type</p>
//                       <p className='font-semibold'>{results.TimeFrame}</p>
//                     </div>
//                     <div>
//                       <p className='text-sm text-gray-600'>Quantity</p>
//                       <p className='font-semibold'>{results.Qty}</p>
//                     </div>
//                   </div>

//                   {/* Enhanced Breakeven Display */}
//                   <div className='flex justify-between items-center pt-3 bg-gray-50 p-4 rounded-lg border border-gray-200'>
//                     <div className='flex items-center gap-2'>
//                       <span className='text-gray-700 font-semibold'>Breakeven Points Required</span>
//                       <div className="group relative">
//                         <div className="w-4 h-4 bg-gray-300 rounded-full text-xs flex items-center justify-center cursor-help text-gray-600">?</div>
//                         <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
//                           Price movement needed to cover brokerage charges
//                           <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className='text-right'>
//                       <span className='font-bold text-lg text-blue-700'>{results.Points_to_Breakeven}</span>
//                       <p className='text-xs text-gray-500 mt-1'>Points needed to cover all charges</p>
//                     </div>
//                   </div>

//                   {/* Broker Calculator Link */}
//                   <div className='pt-2'>
//                     <a 
//                       href={getBrokerCalculatorUrl(results.Broker)}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       <Calculator className="w-4 h-4" />
//                       Open {getBrokerName(results.Broker)} Calculator
//                       <ExternalLink className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </div>

//                 {/* P&L Summary */}
//                 <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200'>
//                   <h4 className='text-lg font-semibold text-gray-900 mb-4'>Profit & Loss Summary</h4>
//                   <div className='space-y-3'>
//                     <div className='flex justify-between'>
//                       <span className='text-gray-600'>Gross P&L</span>
//                       <span className={`font-semibold ${
//                         turnover?.grossPL >= 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         ₹{turnover?.grossPL.toFixed(2)}
//                       </span>
//                     </div>
//                     <div className='flex justify-between'>
//                       <span className='text-gray-600'>Total Charges</span>
//                       <span className='font-semibold text-gray-900'>₹{results.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}</span>
//                     </div>
//                     <div className='flex justify-between pt-3 border-t border-gray-300'>
//                       <span className='text-lg font-bold text-gray-900'>Net P&L</span>
//                       <span className={`text-lg font-bold ${
//                         results.Round_Trip['Net_P&L'] >= 0 ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                         ₹{results.Round_Trip['Net_P&L'].toFixed(2)}
//                       </span>
//                     </div>
//                     {results.AMC && (
//                       <div className='flex justify-between pt-2'>
//                         <span className='text-gray-600'>AMC Charges</span>
//                         <span className='font-semibold text-gray-900'>{results.AMC}</span>
//                       </div>
//                     )}
//                     {results.ACC && (
//                       <div className='flex justify-between pt-2'>
//                         <span className='text-gray-600'>Account Creation</span>
//                         <span className='font-semibold text-gray-900'>{results.ACC}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Comparison Results */}
//         {comparisonResults.length > 0 && (
//           <div className="space-y-8">
//             {/* Comparison Summary */}
//             <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//               <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
//                 Broker Comparison Results
//               </h3>

//               {/* Turnover Summary */}
//               {turnover && (
//                 <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
//                   <h4 className="text-xl font-bold text-gray-800 mb-4">Turnover Summary</h4>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//                     <div className="bg-white rounded-lg p-4 border border-green-200 shadow-xs">
//                       <p className="text-sm font-medium text-gray-600 mb-2">Buy Turnover</p>
//                       <p className="text-lg font-bold text-gray-900">₹{turnover.buyTurnover.toFixed(2)}</p>
//                     </div>
                    
//                     <div className="bg-white rounded-lg p-4 border border-red-200 shadow-xs">
//                       <p className="text-sm font-medium text-gray-600 mb-2">Sell Turnover</p>
//                       <p className="text-lg font-bold text-gray-900">₹{turnover.sellTurnover.toFixed(2)}</p>
//                     </div>
                    
//                     <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-xs">
//                       <p className="text-sm font-medium text-gray-600 mb-2">Total Turnover</p>
//                       <p className="text-lg font-bold text-gray-900">₹{turnover.totalTurnover.toFixed(2)}</p>
//                     </div>
//                   </div>
                  
//                   <div className={`mt-4 p-4 rounded-lg border ${
//                     turnover.grossPL >= 0 
//                       ? 'bg-green-50 border-green-200' 
//                       : 'bg-red-50 border-red-200'
//                   }`}>
//                     <p className="text-sm font-medium text-gray-600 mb-1">Gross P&L (Sell - Buy)</p>
//                     <p className={`text-xl font-bold ${
//                       turnover.grossPL >= 0 ? 'text-green-600' : 'text-red-600'
//                     }`}>
//                       ₹{turnover.grossPL.toFixed(2)}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Buy Leg Charges Comparison */}
//               <div className="mb-8">
//                 <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Charges on Buy Leg</h4>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
//                           Charges
//                         </th>
//                         {comparisonResults.map((result, index) => (
//                           <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
//                             {getBrokerName(result.Broker)}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Turnover Row */}
//                       <tr className="border-b">
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">Turnover</td>
//                         {comparisonResults.map((result, index) => (
//                           <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
//                             ₹{turnover ? turnover.buyTurnover.toFixed(2) : '0.00'}
//                           </td>
//                         ))}
//                       </tr>
                      
//                       {/* Buy Leg Charges */}
//                       {getAllChargeTypes(comparisonResults).map((chargeType) => {
//                         const chargeValues = getChargeValues(comparisonResults, chargeType, 'Buy_Leg');
//                         return (
//                           <tr key={chargeType} className="border-b">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
//                               {chargeType.replace(/_/g, ' ')}
//                             </td>
//                             {comparisonResults.map((result, index) => (
//                               <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
//                                 ₹{parseFloat(result.Buy_Leg[chargeType] || 0).toFixed(2)}
//                               </td>
//                             ))}
//                           </tr>
//                         );
//                       })}

//                       {/* Total Buy Charges */}
//                       <tr className="border-b bg-blue-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Buy Charges</td>
//                         {comparisonResults.map((result, index) => {
//                           const totalValues = getTotalChargeValues(comparisonResults, 'Buy_Leg');
//                           return (
//                             <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(totalValues, index)}`}>
//                               ₹{Object.values(result.Buy_Leg || {}).reduce((sum, charge) => sum + parseFloat(charge), 0).toFixed(2)}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Sell Leg Charges Comparison */}
//               <div className="mb-8">
//                 <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Charges on Sell Leg</h4>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
//                           Charges
//                         </th>
//                         {comparisonResults.map((result, index) => (
//                           <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
//                             {getBrokerName(result.Broker)}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Sell Turnover */}
//                       <tr className="border-b">
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">Turnover</td>
//                         {comparisonResults.map((result, index) => (
//                           <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
//                             ₹{turnover ? turnover.sellTurnover.toFixed(2) : '0.00'}
//                           </td>
//                         ))}
//                       </tr>

//                       {/* Sell Leg Charges */}
//                       {getAllChargeTypes(comparisonResults).map((chargeType) => {
//                         const chargeValues = getChargeValues(comparisonResults, chargeType, 'Sell_Leg');
//                         return (
//                           <tr key={`sell-${chargeType}`} className="border-b">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
//                               {chargeType.replace(/_/g, ' ')}
//                             </td>
//                             {comparisonResults.map((result, index) => (
//                               <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
//                                 ₹{parseFloat(result.Sell_Leg[chargeType] || 0).toFixed(2)}
//                               </td>
//                             ))}
//                           </tr>
//                         );
//                       })}

//                       {/* Total Sell Charges */}
//                       <tr className="border-b bg-green-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Sell Charges</td>
//                         {comparisonResults.map((result, index) => {
//                           const totalValues = getTotalChargeValues(comparisonResults, 'Sell_Leg');
//                           return (
//                             <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(totalValues, index)}`}>
//                               ₹{Object.values(result.Sell_Leg || {}).reduce((sum, charge) => sum + parseFloat(charge), 0).toFixed(2)}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Net Charges Comparison */}
//               <div className="mb-8">
//                 <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Net Charges</h4>
//                 <div className="overflow-x-auto">
//                   <table className="w-full border-collapse">
//                     <thead>
//                       <tr className="bg-gray-50">
//                         <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
//                           Charges
//                         </th>
//                         {comparisonResults.map((result, index) => (
//                           <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
//                             {getBrokerName(result.Broker)}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {/* Total Turnover */}
//                       <tr className="border-b">
//                         <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Turnover</td>
//                         {comparisonResults.map((result, index) => (
//                           <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
//                             ₹{turnover ? turnover.totalTurnover.toFixed(2) : '0.00'}
//                           </td>
//                         ))}
//                       </tr>

//                       {/* Net Charges */}
//                       {getAllNetChargeTypes(comparisonResults).map((chargeType) => {
//                         const chargeValues = getNetChargeValues(comparisonResults, chargeType);
//                         return (
//                           <tr key={`net-${chargeType}`} className="border-b">
//                             <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
//                               {chargeType.replace(/_/g, ' ')}
//                             </td>
//                             {comparisonResults.map((result, index) => (
//                               <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
//                                 ₹{parseFloat(calculateCombinedCharges(result)?.[chargeType] || 0).toFixed(2)}
//                               </td>
//                             ))}
//                           </tr>
//                         );
//                       })}

//                       {/* Total Round Trip Charges */}
//                       <tr className="border-b bg-purple-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Round Trip Charges</td>
//                         {comparisonResults.map((result, index) => {
//                           const roundTripValues = getRoundTripChargeValues(comparisonResults);
//                           return (
//                             <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(roundTripValues, index)}`}>
//                               ₹{result.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Net P&L - Updated with special color coding */}
//                       <tr className="border-b">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Net P&L</td>
//                         {comparisonResults.map((result, index) => {
//                           const netPLValues = getNetPLValues(comparisonResults);
//                           return (
//                             <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getNetPLColor(netPLValues, index)}`}>
//                               ₹{result.Round_Trip['Net_P&L'].toFixed(2)}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Enhanced Breakeven Points with Color Coding */}
//                       <tr className="border-b bg-yellow-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Breakeven Points</td>
//                         {comparisonResults.map((result, index) => {
//                           const breakevenValues = getBreakevenValues(comparisonResults);
//                           return (
//                             <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getBreakevenColor(breakevenValues, index)}`}>
//                               {result.Points_to_Breakeven || 'N/A'}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* AMC Charges */}
//                       <tr className="border-b bg-orange-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">AMC Charges</td>
//                         {comparisonResults.map((result, index) => {
//                           const amcValues = getAMCValues(comparisonResults);
//                           return (
//                             <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
//                               {result.AMC || 'N/A'}
//                             </td>
//                           );
//                         })}
//                       </tr>

//                       {/* Account Creation Charges */}
//                       {/* <tr className="border-b bg-pink-50">
//                         <td className="px-4 py-3 text-sm font-bold text-gray-900">Account Creation</td>
//                         {comparisonResults.map((result, index) => {
//                           const accValues = getACCValues(comparisonResults);
//                           return (
//                             <td key={index} className="px-4 py-3 text-center text-sm font-bold text-gray-700">
//                               {result.ACC || 'N/A'}
//                             </td>
//                           );
//                         })}
//                       </tr> */}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Broker Calculator Links */}
//               <div className="mt-6 flex flex-wrap gap-6 justify-end">
//                 {comparisonResults.map((result, index) => (
//                   <a
//                     key={index}
//                     href={getBrokerCalculatorUrl(result.Broker)}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <Calculator className="w-4 h-4" />
//                     {getBrokerName(result.Broker)} Calculator
//                     <ExternalLink className="w-4 h-4" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add CSS for toast animation */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   )
// }

// export default BrokerageCalculator






import React, { useState, useRef, useEffect } from 'react'
import Navbar from '../Navbar'
import { TrendingUp, Search, X, Plus, ExternalLink, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

function BrokerageCalculator() {
  const [formData, setFormData] = useState({
    quantity: '',
    buyPrice: '',
    sellPrice: '',
    exchange: 'NSE',
    equityType: 'Delivery',
    broker: '',
    gender: ''
  });

  const [results, setResults] = useState(null);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
  const [showCompareDropdown, setShowCompareDropdown] = useState(false);
  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [showBrokerDropdown, setShowBrokerDropdown] = useState(false);
  const [brokerSearch, setBrokerSearch] = useState('');
  const [focusedBrokerIndex, setFocusedBrokerIndex] = useState(-1);

  const brokerDropdownRef = useRef(null);
  const brokerInputRef = useRef(null);
  const compareDropdownRef = useRef(null);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

 const brokersList = [
    { id: 'GROWW', name: 'GROWW', calculatorUrl: 'https://groww.in/calculators/brokerage-calculator' },
    { id: 'ZERODHA', name: 'ZERODHA', calculatorUrl: 'https://zerodha.com/brokerage-calculator' },
    { id: 'ANGELONE', name: 'ANGEL ONE', calculatorUrl: 'https://angelone.in/brokerage-calculator' },
    { id: 'PAYTMMONEY', name: 'Paytm Money', calculatorUrl: 'https://paytmmoney.com/brokerage-calculator' },
    { id: 'DHAN', name: 'DHAN', calculatorUrl: 'https://dhan.co/brokerage-calculator' },
    { id: '5PAISA', name: '5paisa', calculatorUrl: 'https://5paisa.com/brokerage-calculator' },
    { id: 'UPSTOX', name: 'UPSTOX', calculatorUrl: 'https://upstox.com/brokerage-calculator' },
    { id: 'FYERS', name: 'FYERS', calculatorUrl: 'https://fyers.in/brokerage-calculator' },
    { id: 'PROSTOCKS', name: 'ProStocks', calculatorUrl: 'https://prostocks.com/brokerage-calculator' },
    { id: 'ICICIDIRECT_MONEYSAVER', name: 'ICICI Direct Money Saver', calculatorUrl: 'https://icicidirect.com/brokerage-calculator' },
    { id: 'ICICIDIRECT_PRIME_TIER1', name: 'ICICI Direct Prime Tier 1', calculatorUrl: 'https://icicidirect.com/brokerage-calculator' },
    // { id: 'ICICIDIRECT_IVALUE', name: 'ICICI Direct iValue', calculatorUrl: 'https://icicidirect.com/brokerage-calculator' },
    { id: 'KOTAK_TRADE_FREE_YOUTH', name: 'Kotak Trade Free Youth', calculatorUrl: 'https://kotaksecurities.com/brokerage-calculator' },
    { id: 'KOTAK_TRADE_FREE', name: 'Kotak Trade Free', calculatorUrl: 'https://kotaksecurities.com/brokerage-calculator' },
    { id: 'INDMONEY', name: 'INDmoney', calculatorUrl: 'https://indmoney.com/brokerage-calculator' },
    { id: 'PHONEPE_SHARE_MARKET', name: 'PhonePe Share Market', calculatorUrl: 'https://phonepe.com/brokerage-calculator' },
    { id: 'SHAREKHAN', name: 'Sharekhan', calculatorUrl: 'https://sharekhan.com/brokerage-calculator' },
    { id: 'SHOONYA', name: 'Shoonya', calculatorUrl: 'https://shoonya.com/brokerage-calculator' },
    { id: 'SAMCO', name: 'SAMCO', calculatorUrl: 'https://samco.in/brokerage-calculator' }
  ];

  // Filter brokers based on search
  const filteredBrokers = brokersList.filter(broker =>
    broker.name.toLowerCase().includes(brokerSearch.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brokerDropdownRef.current && !brokerDropdownRef.current.contains(event.target)) {
        setShowBrokerDropdown(false);
        setFocusedBrokerIndex(-1);
      }
      if (compareDropdownRef.current && !compareDropdownRef.current.contains(event.target)) {
        setShowCompareDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation for broker dropdown
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showBrokerDropdown) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedBrokerIndex(prev => 
          prev < filteredBrokers.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedBrokerIndex(prev => 
          prev > 0 ? prev - 1 : filteredBrokers.length - 1
        );
      } else if (e.key === 'Enter' && focusedBrokerIndex >= 0) {
        e.preventDefault();
        handleBrokerSelect(filteredBrokers[focusedBrokerIndex].id);
      } else if (e.key === 'Escape') {
        setShowBrokerDropdown(false);
        setFocusedBrokerIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showBrokerDropdown, focusedBrokerIndex, filteredBrokers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBrokerSelect = (brokerId) => {
    setFormData(prev => ({
      ...prev,
      broker: brokerId
    }));
    setShowBrokerDropdown(false);
    setBrokerSearch('');
    setFocusedBrokerIndex(-1);
  };

  const handleBrokerSearchChange = (e) => {
    setBrokerSearch(e.target.value);
    setFocusedBrokerIndex(-1);
    if (!showBrokerDropdown) {
      setShowBrokerDropdown(true);
    }
  };

  const toggleBrokerDropdown = () => {
    setShowBrokerDropdown(!showBrokerDropdown);
    setFocusedBrokerIndex(-1);
    if (!showBrokerDropdown) {
      setBrokerSearch('');
    }
  };

  const showToastMessage = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => {
      setShowToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const calculateBrokerage = async (broker = null) => {
    const currentBroker = broker || formData.broker;
    
    // More specific validation
    const missingFields = [];
    if (!formData.quantity) missingFields.push('Quantity');
    if (!formData.buyPrice) missingFields.push('Buy Price');
    if (!formData.sellPrice) missingFields.push('Sell Price');
    if (!currentBroker) missingFields.push('Broker');
    if (!formData.gender) missingFields.push('Gender');
    
    if (missingFields.length > 0) {
      if (!broker) { // Only show toast for single calculation, not for comparison
        showToastMessage(`Please fill in: ${missingFields.join(', ')}`, 'error');
      }
      return null;
    }

    const loadingState = broker ? setCompareLoading : setLoading;
    loadingState(true);

    try {
      const requestBody = {
        exchange: formData.exchange,
        buyPrice: parseFloat(formData.buyPrice),
        sellPrice: parseFloat(formData.sellPrice),
        gender: formData.gender,
        quantity: parseInt(formData.quantity),
        broker: currentBroker,
        timeframe: formData.equityType
      };

      const response = await fetch(`${API_BASE}/brokerage/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate brokerage');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        if (broker) {
          return data.data;
        } else {
          setResults(data.data);
          showToastMessage('Brokerage calculated successfully!');
          return data.data;
        }
      } else {
        throw new Error(data.message || 'Calculation failed');
      }
    } catch (err) {
      console.error('API Error:', err);
      let errorMessage = 'Something went wrong';
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (err.message.includes('Calculation failed')) {
        errorMessage = 'Brokerage calculation failed. Please check your input values.';
      }
      
      if (!broker) {
        showToastMessage(errorMessage, 'error');
      }
      return null;
    } finally {
      loadingState(false);
    }
  };

  const handleCompare = async () => {
    if (selectedBrokers.length === 0) {
      showToastMessage('Please select at least one broker to compare', 'error');
      return;
    }

    // Add validation for required fields before proceeding
    const missingFields = [];
    if (!formData.quantity) missingFields.push('Quantity');
    if (!formData.buyPrice) missingFields.push('Buy Price');
    if (!formData.sellPrice) missingFields.push('Sell Price');
    if (!formData.gender) missingFields.push('Gender');
    
    if (missingFields.length > 0) {
      showToastMessage(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    setCompareLoading(true);

    try {
      const comparisonPromises = selectedBrokers.map(brokerId => 
        calculateBrokerage(brokerId)
      );

      const results = await Promise.all(comparisonPromises);
      const validResults = results.filter(result => result !== null);
      
      setComparisonResults(validResults);
      setShowCompareDropdown(false);
      
      // Only show success message if we actually have results
      if (validResults.length > 0) {
        showToastMessage(`Compared ${validResults.length} broker(s) successfully!`);
      } else {
        showToastMessage('No valid results to compare. Please check your input values.', 'error');
      }
    } catch (err) {
      showToastMessage('Failed to compare brokers', 'error');
    } finally {
      setCompareLoading(false);
    }
  };

  const addBrokerToCompare = (brokerId) => {
    if (selectedBrokers.length >= 3) {
      showToastMessage('Maximum 3 brokers can be compared', 'error');
      return;
    }
    
    if (!selectedBrokers.includes(brokerId)) {
      setSelectedBrokers(prev => [...prev, brokerId]);
    }
  };

  const removeBrokerFromCompare = (brokerId) => {
    setSelectedBrokers(prev => prev.filter(id => id !== brokerId));
  };

  const resetCalculator = () => {
    setFormData({
      quantity: '',
      buyPrice: '',
      sellPrice: '',
      exchange: 'NSE',
      equityType: 'Delivery',
      broker: '',
      gender: ''
    });
    setResults(null);
    setComparisonResults([]);
    setSelectedBrokers([]);
    setBrokerSearch('');
  };

  const calculateTurnover = () => {
    if (!formData.quantity || !formData.buyPrice || !formData.sellPrice) return null;
    
    const quantity = parseFloat(formData.quantity);
    const buyPrice = parseFloat(formData.buyPrice);
    const sellPrice = parseFloat(formData.sellPrice);
    
    const buyTurnover = quantity * buyPrice;
    const sellTurnover = quantity * sellPrice;
    const totalTurnover = buyTurnover + sellTurnover;
    const grossPL = sellTurnover - buyTurnover;
    
    return {
      buyTurnover,
      sellTurnover,
      totalTurnover,
      grossPL
    };
  };

  const turnover = calculateTurnover();

  const calculateCombinedCharges = (resultData) => {
    if (!resultData) return null;

    const allCharges = new Set([
      ...Object.keys(resultData.Buy_Leg || {}),
      ...Object.keys(resultData.Sell_Leg || {})
    ]);

    const combinedCharges = {};
    allCharges.forEach(chargeName => {
      const buyCharge = parseFloat(resultData.Buy_Leg[chargeName] || 0);
      const sellCharge = parseFloat(resultData.Sell_Leg[chargeName] || 0);
      combinedCharges[chargeName] = buyCharge + sellCharge;
    });

    return combinedCharges;
  };

  const getBrokerName = (brokerId) => {
    const broker = brokersList.find(b => b.id === brokerId);
    return broker ? broker.name : brokerId;
  };

  const getBrokerCalculatorUrl = (brokerId) => {
    const broker = brokersList.find(b => b.id === brokerId);
    return broker ? broker.calculatorUrl : '#';
  };

  const getAllChargeTypes = (resultsArray) => {
    const allCharges = new Set();
    resultsArray.forEach(result => {
      if (result.Buy_Leg) {
        Object.keys(result.Buy_Leg).forEach(charge => allCharges.add(charge));
      }
      if (result.Sell_Leg) {
        Object.keys(result.Sell_Leg).forEach(charge => allCharges.add(charge));
      }
    });
    return Array.from(allCharges);
  };

  const getAllNetChargeTypes = (resultsArray) => {
    const allCharges = new Set();
    resultsArray.forEach(result => {
      const combined = calculateCombinedCharges(result);
      if (combined) {
        Object.keys(combined).forEach(charge => allCharges.add(charge));
      }
    });
    return Array.from(allCharges);
  };

  // Color coding helper functions
  const getValueColor = (values, currentIndex) => {
    const currentValue = parseFloat(values[currentIndex]);
    const minValue = Math.min(...values.map(v => parseFloat(v)));
    const maxValue = Math.max(...values.map(v => parseFloat(v)));
    
    if (currentValue === minValue && currentValue === maxValue) {
      return 'text-green-600'; // All values are equal - green
    } else if (currentValue === minValue) {
      return 'text-green-600 font-bold'; // Lowest value - green and bold
    } else if (currentValue === maxValue) {
      return 'text-red-600'; // Highest value - red
    }
    return 'text-gray-700'; // Middle values - default
  };

  // Special color coding for Net P&L - higher is better (green), lower is worse (red)
  const getNetPLColor = (values, currentIndex) => {
    const currentValue = parseFloat(values[currentIndex]);
    const maxValue = Math.max(...values.map(v => parseFloat(v)));
    const minValue = Math.min(...values.map(v => parseFloat(v)));
    
    if (currentValue === maxValue && currentValue === minValue) {
      return currentValue >= 0 ? 'text-green-600' : 'text-red-600'; // All values equal
    } else if (currentValue === maxValue) {
      return 'text-green-600 font-bold'; // Highest Net P&L - green and bold
    } else if (currentValue === minValue) {
      return 'text-red-600'; // Lowest Net P&L - red
    }
    return currentValue >= 0 ? 'text-green-500' : 'text-red-500'; // Middle values with profit/loss indication
  };

  // Enhanced color coding for Breakeven Points - lower is better
  const getBreakevenColor = (values, currentIndex) => {
    // Filter out non-numeric values for comparison
    const numericValues = values
      .map(v => {
        if (v === 'N/A' || v === null || v === undefined) return Infinity;
        const num = parseFloat(v);
        return isNaN(num) ? Infinity : num;
      })
      .filter(v => v !== Infinity);
    
    if (numericValues.length === 0) return 'text-gray-700';
    
    const currentValue = parseFloat(values[currentIndex]) || Infinity;
    const minValue = Math.min(...numericValues);
    const maxValue = Math.max(...numericValues);
    
    if (currentValue === minValue && currentValue === maxValue) {
      return 'text-green-600'; // All values equal
    } else if (currentValue === minValue) {
      return 'text-green-600 font-bold'; // Lowest breakeven - best
    } else if (currentValue === maxValue) {
      return 'text-red-600'; // Highest breakeven - worst
    }
    return 'text-yellow-600'; // Middle values
  };

  const getChargeValues = (resultsArray, chargeType, leg = 'Buy_Leg') => {
    return resultsArray.map(result => parseFloat(result[leg]?.[chargeType] || 0));
  };

  const getNetChargeValues = (resultsArray, chargeType) => {
    return resultsArray.map(result => {
      const combined = calculateCombinedCharges(result);
      return parseFloat(combined?.[chargeType] || 0);
    });
  };

  const getTotalChargeValues = (resultsArray, leg = 'Buy_Leg') => {
    return resultsArray.map(result => 
      Object.values(result[leg] || {}).reduce((sum, charge) => sum + parseFloat(charge), 0)
    );
  };

  const getRoundTripChargeValues = (resultsArray) => {
    return resultsArray.map(result => 
      parseFloat(result.Round_Trip?.Total_Round_Trip_Charges || 0)
    );
  };

  const getNetPLValues = (resultsArray) => {
    return resultsArray.map(result => 
      parseFloat(result.Round_Trip?.['Net_P&L'] || 0)
    );
  };

  const getBreakevenValues = (resultsArray) => {
    return resultsArray.map(result => 
      result.Points_to_Breakeven || 'N/A'
    );
  };

  // Get AMC values for comparison
  const getAMCValues = (resultsArray) => {
    return resultsArray.map(result => result.AMC || 'N/A');
  };

  // Get ACC values for comparison
  const getACCValues = (resultsArray) => {
    return resultsArray.map(result => result.ACC || 'N/A');
  };

  // Check if required fields are filled for comparison
  const areRequiredFieldsFilled = formData.quantity && formData.buyPrice && formData.sellPrice && formData.gender;

  return (
    <>
      <Navbar />
      
      {showToast.show && (
        <div className="fixed top-20 right-4 z-50 dark:bg-gray-900">
          <div className={`${
            showToast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {showToast.type === 'error' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            <span className="font-medium">{showToast.message}</span>
          </div>
        </div>
      )}

      <div className='pt-20 px-4 max-w-9xl mx-auto dark:bg-gray-900 min-h-screen '>
        {/* Header Section */}
        <div className="mb-6 max-w-4xl mx-auto flex items-start gap-4">
          <div className="flex-shrink-0 mt-1 bg-blue-100 p-3 rounded-lg">
            <TrendingUp className="w-10 h-10 text-blue-600" aria-hidden="true" />
          </div>
          <div className="text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-1 dark:text-sky-400">Brokerage Comparator</h1>
            <p className="text-gray-600 text-lg max-w-2xl dark:text-gray-300">
              Calculate exact brokerage charges and compare across different brokers
            </p>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className='bg-white rounded-xl max-w-4xl mx-auto shadow-lg border border-gray-100 p-4 mb-2 dark:bg-gray-800 dark:border-gray-700'>
          {/* Calculator Type Selection */}
          <div className='mb-8'>
            <h3 className='text-sm font-semibold text-gray-500  uppercase tracking-wide mb-2 dark:text-gray-300'>Calculator Type</h3>
            <div className='flex flex-wrap gap-4'>
              <button className='px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors'>
                Equity
              </button>
              <button className='px-6 py-2 bg-gray-100 text-gray-400 rounded-lg font-medium cursor-not-allowed'>
                F&O (Coming Soon)
              </button>
            </div>
          </div>

          {/* Equity Type Selection */}
          <div className='mb-4'>
            <h3 className='text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-300'>Trade Type</h3>
            <div className='flex gap-3'>
              <button 
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.equityType === 'Intraday' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFormData({...formData, equityType: 'Intraday'})}
              >
                Intraday
              </button>
              <button 
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  formData.equityType === 'Delivery' 
                    ? 'bg-green-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFormData({...formData, equityType: 'Delivery'})}
              >
                Delivery
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
            {/* Left Column */}
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Quantity *</label>
                <input 
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  placeholder="Enter quantity"
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Exchange</label>
                <select 
                  name="exchange"
                  value={formData.exchange}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                >
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Buy Price *</label>
                <input 
                  type="number"
                  name="buyPrice"
                  value={formData.buyPrice}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Select Gender *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Sell Price *</label>
                <div className='relative'>
                  <input 
                    type="number"
                    name="sellPrice"
                    value={formData.sellPrice}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="relative" ref={brokerDropdownRef}>
                <label className='block text-sm font-semibold text-gray-700 mb-2 dark:text-gray-300'>Select Broker *</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={brokerSearch || (formData.broker ? getBrokerName(formData.broker) : '')}
                    onChange={handleBrokerSearchChange}
                    onFocus={() => setShowBrokerDropdown(true)}
                    placeholder="Search or select broker..."
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12'
                    ref={brokerInputRef}
                  />
                  <button
                    type="button"
                    onClick={toggleBrokerDropdown}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showBrokerDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Broker Dropdown */}
                {showBrokerDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-700">
                    {/* Search Header */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={brokerSearch}
                          onChange={handleBrokerSearchChange}
                          placeholder="Search brokers..."
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Broker List */}
                    <div className="py-1">
                      {filteredBrokers.length > 0 ? (
                        filteredBrokers.map((broker, index) => (
                          <div
                            key={broker.id}
                            className={`px-4 py-3 cursor-pointer transition-colors ${
                              formData.broker === broker.id
                                ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400'
                                : focusedBrokerIndex === index
                                ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200'
                                : 'text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200'
                            }`}
                            onClick={() => handleBrokerSelect(broker.id)}
                            onMouseEnter={() => setFocusedBrokerIndex(index)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{broker.name}</span>
                              {formData.broker === broker.id && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-center">
                          No brokers found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-4 pt-4'>
            <button
              onClick={() => calculateBrokerage()}
              disabled={loading}
              className='flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'
            >
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  Calculating...
                </div>
              ) : (
                'Calculate Brokerage'
              )}
            </button>

            {/* Compare Button with Dropdown */}
            <div className="relative" ref={compareDropdownRef}>
              <button
                onClick={() => setShowCompareDropdown(!showCompareDropdown)}
                disabled={compareLoading || !areRequiredFieldsFilled}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                {compareLoading ? 'Comparing...' : 'Compare'}
                {selectedBrokers.length > 0 && (
                  <span className="bg-green-800 text-xs px-2 py-1 rounded-full">
                    {selectedBrokers.length}
                  </span>
                )}
              </button>

              {showCompareDropdown && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-gray-900">Compare Brokers</h3>
                      <span className="text-sm text-gray-500">
                        {selectedBrokers.length}/3 selected
                      </span>
                    </div>

                    {/* Selected Brokers */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedBrokers.map(brokerId => (
                          <div key={brokerId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
                            {getBrokerName(brokerId)}
                            <button
                              onClick={() => removeBrokerFromCompare(brokerId)}
                              className="hover:text-blue-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Broker Search and List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {brokersList.map(broker => (
                        <div
                          key={broker.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedBrokers.includes(broker.id)
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => addBrokerToCompare(broker.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                              selectedBrokers.includes(broker.id)
                                ? 'bg-blue-600 border-blue-600'
                                : 'border-gray-400'
                            }`}>
                              {selectedBrokers.includes(broker.id) && (
                                <div className="w-2 h-2 bg-white rounded-sm"></div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{broker.name}</span>
                          </div>
                          {selectedBrokers.includes(broker.id) && (
                            <Plus className="w-4 h-4 text-blue-600 rotate-45" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Compare Action Button */}
                    <button
                      onClick={handleCompare}
                      disabled={selectedBrokers.length === 0 || compareLoading || !areRequiredFieldsFilled}
                      className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {compareLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Comparing...
                        </div>
                      ) : (
                        `Compare ${selectedBrokers.length} Broker${selectedBrokers.length !== 1 ? 's' : ''}`
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={resetCalculator}
              className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors'
            >
              Reset
            </button>
          </div>
        </div>

        {/* Single Broker Results */}
        {results && !loading && comparisonResults.length === 0 && (
          <div className='space-y-8 max-w-7xl mx-auto mb-12'>
            {/* Charges Breakdown - Side by Side */}
            <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-6 dark:bg-gray-800 dark:border-gray-700'>
              <h3 className='text-2xl font-bold text-gray-900 mb-8 text-center dark:text-gray-200'>Charges Breakdown - {getBrokerName(results.Broker)}</h3>
              
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Buy Leg Charges */}
                <div className='bg-blue-50 rounded-xl p-6 border-2 border-blue-200 '>
                  <h4 className='text-xl font-bold text-blue-900 mb-6 text-center'>Buy Leg Charges</h4>
                  
                  {/* Turnover Display */}
                  {turnover && (
                    <div className='mb-4 p-3 bg-blue-100 rounded-lg'>
                      <div className='flex justify-between items-center'>
                        <span className='text-blue-800 font-semibold'>Turnover</span>
                        <span className='text-blue-900 font-bold'>₹{turnover.buyTurnover.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className='space-y-4'>
                    {results.Buy_Leg && Object.entries(results.Buy_Leg).map(([key, value]) => (
                      <div key={key} className='flex justify-between items-center py-2 border-b border-blue-200 last:border-b-0'>
                        <span className='text-blue-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
                        <span className='text-blue-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sell Leg Charges */}
                <div className='bg-green-50 rounded-xl p-6 border-2 border-green-200'>
                  <h4 className='text-xl font-bold text-green-900 mb-6 text-center'>Sell Leg Charges</h4>
                  
                  {/* Turnover Display */}
                  {turnover && (
                    <div className='mb-4 p-3 bg-green-100 rounded-lg'>
                      <div className='flex justify-between items-center'>
                        <span className='text-green-800 font-semibold'>Turnover</span>
                        <span className='text-green-900 font-bold'>₹{turnover.sellTurnover.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className='space-y-4'>
                    {results.Sell_Leg && Object.entries(results.Sell_Leg).map(([key, value]) => (
                      <div key={key} className='flex justify-between items-center py-2 border-b border-green-200 last:border-b-0'>
                        <span className='text-green-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
                        <span className='text-green-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Net Charges */}
                <div className='bg-purple-50 rounded-xl p-6 border-2 border-purple-200'>
                  <h4 className='text-xl font-bold text-purple-900 mb-6 text-center'>Net Charges</h4>
                  
                  {/* Total Turnover Display */}
                  {turnover && (
                    <div className='mb-4 p-3 bg-purple-100 rounded-lg'>
                      <div className='flex justify-between items-center'>
                        <span className='text-purple-800 font-semibold'>Total Turnover</span>
                        <span className='text-purple-900 font-bold'>₹{turnover.totalTurnover.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className='space-y-4'>
                    {calculateCombinedCharges(results) && Object.entries(calculateCombinedCharges(results)).map(([key, value]) => (
                      <div key={key} className='flex justify-between items-center py-2 border-b border-purple-200 last:border-b-0'>
                        <span className='text-purple-800 font-medium capitalize'>{key.replace(/_/g, ' ')}</span>
                        <span className='text-purple-900 font-semibold'>₹{parseFloat(value).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total Charges Only */}
                  <div className='border-t-2 border-purple-300 pt-3 mt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-purple-900 font-bold text-lg'>Total Charges</span>
                      <span className='text-purple-900 font-bold text-lg'>
                        ₹{results.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Summary Section */}
            <div className='bg-white rounded-xl shadow-lg border border-gray-100 p-8'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6 text-center'>Trade Summary - {getBrokerName(results.Broker)}</h3>
              
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Trade Details */}
                <div className='space-y-6'>
                  <h4 className='text-lg font-semibold text-gray-900'>Transaction Details</h4>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm text-gray-600'>Exchange</p>
                      <p className='font-semibold'>{results.Exchange}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Broker</p>
                      <p className='font-semibold'>{getBrokerName(results.Broker)}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Trade Type</p>
                      <p className='font-semibold'>{results.TimeFrame}</p>
                    </div>
                    <div>
                      <p className='text-sm text-gray-600'>Quantity</p>
                      <p className='font-semibold'>{results.Qty}</p>
                    </div>
                  </div>

                  {/* Enhanced Breakeven Display */}
                  <div className='flex justify-between items-center pt-3 bg-gray-50 p-4 rounded-lg border border-gray-200'>
                    <div className='flex items-center gap-2'>
                      <span className='text-gray-700 font-semibold'>Breakeven Points Required</span>
                      <div className="group relative">
                        {/* <div className="w-4 h-4 bg-gray-300 rounded-full text-xs flex items-center justify-center cursor-help text-gray-600">?</div> */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          Price movement needed to cover brokerage charges
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <span className='font-bold text-lg text-blue-700'>{results.Points_to_Breakeven}</span>
                      {/* <p className='text-xs text-gray-500 mt-1'>Points needed to cover all charges</p> */}
                    </div>
                  </div>

                  {/* Broker Calculator Link */}
                  <div className='pt-2'>
                    <a 
                      href={getBrokerCalculatorUrl(results.Broker)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Calculator className="w-4 h-4" />
                      Open {getBrokerName(results.Broker)} Calculator
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* P&L Summary */}
                <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200'>
                  <h4 className='text-lg font-semibold text-gray-900 mb-4'>Profit & Loss Summary</h4>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Gross P&L</span>
                      <span className={`font-semibold ${
                        turnover?.grossPL >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{turnover?.grossPL.toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Total Charges</span>
                      <span className='font-semibold text-gray-900'>₹{results.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between pt-3 border-t border-gray-300'>
                      <span className='text-lg font-bold text-gray-900'>Net P&L</span>
                      <span className={`text-lg font-bold ${
                        results.Round_Trip['Net_P&L'] >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ₹{results.Round_Trip['Net_P&L'].toFixed(2)}
                      </span>
                    </div>
                    {results.AMC && (
                      <div className='flex justify-between pt-2'>
                        <span className='text-gray-600'>AMC Charges</span>
                        <span className='font-semibold text-gray-900'>{results.AMC}</span>
                      </div>
                    )}
                    {results.ACC && (
                      <div className='flex justify-between pt-2'>
                        <span className='text-gray-600'>Account Creation</span>
                        <span className='font-semibold text-gray-900'>{results.ACC}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Results */}
      {/* Comparison Results */}
{comparisonResults.length > 0 && (
  <div className="space-y-8 max-w-7xl mx-auto mb-12">
    {/* Breakeven Points Summary - Compact Version */}
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        Breakeven Points Comparison
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {comparisonResults.map((result, index) => {
          const breakevenValues = getBreakevenValues(comparisonResults);
          const isBest = getBreakevenColor(breakevenValues, index).includes('green-600 font-bold');
          const isWorst = getBreakevenColor(breakevenValues, index).includes('red-600');
          
          return (
            <div 
              key={index} 
              className={`rounded-lg p-4 border transition-all ${
                isBest 
                  ? 'bg-green-50 border-green-300 shadow-sm' 
                  : isWorst
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {getBrokerName(result.Broker)}
                </h4>
                {isBest && (
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Best
                  </span>
                )}
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  isBest 
                    ? 'text-green-700' 
                    : isWorst
                    ? 'text-red-700'
                    : 'text-blue-700'
                }`}>
                  {result.Points_to_Breakeven || 'N/A'}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  points to breakeven
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Rest of the comparison results (existing code) remains the same */}
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Detailed Broker Comparison
      </h3>

      {/* Turnover Summary and other sections remain unchanged */}
      {turnover && (
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
     <h4 className="text-xl font-bold text-gray-800 mb-4">Turnover Summary</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-green-200 shadow-xs">
              <p className="text-sm font-medium text-gray-600 mb-2">Buy Turnover</p>
              <p className="text-lg font-bold text-gray-900">₹{turnover.buyTurnover.toFixed(2)}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-red-200 shadow-xs">
              <p className="text-sm font-medium text-gray-600 mb-2">Sell Turnover</p>
              <p className="text-lg font-bold text-gray-900">₹{turnover.sellTurnover.toFixed(2)}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-xs">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Turnover</p>
              <p className="text-lg font-bold text-gray-900">₹{turnover.totalTurnover.toFixed(2)}</p>
            </div>
          </div>
          
          <div className={`mt-4 p-4 rounded-lg border ${
            turnover.grossPL >= 0 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className="text-sm font-medium text-gray-600 mb-1">Gross P&L (Sell - Buy)</p>
            <p className={`text-xl font-bold ${
              turnover.grossPL >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{turnover.grossPL.toFixed(2)}
            </p>
          </div>

        </div>
      )}

      {/* Buy Leg, Sell Leg, Net Charges sections remain unchanged */}
      <div className="mb-8 bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Charges on Buy Leg</h4>
    <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Charges
                </th>
                {comparisonResults.map((result, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
                    {getBrokerName(result.Broker)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Turnover Row */}
              <tr className="border-b">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Turnover</td>
                {comparisonResults.map((result, index) => (
                  <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
                    ₹{turnover ? turnover.buyTurnover.toFixed(2) : '0.00'}
                  </td>
                ))}
              </tr>
              
              {/* Buy Leg Charges */}
              {getAllChargeTypes(comparisonResults).map((chargeType) => {
                const chargeValues = getChargeValues(comparisonResults, chargeType, 'Buy_Leg');
                return (
                  <tr key={chargeType} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {chargeType.replace(/_/g, ' ')}
                    </td>
                    {comparisonResults.map((result, index) => (
                      <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
                        ₹{parseFloat(result.Buy_Leg[chargeType] || 0).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Total Buy Charges */}
              <tr className="border-b bg-blue-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Buy Charges</td>
                {comparisonResults.map((result, index) => {
                  const totalValues = getTotalChargeValues(comparisonResults, 'Buy_Leg');
                  return (
                    <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(totalValues, index)}`}>
                      ₹{Object.values(result.Buy_Leg || {}).reduce((sum, charge) => sum + parseFloat(charge), 0).toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div className="mb-8 bg-green-50 rounded-xl p-6 border-2 border-green-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Charges on Sell Leg</h4>
<div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Charges
                </th>
                {comparisonResults.map((result, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
                    {getBrokerName(result.Broker)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Sell Turnover */}
              <tr className="border-b">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Turnover</td>
                {comparisonResults.map((result, index) => (
                  <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
                    ₹{turnover ? turnover.sellTurnover.toFixed(2) : '0.00'}
                  </td>
                ))}
              </tr>

              {/* Sell Leg Charges */}
              {getAllChargeTypes(comparisonResults).map((chargeType) => {
                const chargeValues = getChargeValues(comparisonResults, chargeType, 'Sell_Leg');
                return (
                  <tr key={`sell-${chargeType}`} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {chargeType.replace(/_/g, ' ')}
                    </td>
                    {comparisonResults.map((result, index) => (
                      <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
                        ₹{parseFloat(result.Sell_Leg[chargeType] || 0).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Total Sell Charges */}
              <tr className="border-b bg-green-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Sell Charges</td>
                {comparisonResults.map((result, index) => {
                  const totalValues = getTotalChargeValues(comparisonResults, 'Sell_Leg');
                  return (
                    <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(totalValues, index)}`}>
                      ₹{Object.values(result.Sell_Leg || {}).reduce((sum, charge) => sum + parseFloat(charge), 0).toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div className="mb-8 bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
        <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">Net Charges</h4>
      <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                  Charges
                </th>
                {comparisonResults.map((result, index) => (
                  <th key={index} className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b">
                    {getBrokerName(result.Broker)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Total Turnover */}
              <tr className="border-b">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">Total Turnover</td>
                {comparisonResults.map((result, index) => (
                  <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
                    ₹{turnover ? turnover.totalTurnover.toFixed(2) : '0.00'}
                  </td>
                ))}
              </tr>

              {/* Net Charges */}
              {getAllNetChargeTypes(comparisonResults).map((chargeType) => {
                const chargeValues = getNetChargeValues(comparisonResults, chargeType);
                return (
                  <tr key={`net-${chargeType}`} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">
                      {chargeType.replace(/_/g, ' ')}
                    </td>
                    {comparisonResults.map((result, index) => (
                      <td key={index} className={`px-4 py-3 text-center text-sm ${getValueColor(chargeValues, index)}`}>
                        ₹{parseFloat(calculateCombinedCharges(result)?.[chargeType] || 0).toFixed(2)}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Total Round Trip Charges */}
              <tr className="border-b bg-purple-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Total Round Trip Charges</td>
                {comparisonResults.map((result, index) => {
                  const roundTripValues = getRoundTripChargeValues(comparisonResults);
                  return (
                    <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getValueColor(roundTripValues, index)}`}>
                      ₹{result.Round_Trip.Total_Round_Trip_Charges.toFixed(2)}
                    </td>
                  );
                })}
              </tr>

              {/* Net P&L - Updated with special color coding */}
              <tr className="border-b">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">Net P&L</td>
                {comparisonResults.map((result, index) => {
                  const netPLValues = getNetPLValues(comparisonResults);
                  return (
                    <td key={index} className={`px-4 py-3 text-center text-sm font-bold ${getNetPLColor(netPLValues, index)}`}>
                      ₹{result.Round_Trip['Net_P&L'].toFixed(2)}
                    </td>
                  );
                })}
              </tr>

              {/* AMC Charges */}
              <tr className="border-b bg-orange-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-900">AMC Charges</td>
                {comparisonResults.map((result, index) => {
                  const amcValues = getAMCValues(comparisonResults);
                  return (
                    <td key={index} className="px-4 py-3 text-center text-sm text-gray-700">
                      {result.AMC || 'N/A'}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
     
      </div>

      {/* Broker Calculator Links */}
      <div className="mt-6 flex flex-wrap gap-6 justify-end">
        {comparisonResults.map((result, index) => (
          <a
            key={index}
            href={getBrokerCalculatorUrl(result.Broker)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            {getBrokerName(result.Broker)} Calculator
            <ExternalLink className="w-4 h-4" />
          </a>
        ))}
      </div>
    </div>
  </div>
)}
      </div>

      {/* Add CSS for toast animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default BrokerageCalculator