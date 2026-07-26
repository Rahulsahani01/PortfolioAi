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
  const [selectedPlan, setSelectedPlan] = useState<'6_month' | '1_year' | '3_year'>('1_year');
  const [transactionNo, setTransactionNo] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const prices = isOfferUnlocked 
    ? { sixMo: 250, oneYr: 500, threeYr: 1000 }
    : { sixMo: 500, oneYr: 1000, threeYr: 1500 };

  const handleSubmit = () => {
    let amount = prices.oneYr;
    if (selectedPlan === '6_month') amount = prices.sixMo;
    if (selectedPlan === '3_year') amount = prices.threeYr;

    onSubmit(transactionNo, screenshotFile, amount);
    // Reset local state after submit
    setTransactionNo('');
    setScreenshotFile(null);
    setSelectedPlan('1_year');
  };

  const handleClose = () => {
    onClose();
    // Reset local state on close
    setTransactionNo('');
    setScreenshotFile(null);
    setSelectedPlan('1_year');
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Publish Your Portfolio</h3>
          <button className={styles.modalCloseBtn} onClick={handleClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>1. Select a Plan</label>
            <div className={styles.pricingGrid}>
              <div 
                className={`${styles.pricingCard} ${selectedPlan === '6_month' ? styles.pricingCardSelected : ''}`}
                onClick={() => setSelectedPlan('6_month')}
              >
                <span className={styles.pricingDuration}>6 Months</span>
                <h4 className={styles.pricingPrice}>₹{prices.sixMo}</h4>
              </div>
              <div 
                className={`${styles.pricingCard} ${selectedPlan === '1_year' ? styles.pricingCardSelected : ''}`}
                onClick={() => setSelectedPlan('1_year')}
              >
                <span className={styles.pricingDuration}>1 Year</span>
                <h4 className={styles.pricingPrice}>₹{prices.oneYr}</h4>
              </div>
              <div 
                className={`${styles.pricingCard} ${selectedPlan === '3_year' ? styles.pricingCardSelected : ''}`}
                onClick={() => setSelectedPlan('3_year')}
              >
                <span className={styles.pricingDuration}>3 Years</span>
                <h4 className={styles.pricingPrice}>₹{prices.threeYr}</h4>
              </div>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>2. Payment Screenshot</label>
            <input 
              type="file" 
              accept="image/*"
              className={styles.fileInput}
              onChange={(e) => setScreenshotFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>3. Transaction Number</label>
            <input 
              type="text" 
              className={styles.textInput}
              placeholder="Enter UPI or Bank Transaction No."
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button 
            className={styles.btnOutline} 
            onClick={handleClose}
          >
            Cancel
          </button>
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
        </div>
      </div>
    </div>
  );
}
