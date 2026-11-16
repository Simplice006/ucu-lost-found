import { Link } from 'react-router-dom';
import { formatDate } from '../constants';
import { StatusBadge, TypeBadge } from './Badges';

export default function ReportCard({ report, children }) {
  return (
    <li className={`item ${report.status === 'returned' ? 'item-done' : ''}`}>
      {report.photo_url && (
        <img src={report.photo_url} alt={`Photo of ${report.title}`} loading="lazy" className="item-photo" />
      )}
      <div className="item-body">
        <div className="badges">
          <TypeBadge type={report.type} />
          <StatusBadge status={report.status} />
        </div>
        <h2 className="item-title">
          <Link to={`/reports/${report.id}`}>{report.title}</Link>
        </h2>
        <p className="meta">{report.category} · {report.location} · {formatDate(report.event_date)}</p>
        <p className="item-desc">{report.description}</p>
        {children}
      </div>
    </li>
  );
}
