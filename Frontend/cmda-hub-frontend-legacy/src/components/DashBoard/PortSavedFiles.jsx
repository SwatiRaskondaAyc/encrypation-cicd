import { useEffect, useState } from "react";
// import { YearFilterProvider } from "./context/YearFilterContext";
import GraphSlider from "../Portfolio/GraphSlider";

const PortSavedFiles = ({ propUploadId }) => {
  const [uploadId, setUploadId] = useState(propUploadId || null);
  const [loading, setLoading] = useState(!propUploadId);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    // if (propUploadId) return;
    const fetchUploadId = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE}/file/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setUploadId(data[0].uploadId); // most recent portfolio
        }
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUploadId();
  }, []);

  if (loading || !uploadId) return null;

  return (
 
      <GraphSlider uploadId={uploadId} />

  );
};

export default PortSavedFiles;
