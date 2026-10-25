import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  validateName,
  validateEmail,
  validatePasswordStrength,
  validateConfirmPassword,
  getPasswordChecks,
} from '../utils/validators';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fieldValidators = {
    name: validateName,
    email: validateEmail,
    password: validatePasswordStrength,
    confirmPassword: (value) => validateConfirmPassword(form.password, value),
  };

  const validateField = (name, value) => fieldValidators[name]?.(value) ?? '';

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);
    if (formError) setFormError('');

    setErrors((prev) => {
      const next = { ...prev };
      if (touched[name]) next[name] = validateField(name, value);
      // Keep confirm-password error in sync whenever password itself changes.
      if (name === 'password' && touched.confirmPassword) {
        next.confirmPassword = validateConfirmPassword(value, nextForm.confirmPassword);
      }
      return next;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const validateAll = () => {
    const nextErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePasswordStrength(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    return Object.values(nextErrors).every((err) => !err);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!validateAll()) return;

    setSubmitting(true);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const checks = getPasswordChecks(form.password);

  return (
    <form className="auth-form glass" onSubmit={handleSignup} noValidate>
      <h2 className="auth-form-title">Create your account</h2>
      <p className="auth-form-subtitle">Start trading with AlgoTrade in minutes.</p>

      {formError && (
        <div className="form-error-banner" role="alert">
          {formError}
        </div>
      )}

      <label className="field">
        <span className="field-label">Name</span>
        <input
          type="text"
          name="name"
          placeholder="Jordan Rivera"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.name}
          className={errors.name ? 'field-invalid' : ''}
          autoComplete="name"
        />
      </label>
      {errors.name && <p className="field-error">{errors.name}</p>}

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
          autoComplete="new-password"
        />
      </label>
      {form.password && (
        <ul className="password-checklist">
          <li className={checks.length ? 'valid' : ''}>
            <span>{checks.length ? '✓' : '○'}</span> At least 8 characters
          </li>
          <li className={checks.letter ? 'valid' : ''}>
            <span>{checks.letter ? '✓' : '○'}</span> Contains a letter
          </li>
          <li className={checks.number ? 'valid' : ''}>
            <span>{checks.number ? '✓' : '○'}</span> Contains a number
          </li>
        </ul>
      )}
      {errors.password && <p className="field-error">{errors.password}</p>}

      <label className="field">
        <span className="field-label">Confirm Password</span>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.confirmPassword}
          className={errors.confirmPassword ? 'field-invalid' : ''}
          autoComplete="new-password"
        />
      </label>
      {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

      <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
        {submitting ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Creating account...
          </>
        ) : (
          'Sign Up'
        )}
      </button>

      <p className="auth-switch">
        Already have an account?{' '}
        <Link to="/login" className="link-accent">
          Log in
        </Link>
      </p>
    </form>
  );
}
