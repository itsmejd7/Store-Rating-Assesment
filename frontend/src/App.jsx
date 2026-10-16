import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';

import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';

import AdminDashboard from './pages/admin/Dashboard.jsx';
import AdminUsers from './pages/admin/Users.jsx';
import CreateUser from './pages/admin/CreateUser.jsx';
import AdminUserDetail from './pages/admin/UserDetail.jsx';
import AdminStores from './pages/admin/Stores.jsx';
import CreateStore from './pages/admin/CreateStore.jsx';
import AdminStoreDetail from './pages/admin/StoreDetail.jsx';

import StoreList from './pages/user/StoreList.jsx';
import StoreDetail from './pages/user/StoreDetail.jsx';

import OwnerDashboard from './pages/owner/OwnerDashboard.jsx';

import ChangePassword from './pages/shared/ChangePassword.jsx';

function AppShell({ children }) {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin"             element={<AppShell><AdminDashboard /></AppShell>} />
          <Route path="/admin/users"       element={<AppShell><AdminUsers /></AppShell>} />
          <Route path="/admin/users/new"   element={<AppShell><CreateUser /></AppShell>} />
          <Route path="/admin/users/:id"   element={<AppShell><AdminUserDetail /></AppShell>} />
          <Route path="/admin/stores"      element={<AppShell><AdminStores /></AppShell>} />
          <Route path="/admin/stores/new"  element={<AppShell><CreateStore /></AppShell>} />
          <Route path="/admin/stores/:id"  element={<AppShell><AdminStoreDetail /></AppShell>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/stores"     element={<AppShell><StoreList /></AppShell>} />
          <Route path="/stores/:id" element={<AppShell><StoreDetail /></AppShell>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
          <Route path="/owner" element={<AppShell><OwnerDashboard /></AppShell>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin', 'user', 'store_owner']} />}>
          <Route path="/change-password" element={<AppShell><ChangePassword /></AppShell>} />
        </Route>

        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
