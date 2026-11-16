import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { CATEGORIES, LOCATIONS, todayISO } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import FormField from '../components/FormField';
import ReportCard from '../components/ReportCard';
import { EmptyState, ErrorState, Flash, Loading } from '../components/Feedback';

const EMPTY = { q: '', type: '', category: '', location: '', date: '', status: '' };

export default function Home() {
  useDocumentTitle('Browse items');
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const applied = { ...EMPTY, ...Object.fromEntries(params) };
  const [form, setForm] = useState(applied);
  useEffect(() => { setForm({ ...EMPTY, ...Object.fromEntries(params) }); }, [params]);

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
      <section className="hero">
        <h1>Find what you lost. Return what you found.</h1>
        <p>Search campus listings, report an item, or claim one privately so it reaches its owner.</p>
        <p className="actions">
          {user ? (
            <>
              <Link to="/reports/new?type=lost" className="btn btn-primary">I lost something</Link>
              <Link to="/reports/new?type=found" className="btn btn-secondary">I found something</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">Create account</Link>
              <Link to="/login" className="btn btn-secondary">Log in</Link>
            </>
          )}
        </p>
      </section>

      <Flash />

      <form className="card filters" onSubmit={submit} role="search" aria-label="Search items">
        <FormField id="q" label="Keyword" as="input" type="search" value={form.q} onChange={update}
          hint="For example: blue keyring" />
        <div className="filter-grid">
          <FormField id="type" label="Lost or found" as="select" value={form.type} onChange={update}>
            <option value="">All reports</option>
            <option value="lost">Lost items</option>
            <option value="found">Found items</option>
          </FormField>
          <FormField id="status" label="Status" as="select" value={form.status} onChange={update}>
            <option value="">Open and returned</option>
            <option value="open">Open</option>
            <option value="returned">Returned</option>
          </FormField>
          <FormField id="category" label="Category" as="select" value={form.category} onChange={update}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </FormField>
          <FormField id="location" label="Campus location" as="select" value={form.location} onChange={update}>
            <option value="">All locations</option>
            {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </FormField>
          <FormField id="date" label="Date" type="date" max={todayISO()} value={form.date} onChange={update} />
        </div>
        <div className="actions">
          <button type="submit" className="btn btn-primary">Search</button>
          {filtered && (
            <button type="button" className="btn btn-secondary" onClick={() => setParams({})}>Clear filters</button>
          )}
        </div>
      </form>

      {loading && <Loading label="Loading items…" />}
      {error && <ErrorState message={error} onRetry={reload} />}
      {!loading && !error && (
        <>
          <p className="result-count" role="status">
            {reports.length === 0 ? 'No items found.' : `${reports.length} item${reports.length === 1 ? '' : 's'} found.`}
          </p>
          {reports.length === 0 ? (
            <EmptyState title={filtered ? 'Nothing matches your search' : 'No items reported yet'}>
              <p>{filtered ? 'Try a different keyword, or clear some filters.' : 'Be the first to report a lost or found item.'}</p>
            </EmptyState>
          ) : (
            <ul className="item-list">
              {reports.map((r) => <ReportCard key={r.id} report={r} />)}
            </ul>
          )}
        </>
      )}
    </>
  );
}
