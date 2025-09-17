import React, { useState, useEffect } from 'react';
import { searchApi } from '../../../core/services/api/searchApi';

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
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#dc3545' }}>
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button 
          onClick={fetchAnalytics}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#333' }}>📊 Search Analytics</h2>
        
        <select 
          value={selectedDays} 
          onChange={(e) => setSelectedDays(Number(e.target.value))}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: 'white'
          }}
        >
          <option value={1}>Last 24 hours</option>
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Total Searches</h4>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
            {analyticsData.stats.totalSearches.toLocaleString()}
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Success Rate</h4>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>
            {successRate}%
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Avg Response Time</h4>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffc107' }}>
            {analyticsData.stats.averageResponseTime.toFixed(0)}ms
          </div>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>Avg Results</h4>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#17a2b8' }}>
            {analyticsData.stats.averageResultsCount.toFixed(1)}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Popular Queries */}
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🔍 Popular Queries</h3>
          {analyticsData.popularQueries.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {analyticsData.popularQueries.map((query, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < analyticsData.popularQueries.length - 1 ? '1px solid #f8f9fa' : 'none'
                }}>
                  <span style={{ fontSize: '14px', color: '#495057' }}>{query.query}</span>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#6c757d',
                    backgroundColor: '#f8f9fa',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {query.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>No search queries yet</p>
          )}
        </div>

        {/* Index Information */}
        <div style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>📈 Index Information</h3>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>Total Vectors</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
              {analyticsData.indexInfo.totalVectors.toLocaleString()}
            </div>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>Dimensions</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
              {analyticsData.indexInfo.dimensions}
            </div>
          </div>
          {analyticsData.indexInfo.lastUpdated && (
            <div>
              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>Last Updated</div>
              <div style={{ fontSize: '14px', color: '#495057' }}>
                {new Date(analyticsData.indexInfo.lastUpdated).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Capabilities */}
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>🎯 Search Capabilities</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {Object.entries(analyticsData.capabilities).map(([key, enabled]) => (
            <div key={key} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: enabled ? '#d4edda' : '#f8d7da',
              border: `1px solid ${enabled ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '20px',
              fontSize: '14px'
            }}>
              <span>{enabled ? '✅' : '❌'}</span>
              <span style={{ 
                color: enabled ? '#155724' : '#721c24',
                textTransform: 'capitalize'
              }}>
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
