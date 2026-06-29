'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [securityAlerts] = useState(true); // read-only check box as in Stitch

  // Profile Form States
  const [fullName, setFullName] = useState('Alexander Morgan');
  const [email, setEmail] = useState('alex.morgan@portfolio.ai');
  const [bio, setBio] = useState('Product Designer & Tech Enthusiast building digital experiences for the next generation of creators.');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleSaveProfile = () => {
    triggerToast('🎉 Profile information updated successfully!');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      alert('Please fill in both current and new password fields.');
      return;
    }
    triggerToast('🔒 Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm('Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.');
    if (confirm) {
      alert('Account deletion requested.');
    }
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
            { icon: 'language', label: 'My Site', active: false, href: '/dashboard/my-site' },
            { icon: 'settings', label: 'Settings', active: true, href: '/dashboard/settings' },
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
          <button className={styles.createBtn} onClick={() => triggerToast('🎨 Initializing website builder...')}>
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
          <h2 className={styles.topBarTitle}>Settings</h2>
          <div className={styles.topBarActions}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search settings..."
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
          {/* Toast Notification */}
          {showToast && (
            <div
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#10b981',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)',
                animation: 'slideIn 0.3s ease',
                zIndex: 50,
              }}
            >
              <span className="material-symbols-outlined">check_circle</span>
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Settings Grid Layout */}
          <div className={styles.settingsGrid}>
            {/* Profile Section */}
            <section className={`${styles.sectionCard} ${styles.colSpan8}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>person</span>
                  Profile Information
                </h3>
                <button className={styles.saveChangesBtn} onClick={handleSaveProfile}>
                  Save Changes
                </button>
              </div>

              <div className={styles.profileContainer}>
                <div className={styles.avatarWrapper}>
                  <div
                    style={{
                      width: '128px',
                      height: '128px',
                      borderRadius: '50%',
                      backgroundColor: '#cbd5e1',
                      border: '4px solid var(--surface-container-high)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#475569',
                      fontSize: '32px',
                      fontWeight: '700'
                    }}
                  >
                    AM
                  </div>
                  <button className={styles.avatarEditBtn} onClick={() => alert('Feature to upload new avatar is coming soon!')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                  </button>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email Address</label>
                    <input
                      className={styles.input}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className={`${styles.field} ${styles.colSpan2}`}>
                    <label className={styles.label}>Professional Bio</label>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Plan Details Section */}
            <section className={`${styles.sectionCard} ${styles.colSpan4}`}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '24px' }}>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>verified</span>
                Plan Details
              </h3>

              <div className={styles.planBox}>
                <div className={styles.planHeader}>
                  <span className={styles.planBadge}>PREMIUM PLAN</span>
                  <span className={styles.planPrice}>
                    $19<span className={styles.pricePeriod}>/mo</span>
                  </span>
                </div>
                <p className={styles.billingDate}>Your next billing date is April 24, 2024.</p>
                <ul className={styles.featuresList}>
                  <li className={styles.featureItem}>
                    <span className={`material-symbols-outlined ${styles.featureIcon}`}>check_circle</span>
                    Unlimited Portfolio Sites
                  </li>
                  <li className={styles.featureItem}>
                    <span className={`material-symbols-outlined ${styles.featureIcon}`}>check_circle</span>
                    AI-Powered Resume Builder
                  </li>
                  <li className={styles.featureItem}>
                    <span className={`material-symbols-outlined ${styles.featureIcon}`}>check_circle</span>
                    Custom Domains
                  </li>
                </ul>
              </div>

              <button className={styles.manageBillingBtn} onClick={() => triggerToast('💳 Opening billing portal...')}>
                Manage Billing
              </button>
            </section>

            {/* Preferences Section */}
            <section className={`${styles.sectionCard} ${styles.colSpan7}`}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '24px' }}>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>tune</span>
                Preferences
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Theme Selector */}
                <div className={styles.preferenceItem}>
                  <div className={styles.prefInfo}>
                    <span className={styles.prefTitle}>Appearance</span>
                    <span className={styles.prefDesc}>Choose how PortfolioAI looks to you.</span>
                  </div>

                  <div className={styles.themeSelector}>
                    <button
                      className={`${styles.themeBtn} ${activeTheme === 'light' ? styles.themeBtnActive : ''}`}
                      onClick={() => setActiveTheme('light')}
                    >
                      <span className={`material-symbols-outlined ${styles.themeIcon}`}>light_mode</span>
                      <span>Light</span>
                    </button>
                    <button
                      className={`${styles.themeBtn} ${activeTheme === 'dark' ? styles.themeBtnActive : ''}`}
                      onClick={() => setActiveTheme('dark')}
                    >
                      <span className={`material-symbols-outlined ${styles.themeIcon}`}>dark_mode</span>
                      <span>Dark</span>
                    </button>
                  </div>
                </div>

                <hr className={styles.divider} style={{ margin: '0' }} />

                {/* Notifications */}
                <div>
                  <h4 className={styles.prefSectionTitle}>Notifications</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className={styles.preferenceItem}>
                      <div className={styles.prefInfo}>
                        <span className={styles.prefTitle} style={{ fontSize: '14px' }}>Email Updates</span>
                        <span className={styles.prefDesc} style={{ fontSize: '12px' }}>Receive weekly digests and product news.</span>
                      </div>
                      <label className={styles.toggleLabel}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={emailUpdates}
                          onChange={(e) => {
                            setEmailUpdates(e.target.checked);
                            triggerToast(`Notifications ${e.target.checked ? 'enabled' : 'disabled'}.`);
                          }}
                          style={{ display: 'none' }}
                        />
                        <div className={`${styles.toggleTrack} ${emailUpdates ? styles.toggleTrackChecked : ''}`}>
                          <div className={`${styles.toggleThumb} ${emailUpdates ? styles.toggleThumbChecked : ''}`} />
                        </div>
                      </label>
                    </div>

                    <div className={styles.preferenceItem}>
                      <div className={styles.prefInfo}>
                        <span className={styles.prefTitle} style={{ fontSize: '14px' }}>Security Alerts</span>
                        <span className={styles.prefDesc} style={{ fontSize: '12px' }}>Critical alerts regarding your account security.</span>
                      </div>
                      <label className={styles.toggleLabelDisabled}>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={securityAlerts}
                          disabled
                          style={{ display: 'none' }}
                        />
                        <div className={`${styles.toggleTrack} ${styles.toggleTrackDisabled}`}>
                          <div className={`${styles.toggleThumb} ${styles.toggleThumbDisabled}`} />
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className={`${styles.sectionCard} ${styles.colSpan5}`}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '24px' }}>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>security</span>
                Security
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className={styles.field}>
                  <label className={styles.label}>Current Password</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="••••••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>New Password</label>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button className={styles.actionBtn} onClick={handleChangePassword} style={{ marginTop: '8px' }}>
                  Change Password
                </button>
              </div>

              <div className={styles.dangerZone}>
                <h4 className={styles.dangerTitle}>Danger Zone</h4>
                <p className={styles.dangerDesc}>Once you delete your account, there is no going back. Please be certain.</p>
                <button className={styles.deleteAccountBtn} onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </section>
          </div>
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
