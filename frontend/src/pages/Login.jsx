import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import FormField from '../components/FormField';
import PageHeader from '../components/PageHeader';
import { IconLock, IconMail, IconUser } from '../components/Icons';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Same rules as the backend, so people get instant feedback (the backend still re-checks).
  function validate() {
    const found = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      found.email = 'Enter a valid email address, for example name@example.com.';
    if (!form.password) found.password = 'Enter your password.';
    return found;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader icon={IconUser} title="Welcome back" subtitle="Log in to report items and follow your claims." />
    <section className="card narrow overlap">
      {formError && (
        <p role="alert" className="alert alert-error">
          {formError}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="email"
          required
          label="Email address"
          icon={IconMail}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update}
          error={errors.email}
        />
        <FormField
          id="password"
          required
          label="Password"
          icon={IconLock}
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={update}
          error={errors.password}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="center">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
    </>
  );
}
