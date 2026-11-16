import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Wraps pages that need a logged-in user (or an admin). This only improves the experience:
// the REAL protection is on the backend, which re-checks every request.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p role="status" className="loading">Loading your account…</p>;
  // Keep the query string so "Report Lost" / "Report Found" come back to the right form after login.
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
