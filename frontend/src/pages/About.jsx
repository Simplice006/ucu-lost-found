import { Link } from 'react-router-dom';
import { IconCheckCircle, IconEdit, IconInfo, IconSearch, IconShield } from '../components/Icons';
import { useDocumentTitle } from '../hooks';
import PageHeader from '../components/PageHeader';

const STEPS = [
  { icon: IconEdit, title: 'Report', text: 'Lost something? Describe it and say where on campus it went missing. Found something? Report it with a private detail only the owner would know.' },
  { icon: IconSearch, title: 'Search', text: 'Browse the listings or filter by category, place and date to see whether your item has already been handed in.' },
  { icon: IconShield, title: 'Claim privately', text: 'Explain why an item is yours. Only you and the administrator can read your claim, so the item reaches its real owner.' },
  { icon: IconCheckCircle, title: 'Collect', text: 'Once the administrator approves your claim, collect the item and the report is marked as returned.' },
];

export default function About() {
  useDocumentTitle('About');
  return (
    <>
      <PageHeader icon={IconInfo} title="About UCU Lost & Found" subtitle="Find • Return • Reunite. A single place for the campus community to bring lost items back to their owners." />
      <div className="overlap">
        <ul className="steps">
          {STEPS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="panel step">
              <span className="step-icon"><Icon size={24} /></span>
              <h2>{title}</h2>
              <p>{text}</p>
            </li>
          ))}
        </ul>

        <section id="help" className="panel">
          <h2>Help</h2>
          <p>You need an account to report an item or send a claim. Browsing is open to everyone. Your private details and claim evidence are never shown publicly.</p>
          <p className="actions">
            <Link to="/register" className="btn btn-primary">Create account</Link>
            <Link to="/items" className="btn btn-soft">Browse items</Link>
          </p>
        </section>

        <section id="contact" className="panel">
          <h2>Contact us</h2>
          <p>To collect an approved item or ask about a report, visit the administration office on campus.</p>
        </section>
      </div>
    </>
  );
}
