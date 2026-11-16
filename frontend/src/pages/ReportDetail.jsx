import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import { formatDate } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import FormField from '../components/FormField';
import { StatusBadge, TypeBadge } from '../components/Badges';
import { Alert, ErrorState, Flash, Loading } from '../components/Feedback';

function ClaimForm({ reportId, onDone }) {
  const [evidence, setEvidence] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setFormError('');
    if (evidence.trim().length < 10) {
      setError('Explain why this is yours in at least 10 characters, for example an inscription or what is inside.');
      document.getElementById('evidence')?.focus();
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api(`/api/reports/${reportId}/claims`, { method: 'POST', body: { evidence: evidence.trim() } });
      onDone();
    } catch (err) {
      setError(err.fields?.evidence || '');
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="card">
      <h2>Claim this item</h2>
      {formError && <Alert>{formError}</Alert>}
      <FormField id="evidence" label="Why does it belong to you?" as="textarea" rows={4} required value={evidence}
        onChange={(e) => setEvidence(e.target.value)} error={error}
        hint="Describe something only the owner would know. Only you and the administrator can read this." />
      <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Sending…' : 'Send claim'}</button>
    </form>
  );
}

export default function ReportDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(`/api/reports/${id}`);
  const r = data?.report;
  useDocumentTitle(r ? r.title : 'Item');

  if (loading) return <Loading label="Loading item…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const isOwner = user && user.id === r.user_id;
  const isAdmin = user?.role === 'admin';
  const claim = r.my_claim;

  let claimArea;
  if (r.status === 'returned') claimArea = <Alert kind="info">This item has been returned. New claims are closed.</Alert>;
  else if (r.type !== 'found') claimArea = <Alert kind="info">This is a lost-item report. If you found this item, <Link to="/reports/new?type=found">report it as found</Link>.</Alert>;
  else if (!user) claimArea = <Alert kind="info"><Link to="/login" state={{ from: `/reports/${r.id}` }}>Log in</Link> to claim this item.</Alert>;
  else if (isOwner) claimArea = <Alert kind="info">You reported this item as found, so you cannot claim it.</Alert>;
  else if (isAdmin) claimArea = null;
  else if (claim) claimArea = (
    <div className="card">
      <h2>Your claim</h2>
      <p><StatusBadge status={claim.status} /></p>
      {claim.admin_reason && <p><strong>Administrator response:</strong> {claim.admin_reason}</p>}
      {claim.status === 'approved' && <p>Your claim was accepted. Collect the item from the administrator.</p>}
      <Link to="/my-claims">See all my claims</Link>
    </div>
  );
  else claimArea = <ClaimForm reportId={r.id} onDone={reload} />;

  return (
    <article>
      <Flash />
      <p><Link to="/">← Back to items</Link></p>
      <div className="badges"><TypeBadge type={r.type} /><StatusBadge status={r.status} /></div>
      <h1>{r.title}</h1>
      {r.photo_url && <img src={r.photo_url} alt={`Photo of ${r.title}`} className="detail-photo" />}
      <dl className="facts">
        <div><dt>Category</dt><dd>{r.category}</dd></div>
        <div><dt>Campus location</dt><dd>{r.location}</dd></div>
        <div><dt>{r.type === 'found' ? 'Date found' : 'Date lost'}</dt><dd>{formatDate(r.event_date)}</dd></div>
      </dl>
      <h2>Description</h2>
      <p className="prose">{r.description}</p>

      {r.private_details && (isOwner || isAdmin) && (
        <div className="private-box">
          <h2>Private identifying details</h2>
          <p className="hint">Only you and the administrator can see this.</p>
          <p className="prose">{r.private_details}</p>
        </div>
      )}

      {isOwner && r.status === 'open' && (
        <p><Link to={`/reports/${r.id}/edit`} className="btn btn-secondary">Edit report</Link></p>
      )}
      {claimArea}
    </article>
  );
}
