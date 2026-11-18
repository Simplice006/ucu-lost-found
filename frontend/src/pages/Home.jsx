import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconArrowRight, IconClock, IconEdit, IconSearch } from '../components/Icons';
import { useDocumentTitle, useFetch } from '../hooks';
import { parallaxHandlers } from '../tilt';
import HeroArt from '../components/HeroArt';
import ReportCard from '../components/ReportCard';
import SearchForm, { EMPTY_FILTERS } from '../components/SearchForm';
import { EmptyState, ErrorState, Flash, Loading } from '../components/Feedback';

export default function Home() {
  useDocumentTitle('Home');
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FILTERS);
  const { data, loading, error, reload } = useFetch('/api/reports');
  const recent = (data?.reports || []).slice(0, 5);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  function submit(e) {
    e.preventDefault();
    const params = new URLSearchParams(Object.entries(form).filter(([, v]) => v.trim()));
    navigate(`/items${params.toString() ? `?${params}` : ''}`);
  }

  return (
    <>
      <section className="hero" {...parallaxHandlers()}>
        <div className="hero-inner">
          <div className="hero-copy">
            <h1>
              Find what you <span className="accent">lost.</span><br />
              Return what you <span className="accent">found.</span>
            </h1>
            <p className="hero-lead">Search campus listings, report an item, or claim one privately so it reaches its owner.</p>
            <div className="hero-actions">
              <Link to="/items" className="btn btn-accent btn-lg"><IconSearch size={20} /> Browse Items <IconArrowRight size={18} /></Link>
              <Link to="/reports/new?type=lost" className="btn btn-outline btn-lg"><IconEdit size={20} /> Report an Item</Link>
            </div>
          </div>
          <HeroArt />
        </div>
      </section>

      <div className="home-body">
        <SearchForm form={form} onChange={update} onSubmit={submit} onReset={() => setForm(EMPTY_FILTERS)}
          showReset />

        <Flash />

        <div className="section-head">
          <h2 className="section-title"><IconClock size={26} /> Recent Items</h2>
          <Link to="/items" className="btn btn-pill">View All Items <IconArrowRight size={16} /></Link>
        </div>

        {loading && <Loading label="Loading items…" />}
        {error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && (recent.length === 0 ? (
          <EmptyState title="No items reported yet">
            <p>Be the first to <Link to="/reports/new?type=lost">report a lost</Link> or <Link to="/reports/new?type=found">found</Link> item.</p>
          </EmptyState>
        ) : (
          <ul className="item-list item-list-recent">
            {recent.map((r) => <ReportCard key={r.id} report={r} />)}
          </ul>
        ))}
      </div>
    </>
  );
}
