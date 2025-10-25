import React from 'react';
import { Award, Download, Calendar } from 'lucide-react';
import styles from './Certificates.module.css';

const Certificates = ({ certificates, events }) => {
  const getCertificateEvent = (eventId) => {
    return events.find(e => e.id === eventId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Certificates</h2>
        <p className={styles.subtitle}>View and download your earned certificates</p>
      </div>

      {certificates.length > 0 ? (
        <div className={styles.certificatesGrid}>
          {certificates.map(cert => {
            const event = getCertificateEvent(cert.eventId);
            return (
              <div key={cert.id} className={styles.certificateCard}>
                <div className={styles.certificateHeader}>
                  <Award size={48} className={styles.certificateIcon} />
                </div>
                <div className={styles.certificateBody}>
                  <h3 className={styles.certificateName}>{cert.eventName}</h3>
                  <p className={styles.certificateAchievement}>{cert.achievement}</p>
                  <div className={styles.certificateDetails}>
                    <div className={styles.detailItem}>
                      <Calendar size={16} />
                      <span>Issued: {cert.issuedDate}</span>
                    </div>
                    {event && (
                      <div className={styles.detailItem}>
                        <span className={styles.categoryBadge}>{event.category}</span>
                      </div>
                    )}
                  </div>
                  <button className={styles.downloadButton}>
                    <Download size={16} />
                    <span>Download Certificate</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Award size={64} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No Certificates Yet</p>
          <p className={styles.emptyText}>Complete events to earn certificates</p>
        </div>
      )}
    </div>
  );
};

export default Certificates;