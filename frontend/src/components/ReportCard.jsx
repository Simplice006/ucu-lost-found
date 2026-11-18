import { Link } from 'react-router-dom';
import { formatDate } from '../constants';
import { StatusBadge, TypeBadge } from './Badges';
import { tiltHandlers } from '../tilt';
import { IconBox, IconCalendar, IconPin } from './Icons';

export default function ReportCard({ report, children }) {
  const done = report.status === 'returned';
  return (
    <li className={`item ${done ? 'item-done' : ''}`} {...tiltHandlers(6)}>
      <div className="item-media">
        {report.photo_url ? (
          <img src={report.photo_url} alt={`Photo of ${report.title}`} loading="lazy" className="item-photo" />
        ) : (
          <div className="item-photo item-photo-empty" role="img" aria-label="No photo provided"><IconBox size={38} /></div>
        )}
        <span className="item-flag"><TypeBadge type={report.type} /></span>
        {done && <span className="item-flag item-flag-left"><StatusBadge status="returned" /></span>}
      </div>
      <div className="item-body">
        <h3 className="item-title">
          <Link to={`/reports/${report.id}`}>{report.title}</Link>
        </h3>
        <p className="meta"><IconPin size={15} className="meta-icon" /> {report.location}</p>
        <p className="meta"><IconCalendar size={15} className="meta-icon" /> {formatDate(report.event_date)}</p>
        {report.description && <p className="item-desc">{report.description}</p>}
        {children}
      </div>
    </li>
  );
}
