'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './NotificationDropdown.module.css';

export default function NotificationDropdown({ iconBtnClass }: { iconBtnClass: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button className={iconBtnClass} onClick={() => setIsOpen(!isOpen)}>
        <span className="material-symbols-outlined">notifications</span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownHeader}>
            <h4>Notifications</h4>
          </div>
          <div className={styles.dropdownBody}>
            <div className={styles.emptyState}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--outline-variant)' }}>notifications_off</span>
              <p>No new notifications</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
