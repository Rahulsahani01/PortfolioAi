'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DUMMY_RESUME } from '../../../data/portfolioData';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
import { useSites } from '../../../context/SitesContext';
import { useAuth } from '../../../context/AuthContext';
import { apiFetch } from '../../../lib/api';
import styles from './page.module.css';

type Skill = string;
type ExperienceEntry = typeof DUMMY_RESUME.experience[0];
type EducationEntry = typeof DUMMY_RESUME.education[0];

export default function ResumePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { activeSite, activeSiteId, refreshSites } = useSites();
  const { token } = useAuth();
  const slug = searchParams.get('slug') || searchParams.get('siteId');

  const [activeSiteName, setActiveSiteName] = useState<string | null>(null);
  const [activeSiteStatus, setActiveSiteStatus] = useState<'Draft' | 'LIVE' | 'UNDER_REVIEW' | 'REJECTED' | 'PUBLISHING' | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const fetchedSiteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (activeSiteId && fetchedSiteIdRef.current !== activeSiteId) {
      fetchedSiteIdRef.current = activeSiteId;
      refreshSites(activeSiteId);
    }
  }, [activeSiteId, refreshSites]);

  useEffect(() => {
    if (activeSite) {
      setActiveSiteName(activeSite.slug); // We use slug as name
      setActiveSiteStatus(activeSite.status);
    } else if (slug) {
      setActiveSiteName(slug);
      setActiveSiteStatus('Draft');
    }
  }, [activeSite, slug]);

  // Editor states
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);

  useEffect(() => {
    const data = activeSite?.siteDetail?.parsedData;
    if (data) {
      let fullName = data.personalInfo?.name;
      if (!fullName && data.personalInfo?.firstName) {
        fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName || ''}`.trim();
      }
      setName(fullName || DUMMY_RESUME.name);
      setTitle(data.personalInfo?.title || DUMMY_RESUME.title);
      setSkills(data.skills?.length ? data.skills : DUMMY_RESUME.skills.slice(0, 3));
      setExperience(data.experience?.length ? data.experience : DUMMY_RESUME.experience);
      setEducation(data.education?.length ? data.education : DUMMY_RESUME.education);
    } else {
      // Fallback to empty or dummy if no data
      setName(DUMMY_RESUME.name);
      setTitle(DUMMY_RESUME.title);
      setSkills(DUMMY_RESUME.skills.slice(0, 3));
      setExperience(DUMMY_RESUME.experience);
      setEducation(DUMMY_RESUME.education);
    }
  }, [activeSite]);

  /* ── Drop Zone handlers (hidden but kept if needed later) ───────────────── */

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

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const customData = {
        personalInfo: { name, title },
        skills,
        experience,
        education
      };

      const res = await apiFetch('/site-details/save', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify({
          customData,
          siteDetailId: activeSite?.siteDetailId || undefined
        }),
      });

      // No need to save to localStorage as it's linked to the DB record.

      alert('Details saved successfully!');
      if (activeSite?.id) {
        await refreshSites(activeSite.id);
      }
      if (slug) {
        router.push(`/dashboard/templates?slug=${slug}`);
      }
    } catch (err: any) {
      alert('Error saving details: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.shell}>
      {/* ── Sidebar ───────────────────────────────────────── */}
      <Sidebar styles={styles} activePath="/dashboard/siteDetails" />

      {/* ── Main ─────────────────────────────────────────── */}
      <main className={styles.mainArea}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeSiteName ? (
              <>
                <ActiveSiteBadge siteName={activeSiteName} status={activeSiteStatus} paymentStatus={activeSite?.paymentStatus} />
              </>
            ) : (
              <h2 className={styles.topBarTitle}>Site Details</h2>
            )}
          </div>
          <div className={styles.topBarActions}>
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

          {!activeSiteName ? (
            /* ── No Active Site View ────────────────────────────── */
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--on-surface-variant)' }}>language</span>
              <h3 style={{ color: 'var(--primary-navy)', marginTop: '16px' }}>No Active Site</h3>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '24px' }}>Please create or select a site from the Dashboard first.</p>
              <Link href="/dashboard" style={{ textDecoration: 'none', backgroundColor: 'var(--electric-indigo)', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}>
                Go to Dashboard
              </Link>
            </div>
          ) : (
            /* ── Editor View ────────────────────────────── */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, color: 'var(--primary-navy)', fontSize: '20px' }}>
                  Update Content for {activeSiteName}
                </h3>
              </div>

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
              
              <div className={styles.actionBar}>
                <div style={{flex: 1}} />
                <div className={styles.actionBarRight}>
                  <button 
                    className={styles.saveBtn} 
                    onClick={() => {
                      if (isSaving || activeSite?.paymentStatus === 'PENDING') return;
                      handleSaveDetails();
                    }} 
                    title={activeSite?.paymentStatus === 'PENDING' ? 'now site is under review you can update it after site is published' : undefined}
                    style={{
                      opacity: (isSaving || activeSite?.paymentStatus === 'PENDING') ? 0.5 : 1,
                      cursor: (isSaving || activeSite?.paymentStatus === 'PENDING') ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Details'}
                    <span className="material-symbols-outlined">check</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>{/* /canvas */}
      </main>
    </div>
  );
}
