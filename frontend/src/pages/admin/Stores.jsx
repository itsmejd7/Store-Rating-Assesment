import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStores } from '../../api/adminApi.js';
import StarRating from '../../components/StarRating.jsx';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', address: '', sort: 'name', order: 'asc' });

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.name)    params.name    = filters.name;
    if (filters.address) params.address = filters.address;
    params.sort  = filters.sort;
    params.order = filters.order;

    getAdminStores(params)
      .then((res) => setStores(res.data))
      .catch(() => setError('Failed to load store records.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const toggleSort = (col) => {
    setFilters((f) => ({
      ...f,
      sort: col,
      order: f.sort === col && f.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortIndicator = ({ col }) =>
    filters.sort === col ? (filters.order === 'asc' ? ' ↑' : ' ↓') : '';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Store Management</h1>
          <p>Search, filter, and inspect store profiles and ratings</p>
        </div>
        <Link className="btn btn-primary" to="/admin/stores/new">+ Add Store</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          className="input"
          name="name"
          placeholder="Search by store name..."
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          className="input"
          name="address"
          placeholder="Search by address..."
          value={filters.address}
          onChange={handleFilterChange}
        />
        {(filters.name || filters.address) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setFilters({ name: '', address: '', sort: 'name', order: 'asc' })}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="empty-state">
            <p>Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="empty-state">
            <p>No stores found matching the criteria.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')} title="Click to sort">
                  Store Name<SortIndicator col="name" />
                </th>
                <th>Email</th>
                <th>Address</th>
                <th>Assigned Owner</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('avg_rating')} title="Click to sort">
                  Average Rating<SortIndicator col="avg_rating" />
                </th>
                <th>Total Ratings</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('created_at')} title="Click to sort">
                  Added Date<SortIndicator col="created_at" />
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td>{s.address || <span className="text-muted">—</span>}</td>
                  <td>{s.owner_name}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <StarRating value={Math.round(s.avg_rating)} readOnly />
                      <span style={{ fontWeight: 600 }}>{s.avg_rating}</span>
                    </div>
                  </td>
                  <td>{s.rating_count}</td>
                  <td>{new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link className="btn btn-outline btn-sm" to={`/admin/stores/${s.id}`}>
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
