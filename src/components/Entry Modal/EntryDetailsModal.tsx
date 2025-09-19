import React, { useState, useEffect } from 'react';
import { SearchResult, ContentType } from '../../types';
import { getStackApiKey } from '../../services/api';
import './EntryDetailsModal.css';

interface EntryDetailsModalProps {
  selectedEntry: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
  contentTypes?: ContentType[];
}

export const EntryDetailsModal: React.FC<EntryDetailsModalProps> = ({
  selectedEntry,
  isOpen,
  onClose,
  contentTypes = [],
}) => {
  const [entryUrl, setEntryUrl] = useState<string>('');

  const handleOpenInContentstack = () => {
    if (!selectedEntry || !entryUrl) return;
    
    try {
      window.open(entryUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Contentstack URL:', error);
    }
  };

  const getContentTypeName = (uid: string) => {
    const contentType = contentTypes.find(ct => ct.uid === uid);
    return contentType?.title || uid;
  };

  const getReadableDescription = (entry: SearchResult) => {
    if (!entry) return 'No description available.';
    
    if (entry.description && typeof entry.description === 'string') {
      return entry.description;
    }
    
    if (entry.content) {
      if (typeof entry.content === 'string') {
        return entry.content.length > 500 ? entry.content.substring(0, 500) + '...' : entry.content;
      }
      
      if (typeof entry.content === 'object') {
        const textFields = ['description', 'body', 'text', 'content', 'summary', 'excerpt'];
        
        for (const field of textFields) {
          if (entry.content[field] && typeof entry.content[field] === 'string') {
            const text = entry.content[field];
            return text.length > 500 ? text.substring(0, 500) + '...' : text;
          }
        }
        
        const values = Object.values(entry.content).filter(val => 
          typeof val === 'string' && val.length > 10 && val.length < 1000
        );
        
        if (values.length > 0) {
          const text = values[0] as string;
          return text.length > 500 ? text.substring(0, 500) + '...' : text;
        }
        
        const jsonStr = JSON.stringify(entry.content, null, 2);
        return jsonStr.length > 300 ? jsonStr.substring(0, 300) + '...' : jsonStr;
      }
    }
    
    const possibleFields = ['body', 'text', 'summary', 'excerpt', 'description'];
    for (const field of possibleFields) {
      if (entry[field] && typeof entry[field] === 'string') {
        const text = entry[field];
        return text.length > 500 ? text.substring(0, 500) + '...' : text;
      }
    }
    
    return 'No readable description available for this entry.';
  };

  useEffect(() => {
    const generateUrl = async () => {
      if (!selectedEntry) return;
      
      try {
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
    <div className="entry-modal-overlay" onClick={onClose}>
      <div className="entry-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="entry-modal-header">
          <h2>📄 Entry Details</h2>
          <button onClick={onClose} className="entry-modal-close-btn">
            ×
          </button>
        </div>

        <div className="entry-modal-content">
          
          <div className="entry-modal-title-section">
            <h3 className="entry-modal-title">
              {selectedEntry.title || '(No title)'}
            </h3>
            <div className="entry-modal-tags">
              <span className="entry-modal-tag-content-type">
                {getContentTypeName(selectedEntry.contentType)}
              </span>
              <span className="entry-modal-tag-locale">
                {selectedEntry.locale || 'en-us'}
              </span>
              <span className="entry-modal-tag-uid">
                UID: {selectedEntry.uid}
              </span>
            </div>
          </div>

          <div className="entry-modal-section">
            <h4>Description</h4>
            <div className="entry-modal-description">
              {getReadableDescription(selectedEntry)}
            </div>
          </div>

          <div className="entry-modal-section">
            <h4>Search Scores</h4>
            <div className="entry-modal-scores">
              <div className="entry-modal-score-similarity">
                <div className="score-label">SIMILARITY SCORE</div>
                <div className="score-value">
                  {selectedEntry.similarity?.toFixed(4) ?? 'N/A'}
                </div>
                <div className="score-description">How similar to your search query</div>
              </div>

              <div className="entry-modal-score-rerank">
                <div className="score-label">RERANK SCORE</div>
                <div className="score-value">
                  {selectedEntry.rerankScore?.toFixed(4) ?? 'N/A'}
                </div>
                <div className="score-description">AI-powered relevance ranking</div>
              </div>
            </div>
          </div>

          <div className="entry-modal-section">
            <h4>Entry Metadata</h4>
            <div className="entry-modal-metadata">
              <div className="entry-modal-metadata-grid">
                {Object.entries(selectedEntry)
                  .filter(
                    ([key, value]) =>
                      ![
                        'title',
                        'content',
                        'similarity',
                        'rerankScore',
                        'content_type_uid',
                        'locale',
                        'uid',
                      ].includes(key) &&
                      value !== null &&
                      value !== undefined &&
                      value !== ''
                  )
                  .map(([key, value]) => (
                    <div key={key} className="entry-modal-metadata-item">
                      <span className="entry-modal-metadata-key">
                        {key.replace(/_/g, ' ')}:
                      </span>
                      <span className="entry-modal-metadata-value">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="entry-modal-footer">
          <div className="entry-modal-footer-uid">Entry UID: {selectedEntry.uid}</div>
          <div className="entry-modal-footer-actions">
            <button onClick={onClose} className="entry-modal-btn-close">
              Close
            </button>
            <button onClick={handleOpenInContentstack} className="entry-modal-btn-open">
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
