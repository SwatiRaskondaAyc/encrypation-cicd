export const convertToCandleData = (rawData) => {
  return rawData.map((row) => ({
    time: row.Date, // or timestamp if needed
    open: row.Open,
    high: row.High,
    low: row.Low,
    close: row.Close,
  }));
};

// Example mock data
export const SAMPLE_DATA = [
  { Date: "2024-06-01", Open: 1400, High: 1420, Low: 1390, Close: 1410 },
  { Date: "2024-06-02", Open: 1410, High: 1425, Low: 1405, Close: 1415 },
  { Date: "2024-06-03", Open: 1415, High: 1430, Low: 1408, Close: 1428 },
  { Date: "2024-06-04", Open: 1428, High: 1440, Low: 1412, Close: 1418 },
  { Date: "2024-06-05", Open: 1418, High: 1435, Low: 1410, Close: 1430 },
];
