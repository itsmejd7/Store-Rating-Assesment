import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/adminApi.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard statistics.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Administrator Dashboard</h1>
          <p>System overview and quick access to management tools</p>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-outline" to="/admin/users/new">+ Add User</Link>
          <Link className="btn btn-primary" to="/admin/stores/new">+ Add Store</Link>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading dashboard data...</p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Total Registered Users</span>
              <span className="stat-value">{stats?.totalUsers ?? 0}</span>
              <span className="stat-help">Admins, normal users, and owners</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Listed Stores</span>
              <span className="stat-value">{stats?.totalStores ?? 0}</span>
              <span className="stat-help">Active stores in system</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Submitted Ratings</span>
              <span className="stat-value">{stats?.totalRatings ?? 0}</span>
              <span className="stat-help">Submitted by normal users</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Quick Navigation</div>
            <p className="text-muted mb-3">
              Manage accounts, assign store owners, and review store listings.
            </p>
            <div className="flex gap-2">
              <Link className="btn btn-outline" to="/admin/users">
                View All Users ({stats?.totalUsers ?? 0})
              </Link>
              <Link className="btn btn-outline" to="/admin/stores">
                View All Stores ({stats?.totalStores ?? 0})
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
