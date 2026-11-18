import { IconAlert, IconCheckCircle } from './Icons';

// Text labels (not colour alone) so status is clear to everyone.
export function TypeBadge({ type }) {
  const lost = type === 'lost';
  return (
    <span className={`badge badge-${type}`}>
      {lost ? <IconAlert size={14} /> : <IconCheckCircle size={14} />}
      {lost ? 'Lost' : 'Found'}
    </span>
  );
}
export function StatusBadge({ status }) {
  const text = { open: 'Open', returned: 'Returned', pending: 'Pending review', approved: 'Approved for collection', rejected: 'Rejected' }[status] || status;
  return <span className={`badge badge-${status}`}>{text}</span>;
}
