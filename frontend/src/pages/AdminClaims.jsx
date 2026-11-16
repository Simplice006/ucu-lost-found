import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { formatDate } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import FormField from '../components/FormField';
import { StatusBadge } from '../components/Badges';
import { Alert, EmptyState, ErrorState, Loading } from '../components/Feedback';

function ClaimReview({ claim, onChanged }) {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [message, setMessage] = useState({ kind: '', text: '' });
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function run(path, body, success) {
    setBusy(true);
    setMessage({ kind: '', text: '' });
    try {
      await api(path, { method: 'POST', body });
      onChanged(success);
    } catch (err) {
      setMessage({ kind: 'error', text: err.message });
      setBusy(false);
    }
  }
  function decide(decision) {
    if (reason.trim().length < 3) {
      setReasonError('Record a reason of at least 3 characters so the student understands the decision.');
      document.getElementById(`reason-${claim.id}`)?.focus();
      return;
    }
    setReasonError('');
    run(`/api/admin/claims/${claim.id}/${decision}`, { reason: reason.trim() },
      decision === 'approve' ? 'Claim approved. Confirm the return once the item is collected.' : 'Claim rejected.');
  }

  return (
    <li className="item"><div className="item-body">
      <div className="badges"><StatusBadge status={claim.returned_at ? 'returned' : claim.status} /></div>
      <h2 className="item-title"><Link to={`/reports/${claim.report_id}`}>{claim.report_title}</Link></h2>
      <p className="meta">Claimed by {claim.claimant_name} on {formatDate(claim.created_at)}</p>
      <p><strong>Claimant evidence:</strong> {claim.evidence}</p>
      {claim.private_details && <p><strong>Private details on file:</strong> {claim.private_details}</p>}
      {claim.admin_reason && <p><strong>Recorded reason:</strong> {claim.admin_reason}</p>}
      {message.text && <Alert kind={message.kind}>{message.text}</Alert>}

      {claim.status === 'pending' && (
        <>
          <FormField id={`reason-${claim.id}`} label="Reason for your decision" as="textarea" rows={2} required value={reason}
            onChange={(e) => setReason(e.target.value)} error={reasonError} />
          <div className="actions">
            <button type="button" className="btn btn-primary" disabled={busy} onClick={() => decide('approve')}>Approve claim</button>
            <button type="button" className="btn btn-danger" disabled={busy} onClick={() => decide('reject')}>Reject claim</button>
          </div>
        </>
      )}
      {claim.status === 'approved' && !claim.returned_at && (
        confirming ? (
          <div className="actions">
            <p>Has the claimant collected the item?</p>
            <button type="button" className="btn btn-primary" disabled={busy}
              onClick={() => run(`/api/admin/claims/${claim.id}/confirm-return`, {}, 'Return confirmed. The item is now marked as returned.')}>
              {busy ? 'Saving…' : 'Yes, mark as returned'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>Not yet</button>
          </div>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => setConfirming(true)}>Confirm item collected</button>
        )
      )}
    </div></li>
  );
}

export default function AdminClaims() {
  useDocumentTitle('Review claims');
  const [filter, setFilter] = useState('pending');
  const [flash, setFlash] = useState('');
  const { data, loading, error, reload } = useFetch(`/api/admin/claims?status=${filter}`);
  const claims = data?.claims || [];
  const tabs = [['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected'], ['all', 'All']];

  return (
    <section>
      <h1>Review claims</h1>
      <div role="group" aria-label="Filter claims by status" className="tabs">
        {tabs.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value}
            className={`btn ${filter === value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setFilter(value); setFlash(''); }}>{label}</button>
        ))}
      </div>
      {flash && <Alert kind="success">{flash}</Alert>}
      {loading && <Loading label="Loading claims…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (claims.length === 0 ? (
        <EmptyState title="No claims here"><p>There are no {filter === 'all' ? '' : filter} claims to show.</p></EmptyState>
      ) : (
        <ul className="item-list single">
          {claims.map((c) => <ClaimReview key={c.id} claim={c} onChanged={(msg) => { setFlash(msg); reload(); }} />)}
        </ul>
      ))}
    </section>
  );
}
