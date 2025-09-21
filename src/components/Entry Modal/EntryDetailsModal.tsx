import React, { useState, useEffect } from 'react';
import { SearchResult } from '../../types';
import { getStackApiKey } from '../../services/api';
import './EntryDetailsModal.css';

interface Language {
  code: string;
  name: string;
}

interface TranslationResult {
  originalEntry: SearchResult;
  translatedFields: Record<string, string>;
  targetLanguage: string;
  translatedAt: string;
}

interface EntryDetailsModalProps {
  entry: SearchResult;
  onClose: () => void;
}

export const EntryDetailsModal: React.FC<EntryDetailsModalProps> = ({
  entry,
  onClose,
}) => {
  const [entryUrl, setEntryUrl] = useState<string>('');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [showTranslated, setShowTranslated] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string>('');

  // Load supported languages on component mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/translate/languages');
        const data = await response.json();
        if (data.success) {
          setLanguages(data.languages);
        } else {
          console.error('Failed to load languages:', data);
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
      }
    };

    loadLanguages();
  }, []);

  // Reset translation state when entry changes
  useEffect(() => {
    setTranslationResult(null);
    setShowTranslated(false);
    setTranslationError('');
    setSelectedLanguage('');
  }, [entry]);

  const handleTranslate = async () => {
    if (!entry || !selectedLanguage || entry.type === 'image') return;

    setIsTranslating(true);
    setTranslationError('');

    try {
      const stackApiKey = await getStackApiKey();
      const response = await fetch('http://localhost:8000/api/translate/entry-fields', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryData: entry,
          targetLanguage: selectedLanguage,
          fieldsToTranslate: ['title', 'description', 'content', 'summary', 'body'],
          stackApiKey
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslationResult(data);
        setShowTranslated(true);
        setSelectedLanguage('');
      } else {
        setTranslationError('Translation failed. Please try again.');
        console.error('Translation failed:', data);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError('Translation service unavailable. Please try again later.');
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleTranslation = () => {
    setShowTranslated(!showTranslated);
  };

  const handleOpenInContentstack = () => {
    const urlToOpen = entry.type === 'image' && entry.contentstack_url ? entry.contentstack_url : entryUrl;
    if (!entry || !urlToOpen) return;
    
    try {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Contentstack URL:', error);
    }
  };

  const getContentTypeName = (uid: string) => {
    return entry.contentTypes?.find(ct => ct.uid === uid)?.title || uid;
  };

  const getDisplayValue = (field: string, originalValue: any) => {
    if (showTranslated && translationResult?.translatedFields[field]) {
      return translationResult.translatedFields[field];
    }
    return originalValue;
  };

  const getReadableDescription = (entry: SearchResult) => {
    if (!entry) return 'No description available.';
    const description = getDisplayValue('description', entry.description);
    if (description && typeof description === 'string') {
      return description;
    }
    
    const content = getDisplayValue('content', entry.content);
    if (content) {
      if (typeof content === 'string') {
        return content.length > 500 ? content.substring(0, 500) + '...' : content;
      }
      
      if (typeof content === 'object') {
        const textFields = ['description', 'body', 'text', 'content', 'summary', 'excerpt'];
        
        for (const field of textFields) {
          if (content[field] && typeof content[field] === 'string') {
            const fieldValue = getDisplayValue(field, content[field]);
            return fieldValue.length > 500 ? fieldValue.substring(0, 500) + '...' : fieldValue;
          }
        }
      }
    }
    
    return 'No description available.';
  };

  useEffect(() => {
    const generateUrl = async () => {
      if (!entry) return;
      
      try {
        const stackApiKey = await getStackApiKey();
        
        const url = `https://eu-app.contentstack.com/#!/stack/${stackApiKey}/content-type/${entry.contentType}/${entry.locale}/entry/${entry.uid}/edit?branch=main`;
        setEntryUrl(url);
      } catch (error) {
        console.error('Failed to generate Contentstack URL:', error);
      }
    };

    generateUrl();
  }, [entry]);

  return (
    <div className="entry-modal-overlay" onClick={onClose}>
      <div className="entry-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="entry-modal-header">
          <h2>Entry Details</h2>
            
          {/* Translation Controls - Always show for non-image entries */}
          {entry.type !== 'image' && languages.length > 0 && (
            <div className="translation-section">
              <div className="translation-controls">
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="language-select"
                  disabled={isTranslating}
                >
                  <option value="">Select Language</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                <button 
                  onClick={handleTranslate}
                  disabled={!selectedLanguage || isTranslating}
                  className="entry-modal-btn translate-btn"
                >
                  {isTranslating ? '⏳ Translating...' : '🌐 Translate'}
                </button>
                {/* Show Original/Translation toggle button right next to Translate */}
                {translationResult && (
                  <button 
                    onClick={toggleTranslation}
                    className={`entry-modal-btn toggle-btn ${showTranslated ? 'active' : ''}`}
                  >
                    {showTranslated ? '📄 Show Original' : '🌐 Show Translation'}
                  </button>
                )}
              </div>
            </div>
          )}
            
          <button className="entry-modal-close-btn" onClick={onClose}>×</button>
        </div>

        {translationError && (
          <div className="translation-error">
            {translationError}
          </div>
        )}

        {showTranslated && translationResult && (
          <div className="translation-info">
            <span>Translated to {languages.find(l => l.code === translationResult.targetLanguage)?.name}</span>
          </div>
        )}

        <div className="entry-modal-content">
          
          <div className="entry-modal-title-section">
            <h3 className="entry-modal-title">
              {getDisplayValue('title', entry.title) || '(No title)'}
            </h3>
            <div className="entry-modal-tags">
              <span className="entry-modal-tag-content-type">
                {entry.type === 'image' ? 'Image Asset' : getContentTypeName(entry.contentType)}
              </span>
              <span className="entry-modal-tag-locale">
                {entry.locale || 'en-us'}
              </span>
              <span className="entry-modal-tag-uid">
                UID: {entry.uid}
              </span>
            </div>
          </div>

          <div className="entry-modal-section">
            <h4>Description</h4>
            <div className="entry-modal-description">
              {getReadableDescription(entry)}
            </div>
          </div>

          {entry.type === 'image' && entry.url && (
            <div className="entry-modal-section">
              <h4>Image Preview</h4>
              <div className="entry-modal-image-preview">
                <img 
                  src={entry.url} 
                  alt={entry.title} 
                  style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                />
              </div>
            </div>
          )}

          <div className="entry-modal-section">
            <h4>Search Scores</h4>
            <div className="entry-modal-scores">
              <div className="entry-modal-score-similarity">
                <div className="score-label">SIMILARITY SCORE</div>
                <div className="score-value">
                  {entry.similarity?.toFixed(4) ?? 'N/A'}
                </div>
                <div className="score-description">How similar to your search query</div>
              </div>

              <div className="entry-modal-score-rerank">
                <div className="score-label">RERANK SCORE</div>
                <div className="score-value">
                  {entry.rerankScore?.toFixed(4) ?? 'N/A'}
                </div>
                <div className="score-description">AI-powered relevance ranking</div>
              </div>
            </div>
          </div>

          <div className="entry-modal-section">
            <h4>Entry Metadata</h4>
            <div className="entry-modal-metadata">
              <div className="entry-modal-metadata-grid">
                {Object.entries(entry)
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
          <div className="entry-modal-footer-uid">Entry UID: {entry.uid}</div>
          <div className="entry-modal-footer-actions">
            <button onClick={handleOpenInContentstack} className="entry-modal-btn-open">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
              Open in Contentstack
            </button>
            <button onClick={onClose} className="entry-modal-btn-close">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
