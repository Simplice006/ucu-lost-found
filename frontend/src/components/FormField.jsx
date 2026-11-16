// A labelled input, textarea or select. Errors and hints are linked for screen readers.
export default function FormField({ id, label, error, hint, as = 'input', required, children, ...props }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  const Control = as;
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="req"> (required)</span> : <span className="opt"> (optional)</span>}
      </label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      <Control
        id={id}
        name={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy || undefined}
        {...props}
      >
        {children}
      </Control>
      {error && <p id={errorId} className="field-error">{error}</p>}
    </div>
  );
}
