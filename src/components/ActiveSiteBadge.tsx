import React from 'react';

export default function ActiveSiteBadge({ siteName, status }: { siteName: string, status?: 'Draft' | 'Live' | 'Under Review' | 'Rejected' }) {
  if (!siteName) return null;

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: '8px', 
      color: 'var(--primary-navy)',
      fontSize: '24px', 
      fontWeight: 700,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: 'var(--electric-indigo)' }}>language</span>
      {siteName}
      {status === 'Under Review' && (
        <span style={{
          backgroundColor: '#FFF8E1',
          color: '#F57F17',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginLeft: '8px'
        }}>Under Review</span>
      )}
      {status === 'Rejected' && (
        <span style={{
          backgroundColor: '#FFEBEE',
          color: '#D32F2F',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginLeft: '8px'
        }}>Rejected</span>
      )}
    </div>
  );
}
