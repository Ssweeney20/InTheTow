import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/warehouses" element={<WarehouseBrowser />} />
          <Route path="/warehouses/:warehouseID" element={<WarehouseDetail />} />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" replace />}
          />
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