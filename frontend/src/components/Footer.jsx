import { Link } from 'react-router-dom';
import { Logo } from './Icons';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <div className="footer-brand">
          <Logo size={34} />
          <span><strong>UCU</strong><br />Lost &amp; Found</span>
        </div>
        <p className="footer-tagline">Together, we keep our campus community connected.</p>
        <nav aria-label="Footer" className="footer-links">
          <Link to="/about#help">Help</Link>
          <span aria-hidden="true" className="sep" />
          <Link to="/about#contact">Contact Us</Link>
        </nav>
      </div>
    </footer>
  );
}
