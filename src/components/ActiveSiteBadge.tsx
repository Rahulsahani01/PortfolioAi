import React from 'react';

export default function ActiveSiteBadge({ siteName, status, paymentStatus }: { siteName: string, status?: string, paymentStatus?: string | null }) {
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
      {paymentStatus === 'PENDING' && (
        <span style={{
          backgroundColor: '#FFF8E1',
          color: '#F57F17',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginLeft: '8px'
        }}>Under Review</span>
      )}
      {paymentStatus === 'REJECTED' && (
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
