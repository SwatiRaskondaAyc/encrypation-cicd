import React, { useEffect, useState } from 'react';

const PublicDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Poppins';
        src: url('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPezSQ.woff2') format('woff2');
        font-weight: 400;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const fetchPublicDashboard = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const dashId = urlParams.get('dashId');

      if (!dashId) {
        setError('No dashboard ID provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/dashboard/public/${dashId}`);
        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        if (!data.dashboard) throw new Error('No dashboard data found.');

        // Fetch the screenshot if a path is provided
        let screenshotUrl = null;
        if (data.dashboard.screenshotPath) {
          const screenshotResponse = await fetch(`${API_BASE}/dashboard/${dashId}`);
          if (screenshotResponse.ok) {
            const blob = await screenshotResponse.blob();
            screenshotUrl = URL.createObjectURL(blob);
          }
        }

        setDashboard({
          ...data.dashboard,
          screenshotUrl,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error loading public dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicDashboard();

    return () => {
      if (dashboard?.screenshotUrl) URL.revokeObjectURL(dashboard.screenshotUrl);
    };
  }, []);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!dashboard) return <p>No dashboard found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8 font-[Poppins]">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Public Dashboard: {dashboard.dashboardName}</h2>
      {dashboard.screenshotUrl ? (
        <img
          src={dashboard.screenshotUrl}
          alt="Dashboard Screenshot"
          className="max-w-full rounded-lg shadow-lg"
        />
      ) : (
        <p className="text-gray-600">No screenshot available.</p>
      )}
      {dashboard.plots && (
        <div className="mt-8">
          {dashboard.plots.equityHubPlots?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-700">Equity Hub Plots</h3>
              <ul className="list-disc pl-5">
                {dashboard.plots.equityHubPlots.map((plot, idx) => (
                  <li key={idx} className="text-gray-600">
                    {plot.company_name} ({plot.symbol}) - {plot.graph_type}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {dashboard.plots.portfolioPlots?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-700">Portfolio Plots</h3>
              <ul className="list-disc pl-5">
                {dashboard.plots.portfolioPlots.map((plot, idx) => (
                  <li key={idx} className="text-gray-600">
                    Upload ID: {plot.upload_id} - {plot.graph_type} ({plot.platform})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicDashboard;