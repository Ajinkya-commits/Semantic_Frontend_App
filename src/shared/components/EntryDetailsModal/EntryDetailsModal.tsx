import React, { useState, useEffect } from 'react';
import { SearchResult } from '../../../core/types/search';
import { getStackApiKey } from '../../../services/api';

interface EntryDetailsModalProps {
  selectedEntry: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EntryDetailsModal: React.FC<EntryDetailsModalProps> = ({
  selectedEntry,
  isOpen,
  onClose,
}) => {
  const [entryUrl, setEntryUrl] = useState<string>('');

  const handleOpenInContentstack = () => {
    if (!selectedEntry || !entryUrl) return;
    
    try {
      // Use the already generated entryUrl
      window.open(entryUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Contentstack URL:', error);
    }
  };

  useEffect(() => {
    const generateUrl = async () => {
      if (!selectedEntry) return;
      
      try {
        // Get stack API key from MongoDB
        const stackApiKey = await getStackApiKey();
        
        const url = `https://eu-app.contentstack.com/#!/stack/${stackApiKey}/content-type/${selectedEntry.contentType}/${selectedEntry.locale}/entry/${selectedEntry.uid}/edit?branch=main`;
        setEntryUrl(url);
      } catch (error) {
        console.error('Failed to generate Contentstack URL:', error);
      }
    };

    if (isOpen && selectedEntry) {
      generateUrl();
    }
  }, [selectedEntry, isOpen]);

  if (!isOpen || !selectedEntry) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <h2 style={{ margin: 0, color: '#495057' }}>📄 Entry Details</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c757d',
              padding: '4px',
            }}>
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            margin: '5px',
            paddingLeft: '10px',
            paddingRight: '10px',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}>
          
          {/* Title and Tags */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '20px' }}>
              {selectedEntry.title || '(No title)'}
            </h3>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span
                style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                {selectedEntry.contentType}
              </span>
              <span
                style={{
                  backgroundColor: '#f3e5f5',
                  color: '#7b1fa2',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                {selectedEntry.locale}
              </span>
              <span
                style={{
                  backgroundColor: '#e8f5e8',
                  color: '#2e7d32',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                UID: {selectedEntry.uid}
              </span>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Description</h4>
            <div
              style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#495057',
              }}>
              {selectedEntry.description || 'No description available.'}
            </div>
          </div>

          {/* Search Scores */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Search Scores</h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  border: '1px solid #bbdefb',
                }}>
                <div style={{ fontSize: '12px', color: '#1976d2', fontWeight: '500', marginBottom: '4px' }}>
                  SIMILARITY SCORE
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
                  {selectedEntry.similarity?.toFixed(4) ?? 'N/A'}
                </div>
                <div style={{ fontSize: '11px', color: '#1976d2' }}>How similar to your search query</div>
              </div>

              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#f3e5f5',
                  borderRadius: '8px',
                  border: '1px solid #ce93d8',
                }}>
                <div style={{ fontSize: '12px', color: '#7b1fa2', fontWeight: '500', marginBottom: '4px' }}>
                  RERANK SCORE
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
                  {selectedEntry.rerankScore?.toFixed(4) ?? 'N/A'}
                </div>
                <div style={{ fontSize: '11px', color: '#7b1fa2' }}>AI-powered relevance ranking</div>
              </div>
            </div>
          </div>

          {/* Entry Metadata */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>Entry Metadata</h4>
            <div
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                overflow: 'hidden',
              }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '0',
                }}>
                {Object.entries(selectedEntry)
                  .filter(
                    ([key, value]) =>
                      ![
                        'title',
                        'description',
                        'similarity',
                        'rerankScore',
                        'contentType',
                        'locale',
                        'uid',
                      ].includes(key) &&
                      value !== null &&
                      value !== undefined &&
                      value !== ''
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #e9ecef',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <span
                        style={{
                          fontWeight: '500',
                          color: '#495057',
                          fontSize: '13px',
                          textTransform: 'capitalize',
                        }}>
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span
                        style={{
                          color: '#6c757d',
                          fontSize: '13px',
                          textAlign: 'right',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div style={{ fontSize: '12px', color: '#6c757d' }}>Entry UID: {selectedEntry.uid}</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
              }}>
              Close
            </button>
            <button
              onClick={handleOpenInContentstack}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
              Open in Contentstack
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
