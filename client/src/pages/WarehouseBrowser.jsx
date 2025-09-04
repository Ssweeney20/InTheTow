import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import Search from "../components/Search";
import Spinner from "../components/Spinner";
import WarehouseCard from "../components/WarehouseCard";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
}

const warehouseBrowser = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, seterrorMessage] = useState('');
    const [warehouseList, setwarehouseList] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useDebounce(() => {
        setDebouncedSearchTerm(searchTerm)
    }, 500, [searchTerm])

    const fetchWarehouses = async (searchQuery = '') => {
        setisLoading(true);
        seterrorMessage('');

        try {
            const endpoint = searchQuery ? `${API_BASE_URL}warehouses/search?q=${encodeURIComponent(searchQuery)}` : `${API_BASE_URL}warehouses`

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch warehouses")
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                seterrorMessage(data.Error || 'Failed to fetch warehouses');
                setwarehouseList([]);
                return;
            }

            setwarehouseList(data || []);

        } catch (error) {
            console.error(`error fetching warehouse: ${error}`);
            seterrorMessage("Error fetching warehouses, please try again later.");
        } finally {
            setisLoading(false);
        }
    }

    useEffect(() => {
        fetchWarehouses(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <main>
            <Navbar data = "Warehouses"/>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="./warehouse.png" className="w-[300px] h-[300px]" alt="Warehouse"></img>
                    <h1>Saving Truckers <span className="text-gradient">Time</span> at Every Stop</h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                <section className="all-warehouses">
                    <h2 className="mt-[40px]">Warehouses </h2>

                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {warehouseList.map((warehouse) => (
                                <Link to={`${warehouse._id}`}>
                                    <WarehouseCard key={warehouse._id} warehouse={warehouse} />
                                </Link>
                            ))}
                        </ul>
                    )}

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </section>

            </div>
        </main>
    );
}

export default warehouseBrowser;

