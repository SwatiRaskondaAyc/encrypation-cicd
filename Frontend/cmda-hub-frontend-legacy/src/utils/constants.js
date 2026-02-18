// src/utils/constants.js (New)
// Use a relative path so the dev server proxy (vite) can forward requests to the backend
// export const API_BASE_URL = "portfolio";
export const MAX_PORTFOLIOS_PER_USER = 5;
export const platforms = [
  { id: "Groww", name: "Groww", logo: "/platform_logo/groww.png" },
  { id: "Zerodha", name: "Zerodha", logo: "/platform_logo/zerodha.png" },
  { id: "AxisSecurities", name: "Axis Securities", logo: "/platform_logo/axis_securities.jpg" },
  { id: "AngelOne", name: "Angel One", logo: "/platform_logo/angel-one.png" },
  { id: "MotilalOswal", name: "Motilal Oswal", logo: "/platform_logo/motilal_oswal.png" },
  { id: "KotakSecurities", name: "Kotak Securities", logo: "/platform_logo/kotak_securities.jpg" },
  { id: "IndMoney", name: "IndMoney", logo: "/platform_logo/indmoney.png" },
  { id: "ICICIDirect", name: "ICICI Direct", logo: "/platform_logo/icici_direct.png", comingSoon: true },
  { id: "Sharekhan", name: "Sharekhan", logo: "/platform_logo/sharekhan.jpg", comingSoon: true },
  { id: "HDFCSecurities", name: "HDFC Securities", logo: "/platform_logo/hdfc_securities.png", comingSoon: true },

];