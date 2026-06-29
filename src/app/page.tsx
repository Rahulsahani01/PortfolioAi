'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FEATURES, PRICING_PLANS } from '../data/portfolioData';
import styles from './page.module.css';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <header className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
        <div className={styles.navContainer}>
          <a href="#" className={styles.logoWrapper}>
            <div className={`${styles.logoIcon} flex-center`}>PA</div>
            <span className={styles.logoText}>PortfolioAI</span>
          </a>
          
          <nav className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="#showcase" className={styles.navLink}>Showcase</a>
          </nav>
          
          <div className={styles.navActions}>
            <Link href="/auth" className={styles.btnGhost}>Login</Link>
            <Link href="/auth" className={styles.btnNavAction}>Sign Up</Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <div className={`${styles.pillBadge} animate-fade-in`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', fill: '1' }}>auto_awesome</span>
              <span>New: GPT-4o Powered Generation</span>
            </div>
            
            <h1 className="display-lg heroTitle" style={{ maxWidth: '850px', margin: '0 auto var(--space-lg) auto', color: 'var(--primary-navy)' }}>
              Turn Your Resume Into a Portfolio Website in Minutes
            </h1>
            
            <p className="body-lg heroSub" style={{ maxWidth: '600px', margin: '0 auto var(--space-2xl) auto' }}>
              AI-powered portfolio generation for modern professionals. No coding required. Elevate your personal brand with high-performance layouts.
            </p>
            
            <div className={styles.ctaGroup}>
              <Link href="/dashboard" className={styles.btnPrimary} style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                Get Started Free
              </Link>
              <button className={styles.btnSecondary} onClick={() => alert('Demo is loading...')}>View Demo</button>
            </div>
          </div>

          {/* Decorative blur elements */}
          <div className={styles.decorativeBg}>
            <div className={styles.blurCircle1}></div>
            <div className={styles.blurCircle2}></div>
          </div>
        </section>

        {/* Product Preview Section */}
        <section className={styles.previewSection}>
          <div className={styles.previewContainer}>
            <div className={styles.previewWrapper}>
              <div className="flex-center" style={{ width: '100%', height: '100%', backgroundColor: '#f1f5f9', color: '#64748b', flexDirection: 'column', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>dashboard</span>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>SaaS Dashboard Preview</span>
              </div>
              <div className={styles.previewOverlay}></div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.sectionHeader}>
              <h2 className="headline-lg sectionTitle">Powerful Features</h2>
              <p className="body-md">The tools you need to stand out in the job market.</p>
            </div>
            
            <div className="features-grid">
              {FEATURES.map((feature) => (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.iconWrapper}>
                    <span className="material-symbols-outlined">{feature.icon}</span>
                  </div>
                  <h3 className={`title-lg ${styles.featureCardTitle}`}>{feature.title}</h3>
                  <p className="body-md">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plan Table */}
        <section id="pricing" className={styles.pricingSection}>
          <div className={styles.pricingContainer}>
            <div className={styles.pricingHeader}>
              <h2 className="headline-lg sectionTitle">Simple, Honest Pricing</h2>
              <p className="body-lg">Free to build, pro to scale.</p>
            </div>

            <div className={styles.pricingCardsWrapper}>
              {PRICING_PLANS.map((plan) => {
                const isPro = plan.isPopular;
                return (
                  <div 
                    key={plan.id} 
                    className={isPro ? styles.pricingCardPro : styles.pricingCard}
                  >
                    {isPro && <div className={styles.pricingPopularTag}>Popular</div>}
                    
                    <h3 className={isPro ? styles.pricingPlanTitle : `${styles.pricingPlanTitle} ${styles.pricingPlanTitleNormal}`}>
                      {plan.name}
                    </h3>
                    
                    <div className={styles.pricingPriceWrapper}>
                      <span className={isPro ? styles.priceText : `${styles.priceText} ${styles.priceTextNormal}`}>
                        {plan.price}
                      </span>
                      <span className={styles.pricePeriod}>/{plan.period}</span>
                    </div>

                    <ul className={styles.featureList}>
                      {plan.features.map((feat, i) => (
                        <li key={i} className={styles.featureItem}>
                          <span className={`material-symbols-outlined ${styles.checkIcon}`}>check_circle</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/dashboard" className={isPro ? styles.pricingBtnPro : styles.pricingBtn} style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                      {plan.ctaText}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Showcase Call to Action */}
        <section id="showcase" className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <h2 className="display-lg ctaTitle">Ready to land your dream job?</h2>
            <p className="body-lg ctaSubText">
              Join 50,000+ professionals who have supercharged their careers with PortfolioAI.
            </p>
            <Link href="/dashboard" className={styles.ctaBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
              Start Your Portfolio
            </Link>
          </div>
          
          <div className={styles.ctaBgDecoration1}></div>
          <div className={styles.ctaBgDecoration2}></div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerBrand}>
            <a href="#" className={styles.footerLogo}>
              <div className={`${styles.footerLogoIcon} flex-center`}>PA</div>
              <span>PortfolioAI</span>
            </a>
            <p className={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} PortfolioAI. All rights reserved.
            </p>
          </div>

          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Privacy Policy</a>
            <a href="#" className={styles.footerLink}>Terms of Service</a>
            <a href="#" className={styles.footerLink}>Contact</a>
          </div>

          <div className={styles.footerSocials}>
            <a href="#" className={styles.socialIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>share</span>
            </a>
            <a href="#" className={styles.socialIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>language</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
