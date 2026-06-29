'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedId) || TEMPLATES[0];

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <p className={styles.sidebarBrandName}>PortfolioAI</p>
          </Link>
          <p className={styles.sidebarPlan}>Premium Plan</p>
        </div>

        <nav className={styles.sidebarNav}>
          <Link href="/dashboard/resume" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>description</span>
            <span>My Resume</span>
          </Link>
          <Link href="/dashboard" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/templates" className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>web_stories</span>
            <span>Templates</span>
          </Link>
          <Link href="/dashboard/my-site" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>language</span>
            <span>My Site</span>
          </Link>
          <Link href="/dashboard/settings" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>settings</span>
            <span>Settings</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="#" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>help</span>
            <span>Help Center</span>
          </a>
          <Link href="/auth" className={`${styles.navItem} ${styles.logoutItem}`}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>logout</span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <h2 className={styles.topBarTitle}>Select a Template</h2>
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
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#475569',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>view_quilt</span>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>{template.title}</span>
                    </div>
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
