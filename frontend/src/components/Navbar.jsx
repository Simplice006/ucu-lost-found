import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  async function handleLogout() {
    close();
    await logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" onClick={close}>
          UCU Lost &amp; Found
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
          <NavLink to="/" end onClick={close}>
            Browse items
          </NavLink>
          {user ? (
            <>
              <NavLink to="/reports/new" onClick={close}>Report an item</NavLink>
              <NavLink to="/my-reports" onClick={close}>My reports</NavLink>
              {user.role === 'admin' ? (
                <NavLink to="/admin/claims" onClick={close}>Review claims</NavLink>
              ) : (
                <NavLink to="/my-claims" onClick={close}>My claims</NavLink>
              )}
              <span className="nav-user">Signed in as {user.full_name}</span>
              <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>
                Log in
              </NavLink>
              <Link to="/register" className="btn btn-primary" onClick={close}>
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
