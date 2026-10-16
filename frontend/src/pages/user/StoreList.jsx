import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getStores } from '../../api/storeApi.js';
import StarRating from '../../components/StarRating.jsx';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', address: '' });

  const fetchStores = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.name)    params.name    = filters.name;
    if (filters.address) params.address = filters.address;

    getStores(params)
      .then((res) => setStores(res.data))
      .catch(() => setError('Failed to load stores.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Browse Stores</h1>
          <p>Find stores and submit or update your 1 to 5 star ratings</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          className="input"
          name="name"
          placeholder="Filter by store name..."
          value={filters.name}
          onChange={handleChange}
        />
        <input
          className="input"
          name="address"
          placeholder="Filter by address..."
          value={filters.address}
          onChange={handleChange}
        />
        {(filters.name || filters.address) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setFilters({ name: '', address: '' })}
          >
            Clear Search
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
            <p>No stores found matching your search.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td>
                    <Link className="link" to={`/stores/${s.id}`} style={{ fontWeight: 600 }}>
                      {s.name}
                    </Link>
                  </td>
                  <td>{s.address || <span className="text-muted">—</span>}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <StarRating value={Math.round(s.avg_rating)} readOnly />
                      <span style={{ fontWeight: 600 }}>{s.avg_rating}</span>
                      <span className="text-muted" style={{ fontSize: '12px' }}>
                        ({s.rating_count})
                      </span>
                    </div>
                  </td>
                  <td>
                    {s.my_rating != null ? (
                      <span style={{ color: '#16a34a', fontWeight: 500 }}>
                        ★ {s.my_rating} / 5
                      </span>
                    ) : (
                      <span className="text-muted">Not rated</span>
                    )}
                  </td>
                  <td>
                    <Link
                      className={`btn btn-sm ${s.my_rating != null ? 'btn-outline' : 'btn-primary'}`}
                      to={`/stores/${s.id}`}
                    >
                      {s.my_rating != null ? 'Update Rating' : 'Rate Store'}
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
