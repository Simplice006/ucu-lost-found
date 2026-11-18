import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { IconCheckCircle, IconEdit, IconGrid, IconHome, IconInfo, IconLogout, IconUser, IconUserPlus, Logo } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  async function handleLogout() {
    close();
    await logout();
    navigate('/');
  }

  // "Report Lost" and "Report Found" share one path and differ only by the ?type value.
  const reportType = pathname === '/reports/new' ? new URLSearchParams(search).get('type') : null;
  const reportClass = (type) => `nav-link${reportType === type ? ' active' : ''}`;

  return (
    <header className="site-header">
      <div className="header-row">
        <Link to="/" className="brand" onClick={close}>
          <Logo />
          <span className="brand-text">
            <span className="brand-name">UCU Lost &amp; Found</span>
            <span className="brand-tag">Find • Return • Reunite</span>
          </span>
        </Link>

        {/* On phones the menu is hidden behind a button; it is a real <button> so the keyboard works. */}
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close menu' : 'Menu'}
        </button>

        <nav id="main-nav" aria-label="Main" className={open ? 'nav open' : 'nav'}>
          <div className="nav-main">
            <NavLink to="/" end className="nav-link" onClick={close}><IconHome /> Home</NavLink>
            <NavLink to="/items" className="nav-link" onClick={close}><IconGrid /> Browse Items</NavLink>
            <Link to="/reports/new?type=lost" className={reportClass('lost')} onClick={close}><IconEdit /> Report Lost</Link>
            <Link to="/reports/new?type=found" className={reportClass('found')} onClick={close}><IconCheckCircle /> Report Found</Link>
            <NavLink to="/about" className="nav-link" onClick={close}><IconInfo /> About</NavLink>
            {user && <NavLink to="/my-reports" className="nav-link" onClick={close}>My reports</NavLink>}
            {user && (user.role === 'admin'
              ? <NavLink to="/admin/claims" className="nav-link" onClick={close}>Review claims</NavLink>
              : <NavLink to="/my-claims" className="nav-link" onClick={close}>My claims</NavLink>)}
          </div>

          <div className="nav-account">
            {user ? (
              <>
                <span className="nav-user">{user.full_name}</span>
                <button type="button" className="btn btn-ghost" onClick={handleLogout}><IconLogout size={18} /> Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost" onClick={close}><IconUser size={18} /> Login</Link>
                <Link to="/register" className="btn btn-accent" onClick={close}><IconUserPlus size={18} /> Create Account</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
