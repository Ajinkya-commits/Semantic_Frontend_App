import React, { useState, useEffect } from 'react';
import { searchApi } from '../../services/api';
import './AnalyticsDashboard.css';

interface AnalyticsData {
  stats: {
    totalSearches: number;
    successfulSearches: number;
    averageResponseTime: number;
    averageResultsCount: number;
  };
  popularQueries: Array<{
    query: string;
    count: number;
  }>;
  indexInfo: {
    totalVectors: number;
    dimensions: number;
    lastUpdated: string | null;
  };
  capabilities: {
    textSearch: boolean;
    imageSearch: boolean;
    hybridSearch: boolean;
    uploadSearch: boolean;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDays]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [analytics, stats] = await Promise.all([
        searchApi.getAnalytics(selectedDays),
        searchApi.getStats()
      ]);

      setAnalyticsData({
        stats: analytics.stats,
        popularQueries: analytics.popularQueries || [],
        indexInfo: stats.indexInfo,
        capabilities: stats.capabilities
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={fetchAnalytics} className="analytics-retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>No analytics data available</div>;
  }

  const successRate = analyticsData.stats.totalSearches > 0 
    ? ((analyticsData.stats.successfulSearches / analyticsData.stats.totalSearches) * 100).toFixed(1)
    : '0';

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <h2>📊 Search Analytics</h2>
        
        <select 
          value={selectedDays} 
          onChange={(e) => setSelectedDays(Number(e.target.value))}
          className="analytics-time-select"
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="analytics-metrics-grid">
        <div className="analytics-metric-card">
          <h4 className="analytics-metric-label">Total Searches</h4>
          <div className="analytics-metric-value total-searches">
            {analyticsData.stats.totalSearches.toLocaleString()}
          </div>
        </div>

        <div className="analytics-metric-card">
          <h4 className="analytics-metric-label">Success Rate</h4>
          <div className="analytics-metric-value success-rate">
            {successRate}%
          </div>
        </div>

        <div className="analytics-metric-card">
          <h4 className="analytics-metric-label">Avg Response Time</h4>
          <div className="analytics-metric-value response-time">
            {analyticsData.stats.averageResponseTime.toFixed(0)}ms
          </div>
        </div>

        <div className="analytics-metric-card">
          <h4 className="analytics-metric-label">Avg Results</h4>
          <div className="analytics-metric-value avg-results">
            {analyticsData.stats.averageResultsCount.toFixed(1)}
          </div>
        </div>
      </div>

      <div className="analytics-content-grid">
        <div className="analytics-card">
          <h3>🔍 Popular Queries</h3>
          {analyticsData.popularQueries.length > 0 ? (
            <div className="analytics-queries-list">
              {analyticsData.popularQueries.map((query, index) => (
                <div key={index} className="analytics-query-item">
                  <span className="analytics-query-text">{query.query}</span>
                  <span className="analytics-query-count">
                    {query.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="analytics-no-queries">No search queries yet</p>
          )}
        </div>

        <div className="analytics-card">
          <h3>📈 Index Information</h3>
          <div className="analytics-index-info">
            <div className="analytics-index-label">Total Vectors</div>
            <div className="analytics-index-value total-vectors">
              {analyticsData.indexInfo.totalVectors.toLocaleString()}
            </div>
          </div>
          <div className="analytics-index-info">
            <div className="analytics-index-label">Dimensions</div>
            <div className="analytics-index-value dimensions">
              {analyticsData.indexInfo.dimensions}
            </div>
          </div>
          {analyticsData.indexInfo.lastUpdated && (
            <div>
              <div className="analytics-index-label">Last Updated</div>
              <div className="analytics-index-updated">
                {new Date(analyticsData.indexInfo.lastUpdated).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="analytics-card">
        <h3>🎯 Search Capabilities</h3>
        <div className="analytics-capabilities">
          {Object.entries(analyticsData.capabilities).map(([key, enabled]) => (
            <div key={key} className={`analytics-capability ${enabled ? 'enabled' : 'disabled'}`}>
              <span>{enabled ? '✅' : '❌'}</span>
              <span className={`analytics-capability-text ${enabled ? 'enabled' : 'disabled'}`}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
