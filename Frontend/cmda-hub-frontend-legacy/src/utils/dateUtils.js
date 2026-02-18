// src/utils/dateUtils.js (New: Extracted utils)
import { parse, format, isValid } from "date-fns";

// export const formatTradeExecutionTime = (timeArray) => {
//     if (!Array.isArray(timeArray) || timeArray.length < 5) return "-";
//     const [year, month, day, hour, minute] = timeArray;
//     const date = new Date(year, month - 1, day, hour, minute);
//     return isValid(date) ? format(date, "dd MMM yyyy, HH:mm") : "-";

// };
export const formatTradeExecutionTime = (timeString) => {
  if (!timeString || typeof timeString !== "string") return "-";

  // Parse "yyyy-MM-dd HH:mm:ss"
  const date = parse(timeString, "yyyy-MM-dd HH:mm:ss", new Date());

  return isValid(date) ? format(date, "dd MMM yyyy, HH:mm") : "-";
};

export const formatTradeDateOnly = (timeArray) => {
  if (!Array.isArray(timeArray) || timeArray.length < 3) return "-";
    const [year, month, day] = timeArray;
    const date = new Date(year, month - 1, day);
    return isValid(date) ? format(date, "dd MMM yyyy") : "-";

};

export const formatArrayToDateString = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return null;
    const [year, month, day] = dateArray;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

};

export const formatINR = (amount, decimals = 2) => {
  if (!amount) return "-";

  const num = Number(amount);
  if (Number.isNaN(num)) return "-";

  return num.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatUploadedAt = (uploadedAtArray) => {
   if (!Array.isArray(uploadedAtArray) || uploadedAtArray.length < 3) return "Unknown";

  // uploadedAt: [2025, 12, 25, 16, 29, 19, 310000000]
  const [year, month, day, hour = 0, minute = 0] = uploadedAtArray;
  const date = new Date(year, month - 1, day, hour, minute);

  return isValid(date) ? format(date, "dd MMM yyyy, HH:mm") : "Unknown";

};

export const generatePortfolioId = () => `CMDAPF_${Date.now()}`;


export const getNextBrokerId = (savedPortfolios = [], selectedBroker) => {
  if (!Array.isArray(savedPortfolios) || !selectedBroker) return undefined;
  const existingBroker = savedPortfolios.find((p) => p.broker === selectedBroker);
  return existingBroker ? existingBroker.brokerId : undefined;
};