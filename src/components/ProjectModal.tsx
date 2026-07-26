'use client';

import { useState, useEffect } from 'react';
import styles from './InputModal.module.css';

interface ProjectEntry {
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProjectEntry) => void;
  initialData?: ProjectEntry;
}

export default function ProjectModal({ isOpen, onClose, onSave, initialData }: ProjectModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [addingTech, setAddingTech] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setDescription(initialData?.description || '');
      setTechStack(initialData?.techStack || []);
      setGithubUrl(initialData?.githubUrl || '');
      setLiveUrl(initialData?.liveUrl || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const removeTech = (t: string) => setTechStack(techStack.filter(x => x !== t));
  const commitTech = () => {
    const trimmed = newTech.trim();
    if (trimmed && !techStack.includes(trimmed)) setTechStack([...techStack, trimmed]);
    setNewTech('');
    setAddingTech(false);
  };

  const handleSave = () => {
    if (!name || !description) {
      alert('Project Name and Description are required.');
      return;
    }
    onSave({ name, description, techStack, githubUrl, liveUrl });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{initialData ? 'Edit Project' : 'Add Project'}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.label}>Project Name *</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Portfolio Builder"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Short Description *</label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Briefly describe what the project does... in 50 words"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tech Stack *</label>
            <div className={styles.skillsWrap}>
              {techStack.map(t => (
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
          <div className={styles.field}>
            <label className={styles.label}>GitHub URL</label>
            <input
              className={styles.input}
              type="text"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Live Demo URL</label>
            <input
              className={styles.input}
              type="text"
              value={liveUrl}
              onChange={e => setLiveUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Project</button>
        </div>
      </div>
    </div>
  );
}
