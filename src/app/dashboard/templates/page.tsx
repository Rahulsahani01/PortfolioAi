'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
import { useSites } from '../../../context/SitesContext';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import styles from './page.module.css';

interface Template {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageSrc: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'modern-dev',
    title: 'Modern Developer',
    description: 'A robust, high-performance layout designed for software engineers and technical leads.',
    tags: ['Development', 'Top Rated'],
    imageSrc: '/template-modern-dev.png',
  },
  {
    id: 'creative-designer',
    title: 'Creative Designer',
    description: 'Dynamic grids and bold typography for UI/UX designers and art directors.',
    tags: ['Design'],
    imageSrc: '/template-creative-designer.png',
  },
  {
    id: 'minimal-portfolio',
    title: 'Minimal Portfolio',
    description: 'A clean, distraction-free layout that puts the focus entirely on your quality of work.',
    tags: ['Minimalist'],
    imageSrc: '/template-minimal.png',
  },
  {
    id: 'student-portfolio',
    title: 'Student Portfolio',
    description: 'Optimized for internships and first jobs, highlighting skills and education.',
    tags: ['Academic'],
    imageSrc: '/template-student.png',
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeSite, refreshSites, setActiveSiteId } = useSites();
  const { token } = useAuth();
  const slug = searchParams.get('slug') || searchParams.get('siteId');

  const [selectedId, setSelectedId] = useState<string>('modern-dev');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (activeSite?.templateKey) {
      setSelectedId(activeSite.templateKey);
    }
  }, [activeSite?.templateKey]);

  const activeSiteId = activeSite?.id;
  const fetchedSiteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeSiteId && fetchedSiteIdRef.current !== activeSiteId) {
      fetchedSiteIdRef.current = activeSiteId;
      refreshSites(activeSiteId);
    }
  }, [activeSiteId, refreshSites]);

  const activeSiteName = activeSite?.slug || slug;
  const activeSiteStatus = activeSite?.status || 'Draft';
  
  const canGenerate = !!activeSite && activeSite?.siteDetail?.status === 'COMPLETED' && activeSite?.paymentStatus !== 'PENDING';
  const getDisabledReason = () => {
    if (!activeSite) return 'No active site';
    if (activeSite.paymentStatus === 'PENDING') return 'now site is under review you can update it after site is published';
    if (activeSite.siteDetail?.status !== 'COMPLETED') return 'complete the site details first';
    return undefined;
  };

  const handleGenerateSite = async () => {
    if (!canGenerate || !activeSite) return;
    setIsGenerating(true);
    try {
      await apiFetch(`/sites/${activeSite.id}`, {
        method: 'PUT',
        token: token || undefined,
        body: JSON.stringify({
          templateKey: selectedId
        })
      });

      // Refresh global context and redirect to My Site
      await refreshSites(activeSite.id);
      router.push('/dashboard/my-site');
    } catch (err: any) {
      alert('Error updating site: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0];

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <Sidebar styles={styles} activePath="/dashboard/templates" />

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeSiteName ? (
              <>
                <ActiveSiteBadge siteName={activeSiteName} status={activeSiteStatus} paymentStatus={activeSite?.paymentStatus} />
              </>
            ) : (
              <h2 className={styles.topBarTitle} style={{ margin: 0 }}>Select a Template</h2>
            )}
          </div>
          <div className={styles.topBarActions}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search templates..."
              />
            </div>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className={styles.canvas}>
          <p className={styles.subTitle}>
            Choose a starting point for your portfolio. All templates are fully customizable with your AI-generated content and personal data.
          </p>

          {/* Grid */}
          <div className={styles.grid}>
            {TEMPLATES.map(template => {
              const isSelected = template.id === selectedId;
              return (
                <div
                  key={template.id}
                  onClick={() => {
                    if (activeSite?.paymentStatus === 'PENDING') return;
                    setSelectedId(template.id);
                  }}
                  title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : undefined}
                  className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ''}`}
                  style={{
                    opacity: activeSite?.paymentStatus === 'PENDING' ? 0.7 : 1,
                    cursor: activeSite?.paymentStatus === 'PENDING' ? 'not-allowed' : undefined
                  }}
                >
                  {isSelected && (
                    <div className={styles.checkBadge}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    </div>
                  )}

                  <div className={styles.imageWrapper}>
                    <img src={template.imageSrc} alt={template.title} className={styles.templateImage} />
                    <div className={styles.imageOverlay}>
                      <button 
                        className={styles.previewBtn} 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if (activeSite?.siteDetail?.status !== 'COMPLETED' || activeSite?.paymentStatus === 'PENDING') return;
                          router.push('/dashboard/my-site'); 
                        }}
                        title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : (activeSite?.siteDetail?.status !== 'COMPLETED' ? 'complete the site details first' : undefined)}
                        style={{
                          opacity: (activeSite?.siteDetail?.status !== 'COMPLETED' || activeSite?.paymentStatus === 'PENDING') ? 0.5 : 1,
                          cursor: (activeSite?.siteDetail?.status !== 'COMPLETED' || activeSite?.paymentStatus === 'PENDING') ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <span className="material-symbols-outlined">visibility</span>
                        Preview
                      </button>
                    </div>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.tagWrapper}>
                      {template.tags.map(tag => {
                        let tagClass = styles.tagDesign;
                        if (tag === 'Development') tagClass = styles.tagDevelopment;
                        else if (tag === 'Minimalist') tagClass = styles.tagMinimalist;
                        else if (tag === 'Academic') tagClass = styles.tagAcademic;
                        else if (tag === 'Top Rated') tagClass = styles.tagTopRated;

                        return (
                          <span key={tag} className={`${styles.tag} ${tagClass}`}>
                            {tag}
                          </span>
                        );
                      })}
                    </div>

                    <h3 className={styles.title}>{template.title}</h3>
                    <p className={styles.description}>{template.description}</p>

                    <button
                      className={`${styles.selectBtn} ${isSelected ? styles.selectBtnSelected : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeSite?.paymentStatus === 'PENDING') return;
                        setSelectedId(template.id);
                      }}
                      title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : undefined}
                      style={{
                        opacity: activeSite?.paymentStatus === 'PENDING' ? 0.5 : 1,
                        cursor: activeSite?.paymentStatus === 'PENDING' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isSelected ? 'Selected' : 'Select Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <footer className={styles.bottomBar}>
          <div className={styles.bottomBarInner}>
            <div className={styles.selectedInfo}>
              <div className={styles.infoIconWrapper}>
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h4 className={styles.infoTitle}>{selectedTemplate.title} Selected</h4>
                <p className={styles.infoSub}>Click preview to see your actual content in this layout.</p>
              </div>
            </div>
            <div>
              <button 
                className={styles.previewDataBtn} 
                onClick={() => {
                  if (!canGenerate) return;
                  handleGenerateSite();
                }}
                style={{ 
                  opacity: canGenerate && !isGenerating ? 1 : 0.5, 
                  cursor: canGenerate && !isGenerating ? 'pointer' : 'not-allowed' 
                }}
                title={getDisabledReason()}
              >
                <span className="material-symbols-outlined">
                  publish
                </span>
                {isGenerating ? 'Generating...' : 'Preview with Data'}
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
