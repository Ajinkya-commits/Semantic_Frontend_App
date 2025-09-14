import React from 'react';
import { SearchResult } from '../../../core/types/search';

interface SearchResultCardProps {
  result: SearchResult;
  onShowDetails: (result: SearchResult) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  onShowDetails,
}) => {
  const handleClick = () => {
    onShowDetails(result);
  };

  const getScoreColor = (score: number | undefined, threshold: number) => {
    if (!score) return '#6c757d';
    return score >= threshold ? '#28a745' : score >= threshold * 0.7 ? '#ffc107' : '#dc3545';
  };

  const formatScore = (score: number | undefined) => {
    return score ? score.toFixed(3) : 'N/A';
  };

  return (
    <div
      style={{
        border: '1px solid #e9ecef',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}>
      
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          color: '#495057',
          fontWeight: '600',
          lineHeight: '1.3',
        }}>
          {result.title || '(No title)'}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
          }}>
            {result.contentType}
          </span>
          <span style={{
            backgroundColor: '#f3e5f5',
            color: '#7b1fa2',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
          }}>
            {result.locale}
          </span>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#6c757d',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {result.description || 'No description available.'}
        </p>
      </div>

      {/* Scores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '16px',
      }}>
        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#6c757d',
            fontWeight: '500',
            marginBottom: '2px',
          }}>
            SIMILARITY
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: getScoreColor(result.similarity, 0.7),
          }}>
            {formatScore(result.similarity)}
          </div>
        </div>

        <div style={{
          padding: '8px 12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #e9ecef',
        }}>
          <div style={{
            fontSize: '10px',
            color: '#6c757d',
            fontWeight: '500',
            marginBottom: '2px',
          }}>
            RERANK
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: getScoreColor(result.rerankScore, 0.5),
          }}>
            {formatScore(result.rerankScore)}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '12px',
        borderTop: '1px solid #f1f3f4',
      }}>
        <div style={{
          fontSize: '12px',
          color: '#6c757d',
          fontFamily: 'monospace',
        }}>
          {result.uid}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#007bff',
          fontWeight: '500',
        }}>
          Click for details →
        </div>
      </div>
    </div>
  );
};
