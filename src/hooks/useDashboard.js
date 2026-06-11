import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:4000/api/dashboard/stats";

const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const [charts, setCharts] = useState(null);
  const [global, setGlobal] = useState({ totalRevenue: 0, totalOrders: 0 });
  const [topProducts, setTopProducts] = useState([]);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("No se pudo obtener la información del dashboard");
      }
      const data = await response.json();
      setStats(data.cards || []);
      setCharts(data.charts || null);
      setGlobal(data.global || { totalRevenue: 0, totalOrders: 0 });
      setTopProducts(data.topProducts || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Error al conectar con la API");
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);

    // Dynamic polling every 30 seconds to reflect real-time updates
    const intervalId = setInterval(() => {
      fetchDashboardData(false); // Fetch silently in background
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchDashboardData]);

  return {
    loading,
    error,
    stats,
    charts,
    global,
    topProducts,
    refetch: () => fetchDashboardData(true),
  };
};

export default useDashboard;
