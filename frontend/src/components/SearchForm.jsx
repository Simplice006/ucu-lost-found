import { useState } from 'react';
import { CATEGORIES, todayISO } from '../constants';
import LocationOptions from './LocationOptions';
import FormField from './FormField';
import { IconCalendar, IconChevronDown, IconGrid, IconKeyboard, IconList, IconPin, IconReset, IconSearch, IconTag } from './Icons';

export const EMPTY_FILTERS = { q: '', type: '', category: '', location: '', date: '', status: '' };

// The search card from the home page, reused on the browse page. It only collects values: the parent decides what to do with them.
export default function SearchForm({ form, onChange, onSubmit, onReset, showReset }) {
  const [advanced, setAdvanced] = useState(true);
  return (
    <form className="search-card" onSubmit={onSubmit} role="search" aria-label="Search items">
      <div className="search-card-top">
        <h2 className="search-tab"><IconSearch size={20} /> Search Items</h2>
        <button type="button" className="advanced-toggle" aria-expanded={advanced} aria-controls="advanced-fields" onClick={() => setAdvanced((a) => !a)}>
          Advanced Search <IconChevronDown size={18} className={advanced ? 'flip' : ''} />
        </button>
      </div>

      <div className="filter-grid">
        <FormField id="q" label="Keyword" icon={IconKeyboard} type="search" placeholder="e.g. phone, bag, wallet…" value={form.q} onChange={onChange} />
        <FormField id="type" label="Lost or Found" icon={IconTag} as="select" value={form.type} onChange={onChange}>
          <option value="">All reports</option>
          <option value="lost">Lost items</option>
          <option value="found">Found items</option>
        </FormField>
        <FormField id="status" label="Status" icon={IconList} as="select" value={form.status} onChange={onChange}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="returned">Returned</option>
        </FormField>
      </div>
      <div id="advanced-fields" className="filter-grid" hidden={!advanced}>
        <FormField id="category" label="Category" icon={IconGrid} as="select" value={form.category} onChange={onChange}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </FormField>
        <FormField id="location" label="Campus Location" icon={IconPin} as="select" value={form.location} onChange={onChange}>
          <option value="">All locations</option>
          <LocationOptions />
        </FormField>
        <FormField id="date" label="Date" icon={IconCalendar} type="date" max={todayISO()} value={form.date} onChange={onChange} />
      </div>

      <div className="search-actions">
        <button type="submit" className="btn btn-primary"><IconSearch size={18} /> Search Items</button>
        {showReset && <button type="button" className="btn btn-soft" onClick={onReset}><IconReset size={18} /> Reset</button>}
      </div>
    </form>
  );
}
