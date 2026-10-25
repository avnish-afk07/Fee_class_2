import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePasswordPresence } from '../utils/validators';

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fieldValidators = {
    email: validateEmail,
    password: validatePasswordPresence,
  };

  const validateField = (name, value) => fieldValidators[name]?.(value) ?? '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
    if (formError) setFormError('');
    if (touched[name] && fieldValidators[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, nextValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!fieldValidators[name]) return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const nextErrors = {
      email: validateEmail(form.email),
      password: validatePasswordPresence(form.password),
    };
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    return Object.values(nextErrors).every((err) => !err);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from ?? '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form glass" onSubmit={handleLogin} noValidate>
      <h2 className="auth-form-title">Welcome back</h2>
      <p className="auth-form-subtitle">Log in to access your portfolio and markets.</p>

      {formError && (
        <div className="form-error-banner" role="alert">
          {formError}
        </div>
      )}

      <label className="field">
        <span className="field-label">Email</span>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email}
          className={errors.email ? 'field-invalid' : ''}
          autoComplete="email"
        />
      </label>
      {errors.email && <p className="field-error">{errors.email}</p>}

      <label className="field">
        <span className="field-label">Password</span>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.password}
          className={errors.password ? 'field-invalid' : ''}
          autoComplete="current-password"
        />
      </label>
      {errors.password && <p className="field-error">{errors.password}</p>}

      <div className="field-row">
        <label className="checkbox-field">
          <input type="checkbox" name="remember" checked={form.remember} onChange={handleChange} />
          <span>Remember me</span>
        </label>
        <a href="#forgot-password" className="link-muted">
          Forgot password?
        </a>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Logging in...
          </>
        ) : (
          'Log In'
        )}
      </button>

      <div className="auth-divider">
        <span>or</span>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="link-accent">
          Sign up
        </Link>
      </p>
    </form>
  );
}
