import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { logout as apiLogout } from '../api/authApi.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
    }
    logout();
    navigate('/login');
  };

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'Admin';
    if (role === 'store_owner') return 'Store Owner';
    return 'User';
  };

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand">
        Store Rating App
        <span className="nav-brand-badge">{getRoleLabel(user.role)}</span>
      </NavLink>

      <div className="nav-links">
        {user.role === 'admin' && (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/admin">Dashboard</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/admin/users">Users</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/admin/stores">Stores</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/change-password">Password</NavLink>
          </>
        )}

        {user.role === 'user' && (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/stores">Stores</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/change-password">Password</NavLink>
          </>
        )}

        {user.role === 'store_owner' && (
          <>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/owner">Dashboard</NavLink>
            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/change-password">Password</NavLink>
          </>
        )}

        <div className="nav-user-info">
          <span className="nav-user-name">{user.name || user.email}</span>
          <button className="nav-btn" onClick={handleLogout} title="Log out of application">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
