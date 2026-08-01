'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import Footer from '../../../components/Footer';
import TopBar from '../../../components/TopBar';
import styles from './page.module.css';

export default function SettingsPage() {
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [securityAlerts] = useState(true); // read-only check box as in Stitch
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@portfolio.ai";

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
      <Sidebar styles={styles} activePath="/dashboard/settings" />

      {/* ── Main Area ─────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top App Bar */}
        <TopBar title="Settings" />

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
            {/* Contact Us Section */}
            <section className={styles.sectionCard} style={{ gridColumn: 'span 12' }}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>contact_support</span>
                  Contact Us
                </h3>
              </div>
              <div className={styles.profileContainer}>
                <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px', lineHeight: '1.6' }}>
                  If you have any questions, require technical support, or want to explore enterprise options, please don't hesitate to reach out. You can contact our dedicated support team directly at <a href={`mailto:${contactEmail}`} style={{ color: 'var(--primary-navy)', fontWeight: 600, textDecoration: 'underline' }}>{contactEmail}</a>.
                </p>
              </div>
            </section>

            {/* Preferences Section */}
            <section className={`${styles.sectionCard} ${styles.colSpan7}`}>
              <h3 className={styles.cardTitle} style={{ marginBottom: '24px' }}>
                <span className={`material-symbols-outlined ${styles.cardIcon}`}>tune</span>
                Preferences
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


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
        <Footer />
      </main>
    </div>
  );
}
