import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUser } from '../../api/adminApi.js';
import FormInput from '../../components/FormInput.jsx';

export default function CreateUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'user', address: '',
  });
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
      await createUser(form);
      navigate('/admin/users');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const fe = {};
        data.errors.forEach((e) => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setGlobalError(data?.error || 'Failed to create user.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add New User</h1>
          <p>Create a new user, administrator, or store owner account</p>
        </div>
        <Link className="btn btn-outline" to="/admin/users">← Back to Users</Link>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        {globalError && <div className="alert alert-error">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name"
            name="name"
            placeholder="e.g. Jane Smith"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="e.g. jane@example.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
          />

          <FormInput
            label="Account Password"
            name="password"
            type="password"
            placeholder="Minimum 8 characters"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
          />
          <p className="text-muted" style={{ fontSize: '11px', marginTop: '-8px', marginBottom: '12px' }}>
            8–72 characters, at least 1 uppercase letter and 1 special symbol (!@#$%^&*).
          </p>

          <div className="form-group mb-3">
            <label htmlFor="role">Assign System Role</label>
            <select
              id="role"
              name="role"
              className={`input${fieldErrors.role ? ' input-error' : ''}`}
              value={form.role}
              onChange={handleChange}
            >
              <option value="user">Normal User (can browse & rate stores)</option>
              <option value="store_owner">Store Owner (can view store dashboard & ratings)</option>
              <option value="admin">Administrator (full system access)</option>
            </select>
            {fieldErrors.role && <span className="error-text">{fieldErrors.role}</span>}
          </div>

          <FormInput
            label="Physical Address (Optional)"
            name="address"
            placeholder="City or street address"
            value={form.address}
            onChange={handleChange}
            error={fieldErrors.address}
          />

          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}
