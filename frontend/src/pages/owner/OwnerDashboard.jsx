import React, { useEffect, useState } from 'react';
import { getOwnerDashboard } from '../../api/ownerApi.js';
import StarRating from '../../components/StarRating.jsx';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOwnerDashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load store dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Loading dashboard data...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!data) return null;

  const { store, avgRating, ratingCount, ratings } = data;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Store Owner Dashboard</h1>
          <p>Review customer ratings and feedback for your store</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-title">Store Profile</div>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Store Name</label>
            <span><strong>{store.name}</strong></span>
          </div>
          <div className="detail-item">
            <label>Contact Email</label>
            <span>{store.email}</span>
          </div>
          <div className="detail-item">
            <label>Store Address</label>
            <span>{store.address || <span className="text-muted">No address provided</span>}</span>
          </div>
        </div>
      </div>

      <div className="stat-grid mb-4">
        <div className="stat-card">
          <span className="stat-label">Average Store Rating</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="stat-value" style={{ color: '#d97706' }}>{avgRating}</span>
            <StarRating value={Math.round(avgRating)} readOnly />
          </div>
          <span className="stat-help">Out of 5.0 maximum</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total Customer Ratings</span>
          <span className="stat-value">{ratingCount}</span>
          <span className="stat-help">Ratings submitted by verified users</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div className="card-title" style={{ margin: 0 }}>
            Customer Ratings ({ratings.length})
          </div>
        </div>

        {ratings.length === 0 ? (
          <div className="empty-state">
            <p>No ratings have been submitted for your store yet.</p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Rating Given</th>
                  <th>Date Submitted</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r) => (
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
