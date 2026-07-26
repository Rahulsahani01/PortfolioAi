'use client';

import { useState, useEffect } from 'react';
import styles from './InputModal.module.css';

interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  duration?: string;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EducationEntry) => void;
  initialData?: EducationEntry;
}

export default function EducationModal({ isOpen, onClose, onSave, initialData }: EducationModalProps) {
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstitution(initialData?.institution || '');
      setDegree(initialData?.degree || '');
      setFieldOfStudy(initialData?.fieldOfStudy || '');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!institution || !degree) {
      alert('Institution and Degree are required.');
      return;
    }
    onSave({ institution, degree, fieldOfStudy });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{initialData ? 'Edit Education' : 'Add Education'}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.field}>
            <label className={styles.label}>Institution Name *</label>
            <input
              className={styles.input}
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              placeholder="e.g. State University of Technology"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Degree *</label>
            <input
              className={styles.input}
              type="text"
              value={degree}
              onChange={e => setDegree(e.target.value)}
              placeholder="e.g. B.Tech"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Field of Study</label>
            <input
              className={styles.input}
              type="text"
              value={fieldOfStudy}
              onChange={e => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave}>Save Education</button>
        </div>
      </div>
    </div>
  );
}
