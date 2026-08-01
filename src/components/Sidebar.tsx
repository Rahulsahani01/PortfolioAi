'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useSites } from '../context/SitesContext';

interface SidebarProps {
  styles: any;
  activePath: string;
  onCreateSite?: () => void;
  disableCreate?: boolean;
}

export default function Sidebar({ styles, activePath, onCreateSite, disableCreate }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { sites } = useSites();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarBrand}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <p className={styles.sidebarBrandName}>PortfolioAI</p>
        </Link>
        <p className={styles.sidebarPlan}>Premium Plan</p>
      </div>

      <nav className={styles.sidebarNav}>
        {[
          { icon: 'dashboard', label: 'Dashboard', href: '/dashboard' },
          { icon: 'description', label: 'Site Details', href: '/dashboard/siteDetails' },
          { icon: 'web_stories', label: 'Templates', href: '/dashboard/templates' },
          { icon: 'language', label: 'My Site', href: '/dashboard/my-site' },
          { icon: 'sell', label: 'Pricing', href: '/dashboard/pricing' },
          { icon: 'settings', label: 'Settings', href: '/dashboard/settings' },
        ].map(({ icon, label, href }) => {
          const active = activePath === href;
          return (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '0 24px 24px 24px', marginTop: 'auto' }}>
        <button
          onClick={() => {
            if (disableCreate || (sites && sites.length >= 10)) return;
            if (onCreateSite) {
              onCreateSite();
            } else {
              router.push('/dashboard?create=true');
            }
          }}
          disabled={disableCreate || (sites && sites.length >= 10)}
          title={(sites && sites.length >= 10) ? "You have reached the maximum limit of 10 sites. Please delete an existing site to create a new one." : undefined}
          style={{
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            fontSize: '14px',
            backgroundColor: 'var(--primary-navy)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',
            cursor: (disableCreate || (sites && sites.length >= 10)) ? 'not-allowed' : 'pointer',
            opacity: (disableCreate || (sites && sites.length >= 10)) ? 0.5 : 1,
            lineHeight: '1.5'
          }}
        >
          Create New Site
        </button>
      </div>

      <div className={styles.sidebarFooter} style={{ marginTop: 0 }}>
        <button onClick={logout} className={`${styles.navItem} ${styles.logoutItem}`} style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
          <span className={`material-symbols-outlined ${styles.navIcon}`}>logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
