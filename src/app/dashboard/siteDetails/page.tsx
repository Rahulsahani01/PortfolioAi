'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { DUMMY_RESUME } from '../../../data/portfolioData';
import ActiveSiteBadge from '../../../components/ActiveSiteBadge';
import Sidebar from '../../../components/Sidebar';
import EducationModal from '../../../components/EducationModal';
import ExperienceModal from '../../../components/ExperienceModal';
import ProjectModal from '../../../components/ProjectModal';
import TopBar from '../../../components/TopBar';
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
  const [summary, setSummary] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [contact, setContact] = useState({ email: '', phone: '', location: '' });
  const [social, setSocial] = useState({ github: '', linkedin: '', twitter: '', portfolioUrl: '', leetcode: '', hackerrank: '' });
  const [resumeUrl, setResumeUrl] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // Modal states
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [editingExpIndex, setEditingExpIndex] = useState<number | null>(null);

  const [isProjModalOpen, setIsProjModalOpen] = useState(false);
  const [editingProjIndex, setEditingProjIndex] = useState<number | null>(null);

  useEffect(() => {
    const data = activeSite?.siteDetail?.parsedData;
    if (data) {
      let fullName = data.name || data.personalInfo?.name;
      if (!fullName && data.personalInfo?.firstName) {
        fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName || ''}`.trim();
      }
      setName(fullName || DUMMY_RESUME.name);
      setTitle(data.title || data.personalInfo?.title || DUMMY_RESUME.title);
      setSummary(data.summary || DUMMY_RESUME.summary);
      setProfilePhoto(data.profilePhoto || DUMMY_RESUME.profilePhoto || '');
      setContact({
        email: data.contact?.email || data.personalInfo?.email || DUMMY_RESUME.contact?.email || '',
        phone: data.contact?.phone || data.personalInfo?.phone || DUMMY_RESUME.contact?.phone || '',
        location: data.contact?.location || DUMMY_RESUME.contact?.location || ''
      });
      setSocial({
        github: data.social?.github || data.personalInfo?.github || DUMMY_RESUME.social?.github || '',
        linkedin: data.social?.linkedin || data.personalInfo?.linkedin || DUMMY_RESUME.social?.linkedin || '',
        twitter: data.social?.twitter || DUMMY_RESUME.social?.twitter || '',
        portfolioUrl: data.social?.portfolioUrl || DUMMY_RESUME.social?.portfolioUrl || '',
        leetcode: data.social?.leetcode || DUMMY_RESUME.social?.leetcode || '',
        hackerrank: data.social?.hackerrank || DUMMY_RESUME.social?.hackerrank || ''
      });
      setResumeUrl(data.resumeUrl || DUMMY_RESUME.resumeUrl || '');
      setSkills(data.skills?.length ? data.skills : DUMMY_RESUME.skills.slice(0, 3));
      setExperience(data.experience?.length ? data.experience : DUMMY_RESUME.experience);
      setEducation(data.education?.length ? data.education : DUMMY_RESUME.education);
      setProjects(data.projects?.length ? data.projects : DUMMY_RESUME.projects);
    } else {
      // Fallback to dummy
      setName(DUMMY_RESUME.name);
      setTitle(DUMMY_RESUME.title);
      setSummary(DUMMY_RESUME.summary);
      setProfilePhoto(DUMMY_RESUME.profilePhoto || '');
      setContact(DUMMY_RESUME.contact || { email: '', phone: '', location: '' });
      setSocial(DUMMY_RESUME.social || { github: '', linkedin: '', twitter: '', portfolioUrl: '', leetcode: '', hackerrank: '' });
      setResumeUrl(DUMMY_RESUME.resumeUrl || '');
      setSkills(DUMMY_RESUME.skills.slice(0, 3));
      setExperience(DUMMY_RESUME.experience);
      setEducation(DUMMY_RESUME.education);
      setProjects(DUMMY_RESUME.projects);
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
  const handleSaveEducation = (data: any) => {
    if (editingEduIndex !== null) {
      setEducation(education.map((x, i) => i === editingEduIndex ? data : x));
    } else {
      setEducation([...education, data]);
    }
  };

  const removeEducation = (i: number) =>
    setEducation(education.filter((_, idx) => idx !== i));

  const handleEditEducation = (i: number) => {
    setEditingEduIndex(i);
    setIsEduModalOpen(true);
  };

  /* ── Experience ─────────────────────────────────────────── */
  const handleSaveExperience = (data: any) => {
    if (editingExpIndex !== null) {
      setExperience(experience.map((x, i) => i === editingExpIndex ? data : x));
    } else {
      setExperience([...experience, data]);
    }
  };

  const removeExperience = (i: number) =>
    setExperience(experience.filter((_, idx) => idx !== i));

  const handleEditExperience = (i: number) => {
    setEditingExpIndex(i);
    setIsExpModalOpen(true);
  };

  /* ── Projects ───────────────────────────────────────────── */
  const handleSaveProject = (data: any) => {
    if (editingProjIndex !== null) {
      setProjects(projects.map((x, i) => i === editingProjIndex ? data : x));
    } else {
      setProjects([...projects, data]);
    }
  };

  const removeProject = (i: number) =>
    setProjects(projects.filter((_, idx) => idx !== i));

  const handleEditProject = (i: number) => {
    setEditingProjIndex(i);
    setIsProjModalOpen(true);
  };

  const handleSaveDetails = async () => {
    setIsSaving(true);
    try {
      const customData = {
        name,
        title,
        summary,
        profilePhoto,
        contact,
        social,
        resumeUrl,
        skills,
        experience,
        education,
        projects
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
        <TopBar title="Site Details" showActiveSiteBadge={true} />

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
                      <div className={styles.field}>
                        <label className={styles.label}>Professional Summary</label>
                        <textarea
                          className={styles.input}
                          style={{ minHeight: '80px', resize: 'vertical' }}
                          value={summary}
                          onChange={e => setSummary(e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Profile Photo URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          placeholder="https://..."
                          value={profilePhoto}
                          onChange={e => setProfilePhoto(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={`material-symbols-outlined ${styles.cardIcon}`}>contact_mail</span>
                      <h3 className={styles.cardTitle}>Contact Information</h3>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                          className={styles.input}
                          type="email"
                          value={contact.email}
                          onChange={e => setContact({ ...contact, email: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Phone Number</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={contact.phone}
                          onChange={e => setContact({ ...contact, phone: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Location</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={contact.location}
                          onChange={e => setContact({ ...contact, location: e.target.value })}
                        />
                      </div>
                    </div>
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

                  {/* Resume */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={`material-symbols-outlined ${styles.cardIcon}`}>description</span>
                      <h3 className={styles.cardTitle}>Resume</h3>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.field}>
                        <label className={styles.label}>Resume Link (PDF URL)</label>
                        <input
                          className={styles.input}
                          type="text"
                          placeholder="https://..."
                          value={resumeUrl}
                          onChange={e => setResumeUrl(e.target.value)}
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
                            <p className={styles.eduDegree}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</p>
                          </div>
                            <button
                              className={styles.expActionBtn}
                              onClick={() => handleEditEducation(i)}
                              title="Edit education"
                              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                            </button>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => removeEducation(i)}
                              title="Remove education"
                              style={{ marginLeft: '8px' }}
                            >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className={styles.addDashedBtn} onClick={() => {
                      setEditingEduIndex(null);
                      setIsEduModalOpen(true);
                    }}>+ ADD EDUCATION</button>
                  </div>

                </div>

                {/* Right Column */}
                <div className={styles.rightCol}>
                  {/* Experience */}
                  <div className={`${styles.card} ${styles.expCard}`}>
                    <div className={styles.cardHeaderRight}>
                      <div className={styles.cardHeader} style={{ margin: 0 }}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>work</span>
                        <h3 className={styles.cardTitle}>Experience</h3>
                      </div>
                      <button className={styles.addExpBtn} onClick={() => {
                        setEditingExpIndex(null);
                        setIsExpModalOpen(true);
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
                          <button className={styles.expActionBtn} onClick={() => handleEditExperience(i)}>
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
                            <p className={styles.expDesc}>{exp.description}</p>
                            {exp.technologies && exp.technologies.length > 0 && <p className={styles.expMeta} style={{ marginTop: '8px' }}>Tech: {Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div className={`${styles.card} ${styles.expCard}`} style={{ marginTop: '24px' }}>
                    <div className={styles.cardHeaderRight}>
                      <div className={styles.cardHeader} style={{ margin: 0 }}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>code</span>
                        <h3 className={styles.cardTitle}>Projects</h3>
                      </div>
                      <button className={styles.addExpBtn} onClick={() => {
                        setEditingProjIndex(null);
                        setIsProjModalOpen(true);
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_circle</span>
                        ADD PROJECT
                      </button>
                    </div>

                    {projects.map((proj, i) => (
                      <div
                        key={i}
                        className={`${styles.expEntry} ${i > 0 ? styles.expEntrySecondary : ''}`}
                      >
                        <div className={styles.expEntryActions}>
                          <button className={styles.expActionBtn} onClick={() => handleEditProject(i)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                          </button>
                          <button className={`${styles.expActionBtn} ${styles.expActionBtnDanger}`} onClick={() => removeProject(i)}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                          </button>
                        </div>

                        <div className={styles.expContent}>
                          <div className={styles.expLogo}>
                            <span className="material-symbols-outlined">rocket_launch</span>
                          </div>
                          <div className={styles.expDetails}>
                            <div className={styles.expTop}>
                              <h4 className={styles.expTitle}>{proj.name}</h4>
                            </div>
                            <p className={styles.expDesc}>{proj.description}</p>
                            <p className={styles.expMeta} style={{ marginTop: '8px' }}>Stack: {Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack}</p>
                            {(proj.githubUrl || proj.liveUrl) && (
                              <p className={styles.expMeta} style={{ marginTop: '4px' }}>
                                {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" style={{color: 'var(--primary-navy)'}}>GitHub</a>}
                                {proj.githubUrl && proj.liveUrl && ' | '}
                                {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{color: 'var(--primary-navy)'}}>Live Demo</a>}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <span className={`material-symbols-outlined ${styles.cardIcon}`}>share</span>
                      <h3 className={styles.cardTitle}>Social Media Links</h3>
                    </div>
                    <div className={styles.fieldGroup}>
                      <div className={styles.field}>
                        <label className={styles.label}>GitHub URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.github || ''}
                          onChange={e => setSocial({ ...social, github: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>LinkedIn URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.linkedin || ''}
                          onChange={e => setSocial({ ...social, linkedin: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Twitter / X URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.twitter || ''}
                          onChange={e => setSocial({ ...social, twitter: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Portfolio URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.portfolioUrl || ''}
                          onChange={e => setSocial({ ...social, portfolioUrl: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>LeetCode URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.leetcode || ''}
                          onChange={e => setSocial({ ...social, leetcode: e.target.value })}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>HackerRank URL</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={social.hackerrank || ''}
                          onChange={e => setSocial({ ...social, hackerrank: e.target.value })}
                        />
                      </div>
                    </div>
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

      {/* Modals */}
      <EducationModal
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
        onSave={handleSaveEducation}
        initialData={editingEduIndex !== null ? education[editingEduIndex] : undefined}
      />
      
      <ExperienceModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        onSave={handleSaveExperience}
        initialData={editingExpIndex !== null ? experience[editingExpIndex] : undefined}
      />
      
      <ProjectModal
        isOpen={isProjModalOpen}
        onClose={() => setIsProjModalOpen(false)}
        onSave={handleSaveProject}
        initialData={editingProjIndex !== null ? projects[editingProjIndex] : undefined}
      />
    </div>
  );
}