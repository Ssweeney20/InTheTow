import React, { useEffect, useState } from "react";
import { useDebounce } from "react-use";

import Search from "../components/Search";
import Spinner from "../components/Spinner";
import WarehouseCard from "../components/WarehouseCard";
import { Warehouse, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
}

const WarehouseBrowser = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, seterrorMessage] = useState('');
    const [warehouseList, setwarehouseList] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)

    useDebounce(() => {
        setDebouncedSearchTerm(searchTerm)
    }, 500, [searchTerm])

    const fetchWarehouses = async (searchQuery = '') => {
        setisLoading(true);
        seterrorMessage('');

        try {
            const endpoint = searchQuery ? `${API_BASE_URL}warehouses/search?q=${encodeURIComponent(searchQuery)}&page=${page}` : `${API_BASE_URL}warehouses?page=${page}`

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch warehouses")
            }

            const data = await response.json();

            console.log(data)

            if (!Array.isArray(data.warehouses)) {
                seterrorMessage(data.Error || 'Failed to fetch warehouses');
                setwarehouseList([...warehouseList]);
                return;
            }

            if (Number.isInteger(data.total)){
                setTotalResults(data.total)
            }

            setwarehouseList(prev => [...prev, ...(data.warehouses)]);

        } catch (error) {
            console.error(`error fetching warehouse: ${error}`);
            seterrorMessage("Error fetching warehouses, please try again later.");
        } finally {
            setisLoading(false);
        }
    }

    useEffect(() => {
        fetchWarehouses(debouncedSearchTerm);
    }, [debouncedSearchTerm, page]);

    useEffect(() => {
        setwarehouseList([])
        setPage(1)
    }, [debouncedSearchTerm]);

    console.log(debouncedSearchTerm)

    console.log("total pages ", Math.ceil(totalResults / 5))

    console.log(page)
    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Header Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-16 md:py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                                <Warehouse className="h-16 w-16 text-white" />
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Saving Truckers <span className="text-blue-200">Time</span> at Every Stop
                        </h1>

                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Find warehouses with real reviews, dock times, and facility details from fellow drivers
                        </p>

                        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 max-w-lg mx-auto">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{totalResults}</div>
                                <div className="text-blue-200 text-sm">Warehouses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">45k+</div>
                                <div className="text-blue-200 text-sm">Reviews</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">15k+</div>
                                <div className="text-blue-200 text-sm">Drivers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-12">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Results Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {searchTerm ? `Search Results for "${searchTerm}"` : 'All Warehouses'}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {isLoading ? 'Searching...' : `${warehouseList.length} / ${totalResults} warehouses found`}
                            </p>
                        </div>

                        {/* Filter/Sort Options - placeholder for future */}
                        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Sort by relevance</option>
                                <option>Highest rated</option>
                                <option>Most reviews</option>
                                <option>Fastest dock times</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center py-12">
                            <Spinner />
                        </div>
                    )}

                    {/* Error State */}
                    {errorMessage && (
                        <div className="text-center py-12">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                                <p className="text-red-600">{errorMessage}</p>
                                <button
                                    onClick={() => fetchWarehouses(debouncedSearchTerm)}
                                    className="mt-3 text-red-700 hover:text-red-800 font-medium"
                                >
                                    Try again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* No Results State */}
                    {!isLoading && !errorMessage && warehouseList.length === 0 && (
                        <div className="text-center py-16">
                            <Warehouse className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900 mb-2">No warehouses found</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm
                                    ? `No warehouses match "${searchTerm}". Try a different search term.`
                                    : 'No warehouses are available right now.'
                                }
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Clear search and show all
                                </button>
                            )}
                        </div>
                    )}

                    {/* Results Grid */}
                    {!errorMessage && warehouseList.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {warehouseList.map((warehouse) => (
                                <Link
                                    key={warehouse._id}
                                    to={`/warehouses/${warehouse._id}`}
                                    className="block"
                                >
                                    <WarehouseCard warehouse={warehouse} />
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {!isLoading && warehouseList.length > 0 && page < Math.ceil(totalResults / 5) &&(
                        <div className="text-center mt-12">
                            <button 
                            type="button"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setPage(prev => prev + 1)
                            }}
                            disabled={isLoading}
                            className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                {isLoading ? "Loading…" : "Load more warehouses"}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default WarehouseBrowser;

