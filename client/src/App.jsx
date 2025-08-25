import './index.css'
import {HashRouter as Router, Routes, Route} from 'react-router-dom'
import WarehouseBrowser from './pages/WarehouseBrowser';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/warehouses" element={<WarehouseBrowser/>}/>
        </Routes>
    </Router>    
  )
}

export default App;