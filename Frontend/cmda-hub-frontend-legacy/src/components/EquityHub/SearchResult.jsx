import React from "react";

const SearchResult = ({ result,query}) => {
    const highlightText = (text, query) => {
        if (!query) return text;
    
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, (match) => `<span class="text-yellow-500 font-bold">${match}</span>`); // Change text color
      };
  return (
    <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
    
          <span
            dangerouslySetInnerHTML={{
              __html: highlightText(result, query), 
            }}
          />
        
    </div>
  );
};

export default SearchResult;

