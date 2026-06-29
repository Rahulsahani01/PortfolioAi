'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function MySitePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // States
  const [isPublished, setIsPublished] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('pro');
  const [siteHandle, setSiteHandle] = useState('rahul');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const published = localStorage.getItem('portfolio_site_published');
    if (published === 'true') {
      setIsPublished(true);
    }
    const plan = localStorage.getItem('portfolio_site_plan');
    if (plan === 'free' || plan === 'pro') {
      setSelectedPlan(plan as 'free' | 'pro');
    }
    const slug = localStorage.getItem('portfolio_site_slug');
    if (slug) {
      setSiteHandle(slug);
    }
  }, []);

  // Save changes helper
  const updatePublishStatus = (status: boolean) => {
    setIsPublished(status);
    localStorage.setItem('portfolio_site_published', status ? 'true' : 'false');
  };

  const updateSelectedPlan = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
    localStorage.setItem('portfolio_site_plan', plan);
  };

  const updateSiteHandle = (slug: string) => {
    setSiteHandle(slug);
    localStorage.setItem('portfolio_site_slug', slug);
  };

  // Confetti handler
  useEffect(() => {
    if (!showSuccess || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#4648d4', '#6063ee', '#000000', '#dae2fd', '#ba1a1a'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        p.y += p.speed;
        p.angle += 2;
        if (p.y > canvas.height) p.y = -10;
      });
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [showSuccess]);

  const handleCheckout = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setIsTransitioning(false);
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  const handleConfirmSuccess = () => {
    setShowSuccess(false);
    updatePublishStatus(true);
  };

  const handleUnpublish = () => {
    if (confirm('Are you sure you want to unpublish your portfolio website? It will no longer be visible to the public.')) {
      updatePublishStatus(false);
    }
  };

  const handleDelete = () => {
    if (confirm('⚠️ WARNING: Deleting your site will permanently remove all content, custom configurations, and DNS settings. This cannot be undone! Proceed?')) {
      updatePublishStatus(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`portfolio.company.com/${siteHandle}`);
    alert('Live link copied to clipboard!');
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
            { icon: 'dashboard', label: 'Dashboard', active: false, href: '/dashboard' },
            { icon: 'description', label: 'My Resume', active: false, href: '/dashboard/resume' },
            { icon: 'web_stories', label: 'Templates', active: false, href: '/dashboard/templates' },
            { icon: 'language', label: 'My Site', active: true, href: '/dashboard/my-site' },
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
          <div className={styles.topBarTitleGroup}>
            <h2 className={styles.topBarTitle}>
              {isPublished && !showSuccess ? 'My Site Management' : 'Publish Your Site'}
            </h2>
            {isPublished && !showSuccess && (
              <div className={styles.topBarBadge}>
                <span className={styles.topBarBadgeDot} />
                PUBLISHED
              </div>
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

        {/* Canvas */}
        <div className={styles.canvas}>
          {/* Confetti canvas */}
          {showSuccess && <canvas ref={canvasRef} className={styles.confettiCanvas} />}

          {/* 1. SUCCESS STATE VIEW */}
          {showSuccess ? (
            <div className={styles.successContainer}>
              <div className={styles.successIconBadge}>
                <span className={`material-symbols-outlined ${styles.successIcon}`}>check_circle</span>
              </div>
              <div>
                <h2 className={styles.successTitle}>It's Official!</h2>
                <p className={styles.successDesc}>
                  Your portfolio has been published to the web. Share your new professional home with the world.
                </p>
              </div>

              <div className={styles.liveUrlCard}>
                <div className={styles.liveUrlGrad} />
                <span className={styles.liveUrlLabel}>Your Live Portfolio URL</span>
                <div className={styles.liveUrlBar}>
                  <span className={styles.liveUrlText}>portfolio.company.com/{siteHandle}</span>
                  <button className={styles.copyUrlBtn} onClick={handleCopyLink}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>content_copy</span>
                    Copy
                  </button>
                </div>
              </div>

              <div className={styles.successBtnGroup}>
                <button className={styles.successPrimaryBtn} onClick={handleConfirmSuccess}>
                  View Site Dashboard
                </button>
                <button className={styles.successSecondaryBtn} onClick={() => setShowSuccess(false)}>
                  Back to Editor
                </button>
              </div>

              <div className={styles.showcaseGrid}>
                <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>laptop</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginTop: '8px' }}>Desktop Mockup</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>query_stats</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginTop: '8px' }}>Analytics Graph</span>
                </div>
                <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#64748b' }}>group</span>
                  <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', marginTop: '8px' }}>Active Community</span>
                </div>
              </div>
            </div>
          ) : !isPublished ? (
            /* 2. UNPUBLISHED PUBLISH & BILLING VIEW */
            <div
              style={{
                opacity: isTransitioning ? 0.5 : 1,
                pointerEvents: isTransitioning ? 'none' : 'auto',
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              {/* Step 1 URL slug */}
              <section className={styles.card}>
                <div className={styles.sectionTitleGroup}>
                  <span className={styles.stepNumber}>1</span>
                  <h3 className={styles.stepTitle}>Claim your custom URL</h3>
                </div>
                <div style={{ maxWidth: '576px' }}>
                  <label className={styles.fieldLabel}>Site Handle</label>
                  <div className={styles.inputGroup}>
                    <span className={styles.urlPrefix}>portfolio.company.com/</span>
                    <input
                      type="text"
                      className={`${styles.inputField} ${styles.inputFieldSuccess}`}
                      value={siteHandle}
                      onChange={(e) => updateSiteHandle(e.target.value)}
                    />
                    <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                  </div>
                  <p className={styles.slugStatus}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span>
                    This slug is available!
                  </p>
                </div>
              </section>

              {/* Step 2 Plan selection */}
              <section>
                <div className={styles.sectionTitleGroup} style={{ marginBottom: 0 }}>
                  <span className={styles.stepNumber}>2</span>
                  <h3 className={styles.stepTitle}>Select your publishing plan</h3>
                </div>

                <div className={styles.plansGrid}>
                  {/* Free plan card */}
                  <div
                    className={`${styles.planCard} ${selectedPlan === 'free' ? styles.planCardActive : ''}`}
                    onClick={() => updateSelectedPlan('free')}
                  >
                    {selectedPlan === 'free' && (
                      <span className={`material-symbols-outlined ${styles.planSelectIcon}`}>check_circle</span>
                    )}
                    <h4 className={styles.planTitle}>Free</h4>
                    <p className={styles.planSub}>Best for starting your journey</p>
                    <div className={styles.planPrice}>
                      ₹0<span className={styles.planPeriod}>/forever</span>
                    </div>
                    <ul className={styles.featuresList}>
                      <li className={styles.featureItem}>
                        <span className={`material-symbols-outlined ${styles.featureIcon}`}>check</span>
                        PortfolioAI Branding
                      </li>
                      <li className={styles.featureItem}>
                        <span className={`material-symbols-outlined ${styles.featureIcon}`}>check</span>
                        Standard Templates
                      </li>
                      <li className={`${styles.featureItem} ${styles.featureItemDisabled}`}>
                        <span className={`material-symbols-outlined ${styles.featureIcon}`}>close</span>
                        Custom Domain
                      </li>
                    </ul>
                    <button className={`${styles.planButton} ${selectedPlan === 'free' ? styles.planButtonActive : ''}`}>
                      {selectedPlan === 'free' ? 'Selected Free' : 'Select Free'}
                    </button>
                  </div>

                  {/* Pro plan card */}
                  <div
                    className={`${styles.planCard} ${selectedPlan === 'pro' ? styles.planCardActive : ''}`}
                    onClick={() => updateSelectedPlan('pro')}
                    style={{ background: 'linear-gradient(to bottom right, #ffffff, rgba(96, 99, 238, 0.05))' }}
                  >
                    <div className={styles.popularBadge}>Popular</div>
                    {selectedPlan === 'pro' && (
                      <span className={`material-symbols-outlined ${styles.planSelectIcon}`}>check_circle</span>
                    )}
                    <h4 className={styles.planTitle}>Pro</h4>
                    <p className={styles.planSub}>The professional's edge</p>
                    <div className={styles.planPrice}>
                      ₹499<span className={styles.planPeriod}>/month</span>
                    </div>
                    <ul className={styles.featuresList}>
                      <li className={styles.featureItem} style={{ fontWeight: '700' }}>
                        <span className={`material-symbols-outlined ${styles.featureIconStar}`}>star</span>
                        No Branding
                      </li>
                      <li className={styles.featureItem} style={{ fontWeight: '700' }}>
                        <span className={`material-symbols-outlined ${styles.featureIconStar}`}>star</span>
                        Custom subdomains
                      </li>
                      <li className={styles.featureItem} style={{ fontWeight: '700' }}>
                        <span className={`material-symbols-outlined ${styles.featureIconStar}`}>star</span>
                        Analytics Dashboard
                      </li>
                    </ul>
                    <button className={`${styles.planButton} ${selectedPlan === 'pro' ? styles.planButtonActive : ''}`}>
                      {selectedPlan === 'pro' ? 'Selected Pro' : 'Select Pro'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Step 3 Checkout button */}
              <section className={styles.paymentSection}>
                <div>
                  <h3 className={styles.paymentTitle}>Ready to go live?</h3>
                  <p className={styles.paymentDesc}>
                    {selectedPlan === 'pro'
                      ? 'You will be redirected to Razorpay for a secure checkout.'
                      : 'Publish instantly for free under our sub-domain.'}
                  </p>
                </div>
                <button
                  className={selectedPlan === 'pro' ? styles.razorpayBtn : styles.successPrimaryBtn}
                  onClick={handleCheckout}
                >
                  {selectedPlan === 'pro' && (
                    <span className="material-symbols-outlined">payments</span>
                  )}
                  <span>
                    {selectedPlan === 'pro'
                      ? 'Pay ₹499 via Razorpay'
                      : 'Go Live for Free'}
                  </span>
                </button>
              </section>
            </div>
          ) : (
            /* 3. PUBLISHED SITE CONTROLS MANAGEMENT VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Row 1: URL & Actions Control + Visitor Stats */}
              <div className={styles.managementGrid}>
                {/* Control card */}
                <div className={styles.siteControlCard}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className={styles.controlLabel}>Live Production URL</span>
                    <div className={styles.urlBar}>
                      <span className={`material-symbols-outlined ${styles.urlIcon}`}>link</span>
                      <code className={styles.urlText}>portfolio.company.com/{siteHandle}</code>
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
                    <button className={styles.btnOutline} onClick={handleUnpublish}>
                      <span className="material-symbols-outlined">cloud_off</span>
                      Unpublish
                    </button>
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
                    <h3 className={styles.statsValue}>1.2k</h3>
                    <p className={styles.statsLabel}>Unique Page Views</p>
                  </div>
                  <div className={styles.statsFooter}>
                    <div className={styles.statsUpdateText}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                      Updated 2 hours ago
                    </div>
                    <span className={styles.statsTrend}>+12% ↑</span>
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
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>web</span>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>Desktop Layout Preview</span>
                    </div>
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
                        <p className={styles.themeName}>Modern Dark</p>
                        <p className={styles.themeVersion}>Version 2.4.0</p>
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
                        <span className={styles.domainName}>{siteHandle}design.com</span>
                        <span className={`material-symbols-outlined ${styles.domainCheckIcon}`}>check_circle</span>
                      </li>
                      <li className={`${styles.domainItem} ${styles.domainItemDisabled}`}>
                        <span className={styles.domainName}>{siteHandle}.me</span>
                        <span className={styles.domainStatusBadge}>RENEW SOON</span>
                      </li>
                    </ul>
                    <button className={styles.dnsLink} onClick={() => alert('Opening DNS configuration panels!')}>
                      Manage DNS Settings
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </button>
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
