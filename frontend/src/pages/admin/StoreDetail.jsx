import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminStoreById } from '../../api/adminApi.js';
import StarRating from '../../components/StarRating.jsx';

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <label>{label}</label>
      <span>{value || <span className="text-muted">—</span>}</span>
    </div>
  );
}

export default function AdminStoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminStoreById(id)
      .then((res) => setStore(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load store profile.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-muted">Loading store details...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!store) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{store.name}</h1>
          <p>Store information and customer ratings</p>
        </div>
        <Link className="btn btn-outline" to="/admin/stores">← Back to Stores</Link>
      </div>

      <div className="card mb-4">
        <div className="card-title">Store Details</div>
        <div className="detail-grid">
          <DetailItem label="Store Name"   value={store.name} />
          <DetailItem label="Store Email"  value={store.email} />
          <DetailItem label="Address"      value={store.address} />
          <DetailItem label="Added Date"   value={new Date(store.created_at).toLocaleDateString()} />
          <div className="detail-item">
            <label>Average Rating</label>
            <div className="flex items-center gap-1">
              <StarRating value={Math.round(store.avg_rating)} readOnly />
              <span style={{ fontWeight: 600 }}>{store.avg_rating}</span>
              <span className="text-muted" style={{ fontSize: '12px' }}>
                ({store.rating_count} {store.rating_count === 1 ? 'rating' : 'ratings'})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-title">Assigned Store Owner</div>
        <div className="detail-grid mb-3">
          <DetailItem label="Owner Name"    value={store.owner_name} />
          <DetailItem label="Owner Email"   value={store.owner_email} />
          <DetailItem label="Owner Address" value={store.owner_address} />
        </div>
        <Link className="btn btn-outline btn-sm" to={`/admin/users/${store.owner_id}`}>
          View Owner Profile →
        </Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title" style={{ margin: 0 }}>
            Submitted Ratings ({store.ratings?.length ?? 0})
          </div>
        </div>

        {!store.ratings || store.ratings.length === 0 ? (
          <div className="empty-state">
            <p>No ratings have been submitted for this store yet.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Rating</th>
                  <th>Submitted Date</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {store.ratings.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.user_name}</strong></td>
                    <td>{r.user_email}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <StarRating value={r.value} readOnly />
                        <span style={{ fontWeight: 600 }}>{r.value} / 5</span>
                      </div>
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>{new Date(r.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
