'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
import Footer from '../../../components/Footer';
import PaymentModal from '../../../components/PaymentModal';
import NotificationDropdown from '../../../components/NotificationDropdown';
import TopBar from '../../../components/TopBar';
import { useSites } from '../../../context/SitesContext';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import styles from './page.module.css';

export default function MySitePage() {
  const router = useRouter();
  const { sites, activeSite, activeSiteId, setActiveSiteId, refreshSites } = useSites();
  const { token } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const fetchedSiteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeSiteId && fetchedSiteIdRef.current !== activeSiteId) {
      fetchedSiteIdRef.current = activeSiteId;
      refreshSites(activeSiteId);
    }
  }, [activeSiteId, refreshSites]);

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleUnpublish = () => {
    if (!activeSite) return;
    if (confirm('Are you sure you want to unpublish your portfolio website? It will no longer be visible to the public.')) {
      // In real backend, call API to unpublish
      console.log('Unpublish not implemented');
    }
  };

  const handleRepublish = () => {
    if (!activeSite) return;
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = async (transactionNo: string, screenshotFile: File | null, amount: number) => {
    if (!activeSite) return;
    if (!transactionNo || !screenshotFile) {
      alert('Please provide both the transaction number and a payment screenshot.');
      return;
    }

    try {
      const checkoutRes = await apiFetch('/billing/checkout', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          siteId: activeSite.id,
          amount
        })
      });

      // 2. Upload screenshot
      const formData = new FormData();
      formData.append('paymentId', checkoutRes.paymentId);
      formData.append('utrNumber', transactionNo);
      formData.append('screenshot', screenshotFile);

      await apiFetch('/billing/verify', {
        method: 'POST',
        token: token || undefined,
        body: formData as any,
        isFormData: true
      });

      alert('Payment details submitted! Your site is under review.');
      setIsPaymentModalOpen(false);
      // Refresh sites to update status to UNDER_REVIEW
      await refreshSites(activeSite.id);
    } catch (err: any) {
      alert('Error submitting payment: ' + err.message);
    }
  };

  const handleDelete = async () => {
    if (!activeSite) return;
    if (confirm('⚠️ WARNING: Deleting your site will permanently remove all content, custom configurations, and DNS settings. This cannot be undone! Proceed?')) {
      try {
        await apiFetch(`/sites/${activeSite.id}`, {
          method: 'DELETE',
          token: token || undefined
        });
        alert('Site deleted successfully.');
        // Refresh sites to remove the deleted site
        await refreshSites();
        router.push('/dashboard');
      } catch (err: any) {
        alert('Error deleting site: ' + err.message);
      }
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
        <TopBar 
          title="My Site Management" 
          showActiveSiteBadge={true} 
          actions={
            sites.length > 0 && (
              <select 
                style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--outline)', outline: 'none', fontWeight: 600, color: 'var(--primary-navy)' }}
                value={activeSite?.id || ''}
                onChange={async (e) => {
                  const newSiteId = e.target.value;
                  setActiveSiteId(newSiteId);
                  await refreshSites(newSiteId);
                }}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.slug}</option>
                ))}
              </select>
            )
          } 
        />

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
                    <Link 
                      href={activeSite?.paymentStatus === 'PENDING' ? '#' : "/dashboard/siteDetails"} 
                      className={styles.btnPrimary} 
                      onClick={(e) => {
                        if (activeSite?.paymentStatus === 'PENDING') {
                          e.preventDefault();
                        }
                      }}
                      title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : undefined}
                      style={{ 
                        textDecoration: 'none',
                        opacity: activeSite?.paymentStatus === 'PENDING' ? 0.5 : 1,
                        cursor: activeSite?.paymentStatus === 'PENDING' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span className="material-symbols-outlined">edit</span>
                      Edit Content
                    </Link>
                    <Link 
                      href={activeSite?.paymentStatus === 'PENDING' ? '#' : "/dashboard/templates"} 
                      className={styles.btnSecondary} 
                      onClick={(e) => {
                        if (activeSite?.paymentStatus === 'PENDING') {
                          e.preventDefault();
                        }
                      }}
                      title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : undefined}
                      style={{ 
                        textDecoration: 'none',
                        opacity: activeSite?.paymentStatus === 'PENDING' ? 0.5 : 1,
                        cursor: activeSite?.paymentStatus === 'PENDING' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <span className="material-symbols-outlined">dashboard_customize</span>
                      Change Template
                    </Link>
                    {activeSite.status === 'Live' ? (
                      <button className={styles.btnOutline} onClick={handleUnpublish}>
                        <span className="material-symbols-outlined">cloud_off</span>
                        Unpublish
                      </button>
                    ) : (
                      <button 
                        className={styles.btnPrimary} 
                        onClick={() => {
                          if (activeSite.siteDetail?.status !== 'COMPLETED' || activeSite.paymentStatus === 'PENDING') return;
                          handleRepublish();
                        }} 
                        title={activeSite.paymentStatus === 'PENDING' ? 'Site is under review' : (activeSite.siteDetail?.status !== 'COMPLETED' ? 'complete the site details first' : undefined)}
                        style={{ 
                          backgroundColor: 'var(--primary-navy)',
                          opacity: (activeSite.siteDetail?.status !== 'COMPLETED' || activeSite.paymentStatus === 'PENDING') ? 0.5 : 1,
                          cursor: (activeSite.siteDetail?.status !== 'COMPLETED' || activeSite.paymentStatus === 'PENDING') ? 'not-allowed' : 'pointer'
                        }}
                      >
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
        <Footer />
      </main>

      {/* ── Payment Modal ─────────────────────────────────────── */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleSubmitPayment}
        isOfferUnlocked={activeSite?.socialOffer?.status === 'APPROVED'}
        styles={styles}
      />
    </div>
  );
}
