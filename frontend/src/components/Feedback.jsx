import { useLocation } from 'react-router-dom';

export function Alert({ kind = 'error', children }) {
  // Errors interrupt screen readers (alert); success/info are announced politely (status).
  return (
    <p className={`alert alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

// Success message passed from the previous page through router state.
export function Flash() {
  const { state } = useLocation();
  return state?.flash ? <Alert kind="success">{state.flash}</Alert> : null;
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="empty">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>Try again</button>
      )}
    </div>
  );
}
