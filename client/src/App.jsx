import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json'
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  const [warehouseList, setwarehouseList] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchWarehouses = async () => {
    setisLoading(true);
    seterrorMessage('');

    try {
      const endpoint = `${API_BASE_URL}warehouses`
      
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok){
        throw new Error("Failed to fetch warehouses")
      }

      const data = await response.json();
      console.log(data);

      if (!Array.isArray(data)){
        seterrorMessage(data.Error || 'Failed to fetch warehouses');
        setwarehouseList([]);
        return;
      }

      setwarehouseList(data|| []);

    } catch (error) {
      console.error(`error fetching warehouse: ${error}`);
      seterrorMessage("Error fetching warehouses, please try again later.");
    } finally {
      setisLoading(true);
    }
  }

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./warehouse.png" className="w-[300px] h-[300px]" alt="Warehouse"></img>
          <h1>Saving Truckers <span className="text-gradient">Time</span> at Every Stop</h1>

          <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
        </header>

        <section className="all-warehouses">
          <h2>All Warehouses</h2>

          {isLoading ? (
            <Spinner/>
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ): (
            <ul>
              {warehouseList.map((warehouse) => (
                <p key = {warehouse._id} className="text-white">{warehouse.name}</p>
              ))}
            </ul>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </section>

      </div>
    </main>
  );
}

export default App;