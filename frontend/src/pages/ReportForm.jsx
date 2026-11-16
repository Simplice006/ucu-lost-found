import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { CATEGORIES, LOCATIONS, todayISO } from '../constants';
import { useDocumentTitle, useFetch } from '../hooks';
import FormField from '../components/FormField';
import { Alert, ErrorState, Loading } from '../components/Feedback';

const BLANK = { type: 'lost', title: '', category: '', description: '', private_details: '', event_date: '', location: '', photo_url: '' };

export default function ReportForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const [params] = useSearchParams();
  useDocumentTitle(editing ? 'Edit report' : 'New report');
  const navigate = useNavigate();

  const existing = useFetch(editing ? `/api/reports/${id}` : '/api/health');
  const [form, setForm] = useState({ ...BLANK, type: params.get('type') === 'found' ? 'found' : 'lost' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const r = existing.data?.report;
    if (editing && r) setForm({ ...BLANK, ...r, private_details: r.private_details || '', photo_url: r.photo_url || '', event_date: String(r.event_date).slice(0, 10) });
  }, [existing.data, editing]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const f = {};
    if (form.title.trim().length < 3 || form.title.trim().length > 120) f.title = 'Enter a short title of 3 to 120 characters, for example "Keys with blue keyring".';
    if (!form.category) f.category = 'Choose the category that fits the item best.';
    if (form.description.trim().length < 10) f.description = 'Describe the item in at least 10 characters. Do not include details only the owner would know.';
    if (!form.event_date) f.event_date = 'Choose the date the item was lost or found.';
    else if (form.event_date > todayISO()) f.event_date = 'The date cannot be in the future. Choose today or an earlier date.';
    if (!form.location) f.location = 'Choose where on campus the item was lost or found.';
    if (form.type === 'found' && form.private_details.trim().length < 3) f.private_details = 'Add a detail only the owner would know, such as an inscription. It stays private.';
    if (form.photo_url.trim() && !/^https?:\/\/\S+$/i.test(form.photo_url.trim())) f.photo_url = 'Enter a web address starting with http:// or https://, or leave this empty.';
    return f;
  }

  async function submit(e) {
    e.preventDefault();
    setFormError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        type: form.type, title: form.title.trim(), category: form.category,
        description: form.description.trim(), event_date: form.event_date, location: form.location,
        private_details: form.type === 'found' ? form.private_details.trim() : null,
        photo_url: form.photo_url.trim() || null,
      };
      const res = await api(editing ? `/api/reports/${id}` : '/api/reports', { method: editing ? 'PUT' : 'POST', body });
      const newId = res.report?.id || id;
      navigate(`/reports/${newId}`, { state: { flash: editing ? 'Your report was updated.' : 'Your report was published.' } });
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (editing && existing.loading) return <Loading label="Loading report…" />;
  if (editing && existing.error) return <ErrorState message={existing.error} onRetry={existing.reload} />;

  return (
    <section className="card narrow-lg">
      <h1>{editing ? 'Edit your report' : 'Report an item'}</h1>
      {formError && <Alert>{formError}</Alert>}
      <form onSubmit={submit} noValidate>
        <fieldset className="field">
          <legend>What happened?</legend>
          <label className="choice"><input type="radio" name="type" value="lost" checked={form.type === 'lost'} onChange={update} disabled={editing} /> I lost an item</label>
          <label className="choice"><input type="radio" name="type" value="found" checked={form.type === 'found'} onChange={update} disabled={editing} /> I found an item</label>
        </fieldset>

        <FormField id="title" label="Title" required value={form.title} onChange={update} error={errors.title} maxLength={120} />
        <FormField id="category" label="Category" as="select" required value={form.category} onChange={update} error={errors.category}>
          <option value="">Choose a category</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </FormField>
        <FormField id="description" label="Public description" as="textarea" rows={4} required value={form.description} onChange={update} error={errors.description}
          hint="Everyone can read this. Describe colour, size and brand. Keep identifying details out of here." />

        {form.type === 'found' && (
          <div className="private-box">
            <FormField id="private_details" label="Private identifying details" as="textarea" rows={3} required value={form.private_details} onChange={update} error={errors.private_details}
              hint="Only you and the administrator can see this. Write something only the owner would know, like an inscription or what is inside. Never put it in the public description or photo." />
          </div>
        )}

        <FormField id="event_date" label={form.type === 'found' ? 'Date found' : 'Date lost'} type="date" max={todayISO()} required value={form.event_date} onChange={update} error={errors.event_date} />
        <FormField id="location" label="Campus location" as="select" required value={form.location} onChange={update} error={errors.location}>
          <option value="">Choose a location</option>
          {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
        </FormField>
        <FormField id="photo_url" label="Photo web address" type="url" inputMode="url" value={form.photo_url} onChange={update} error={errors.photo_url}
          hint="Optional. Use a photo that does not show private details." />

        <div className="actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : editing ? 'Save changes' : 'Publish report'}
          </button>
          <Link to={editing ? `/reports/${id}` : '/'} className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </section>
  );
}
