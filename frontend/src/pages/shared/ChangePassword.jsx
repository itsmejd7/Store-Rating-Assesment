import React, { useState } from 'react';
import { changePassword } from '../../api/authApi.js';
import FormInput from '../../components/FormInput.jsx';

export default function ChangePassword() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setFieldErrors((fe) => ({ ...fe, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setSuccess('');
    setFieldErrors({});

    if (form.newPassword !== form.confirmNewPassword) {
      setFieldErrors({ confirmNewPassword: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess('Your password has been changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const fe = {};
        data.errors.forEach((e) => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setGlobalError(data?.error || 'Failed to update password. Please verify current password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Change Password</h1>
          <p>Update your account security password</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 440 }}>
        {success && <div className="alert alert-success">{success}</div>}
        {globalError && <div className="alert alert-error">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={form.currentPassword}
            onChange={handleChange}
            error={fieldErrors.currentPassword}
            autoComplete="current-password"
            required
          />

          <FormInput
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Minimum 8 characters"
            value={form.newPassword}
            onChange={handleChange}
            error={fieldErrors.newPassword}
            autoComplete="new-password"
            required
          />
          <p className="text-muted" style={{ fontSize: '11px', marginTop: '-8px', marginBottom: '12px' }}>
            Must contain 8–72 characters, 1 uppercase letter, and 1 special symbol (!@#$%^&*).
          </p>

          <FormInput
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            placeholder="Re-enter new password"
            value={form.confirmNewPassword}
            onChange={handleChange}
            error={fieldErrors.confirmNewPassword}
            autoComplete="new-password"
            required
          />

          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
