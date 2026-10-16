import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById } from '../../api/adminApi.js';

const ROLE_LABELS = { admin: 'Admin', user: 'Normal User', store_owner: 'Store Owner' };

function RoleBadge({ role }) {
  const cls = role === 'admin' ? 'badge-admin' : role === 'store_owner' ? 'badge-owner' : 'badge-user';
  return <span className={`badge ${cls}`}>{ROLE_LABELS[role] || role}</span>;
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <label>{label}</label>
      <span>{value || <span className="text-muted">—</span>}</span>
    </div>
  );
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserById(id)
      .then((res) => setUser(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load user details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-muted">Loading user profile...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!user) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{user.name}</h1>
          <p>Account details and associated stores</p>
        </div>
        <Link className="btn btn-outline" to="/admin/users">← Back to Users</Link>
      </div>

      <div className="card mb-4">
        <div className="card-title">Account Details</div>
        <div className="detail-grid">
          <DetailItem label="Full Name"       value={user.name} />
          <DetailItem label="Email Address"   value={user.email} />
          <DetailItem label="System Role"     value={<RoleBadge role={user.role} />} />
          <DetailItem label="User Address"    value={user.address} />
          <DetailItem label="Registered Date" value={new Date(user.created_at).toLocaleDateString()} />
          {user.role === 'user' && (
            <DetailItem label="Submitted Ratings Count" value={user.ratingCount ?? 0} />
          )}
        </div>
      </div>

      {user.role === 'store_owner' && user.store && (
        <div className="card">
          <div className="card-title">Assigned Store</div>
          <div className="detail-grid mb-3">
            <DetailItem label="Store Name"    value={user.store.name} />
            <DetailItem label="Store Email"   value={user.store.email} />
            <DetailItem label="Location"      value={user.store.address} />
            <DetailItem label="Average Rating" value={`★ ${user.store.avg_rating}`} />
          </div>
          <Link className="btn btn-outline btn-sm" to={`/admin/stores/${user.store.id}`}>
            View Store Details →
          </Link>
        </div>
      )}

      {user.role === 'store_owner' && !user.store && (
        <div className="card">
          <div className="card-title">Assigned Store</div>
          <p className="text-muted">This store owner does not currently have a store assigned.</p>
        </div>
      )}
    </div>
  );
}
