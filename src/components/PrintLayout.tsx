// src/components/PrintLayout.tsx (alternative with inline styles)
import { ComponentType } from 'react';

interface PrintLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ 
  title, 
  subtitle, 
  children 
}) => {
  const styles = {
    container: { display: 'none' },
    header: { textAlign: 'center' as const, marginBottom: '20pt' },
    title: { fontSize: '24pt', margin: '0 0 5pt 0' },
    subtitle: { fontSize: '10pt', color: '#666', margin: '0 0 10pt 0' },
    divider: { border: 'none', borderTop: '1px solid #ccc', margin: '10pt 0 20pt 0' }
  };

  return (
    <div className="print-container" style={styles.container}>
      <div className="print-header" style={styles.header}>
        <h1 className="print-title" style={styles.title}>{title}</h1>
        {subtitle && <p className="print-subtitle" style={styles.subtitle}>{subtitle}</p>}
        <hr className="print-divider" style={styles.divider} />
      </div>
      <div className="print-content">
        {children}
      </div>
    </div>
  );
};
