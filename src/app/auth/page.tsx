'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (activeTab === 'signup' && !fullName)) {
      alert('Please fill out all required fields.');
      return;
    }
    // Navigate to dashboard upon successful simulation
    router.push('/dashboard');
  };

  return (
    <div className={styles.authBody}>
      <main className={styles.authContainer}>
        {/* Logo Section */}
        <div className={styles.logoWrapper}>
          <div className={`${styles.logoIcon} flex-center`}>PA</div>
          <h1 className={styles.logoText}>PortfolioAI</h1>
        </div>

        {/* Authentication Card */}
        <div className={styles.authCard}>
          {/* Tabs */}
          <div className={styles.tabWrapper}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'login' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Log In
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'signup' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Social OAuth */}
          <button
            className={styles.oauthBtn}
            onClick={() => router.push('/dashboard')}
          >
            <svg height="18" viewBox="0 0 18 18" width="18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"></path>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"></path>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957C.347 6.173 0 7.548 0 9s.347 2.827.957 4.044l3.007-2.332z" fill="#FBBC05"></path>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          {/* Form Content */}
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Name Field (Conditional) */}
            {activeTab === 'signup' && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input
                  className={styles.input}
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">Email Address</label>
              <input
                className={styles.input}
                id="email"
                placeholder="name@company.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label className={styles.label} htmlFor="password">Password</label>
                {activeTab === 'login' && (
                  <a className={styles.forgotLink} href="#" onClick={(e) => { e.preventDefault(); alert('Password reset link sent!'); }}>
                    Forgot?
                  </a>
                )}
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  className={styles.input}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className={styles.toggleVisibilityBtn}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* CTA Button */}
            <button className={styles.submitBtn} type="submit">
              {activeTab === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            By continuing, you agree to PortfolioAI's <br />
            <a className={styles.footerLink} href="#">Terms of Service</a> and <a className={styles.footerLink} href="#">Privacy Policy</a>.
          </p>
        </div>
      </main>
    </div>
  );
}
