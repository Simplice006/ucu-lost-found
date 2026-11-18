import { Link } from 'react-router-dom';
import { useDocumentTitle, useFetch } from '../hooks';
import ReportCard from '../components/ReportCard';
import { EmptyState, ErrorState, Flash, Loading } from '../components/Feedback';
import PageHeader from '../components/PageHeader';
import { IconList } from '../components/Icons';

export default function MyReports() {
  useDocumentTitle('My reports');
  const { data, loading, error, reload } = useFetch('/api/reports/mine');
  const reports = data?.reports || [];
  return (
    <>
      <PageHeader icon={IconList} title="My reports" subtitle="Items you reported as lost or found.">
        <p className="actions">
          <Link to="/reports/new?type=lost" className="btn btn-accent">I lost something</Link>
          <Link to="/reports/new?type=found" className="btn btn-outline">I found something</Link>
        </p>
      </PageHeader>
      <section className="overlap">
      <Flash />
      {loading && <Loading label="Loading your reports…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (reports.length === 0 ? (
        <EmptyState title="You have not reported anything yet"><p>Use the buttons above to report a lost or found item.</p></EmptyState>
      ) : (
        <ul className="item-list">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r}>
              {r.status === 'open' && <Link to={`/reports/${r.id}/edit`} className="btn btn-soft">Edit</Link>}
            </ReportCard>
          ))}
        </ul>
      ))}
      </section>
    </>
  );
}
