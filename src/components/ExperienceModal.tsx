'use client';

import { useState, useEffect } from 'react';
import styles from './InputModal.module.css';

interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies?: string[];
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExperienceEntry) => void;
  initialData?: ExperienceEntry;
}

export default function ExperienceModal({ isOpen, onClose, onSave, initialData }: ExperienceModalProps) {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [addingTech, setAddingTech] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCompany(initialData?.company || '');
      setRole(initialData?.role || '');
      setDescription(initialData?.description || '');
      setTechnologies(initialData?.technologies || []);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const removeTech = (t: string) => setTechnologies(technologies.filter(x => x !== t));
  const commitTech = () => {
    const trimmed = newTech.trim();
    if (trimmed && !technologies.includes(trimmed)) setTechnologies([...technologies, trimmed]);
    setNewTech('');
    setAddingTech(false);
  };

  const handleSave = () => {
    if (!company || !role || !description) {
      alert('Company, Role, and Description are required.');
      return;
    }
    onSave({ company, role, description, technologies });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{initialData ? 'Edit Experience' : 'Add Experience'}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.label}>Company Name *</label>
            <input
              className={styles.input}
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. TechCorp Solutions"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Job Title *</label>
            <input
              className={styles.input}
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description *</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your responsibilities and achievements...in 50 words"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Technologies Used</label>
            <div className={styles.skillsWrap}>
              {technologies.map(t => (
                <span key={t} className={styles.skillChip}>
                  {t}
                  <button className={styles.skillClose} onClick={() => removeTech(t)}>
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </span>
              ))}
              {addingTech ? (
                <input
                  className={styles.input}
                  style={{ width: '120px', padding: '4px 10px', fontSize: '12px' }}
                  autoFocus
                  value={newTech}
                  onChange={e => setNewTech(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitTech();
                    if (e.key === 'Escape') { setAddingTech(false); setNewTech(''); }
                  }}
                  onBlur={commitTech}
                  placeholder="Type & Enter"
                />
              ) : (
                <button className={styles.addSkillBtn} onClick={() => setAddingTech(true)}>
                  + Add Tech
                </button>
              )}
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Experience</button>
        </div>
      </div>
    </div>
  );
}
