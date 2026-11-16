import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { IconGrid } from '../components/Icons';
import { useDocumentTitle, useFetch } from '../hooks';
import PageHeader from '../components/PageHeader';
import ReportCard from '../components/ReportCard';
import SearchForm, { EMPTY_FILTERS } from '../components/SearchForm';
import { EmptyState, ErrorState, Flash, Loading } from '../components/Feedback';

export default function Browse() {
  useDocumentTitle('Browse items');
  const [params, setParams] = useSearchParams();
  const applied = { ...EMPTY_FILTERS, ...Object.fromEntries(params) };
  const [form, setForm] = useState(applied);
  useEffect(() => { setForm({ ...EMPTY_FILTERS, ...Object.fromEntries(params) }); }, [params]);

  const query = new URLSearchParams(Object.entries(applied).filter(([, v]) => v)).toString();
  const { data, loading, error, reload } = useFetch(`/api/reports${query ? `?${query}` : ''}`);
  const reports = data?.reports || [];
  const filtered = Object.values(applied).some(Boolean);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    setParams(Object.fromEntries(Object.entries(form).filter(([, v]) => v.trim())));
  }

  return (
    <>
      <PageHeader icon={IconGrid} title="Browse Items" subtitle="Every lost and found report on campus, newest first." />
      <div className="overlap">
        <SearchForm form={form} onChange={update} onSubmit={submit} onReset={() => setParams({})} showReset={filtered} />
        <Flash />
        {loading && <Loading label="Loading items…" />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && (
          <>
            <p className="result-count" role="status">
              {reports.length === 0 ? 'No items found.' : `${reports.length} item${reports.length === 1 ? '' : 's'} found.`}
            </p>
            {reports.length === 0 ? (
              <EmptyState title={filtered ? 'Nothing matches your search' : 'No items reported yet'}>
                <p>{filtered ? 'Try a different keyword, or reset some filters.' : 'Be the first to report a lost or found item.'}</p>
              </EmptyState>
            ) : (
              <ul className="item-list">
                {reports.map((r) => <ReportCard key={r.id} report={r} />)}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
