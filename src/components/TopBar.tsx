'use client';

import React from 'react';
import ActiveSiteBadge from './ActiveSiteBadge';
import NotificationDropdown from './NotificationDropdown';
import { useSites } from '../context/SitesContext';
import styles from './TopBar.module.css';

interface TopBarProps {
  title: string;
  showActiveSiteBadge?: boolean;
  actions?: React.ReactNode;
}

export default function TopBar({ title, showActiveSiteBadge = false, actions }: TopBarProps) {
  const { activeSite } = useSites();
  const activeSiteName = activeSite?.slug || '';
  const activeSiteStatus = activeSite?.status || 'DRAFT';

  return (
    <header className={styles.topBar}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {showActiveSiteBadge && activeSite ? (
          <ActiveSiteBadge 
            siteName={activeSiteName} 
            status={activeSiteStatus} 
            paymentStatus={activeSite?.paymentStatus} 
          />
        ) : (
          <h2 className={styles.topBarTitle} style={{ margin: 0 }}>{title}</h2>
        )}
      </div>
      <div className={styles.topBarActions}>
        {actions}
        <NotificationDropdown iconBtnClass={styles.iconBtn} />
      </div>
    </header>
  );
}
