import './index.css'
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

import WarehouseBrowser from './pages/WarehouseBrowser';
import HomePage from './pages/HomePage';
import WarehouseDetail from './pages/WarehouseDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyReviewPage from './pages/MyReviewPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import MainLayout from './components/MainLayout';

function App() {
  const { user } = useAuthContext()

  return (
    <Router>
      <Routes>
        {/* All main routes share a persistent Navbar */}
        <Route element={<MainLayout />}>
          {/* "/" becomes the index route under the layout */}
          <Route index element={<HomePage />} />
          <Route path="/warehouses" element={<WarehouseBrowser />} />
          <Route path="/warehouses/:warehouseID" element={<WarehouseDetail />} />

          {/* Public-only routes (same logic as before) */}
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" replace />}
          />

          {/* Authed routes (same logic as before) */}
          <Route
            path="/reviews"
            element={user ? <MyReviewPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/profile"
            element={user ? <ProfileSettingsPage /> : <Navigate to="/" replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;