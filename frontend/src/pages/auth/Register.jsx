import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../../api/authApi.js';
import FormInput from '../../components/FormInput.jsx';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await apiRegister(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const fe = {};
        data.errors.forEach((e) => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setGlobalError(data?.error || 'Registration failed. Please check your information.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Register as a regular user to rate stores</p>
        </div>

        {globalError && <div className="alert alert-error">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            name="name"
            placeholder="e.g. John Doe"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            autoComplete="name"
            required
          />
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. john@example.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            autoComplete="email"
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="new-password"
            required
          />
          <p className="text-muted" style={{ fontSize: '11px', marginTop: '-8px', marginBottom: '12px' }}>
            Must contain 8–72 characters, 1 uppercase letter, and 1 special symbol (!@#$%^&*).
          </p>
          <FormInput
            label="Address (Optional)"
            name="address"
            placeholder="City or street address"
            value={form.address}
            onChange={handleChange}
            error={fieldErrors.address}
            autoComplete="street-address"
          />
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-muted mt-4 text-center">
          Already registered?{' '}
          <Link className="link" to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
