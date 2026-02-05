import { useEffect } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import WarehouseCard from "./WarehouseCard"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function ActiveFacilities() {
    const [activeFacilities, setActiveFacilities] = useState([])

    const fetchActiveFacilities = async () => {

        try {
            const endpoint = `${API_BASE_URL}warehouses/active-warehouses`
            const response = await fetch(endpoint)

            if (!response.ok) {
                throw new Error('Unable to Fetch Active Facilities')
            }

            const wh = await response.json()

            setActiveFacilities(wh)

        }
        catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => {
        fetchActiveFacilities()
    }, [])

    if (!activeFacilities || activeFacilities.length === 0) {
        return null
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h2 className="text-3xl font-bold text-gray-900">
                                Today's Active Facilities
                            </h2>
                        </div>
                        <p className="text-gray-600">
                            Facilities with the most driver feedback
                        </p>
                    </div>
                    <Link
                        to="/warehouses"
                        className="hidden md:inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        View all facilities
                        <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Warehouse Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                    {activeFacilities.map((warehouse) => (
                        <Link
                            key={warehouse._id}
                            to={`/warehouses/${warehouse._id}`}
                            className="block"
                        >
                            <WarehouseCard warehouse={warehouse} activeFacilitySection={true} />
                        </Link>
                    ))}
                </div>

                {/* Mobile "View All" Button */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/warehouses"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        View all facilites
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}