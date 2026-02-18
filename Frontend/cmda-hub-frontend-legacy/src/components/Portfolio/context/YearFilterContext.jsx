import React, { createContext, useContext, useState } from 'react'

const YearFilterContext =createContext();

export const YearFilterProvider=({children})=>{
    const [selectedYear,setSelectedYear]=useState("All");

    return(
        <YearFilterContext.Provider value={{selectedYear,setSelectedYear}}>
            {children}
        </YearFilterContext.Provider>
    )
}

export const useYearFilter=()=>useContext(YearFilterContext);