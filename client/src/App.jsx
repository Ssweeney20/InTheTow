import './index.css'
import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';

import WarehouseBrowser from './pages/WarehouseBrowser';
import HomePage from './pages/HomePage';
import WarehouseDetail from './pages/WarehouseDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyReviewPage from './pages/MyReviewPage';

function App() {
  const { user } = useAuthContext()

  return (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/warehouses" element={<WarehouseBrowser/>}/>
            <Route path="/warehouses/:warehouseID" element={<WarehouseDetail/>}/>
            <Route path="/login" element={!user ? <LoginPage/> : <Navigate to="/"/>}/>
            <Route path="/signup" element={!user ? <SignupPage/> : <Navigate to="/"/> }/>
            <Route path="/reviews" element={user ? <MyReviewPage/> : <Navigate to="/"/> }/>
        </Routes> 
    </Router>    
  )
}

export default App;