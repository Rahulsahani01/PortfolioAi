'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
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
  const [selectedId, setSelectedId] = useState<string>('modern-dev');
  const [activeSiteName, setActiveSiteName] = useState<string | null>(null);

  useEffect(() => {
    const savedSites = localStorage.getItem('mock_portfolio_sites');
    if (savedSites) {
      const parsed = JSON.parse(savedSites);
      const savedActiveId = localStorage.getItem('active_portfolio_site_id');
      const activeSite = savedActiveId ? parsed.find((s: any) => s.id === savedActiveId) : (parsed.length > 0 ? parsed[0] : null);
      
      if (activeSite) {
        setActiveSiteName(activeSite.name);
      }
    }
  }, []);

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
                <ActiveSiteBadge siteName={activeSiteName} />
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
                  onClick={() => setSelectedId(template.id)}
                  className={`${styles.templateCard} ${isSelected ? styles.templateCardSelected : ''}`}
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
                      <button className={styles.previewBtn} onClick={(e) => { e.stopPropagation(); router.push('/dashboard/my-site'); }}>
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
                        setSelectedId(template.id);
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
              <button className={styles.previewDataBtn} onClick={() => router.push('/dashboard/my-site')}>
                <span className="material-symbols-outlined">play_circle</span>
                Preview with My Data
              </button>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
