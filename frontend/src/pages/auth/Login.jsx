import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { login as apiLogin } from '../../api/authApi.js';
import FormInput from '../../components/FormInput.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registered = location.state?.registered;

  useEffect(() => {
    if (user) {
      if (user.role === 'admin')       navigate('/admin',  { replace: true });
      else if (user.role === 'store_owner') navigate('/owner', { replace: true });
      else navigate('/stores', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiLogin(form);
      login(res.data.user);
      const role = res.data.user.role;
      if (role === 'admin')       navigate('/admin');
      else if (role === 'store_owner') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Store Rating Portal</h2>
          <p>Sign in to your account</p>
        </div>

        {registered && (
          <div className="alert alert-success">
            Registration successful! Please sign in.
          </div>
        )}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. name@example.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-muted mt-4 text-center">
          Need an account?{' '}
          <Link className="link" to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
