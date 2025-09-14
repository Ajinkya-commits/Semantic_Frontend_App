import React, { useState } from 'react';
import { SearchPage } from './features/search/pages/SearchPage';
import { IndexingPage } from './features/indexing/pages/IndexingPage';
import './App.css';

type ActivePage = 'search' | 'indexing';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('search');

  return (
    <div className="App">
      {/* Navigation Header */}
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#007bff',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}>
              🔍
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '600',
              color: '#495057'
            }}>
              Semantic Search
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActivePage('search')}
              style={{
                padding: '8px 16px',
                backgroundColor: activePage === 'search' ? '#007bff' : 'transparent',
                color: activePage === 'search' ? 'white' : '#6c757d',
                border: '1px solid',
                borderColor: activePage === 'search' ? '#007bff' : '#e9ecef',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
              🔍 Search
            </button>
            
            <button
              onClick={() => setActivePage('indexing')}
              style={{
                padding: '8px 16px',
                backgroundColor: activePage === 'indexing' ? '#007bff' : 'transparent',
                color: activePage === 'indexing' ? 'white' : '#6c757d',
                border: '1px solid',
                borderColor: activePage === 'indexing' ? '#007bff' : '#e9ecef',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
              🔄 Indexing
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f8f9fa'
      }}>
        {activePage === 'search' && <SearchPage />}
        {activePage === 'indexing' && <IndexingPage />}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e9ecef',
        padding: '20px 0',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{
            margin: 0,
            color: '#6c757d',
            fontSize: '14px'
          }}>
            Powered by AI • Contentstack Integration • Semantic Search Technology
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
