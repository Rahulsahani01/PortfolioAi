import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.footerCopy}>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</p>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>Privacy Policy</a>
          <a href="#" className={styles.footerLink}>Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
