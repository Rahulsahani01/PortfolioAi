'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ActiveSiteBadge from '../../components/ActiveSiteBadge';
import Sidebar from '../../components/Sidebar';
import styles from './page.module.css';

type Site = {
  id: string;
  name: string;
  slug: string;
  status: 'Draft' | 'Live';
  template: string;
  resume: string;
};

export default function UserDashboard() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);

  // Modal & Wizard State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSiteSlug, setNewSiteSlug] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      openCreateWizard();
      router.replace('/dashboard'); // Clean up URL to avoid reopening on refresh
    }
  }, [searchParams, router]);

  useEffect(() => {
    const savedSites = localStorage.getItem('mock_portfolio_sites');
    if (savedSites) {
      const parsed = JSON.parse(savedSites);
      setSites(parsed);
      const savedActiveId = localStorage.getItem('active_portfolio_site_id');
      if (savedActiveId && parsed.find((s: Site) => s.id === savedActiveId)) {
        setActiveSiteId(savedActiveId);
      } else if (parsed.length > 0) {
        handleSetActiveSite(parsed[0].id);
      }
    }
  }, []);

  const handleSetActiveSite = (id: string) => {
    setActiveSiteId(id);
    localStorage.setItem('active_portfolio_site_id', id);
  };

  const saveSites = (newSites: Site[]) => {
    setSites(newSites);
    localStorage.setItem('mock_portfolio_sites', JSON.stringify(newSites));
    if (newSites.length > 0 && !activeSiteId) {
      handleSetActiveSite(newSites[0].id);
    }
  };

  const openCreateWizard = () => {
    setNewSiteSlug('');
    setIsModalOpen(true);
  };

  const handleFinishWizard = () => {
    const newSite: Site = {
      id: Math.random().toString(36).substring(7),
      name: newSiteSlug,
      slug: newSiteSlug,
      status: 'Draft',
      template: 'Modern Minimal', // Default
      resume: '',
    };

    saveSites([...sites, newSite]);
    setIsModalOpen(false);

    // Switch active site context to the new one and redirect to resume editor
    handleSetActiveSite(newSite.id);
    router.push('/dashboard/resume');
  };

  const activeSite = sites.find(s => s.id === activeSiteId);

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <Sidebar 
        styles={styles} 
        activePath="/dashboard" 
        onCreateSite={openCreateWizard} 
      />

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top App Bar */}
        <header className={styles.topBar}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeSite ? (
              <>
                <ActiveSiteBadge siteName={activeSite.name} />
              </>
            ) : (
              <h2 className={styles.topBarTitle}>Dashboard</h2>
            )}
          </div>

          <div className={styles.topBarActions}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search portfolios..."
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

        {/* Dashboard Content */}
        <div className={styles.canvas}>

          {/* Templates Promotion Banner */}
          <div style={{ marginBottom: '40px', backgroundColor: 'var(--surface-container-high)', padding: '32px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--outline-variant)' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-navy)', fontSize: '20px' }}>Looking for a fresh design?</h3>
              <p style={{ margin: 0, color: 'var(--on-surface-variant)' }}>Check out our gallery of professionally designed templates and find the perfect match for your portfolio.</p>
            </div>
            <Link href="/dashboard/templates" style={{ textDecoration: 'none', backgroundColor: 'var(--primary-navy)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <span className="material-symbols-outlined">web_stories</span>
              Explore Templates
            </Link>
          </div>

          {sites.length === 0 ? (
            /* ZERO SITES STATE */
            <div className={styles.emptyStateContainer}>
              <span className={`material-symbols-outlined ${styles.emptyStateIcon}`}>language</span>
              <h3 className={styles.emptyStateTitle}>Welcome to PortfolioAI!</h3>
              <p className={styles.emptyStateDesc}>
                You haven't created any portfolio sites yet. Start by generating a beautiful, AI-powered portfolio from your resume.
              </p>
              <button className={styles.bigCreateBtn} onClick={openCreateWizard}>
                <span className="material-symbols-outlined">add_circle</span>
                Create My Site
              </button>
            </div>
          ) : (
            /* ACTIVE SITES STATE */
            <div>
              <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'var(--surface-container-lowest)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px dashed var(--outline-variant)' }}>
                <h3 style={{ color: 'var(--primary-navy)', margin: '0 0 8px 0', fontSize: '18px' }}>Looking to create another portfolio website?</h3>
                <p style={{ color: 'var(--on-surface-variant)', margin: '0 0 24px 0', fontSize: '14px', textAlign: 'center' }}>You can build and manage multiple portfolios for different use-cases.</p>
                <button 
                  className={styles.bigCreateBtn} 
                  onClick={openCreateWizard}
                  style={{ cursor: 'pointer', width: 'auto', display: 'inline-flex' }}
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Create New Site
                </button>
              </div>

              <div className={styles.createSection}>
                <h3 className={styles.activeSitesTitle}>Your Portfolios ({sites.length})</h3>
              </div>

              {/* Grid Layout for Cards */}
              <div className={styles.statusGrid}>
                {sites.map((site) => (
                  <div
                    key={site.id}
                    className={styles.statusCard}
                    style={{ 
                      backgroundColor: activeSiteId === site.id ? '#e1e0ff' : 'var(--surface-container-lowest)',
                      borderTop: activeSiteId === site.id ? '3px solid var(--electric-indigo)' : '2px solid transparent' 
                    }}
                    onClick={() => handleSetActiveSite(site.id)}
                  >
                    <div className={styles.cardTop}>
                      <div className={styles.cardIcon}>
                        <span className={`material-symbols-outlined ${styles.cardIconSpan}`}>language</span>
                      </div>
                      <span className={site.status === 'Live' ? styles.badgeParsed : styles.badgeDraft}>
                        {site.status}
                      </span>
                    </div>
                    <h4 className={styles.cardTitle}>{site.name}</h4>
                    <p className={styles.cardDesc} style={{ marginBottom: '8px' }}>
                      portfolio.ai/{site.slug}
                    </p>
                    <p className={styles.cardDesc} style={{ fontSize: '12px', marginTop: 0 }}>
                      Template: {site.template} • Resume: {site.resume}
                    </p>

                    <div className={styles.cardActions}>
                      <button
                        className={styles.cardLinkBtn}
                        onClick={(e) => { e.stopPropagation(); handleSetActiveSite(site.id); router.push('/dashboard/my-site'); }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>settings</span>
                        Manage Site
                      </button>
                      <a href={`http://portfolio.ai/${site.slug}`} target="_blank" rel="noreferrer" className={styles.cardTextBtn} onClick={e => e.stopPropagation()}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
                        Visit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <p className={styles.footerCopy}>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>
          </div>
        </footer>
      </main>

      {/* ── CREATE SITE MODAL WIZARD ───────────────────── */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Step 1: Website Name
              </h3>
              <button className={styles.modalCloseBtn} onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <p style={{ color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
                  Choose a unique handle for your portfolio URL. This will be the name of your site.
                </p>
                <label className={styles.modalLabel}>Website Name / URL Slug</label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', border: '1px solid var(--outline)', borderRadius: '8px', overflow: 'hidden' }}>
                  <span style={{ padding: '12px', backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', fontSize: '14px' }}>
                    portfolio.ai/
                  </span>
                  <input
                    type="text"
                    className={styles.modalInput}
                    style={{ border: 'none', marginTop: 0, borderRadius: 0 }}
                    placeholder="e.g. rahul-dev"
                    value={newSiteSlug}
                    onChange={e => setNewSiteSlug(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <div /> {/* Spacer */}

              <button
                className={styles.modalBtnPrimary}
                onClick={handleFinishWizard}
                disabled={!newSiteSlug}
                style={{ opacity: (!newSiteSlug) ? 0.5 : 1 }}
              >
                Continue to Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
