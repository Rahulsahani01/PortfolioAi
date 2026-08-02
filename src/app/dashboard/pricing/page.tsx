'use client';

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../components/Sidebar';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Footer from '../../../components/Footer';
import TopBar from '../../../components/TopBar';
import { useSites } from '../../../context/SitesContext';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import styles from './page.module.css';

export default function PricingPage() {
  const { activeSite, activeSiteId, refreshSites } = useSites();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchedSiteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeSiteId && fetchedSiteIdRef.current !== activeSiteId) {
      fetchedSiteIdRef.current = activeSiteId;
      refreshSites(activeSiteId);
    }
  }, [activeSiteId, refreshSites]);

  // Form states
  const [socialType, setSocialType] = useState('LinkedIn');
  const [handlerName, setHandlerName] = useState('');
  const [postLink, setPostLink] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  const handleSubmitOffer = async () => {
    if (!handlerName || !postLink || !screenshotFile) {
      alert('Please fill out all fields and upload a screenshot to claim the offer.');
      return;
    }
    
    if (!activeSiteId) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('siteId', activeSiteId);
      formData.append('platform', socialType);
      formData.append('handlerName', handlerName);
      formData.append('postUrl', postLink);
      formData.append('screenshot', screenshotFile);

      await apiFetch('/social-offers', {
        method: 'POST',
        token: token || undefined,
        body: formData as any, // fetch will correctly set content-type for FormData if we pass it directly
        isFormData: true
      });

      alert('Reference submitted successfully! Your offer is under review.');
      await refreshSites(activeSiteId);
    } catch (err: any) {
      alert('Error submitting offer: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const offerStatus = activeSite?.socialOffer?.status || 'None';
  const isOfferUnlocked = offerStatus === 'APPROVED';
  const isOfferPending = offerStatus === 'PENDING';

  const originalPrices = { sixMo: 500, oneYr: 1000, threeYr: 1500 };
  const prices = isOfferUnlocked 
    ? { sixMo: 250, oneYr: 500, threeYr: 1000 }
    : originalPrices;

  return (
    <div className={styles.shell}>
      <Sidebar styles={styles} activePath="/dashboard/pricing" />

      <main className={styles.mainArea}>
        <TopBar title="Pricing" showActiveSiteBadge={true} />

        <div className={styles.canvas}>
          <div className={styles.pricingContainer}>
            
            {/* Standard Pricing Section */}
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                {isOfferUnlocked ? 'Your Discounted Plans' : 'Choose Your Plan'}
              </h2>
              <p className={styles.sectionSubtitle}>
                {isOfferUnlocked 
                  ? 'Awesome! You have unlocked our exclusive creator pricing.' 
                  : 'Simple, transparent pricing for your portfolio site.'}
              </p>
            </div>

            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <span className={styles.pricingDuration}>6 Months</span>
                <h4 className={styles.pricingPrice}>
                  {isOfferUnlocked && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--on-surface-variant)', fontSize: '0.7em', marginRight: '8px' }}>
                      ₹{originalPrices.sixMo}
                    </span>
                  )}
                  ₹{prices.sixMo}
                </h4>
              </div>
              <div className={styles.pricingCard} style={{ borderColor: 'var(--electric-indigo)', boxShadow: 'var(--shadow-level-3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--electric-indigo)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', zIndex: 1 }}>POPULAR</div>
                <span className={styles.pricingDuration}>1 Year</span>
                <h4 className={styles.pricingPrice}>
                  {isOfferUnlocked && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--on-surface-variant)', fontSize: '0.7em', marginRight: '8px' }}>
                      ₹{originalPrices.oneYr}
                    </span>
                  )}
                  ₹{prices.oneYr}
                </h4>
              </div>
              <div className={styles.pricingCard}>
                <span className={styles.pricingDuration}>3 Years</span>
                <h4 className={styles.pricingPrice}>
                  {isOfferUnlocked && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--on-surface-variant)', fontSize: '0.7em', marginRight: '8px' }}>
                      ₹{originalPrices.threeYr}
                    </span>
                  )}
                  ₹{prices.threeYr}
                </h4>
              </div>
            </div>

            {/* Special Offer Banner */}
            {!isOfferUnlocked && !isOfferPending && (
              <div className={styles.offerBanner}>
                <div className={styles.offerHeader}>
                  <h3>Unlock 50% Off 🚀</h3>
                  <p>
                    Create a post on <strong>any social media platform</strong> tagging us, 
                    including our site URL, and following our page (accept our follow requests). 
                    Submit your proof below to instantly unlock discounted pricing!
                  </p>
                </div>
                
                <div className={styles.offerForm}>
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Social Media Platform</label>
                    <select 
                      className={styles.selectInput} 
                      value={socialType} 
                      onChange={(e) => setSocialType(e.target.value)}
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Twitter/X">Twitter / X</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Your Handler Name / Username</label>
                    <input 
                      type="text" 
                      className={styles.textInput} 
                      placeholder="@username"
                      value={handlerName}
                      onChange={(e) => setHandlerName(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Link to Post</label>
                    <input 
                      type="url" 
                      className={styles.textInput} 
                      placeholder="https://..."
                      value={postLink}
                      onChange={(e) => setPostLink(e.target.value)}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Screenshot of Post</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  <button 
                    className={styles.btnPrimary}
                    onClick={handleSubmitOffer}
                    disabled={!handlerName || !postLink || !screenshotFile}
                    style={{ opacity: (!handlerName || !postLink || !screenshotFile) ? 0.5 : 1, cursor: (!handlerName || !postLink || !screenshotFile) ? 'not-allowed' : 'pointer' }}
                  >
                    Submit Reference
                  </button>
                </div>
              </div>
            )}
            
            {isOfferPending && (
              <div className={styles.offerBanner} style={{ alignItems: 'center', textAlign: 'center' }}>
                <div className={styles.successMessage} style={{ backgroundColor: 'rgba(245, 127, 23, 0.1)', borderColor: 'rgba(245, 127, 23, 0.3)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#F57F17' }}>hourglass_empty</span>
                  <div className={styles.successText} style={{ textAlign: 'left' }}>
                    <h4>Reference Submitted!</h4>
                    <p>The offer will be available to this site within 3 hours. If there is something not correct about the post, you will lose this offer.</p>
                  </div>
                </div>
              </div>
            )}

            {isOfferUnlocked && (
              <div className={styles.offerBanner} style={{ alignItems: 'center', textAlign: 'center' }}>
                <div className={styles.successMessage}>
                  <span className="material-symbols-outlined">check_circle</span>
                  <div className={styles.successText} style={{ textAlign: 'left' }}>
                    <h4>Discount Unlocked!</h4>
                    <p>Your social media post reference has been accepted. Your discount is now active for this site.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
