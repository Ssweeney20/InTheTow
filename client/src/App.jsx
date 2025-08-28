import './index.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import WarehouseBrowser from './pages/WarehouseBrowser';
import HomePage from './pages/HomePage';
import WarehouseDetail from './pages/WarehouseDetail';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/warehouses" element={<WarehouseBrowser/>}/>
            <Route path="/warehouses/:warehouseID" element={<WarehouseDetail/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
        </Routes>
    </Router>    
  )
}

export default App;