import React from 'react';

export default function ActiveSiteBadge({ siteName }: { siteName: string }) {
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
    </div>
  );
}
