import React from "react";
import { Link } from "react-router-dom";
import { 
  Calculator, 
  TrendingUp, 
  CreditCard, 
  Scale,
  ArrowRight
} from "lucide-react";

const FinancialCalculatorsMenu = ({ onItemClick }) => {
  const handleClick = (calculatorName, e) => {
    if (onItemClick) {
      onItemClick(calculatorName, e);
    }
  };

  const calculatorItems = [
    {
      name: "Brokerage Comparator",
      path: "/calculators/brokerage-calculator",
      label: "Brokerage Calculator",
      description: "Calculate trading costs & charges",
      icon: TrendingUp,
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-800",
      available: true
    },
    {
      name: "EMI Comparator", 
      path: "/calculators/emi-calculator",
      label: "EMI Calculator",
      description: "Plan your loan repayments",
      icon: CreditCard,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-800",
      available: false
    },
    {
      name: "Margin Comparator",
      path: "/calculators/margin-calculator", 
      label: "Margin Calculator",
      description: "Calculate margin requirements",
      icon: Scale,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200 dark:border-purple-800",
      available: false
    }
  ];

  return (
    <div 
      className="w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-4 z-50 border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
      onMouseEnter={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onMouseOver={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-5 pb-3 mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Financial Calculators
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-tight">
              All the calculations you need for crystal clear insights
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Items */}
      <div className="space-y-2 px-2">
        {calculatorItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleClick(item.label, e);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${item.borderColor} ${item.bgColor} hover:shadow-md transition-all duration-200 group relative ${
                !item.available ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border ${item.borderColor} ${
                !item.available ? "opacity-60" : ""
              }`}>
                <IconComponent className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold ${
                    item.available 
                      ? "text-gray-900 dark:text-white group-hover:text-sky-600" 
                      : "text-gray-500 dark:text-gray-400"
                  } transition-colors duration-200 truncate`}>
                    {item.name}
                  </span>
                  {!item.available && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      Coming Soon
                    </span>
                  )}
                </div>
                <p className={`text-xs ${
                  item.available ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                } truncate`}>
                  {item.description}
                </p>
              </div>

              <div className={`flex-shrink-0 transition-all duration-200 ${
                item.available 
                  ? "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0" 
                  : "opacity-30"
              }`}>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      {/* <div className="px-5 pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Make informed financial decisions
        </p>
      </div> */}
    </div>
  );
};

export default FinancialCalculatorsMenu;