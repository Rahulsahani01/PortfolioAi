'use client';

import { useState, useEffect } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transactionNo: string, screenshotFile: File | null, amount: number) => void;
  styles: any;
  isOfferUnlocked?: boolean;
}

export default function PaymentModal({ isOpen, onClose, onSubmit, styles, isOfferUnlocked = false }: PaymentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPlan, setSelectedPlan] = useState<'6_month' | '1_year' | '3_year'>('1_year');
  const [transactionNo, setTransactionNo] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const originalPrices = { sixMo: 500, oneYr: 1000, threeYr: 1500 };
  const prices = isOfferUnlocked 
    ? { sixMo: 250, oneYr: 500, threeYr: 1000 }
    : originalPrices;

  let amount = prices.oneYr;
  if (selectedPlan === '6_month') amount = prices.sixMo;
  if (selectedPlan === '3_year') amount = prices.threeYr;

  const handleSubmit = () => {
    onSubmit(transactionNo, screenshotFile, amount);
    // Reset local state after submit
    resetState();
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const resetState = () => {
    setTransactionNo('');
    setScreenshotFile(null);
    setSelectedPlan('1_year');
    setStep(1);
    setCopySuccess(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(process.env.NEXT_PUBLIC_UPI_ID || 'UPI ID not set');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Publish Your Portfolio</h3>
          <button className={styles.modalCloseBtn} onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {/* Progress Indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
            <div style={{ height: '4px', flex: 1, backgroundColor: step >= 1 ? 'var(--primary-navy)' : '#e0e0e0', borderRadius: '2px', transition: '0.3s' }} />
            <div style={{ height: '4px', flex: 1, backgroundColor: step >= 2 ? 'var(--primary-navy)' : '#e0e0e0', borderRadius: '2px', transition: '0.3s' }} />
            <div style={{ height: '4px', flex: 1, backgroundColor: step >= 3 ? 'var(--primary-navy)' : '#e0e0e0', borderRadius: '2px', transition: '0.3s' }} />
          </div>

          {step === 1 && (
            <div className={styles.inputGroup} style={{ animation: 'fadeIn 0.3s' }}>
              <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'block', textAlign: 'center' }}>Step 1: Select a Plan</label>
              <div className={styles.pricingGrid}>
                <div 
                  className={`${styles.pricingCard} ${selectedPlan === '6_month' ? styles.pricingCardSelected : ''}`}
                  onClick={() => setSelectedPlan('6_month')}
                >
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
                <div 
                  className={`${styles.pricingCard} ${selectedPlan === '1_year' ? styles.pricingCardSelected : ''}`}
                  onClick={() => setSelectedPlan('1_year')}
                >
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
                <div 
                  className={`${styles.pricingCard} ${selectedPlan === '3_year' ? styles.pricingCardSelected : ''}`}
                  onClick={() => setSelectedPlan('3_year')}
                >
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
            </div>
          )}

          {step === 2 && (
            <div style={{ textAlign: 'center', animation: 'fadeIn 0.3s' }}>
              <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '8px', display: 'block' }}>Step 2: Make Payment</label>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>Scan the QR code below to pay <strong>₹{amount}</strong></p>
              
              <div style={{ background: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #eaeaea', marginBottom: '24px' }}>
                <img 
                  src="/QRimage.png" 
                  alt="Payment QR Code" 
                  style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '8px' }} 
                />
              </div>

              <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '12px', border: '1px solid #e9ecef', textAlign: 'left' }}>
                <p style={{ fontSize: '0.85rem', color: '#6c757d', marginBottom: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or pay via UPI ID</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', color: '#212529', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                    {process.env.NEXT_PUBLIC_UPI_ID || 'UPI ID not set'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={copyToClipboard}
                      style={{ padding: '6px 12px', background: copySuccess ? '#d4edda' : '#fff', color: copySuccess ? '#155724' : '#495057', border: `1px solid ${copySuccess ? '#c3e6cb' : '#ced4da'}`, borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {copySuccess ? 'check' : 'content_copy'}
                      </span>
                      {copySuccess ? 'Copied' : 'Copy'}
                    </button>
                    
                    <a 
                      href="/QRimage.png" 
                      download="QRimage.png"
                      style={{ padding: '6px 12px', background: 'var(--primary-navy)', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid var(--primary-navy)', transition: 'all 0.2s' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                      QR
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <label className={styles.inputLabel} style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'block', textAlign: 'center' }}>Step 3: Verification Details</label>
              
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Upload Payment Screenshot</label>
                <div style={{ marginTop: '8px', position: 'relative' }}>
                  <input 
                    type="file" 
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
                    style={{ width: '100%', padding: '12px', border: '2px dashed #ced4da', borderRadius: '8px', cursor: 'pointer', background: '#f8f9fa' }}
                  />
                  {screenshotFile && <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#28a745', fontWeight: '500' }}>✓ {screenshotFile.name} selected</p>}
                </div>
              </div>

              <div className={styles.inputGroup} style={{ marginTop: '24px' }}>
                <label className={styles.inputLabel}>Transaction Reference Number</label>
                <input 
                  type="text" 
                  className={styles.textInput}
                  placeholder="e.g. UPI Ref No. 123456789012"
                  value={transactionNo}
                  onChange={(e) => setTransactionNo(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ced4da', borderRadius: '8px', fontSize: '1rem', marginTop: '8px' }}
                />
                <p style={{ marginTop: '6px', fontSize: '0.8rem', color: '#6c757d' }}>12-digit UPI reference number from your payment app</p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter} style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <button 
              className={styles.btnOutline} 
              onClick={() => setStep(step - 1 as 1 | 2)}
            >
              Back
            </button>
          ) : (
            <button 
              className={styles.btnOutline} 
              onClick={handleClose}
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button 
              className={styles.btnPrimary} 
              onClick={() => setStep(step + 1 as 2 | 3)}
              style={{ backgroundColor: 'var(--primary-navy)' }}
            >
              Next Step
            </button>
          ) : (
            <button 
              className={styles.btnPrimary} 
              onClick={handleSubmit}
              disabled={!transactionNo || !screenshotFile}
              style={{ 
                backgroundColor: 'var(--primary-navy)',
                opacity: (!transactionNo || !screenshotFile) ? 0.5 : 1,
                cursor: (!transactionNo || !screenshotFile) ? 'not-allowed' : 'pointer'
              }}
            >
              Submit for Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
