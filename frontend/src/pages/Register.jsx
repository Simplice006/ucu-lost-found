import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import FormField from '../components/FormField';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  function validate() {
    const found = {};
    const name = form.full_name.trim();
    if (name.length < 2 || name.length > 100)
      found.full_name = 'Enter your full name (2 to 100 characters).';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      found.email = 'Enter a valid email address, for example name@example.com.';
    if (form.password.length < 8 || form.password.length > 72)
      found.password = 'Choose a password of 8 to 72 characters.';
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
      await register(form.full_name.trim(), form.email.trim(), form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setErrors(err.fields || {});
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="card narrow">
      <h1>Create your account</h1>
      {formError && (
        <p role="alert" className="alert alert-error">
          {formError}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <FormField
          id="full_name"
          label="Full name"
          autoComplete="name"
          value={form.full_name}
          onChange={update}
          error={errors.full_name}
        />
        <FormField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update}
          error={errors.email}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          value={form.password}
          onChange={update}
          error={errors.password}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="center">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  );
}
