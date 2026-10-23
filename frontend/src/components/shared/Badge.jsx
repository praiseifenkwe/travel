import React from 'react';

export const Badge = ({ status, label }) => {
  const getBadgeClass = () => {
    switch (status?.toLowerCase()) {
      case 'passed':
      case 'verified':
      case 'active':
        return 'badge-passed';
      case 'processing':
      case 'intake':
        return 'badge-processing';
      case 'flagged':
      case 'document_audit':
        return 'badge-flagged';
      case 'failed':
      case 'critical':
        return 'badge-danger';
      default:
        return 'badge-pending';
    }
  };

  return (
    <span className={`badge ${getBadgeClass()}`}>
      <span className="pulse-dot" style={{ width: 6, height: 6 }} />
      {label || status || 'Pending'}
    </span>
  );
};
