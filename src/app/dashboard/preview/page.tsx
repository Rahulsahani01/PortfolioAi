'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import styles from './page.module.css';

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  
  const templateId = searchParams.get('template');
  const siteId = searchParams.get('siteId');

  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setError('Template ID is missing');
      setLoading(false);
      return;
    }

    const fetchPreview = async () => {
      try {
        const res = await fetch('/api/templates/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId,
            siteId,
            token
          })
        });

        if (!res.ok) {
          throw new Error('Failed to fetch template preview');
        }

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setHtmlContent(data.html);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [templateId, siteId, token]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error generating preview</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <iframe 
      srcDoc={htmlContent} 
      className={styles.previewIframe}
      title="Template Preview"
    />
  );
}
