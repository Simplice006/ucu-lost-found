import { Link } from 'react-router-dom';
import { useDocumentTitle, useFetch } from '../hooks';
import ReportCard from '../components/ReportCard';
import { EmptyState, ErrorState, Flash, Loading } from '../components/Feedback';

export default function MyReports() {
  useDocumentTitle('My reports');
  const { data, loading, error, reload } = useFetch('/api/reports/mine');
  const reports = data?.reports || [];
  return (
    <section>
      <h1>My reports</h1>
      <Flash />
      <p className="actions">
        <Link to="/reports/new?type=lost" className="btn btn-primary">I lost something</Link>
        <Link to="/reports/new?type=found" className="btn btn-secondary">I found something</Link>
      </p>
      {loading && <Loading label="Loading your reports…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (reports.length === 0 ? (
        <EmptyState title="You have not reported anything yet"><p>Use the buttons above to report a lost or found item.</p></EmptyState>
      ) : (
        <ul className="item-list">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r}>
              {r.status === 'open' && <Link to={`/reports/${r.id}/edit`} className="btn btn-secondary">Edit</Link>}
            </ReportCard>
          ))}
        </ul>
      ))}
    </section>
  );
}
