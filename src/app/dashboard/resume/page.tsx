'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DUMMY_RESUME } from '../../../data/portfolioData';
import styles from './page.module.css';

type Skill = string;
type ExperienceEntry = typeof DUMMY_RESUME.experience[0];
type EducationEntry = typeof DUMMY_RESUME.education[0];

export default function ResumePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const [name, setName] = useState(DUMMY_RESUME.name);
  const [title, setTitle] = useState(DUMMY_RESUME.title);
  const [skills, setSkills] = useState<Skill[]>(DUMMY_RESUME.skills.slice(0, 3));
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const [experience, setExperience] = useState<ExperienceEntry[]>(DUMMY_RESUME.experience);
  const [education, setEducation] = useState<EducationEntry[]>(DUMMY_RESUME.education);

  /* ── Drop Zone handlers ─────────────────────────────────── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  const handleDragLeave = () => setIsDragActive(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  };
  const handleBrowse = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  /* ── Skills ─────────────────────────────────────────────── */
  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));
  const commitSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setNewSkill('');
    setAddingSkill(false);
  };

  /* ── Education ──────────────────────────────────────────── */
  const removeEducation = (i: number) =>
    setEducation(education.filter((_, idx) => idx !== i));

  /* ── Experience ─────────────────────────────────────────── */
  const removeExperience = (i: number) =>
    setExperience(experience.filter((_, idx) => idx !== i));

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <p className={styles.sidebarBrandName}>PortfolioAI</p>
          </Link>
          <p className={styles.sidebarPlan}>Premium Plan</p>
        </div>

        <nav className={styles.sidebarNav}>
          {[
            { icon: 'description', label: 'My Resume', active: true, href: '/dashboard/resume' },
            { icon: 'dashboard', label: 'Dashboard', active: false, href: '/dashboard' },
            { icon: 'web_stories', label: 'Templates', active: false, href: '/dashboard/templates' },
            { icon: 'language', label: 'My Site', active: false, href: '/dashboard/my-site' },
            { icon: 'settings', label: 'Settings', active: false, href: '/dashboard/settings' },
          ].map(({ icon, label, active, href }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
            >
              <span className={`material-symbols-outlined ${styles.navIcon}`}>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <a href="#" className={styles.navItem}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>help</span>
            <span>Help Center</span>
          </a>
          <Link href="/auth" className={`${styles.navItem} ${styles.logoutItem}`}>
            <span className={`material-symbols-outlined ${styles.navIcon}`}>logout</span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <h2 className={styles.topBarTitle}>Resume Review</h2>
          <div className={styles.topBarActions}>
            <div className={styles.searchWrapper}>
              <span className={`material-symbols-outlined ${styles.searchIcon}`}>search</span>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search components..."
              />
            </div>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className={styles.iconBtn}>
              <span className="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className={styles.canvas}>

          {/* ── Drop Zone ─────────────────────────────────── */}
          <section>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div
              className={`${styles.dropZone} ${isDragActive ? styles.dropZoneActive : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowse}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleBrowse()}
            >
              <div className={styles.dropZoneIcon}>
                <span className="material-symbols-outlined">upload_file</span>
              </div>
              {uploadedFile ? (
                <>
                  <p className={styles.dropZoneTitle}>✓ {uploadedFile}</p>
                  <p className={styles.dropZoneSub}>Click to replace file</p>
                </>
              ) : (
                <>
                  <p className={styles.dropZoneTitle}>Drop your PDF or DOCX here</p>
                  <p className={styles.dropZoneSub}>or click to browse from your computer (Max 10MB)</p>
                </>
              )}
            </div>
          </section>

          {/* ── Data Review Grid ───────────────────────────── */}
          <section className={styles.reviewGrid}>

            {/* Left Column */}
            <div className={styles.leftCol}>

              {/* Personal Info */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>person</span>
                  <h3 className={styles.cardTitle}>Personal Information</h3>
                </div>
                <div className={styles.fieldGroup}>
                  <div className={styles.field}>
                    <label className={styles.label}>Full Name</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Professional Title</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>school</span>
                  <h3 className={styles.cardTitle}>Education</h3>
                </div>
                <div className="flex-col" style={{ display: 'flex', gap: '8px' }}>
                  {education.map((edu, i) => (
                    <div key={i} className={styles.eduEntry}>
                      <div>
                        <p className={styles.eduName}>{edu.institution}</p>
                        <p className={styles.eduDegree}>{edu.degree}</p>
                      </div>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => removeEducation(i)}
                        title="Remove education"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button className={styles.addDashedBtn} onClick={() => {
                  const inst = prompt('Institution Name:');
                  const deg = prompt('Degree and Field of Study:');
                  if (inst && deg) {
                    setEducation([...education, { institution: inst, degree: deg, duration: '2023' }]);
                  }
                }}>+ ADD EDUCATION</button>
              </div>

              {/* Skills */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>bolt</span>
                  <h3 className={styles.cardTitle}>Skills</h3>
                </div>
                <div className={styles.skillsWrap}>
                  {skills.map(s => (
                    <span key={s} className={styles.skillChip}>
                      {s}
                      <button className={styles.skillClose} onClick={() => removeSkill(s)}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </span>
                  ))}
                  {addingSkill ? (
                    <input
                      className={styles.input}
                      style={{ width: '120px', padding: '4px 10px', fontSize: '12px' }}
                      autoFocus
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitSkill();
                        if (e.key === 'Escape') { setAddingSkill(false); setNewSkill(''); }
                      }}
                      onBlur={commitSkill}
                      placeholder="Type & Enter"
                    />
                  ) : (
                    <button className={styles.addSkillBtn} onClick={() => setAddingSkill(true)}>
                      + Add Skill
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column – Experience */}
            <div className={styles.rightCol}>
              <div className={`${styles.card} ${styles.expCard}`}>
                <div className={styles.cardHeaderRight}>
                  <div className={styles.cardHeader} style={{ margin: 0 }}>
                    <span className={`material-symbols-outlined ${styles.cardIcon}`}>work</span>
                    <h3 className={styles.cardTitle}>Experience</h3>
                  </div>
                  <button className={styles.addExpBtn} onClick={() => {
                    const comp = prompt('Company Name:');
                    const role = prompt('Role Title:');
                    const desc = prompt('Job Description:');
                    if (comp && role && desc) {
                      setExperience([...experience, { company: comp, role, duration: '2025 - Present', description: desc }]);
                    }
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                    ADD EXPERIENCE
                  </button>
                </div>

                {experience.map((exp, i) => (
                  <div
                    key={i}
                    className={`${styles.expEntry} ${i > 0 ? styles.expEntrySecondary : ''}`}
                  >
                    {/* hover actions */}
                    <div className={styles.expEntryActions}>
                      <button className={styles.expActionBtn} onClick={() => {
                        const newTitle = prompt('Edit Company Name:', exp.company);
                        if (newTitle) {
                          setExperience(experience.map((x, idx) => idx === i ? { ...x, company: newTitle } : x));
                        }
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                      </button>
                      <button className={`${styles.expActionBtn} ${styles.expActionBtnDanger}`} onClick={() => removeExperience(i)}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                      </button>
                    </div>

                    <div className={styles.expContent}>
                      <div className={styles.expLogo}>
                        <span className="material-symbols-outlined">business</span>
                      </div>
                      <div className={styles.expDetails}>
                        <div className={styles.expTop}>
                          <h4 className={styles.expTitle}>{exp.company} – {exp.role}</h4>
                          {i === 0 && <span className={styles.badgePublished}>Published</span>}
                        </div>
                        <p className={styles.expMeta}>{exp.duration}</p>
                        <p className={styles.expDesc}>{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          {/* ── Action Bar ────────────────────────────────── */}
          <div className={styles.actionBar}>
            <Link href="/dashboard" className={styles.backBtn} style={{ textDecoration: 'none' }}>
              <span className="material-symbols-outlined">arrow_back</span>
              BACK TO DASHBOARD
            </Link>
            <div className={styles.actionBarRight}>
              <button className={styles.discardBtn} onClick={() => router.push('/dashboard')}>DISCARD CHANGES</button>
              <button className={styles.saveBtn} onClick={() => router.push('/dashboard/templates')}>
                Save &amp; Continue
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>

        </div>{/* /canvas */}

        {/* ── Footer ─────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span className={styles.footerBrandName}>PortfolioAI</span>
              <span className={styles.footerCopy}>© {new Date().getFullYear()} PortfolioAI. All rights reserved.</span>
            </div>
            <div className={styles.footerLinks}>
              <a href="#" className={styles.footerLink}>Privacy Policy</a>
              <a href="#" className={styles.footerLink}>Terms of Service</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>
          </div>
        </footer>
      </main>

      {/* ── Sticky Progress Dots ───────────────────────────── */}
      <div className={styles.progressDots}>
        <div className={`${styles.dot} ${styles.dotSmall} ${styles.dotActive}`} />
        <div className={`${styles.dot} ${styles.dotActive}`} style={{ width: '32px' }} />
        <div className={`${styles.dot} ${styles.dotSmall}`} />
        <div className={`${styles.dot} ${styles.dotSmall}`} />
      </div>
    </div>
  );
}
