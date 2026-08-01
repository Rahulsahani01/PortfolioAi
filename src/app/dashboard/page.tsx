'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import TopBar from '../../components/TopBar';
import { useSites } from '../../context/SitesContext';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../lib/api';
import styles from './page.module.css';

export default function UserDashboard() {
  const router = useRouter();
  const { sites, activeSite, activeSiteId, setActiveSiteId, refreshSites } = useSites();
  const { token } = useAuth();

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

  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      refreshSites();
    }
  }, [refreshSites]);

  // Removed local storage useEffects as context handles it

  const openCreateWizard = () => {
    setNewSiteSlug('');
    setIsModalOpen(true);
  };

  const [isCreating, setIsCreating] = useState(false);

  const handleFinishWizard = async () => {
    if (!newSiteSlug) return;
    try {
      setIsCreating(true);
      const data = await apiFetch('/sites', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({ slug: newSiteSlug })
      });
      await refreshSites(); // wait for context to update
      setActiveSiteId(data.site.id);
      setIsModalOpen(false);
      router.push(`/dashboard/siteDetails?siteId=${data.site.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create site');
    } finally {
      setIsCreating(false);
    }
  };

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
        <TopBar title="Dashboard" showActiveSiteBadge={true} />

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
                  onClick={() => {
                    if (sites.length >= 10) return;
                    openCreateWizard();
                  }}
                  disabled={sites.length >= 10}
                  title={sites.length >= 10 ? "You have reached the maximum limit of 10 sites. Please delete an existing site to create a new one." : undefined}
                  style={{ 
                    cursor: sites.length >= 10 ? 'not-allowed' : 'pointer', 
                    width: 'auto', 
                    display: 'inline-flex',
                    opacity: sites.length >= 10 ? 0.5 : 1
                  }}
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
                {[...sites].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(site => (
                  <div key={site.id} className={styles.statusCard}
                    style={{ 
                      backgroundColor: activeSiteId === site.id ? '#e1e0ff' : 'var(--surface-container-lowest)',
                      borderTopColor: activeSiteId === site.id ? 'var(--electric-indigo)' : 'transparent' 
                    }}
                  >
                    <div className={styles.cardTop}>
                      <div>
                        <h4 className={styles.cardTitle}>{site.slug}</h4>
                        <span className={site.status === 'LIVE' ? styles.badgeParsed : styles.badgeDraft}>
                          {site.status}
                        </span>
                      </div>
                      <button className={styles.iconBtn}>
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                    <div className={styles.cardDesc}>
                      <p style={{ margin: 0, marginBottom: '4px' }}><strong>Template:</strong> {site.templateKey || 'None'}</p>
                      <p style={{ margin: 0 }}><strong>Created:</strong> {new Date(site.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.cardTextBtn} 
                        onClick={() => setActiveSiteId(site.id)}
                        disabled={activeSite?.id === site.id}
                        style={{ marginLeft: 0, opacity: activeSite?.id === site.id ? 0.5 : 1 }}
                      >
                        <span className="material-symbols-outlined">
                          {activeSite?.id === site.id ? 'check_circle' : 'swap_horiz'}
                        </span>
                        {activeSite?.id === site.id ? 'Currently Active' : 'Switch to Site'}
                      </button>
                      <button className={styles.primarySiteBtn} onClick={() => router.push(`/dashboard/resume?siteId=${site.id}`)}>
                        Edit Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <Footer />
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
                disabled={!newSiteSlug || isCreating}
                style={{ opacity: (!newSiteSlug || isCreating) ? 0.5 : 1 }}
              >
                {isCreating ? 'Creating...' : 'Continue to Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
