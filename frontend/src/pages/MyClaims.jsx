import { Link } from 'react-router-dom';
import { formatDate } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import { StatusBadge } from '../components/Badges';
import { EmptyState, ErrorState, Loading } from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import { IconShield } from '../components/Icons';

export default function MyClaims() {
  useDocumentTitle('My claims');
  const { data, loading, error, reload } = useFetch('/api/claims/mine');
  const claims = data?.claims || [];
  return (
    <>
      <PageHeader icon={IconShield} title="My claims" subtitle="Follow the answer of the administrator on each claim you sent." />
      <section className="overlap">
      {loading && <Loading label="Loading your claims…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (claims.length === 0 ? (
        <EmptyState title="You have not claimed any items"><p><Link to="/">Browse found items</Link> and claim the one that is yours.</p></EmptyState>
      ) : (
        <ul className="stack">
          {claims.map((c) => (
            <li key={c.id} className="panel">
              <div className="badges"><StatusBadge status={c.returned_at ? 'returned' : c.status} /></div>
              <h2 className="panel-title"><Link to={`/reports/${c.report_id}`}>{c.report_title}</Link></h2>
              <p className="meta">Claimed on {formatDate(c.created_at)}</p>
              <p><strong>Your evidence:</strong> {c.evidence}</p>
              {c.admin_reason && <p><strong>Administrator response:</strong> {c.admin_reason}</p>}
              {c.status === 'approved' && !c.returned_at && <p>Approved. Collect your item from the administrator.</p>}
              {c.returned_at && <p>Collection confirmed on {formatDate(c.returned_at)}.</p>}
            </li>
          ))}
        </ul>
      ))}
      </section>
    </>
  );
}
