// src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/warehouses');
        // if your controller does `res.json(list)`, `data` *is* the array
        setWarehouses(data);
      } catch (err) {
        console.error('Failed to fetch warehouses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  if (loading) return <p>Loading warehouses…</p>;

  return (
    <div className="App">
      <h1>Warehouses</h1>
      {warehouses.length === 0 ? (
        <p>No warehouses found.</p>
      ) : (
        <ul>
          {warehouses.map((wh) => (
            <li key={wh._id}>
              <strong>{wh.name}</strong><br/>
              <em>{wh.address}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;