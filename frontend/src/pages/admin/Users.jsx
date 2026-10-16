import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../../api/adminApi.js';

const ROLE_LABELS = { admin: 'Admin', user: 'Normal User', store_owner: 'Store Owner' };

function RoleBadge({ role }) {
  const cls = role === 'admin' ? 'badge-admin' : role === 'store_owner' ? 'badge-owner' : 'badge-user';
  return <span className={`badge ${cls}`}>{ROLE_LABELS[role] || role}</span>;
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', role: '', sort: 'name', order: 'asc' });

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.name)  params.name  = filters.name;
    if (filters.email) params.email = filters.email;
    if (filters.role)  params.role  = filters.role;
    params.sort  = filters.sort;
    params.order = filters.order;

    getUsers(params)
      .then((res) => setUsers(res.data))
      .catch(() => setError('Failed to load user records.'))
      .finally(() => setLoading(false));
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
          <h1>User Management</h1>
          <p>Search, filter, and view registered system accounts</p>
        </div>
        <Link className="btn btn-primary" to="/admin/users/new">+ Add User</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="search-bar">
        <input
          className="input"
          name="name"
          placeholder="Search by name..."
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          className="input"
          name="email"
          placeholder="Search by email..."
          value={filters.email}
          onChange={handleFilterChange}
        />
        <select className="input" name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        {(filters.name || filters.email || filters.role) && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setFilters({ name: '', email: '', role: '', sort: 'name', order: 'asc' })}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div className="empty-state">
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No user records found matching the criteria.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')} title="Click to sort">
                  Name<SortIndicator col="name" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('email')} title="Click to sort">
                  Email<SortIndicator col="email" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('role')} title="Click to sort">
                  Role<SortIndicator col="role" />
                </th>
                <th>Address</th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('created_at')} title="Click to sort">
                  Registered Date<SortIndicator col="created_at" />
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td><RoleBadge role={u.role} /></td>
                  <td>{u.address || <span className="text-muted">—</span>}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link className="btn btn-outline btn-sm" to={`/admin/users/${u.id}`}>
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
