'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
import styles from './page.module.css';

type Site = {
  id: string;
  name: string;
  slug: string;
  status: 'Draft' | 'Live';
  template: string;
  resume: string;
};

export default function MySitePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSiteId, setActiveSiteId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load from local storage on mount
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

  const handleSetActiveSite = (id: string | null) => {
    setActiveSiteId(id);
    if (id) {
      localStorage.setItem('active_portfolio_site_id', id);
    } else {
      localStorage.removeItem('active_portfolio_site_id');
    }
  };

  const saveSites = (newSites: Site[]) => {
    setSites(newSites);
    localStorage.setItem('mock_portfolio_sites', JSON.stringify(newSites));
    if (newSites.length === 0) {
      handleSetActiveSite(null);
    } else if (activeSiteId && !newSites.find(s => s.id === activeSiteId)) {
      handleSetActiveSite(newSites[0].id);
    }
  };

  const activeSite = sites.find(s => s.id === activeSiteId);

  const handleUnpublish = () => {
    if (!activeSite) return;
    if (confirm('Are you sure you want to unpublish your portfolio website? It will no longer be visible to the public.')) {
      const updated = sites.map(s => s.id === activeSite.id ? { ...s, status: 'Draft' as const } : s);
      saveSites(updated);
    }
  };

  const handleRepublish = () => {
    if (!activeSite) return;
    const updated = sites.map(s => s.id === activeSite.id ? { ...s, status: 'Live' as const } : s);
    saveSites(updated);
    alert('Site republished successfully!');
  };

  const handleDelete = () => {
    if (!activeSite) return;
    if (confirm('⚠️ WARNING: Deleting your site will permanently remove all content, custom configurations, and DNS settings. This cannot be undone! Proceed?')) {
      const updated = sites.filter(s => s.id !== activeSite.id);
      saveSites(updated);
      router.push('/dashboard');
    }
  };

  const handleCopyLink = () => {
    if (!activeSite) return;
    navigator.clipboard.writeText(`portfolio.ai/${activeSite.slug}`);
    alert('Live link copied to clipboard!');
  };

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <Sidebar styles={styles} activePath="/dashboard/my-site" />

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top App Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarTitleGroup}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {activeSite ? (
                  <ActiveSiteBadge siteName={activeSite.name} />
                ) : (
                  <h2 className={styles.topBarTitle} style={{ margin: 0 }}>
                    My Site Management
                  </h2>
                )}
                {activeSite && activeSite.status === 'Live' && (
                  <div className={styles.topBarBadge} style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', backgroundColor: '#059669', borderRadius: '50%' }} />
                    PUBLISHED
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.topBarActions}>
            
            {/* Site Switcher Dropdown */}
            {sites.length > 0 && (
              <select 
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--outline)', outline: 'none', fontWeight: 600, color: 'var(--primary-navy)' }}
                value={activeSiteId || ''}
                onChange={(e) => handleSetActiveSite(e.target.value)}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}

            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Canvas */}
        <div className={styles.canvas}>
          
          {!activeSite ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--on-surface-variant)' }}>language</span>
              <h3 style={{ color: 'var(--primary-navy)', marginTop: '16px' }}>No Sites Available</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>You haven't created any sites yet.</p>
              <Link href="/dashboard" style={{ textDecoration: 'none', backgroundColor: 'var(--electric-indigo)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Row 1: URL & Actions Control + Visitor Stats */}
              <div className={styles.managementGrid}>
                {/* Control card */}
                <div className={styles.siteControlCard}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className={styles.controlLabel}>Live Production URL</span>
                    <div className={styles.urlBar}>
                      <span className={`material-symbols-outlined ${styles.urlIcon}`}>link</span>
                      <code className={styles.urlText}>portfolio.ai/{activeSite.slug}</code>
                      <button className={styles.copyLinkBtn} onClick={handleCopyLink}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>content_copy</span>
                        Copy Link
                      </button>
                    </div>
                  </div>

                  <div className={styles.controlButtonsWrap}>
                    <Link href="/dashboard/resume" className={styles.btnPrimary} style={{ textDecoration: 'none' }}>
                      <span className="material-symbols-outlined">edit</span>
                      Edit Content
                    </Link>
                    <Link href="/dashboard/templates" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
                      <span className="material-symbols-outlined">dashboard_customize</span>
                      Change Template
                    </Link>
                    {activeSite.status === 'Live' ? (
                      <button className={styles.btnOutline} onClick={handleUnpublish}>
                        <span className="material-symbols-outlined">cloud_off</span>
                        Unpublish
                      </button>
                    ) : (
                      <button className={styles.btnPrimary} onClick={handleRepublish} style={{ backgroundColor: 'var(--primary-navy)' }}>
                        <span className="material-symbols-outlined">rocket_launch</span>
                        Publish Now
                      </button>
                    )}
                  </div>
                </div>

                {/* Visitor stats */}
                <div className={styles.statsCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className={styles.statsIconWrapper}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>insights</span>
                    </div>
                    <span className={styles.statsPeriod}>Last 30 Days</span>
                  </div>
                  <div>
                    <h3 className={styles.statsValue}>{activeSite.status === 'Live' ? '1.2k' : '0'}</h3>
                    <p className={styles.statsLabel}>Unique Page Views</p>
                  </div>
                  <div className={styles.statsFooter}>
                    <div className={styles.statsUpdateText}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                      Updated just now
                    </div>
                    <span className={styles.statsTrend}>{activeSite.status === 'Live' ? '+12% ↑' : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Row 2: Live desktop preview & Config items bento */}
              <div className={styles.bentoRow}>
                {/* Visual Preview */}
                <div className={styles.previewCard}>
                  <div className={styles.previewHeader}>
                    <span className={styles.previewHeaderTitle}>Site Preview</span>
                    <div className={styles.previewControls}>
                      <button className={styles.previewControlBtn}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>desktop_windows</span>
                      </button>
                      <button className={styles.previewControlBtn}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>smartphone</span>
                      </button>
                    </div>
                  </div>
                  <div className={styles.previewCardContent}>
                    <img src="/portfolio-desktop-preview.png" alt="Desktop Layout Preview" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className={styles.previewOverlay}>
                      <button className={styles.openLiveBtn} onClick={handleCopyLink}>
                        <span className="material-symbols-outlined">open_in_new</span>
                        Open Live Site
                      </button>
                    </div>
                  </div>
                </div>

                {/* Config column cards */}
                <div className={styles.configCol}>
                  {/* Theme info */}
                  <div className={styles.configCard}>
                    <span className={styles.configLabel}>Active Theme</span>
                    <div className={styles.activeThemeWrap}>
                      <div className={styles.themeIcon}>
                        <span className="material-symbols-outlined">palette</span>
                      </div>
                      <div>
                        <p className={styles.themeName}>{activeSite.template}</p>
                        <p className={styles.themeVersion}>Assigned Resume: {activeSite.resume}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lighthouse SEO Health */}
                  <div className={styles.configCard}>
                    <div className={styles.seoHeader}>
                      <h4 className={styles.seoLabel}>SEO Health</h4>
                      <span className={styles.seoStatus}>Optimal</span>
                    </div>
                    <div className={styles.progressBarWrap}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressBarFill} style={{ width: '92%' }} />
                      </div>
                      <p className={styles.seoScoreDesc}>92/100 score on Google Lighthouse</p>
                    </div>
                  </div>

                  {/* Connected Domain Handle */}
                  <div className={styles.configCard}>
                    <span className={styles.configLabel}>Connected Domains</span>
                    <ul className={styles.domainsList}>
                      <li className={styles.domainItem}>
                        <span className={styles.domainName}>{activeSite.slug}.portfolio.ai</span>
                        <span className={`material-symbols-outlined ${styles.domainCheckIcon}`}>check_circle</span>
                      </li>
                      <li className={`${styles.domainItem} ${styles.domainItemDisabled}`}>
                        <span className={styles.domainName}>{activeSite.slug}.me</span>
                        <span className={styles.domainStatusBadge}>UPGRADE</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Row 3: Danger Zone */}
              <section className={styles.dangerZone}>
                <div className={styles.dangerZoneInner}>
                  <div>
                    <h3 className={styles.dangerTitle}>Danger Zone</h3>
                    <p className={styles.dangerDesc}>
                      Deleting your site will permanently remove all content, assets, and custom domain links. This action cannot be undone.
                    </p>
                  </div>
                  <button className={styles.deleteBtn} onClick={handleDelete}>
                    Delete Site
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.footerBrandName}>PortfolioAI</span>
              <span className={styles.footerCopy}>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
