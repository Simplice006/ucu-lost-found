import { Link } from 'react-router-dom';
import { formatDate } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import { StatusBadge } from '../components/Badges';
import { EmptyState, ErrorState, Loading } from '../components/Feedback';

export default function MyClaims() {
  useDocumentTitle('My claims');
  const { data, loading, error, reload } = useFetch('/api/claims/mine');
  const claims = data?.claims || [];
  return (
    <section>
      <h1>My claims</h1>
      {loading && <Loading label="Loading your claims…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (claims.length === 0 ? (
        <EmptyState title="You have not claimed any items"><p><Link to="/">Browse found items</Link> and claim the one that is yours.</p></EmptyState>
      ) : (
        <ul className="item-list single">
          {claims.map((c) => (
            <li key={c.id} className="item"><div className="item-body">
              <div className="badges"><StatusBadge status={c.returned_at ? 'returned' : c.status} /></div>
              <h2 className="item-title"><Link to={`/reports/${c.report_id}`}>{c.report_title}</Link></h2>
              <p className="meta">Claimed on {formatDate(c.created_at)}</p>
              <p><strong>Your evidence:</strong> {c.evidence}</p>
              {c.admin_reason && <p><strong>Administrator response:</strong> {c.admin_reason}</p>}
              {c.status === 'approved' && !c.returned_at && <p>Approved. Collect your item from the administrator.</p>}
              {c.returned_at && <p>Collection confirmed on {formatDate(c.returned_at)}.</p>}
            </div></li>
          ))}
        </ul>
      ))}
    </section>
  );
}
