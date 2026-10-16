import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createStore, getUsers } from '../../api/adminApi.js';
import FormInput from '../../components/FormInput.jsx';

export default function CreateStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [owners, setOwners] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownersLoading, setOwnersLoading] = useState(true);

  useEffect(() => {
    getUsers({ role: 'store_owner' })
      .then((res) => setOwners(res.data))
      .catch(() => setGlobalError('Failed to load store owners.'))
      .finally(() => setOwnersLoading(false));
  }, []);

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
      await createStore({ ...form, owner_id: parseInt(form.owner_id, 10) });
      navigate('/admin/stores');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const fe = {};
        data.errors.forEach((e) => { fe[e.field] = e.message; });
        setFieldErrors(fe);
      } else {
        setGlobalError(data?.error || 'Failed to create store.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Add New Store</h1>
          <p>Register a store and assign it to an existing Store Owner</p>
        </div>
        <Link className="btn btn-outline" to="/admin/stores">← Back to Stores</Link>
      </div>

      <div className="card" style={{ maxWidth: 500 }}>
        {globalError && <div className="alert alert-error">{globalError}</div>}

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Store Name"
            name="name"
            placeholder="e.g. Downtown Bookshop"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            required
          />

          <FormInput
            label="Store Contact Email"
            name="email"
            type="email"
            placeholder="e.g. contact@downtownbookshop.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
          />

          <FormInput
            label="Store Physical Address (Optional)"
            name="address"
            placeholder="e.g. 102 Market Street, Suite 4"
            value={form.address}
            onChange={handleChange}
            error={fieldErrors.address}
          />

          <div className="form-group mb-3">
            <label htmlFor="owner_id">Assigned Store Owner</label>
            {ownersLoading ? (
              <p className="text-muted" style={{ fontSize: '13px' }}>Loading registered store owners...</p>
            ) : (
              <select
                id="owner_id"
                name="owner_id"
                className={`input${fieldErrors.owner_id ? ' input-error' : ''}`}
                value={form.owner_id}
                onChange={handleChange}
                required
              >
                <option value="">— Select a registered store owner —</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.email})
                  </option>
                ))}
              </select>
            )}
            {fieldErrors.owner_id && (
              <span className="error-text">{fieldErrors.owner_id}</span>
            )}
            {!ownersLoading && owners.length === 0 && (
              <span className="error-text">
                No store owners found. Please create a user with the &quot;Store Owner&quot; role first.
              </span>
            )}
          </div>

          <button className="btn btn-primary w-full mt-2" type="submit" disabled={loading || ownersLoading || owners.length === 0}>
            {loading ? 'Creating Store...' : 'Create Store'}
          </button>
        </form>
      </div>
    </div>
  );
}
