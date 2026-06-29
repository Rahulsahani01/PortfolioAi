'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function UserDashboard() {
  const [isLive, setIsLive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handlePublish = () => {
    setIsLive(true);
    setToastMessage('🎉 Congratulations! Your portfolio is now live at portfolio.ai/rahul!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

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
          {[
            { icon: 'dashboard', label: 'Dashboard', active: true, href: '/dashboard' },
            { icon: 'description', label: 'My Resume', active: false, href: '/dashboard/resume' },
            { icon: 'web_stories', label: 'Templates', active: false, href: '/dashboard/templates' },
            { icon: 'language', label: 'My Site', active: false, href: '/dashboard/my-site' },
            { icon: 'settings', label: 'Settings', active: false, href: '/dashboard/settings' },
          ].map(({ icon, label, active, href }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.createBtnWrapper}>
          <button className={styles.createBtn} onClick={handlePublish}>
            Create New Site
          </button>
        </div>

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
        {/* Top App Bar */}
        <header className={styles.topBar}>
          <h2 className={styles.topBarTitle}>Dashboard</h2>
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

        {/* Dashboard Grid Content */}
        <div className={styles.canvas}>
          {/* Onboarding Progress Card */}
          <section className={styles.onboardingCard}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <span className={styles.onboardingBadge}>ONBOARDING PROGRESS</span>
              <h3 className={styles.onboardingTitle}>Current Step: Pick a template</h3>
              <p className={styles.onboardingDesc}>
                Your resume has been successfully uploaded and parsed. Choose a high-conversion design to bring your portfolio to life.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <Link href="/dashboard/templates" className={styles.onboardingBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
                Browse Templates
              </Link>
            </div>
            <div className={styles.onboardingDecor} />
          </section>

          {/* Toast Notification */}
          {showToast && (
            <div
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
                animation: 'slideIn 0.3s ease',
              }}
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Grid Layout for Cards */}
          <div className={styles.statusGrid}>
            {/* Resume Card */}
            <div className={styles.statusCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>
                  <span className={`material-symbols-outlined ${styles.cardIconSpan}`}>description</span>
                </div>
                <span className={styles.badgeParsed}>Parsed</span>
              </div>
              <h4 className={styles.cardTitle}>resume_v1.pdf</h4>
              <p className={styles.cardDesc}>Uploaded on Oct 24, 2023 • 2.4 MB</p>
              <div className={styles.cardActions}>
                <Link href="/dashboard/resume" className={styles.cardLinkBtn}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                  View Details
                </Link>
                <Link href="/dashboard/resume" className={styles.cardTextBtn}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                  Edit Info
                </Link>
              </div>
            </div>

            {/* Site Status Card */}
            <div className={styles.statusCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>
                  <span className={`material-symbols-outlined ${styles.cardIconSpan}`}>language</span>
                </div>
                <span className={isLive ? styles.badgeParsed : styles.badgeDraft}>
                  {isLive ? 'Live' : 'Draft'}
                </span>
              </div>
              <h4 className={styles.cardTitle}>portfolio.ai/rahul</h4>
              <p className={styles.cardDesc}>
                {isLive ? 'Publicly accessible to everyone.' : 'Not yet visible to the public.'}
              </p>
              <div className={styles.cardActions}>
                <button
                  className={styles.primarySiteBtn}
                  onClick={(e) => {
                    e.preventDefault();
                    if (isLive) {
                      alert('Opening live portfolio preview!');
                    } else {
                      handlePublish();
                    }
                  }}
                >
                  {isLive ? 'View Site' : 'Publish Site'}
                </button>
                {!isLive && (
                  <button className={styles.cardTextBtn} onClick={handlePublish}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rocket_launch</span>
                    Go Live
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <h3 className={styles.quickActionsTitle}>Quick Actions</h3>
            <div className={styles.quickActionsGrid}>
              <Link href="/dashboard/resume" className={styles.quickActionBtn}>
                <span className={`material-symbols-outlined ${styles.quickActionIcon}`}>upload_file</span>
                <span className={styles.quickActionLabel}>Upload New Resume</span>
              </Link>
              <Link href="/dashboard/templates" className={styles.quickActionBtn}>
                <span className={`material-symbols-outlined ${styles.quickActionIcon}`}>palette</span>
                <span className={styles.quickActionLabel}>Change Template</span>
              </Link>
              <button className={styles.quickActionBtn} onClick={handlePublish}>
                <span className={`material-symbols-outlined ${styles.quickActionIcon}`}>publish</span>
                <span className={styles.quickActionLabel}>Publish Site</span>
              </button>
            </div>
          </section>

          {/* Bento Grid */}
          <section className={styles.bentoGrid}>
            {/* Live Mobile Preview */}
            <div className={styles.bentoColSpan2}>
              <h3 className={styles.bentoTitle}>Live Preview (Mobile)</h3>
              <div className={styles.previewArea}>
                <div className={styles.phoneFrame}>
                  <div className="flex-center" style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', color: '#64748b', flexDirection: 'column', gap: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>smartphone</span>
                    <span style={{ fontSize: '12px', fontWeight: '500' }}>Preview Screen</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Site Visitors Circular Analytics */}
            <div className={styles.bentoCard}>
              <h3 className={styles.bentoTitle}>Site Visitors</h3>
              <div className={styles.analyticsArea}>
                <div className={styles.spinner} />
                <p className={styles.analyticsDesc}>
                  Publish your site to start tracking analytics and visitor engagement.
                </p>
              </div>
            </div>
          </section>
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
    </div>
  );
}
