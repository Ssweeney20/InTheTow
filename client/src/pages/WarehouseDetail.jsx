import { WarehouseImageGallery } from '../components/ImageGallery'
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import ReviewCard from '../components/ReviewCard';
import { useAuthContext } from '../hooks/useAuthContext';
import {
    Star,
    Clock,
    Shield,
    CheckCircle,
    MapPin,
    Phone,
    ExternalLink,
    Plus,
    X,
    Calendar,
    Camera,
    AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json'
    }
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function WarehouseDetail() {
    const { user } = useAuthContext()
    const { warehouseID } = useParams();
    const [isLoading, setisLoading] = useState(false);
    const [warehouse, setWarehouse] = useState(null);
    const [reviews, setReviews] = useState([])
    const [errorMessage, seterrorMessage] = useState('');
    const [page, setPage] = useState(1)
    const [totalReviews, setTotalReviews] = useState(0)

    {/* Add Review states */ }
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");


    const fetchWarehouse = async (searchQuery = '') => {
        setisLoading(true);
        seterrorMessage('');

        try {
            const endpoint = `${API_BASE_URL}warehouses/${encodeURIComponent(searchQuery)}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch warehouse")
            }

            const data = await response.json();

            setWarehouse(data || {});

        } catch (error) {
            console.error(`error fetching warehouse: ${error}`);
            seterrorMessage("Error fetching warehouse, please try again later.");
        } finally {
            setisLoading(false);
        }
    }

    const fetchReviews = async (searchQuery = '') => {
        try {
            const endpoint = `${API_BASE_URL}reviews/warehouse/${encodeURIComponent(searchQuery)}?page=${page}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch reviews")
            }

            const data = await response.json();

            setTotalReviews(data.total)

            setReviews(prev => [...prev, ...(data.reviews)]);

        } catch (error) {
            console.error(`error fetching reviews: ${error}`);
            seterrorMessage("Error fetching reviews, please try again later.");
        }
    }


    async function handleSubmitReview(e) {
        e.preventDefault();
        if (user) {
            setSubmitting(true);
            setSubmitError("");

            try {

                const fd = new FormData(e.currentTarget);

                fd.set("warehouse", warehouse?._id || warehouseID);

                // normalize booleans for checkboxes
                fd.set("hasLumper", fd.get("hasLumper") ? "true" : "false");
                fd.set("overnightParking", fd.get("overnightParking") ? "true" : "false");

                const res = await fetch(`${API_BASE_URL}reviews/`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${user.token}` },
                    body: fd,
                });

                if (!res.ok) throw new Error(`Failed to add review (${res.status})`);

                window.location.reload();
                return
                setIsReviewOpen(false);
                e.currentTarget.reset();
            } catch (err) {
                console.error(err);
                setSubmitError("Could not submit review. Please try again.");
            } finally {
                setSubmitting(false);
            }
        }
    }

    useEffect(() => {
        fetchWarehouse(warehouseID);
    }, [warehouseID]);

    useEffect(() => {
        fetchReviews(warehouseID);
    }, [page]);


    const photos = warehouse?.photoURLs ?? [];
    const placeholder = "/placeholder-image.jpg";
    const inTheTowScore = Math.round(warehouse?.inTheTowScore ?? 50)

    return (
        <div className="min-h-screen bg-gray-50">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spinner />
                </div>
            ) : errorMessage ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-700 text-center">{errorMessage}</p>
                        <button
                            onClick={() => fetchWarehouse(warehouseID)}
                            className="mt-4 w-full bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            ) : !warehouse ? (
                <div className="flex justify-center items-center min-h-screen">
                    <p className="text-gray-700 text-lg">No facility found.</p>
                </div>
            ) : (
                <div className="bg-white">
                    {/* Breadcrumb */}
                    <div className="bg-gray-50 border-b">
                        <div className="max-w-7xl mx-auto px-4 py-4">
                            <nav className="flex items-center space-x-2 text-sm">
                                <Link to="/" className="text-blue-600 hover:text-blue-700">Home</Link>
                                <span className="text-gray-400">/</span>
                                <Link to="/warehouses" className="text-blue-600 hover:text-blue-700">Warehouses</Link>
                                <span className="text-gray-400">/</span>
                                <span className="text-gray-700 font-medium">{warehouse.name}</span>
                            </nav>
                        </div>
                    </div>

                    <div className="pt-6">
                        {/* Image gallery */}
                        <WarehouseImageGallery photos={photos} warehouseName={warehouse.name} />

                        {/* Info grid */}
                        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                            {/* Title + address (left) */}
                            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {warehouse.name}
                                </h1>
                                <div className="mt-4 flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    <p className="text-lg">
                                        {[warehouse.streetAddress, warehouse.city, warehouse.state, warehouse.zipCode]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                                    {warehouse.phoneNumber && (
                                        <a
                                            href={`tel:${warehouse.phoneNumber.replace(/\D/g, "")}`}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            {warehouse.phoneNumber}
                                        </a>
                                    )}
                                    {warehouse.googlePlaceId && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${warehouse.googlePlaceId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Open in Google Maps
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Right column - Stats & Actions */}
                            <div className="mt-8 lg:row-span-3 lg:mt-0">
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Facility Stats</h2>

                                    {/* InTheTow Score */}
                                    {inTheTowScore && (
                                        <div className={`mb-6 p-4 rounded-lg ${
                                            inTheTowScore >= 85 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                                            inTheTowScore >= 60 ? 'bg-gradient-to-br from-green-500 to-green-600' :
                                                inTheTowScore >= 45 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                                                        inTheTowScore >= 38 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                                                            'bg-gradient-to-br from-red-500 to-red-600'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-xs font-medium text-white/90 uppercase tracking-wide mb-1">
                                                        InTheTow Score
                                                    </div>
                                                    <div className="text-sm text-white/80">
                                                        Based on {warehouse.numRatings || 0} reviews
                                                    </div>
                                                </div>
                                                <div className="text-5xl font-bold text-white">
                                                    {inTheTowScore}
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-white/20">
                                                <div className="text-xs text-white/90 font-medium">
                                                    {inTheTowScore >= 85 ? 'Excellent' :
                                                        inTheTowScore >= 60 ? 'Good' :
                                                            inTheTowScore >= 45 ? 'Average' :
                                                                inTheTowScore >= 38 ? 'Below average' :
                                                                    'Poor'}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div className="mb-6">
                                        <div className="flex items-center mb-2">
                                            <div className="flex items-center">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-5 w-5 ${(Number(warehouse.avgRating) || 0) > i
                                                            ? "text-yellow-500 fill-current"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="ml-3 text-sm text-gray-600">
                                                {((Math.round((Number(warehouse.avgRating) * 10)) / 10) ?? "—")} avg · {(warehouse.numRatings ?? 0)} ratings
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stat cards */}
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                            <div className="flex items-center mb-2">
                                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                                <div className="text-sm font-medium text-blue-900">Average Time at Dock</div>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {warehouse.avgTimeAtDock != null ? `${Math.round(warehouse.avgTimeAtDock)} minutes` : "—"}
                                            </div>
                                            <div className="text-xs text-blue-700">
                                                {(warehouse.numTimeReports ?? 0)} time reports
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                            <div className="flex items-center mb-2">
                                                <Shield className="h-5 w-5 text-green-600 mr-2" />
                                                <div className="text-sm font-medium text-green-900">Safety Score</div>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                {[0, 1, 2, 3, 4].map((i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-5 w-5 ${(warehouse.safetyScore || 0) > i
                                                            ? "text-green-500 fill-current"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-xs text-green-700">
                                                {(warehouse.numSafetyReports ?? 0)} safety reports
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                            <div className="flex items-center mb-2">
                                                <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
                                                <div className="text-sm font-medium text-purple-900">On-Time Appointments</div>
                                            </div>
                                            <div className="text-2xl font-bold text-purple-900">
                                                {reviews.length > 0
                                                    ? `${Math.round(warehouse.appointmentsOnTimePercentage)}%`
                                                    : "—"}
                                            </div>
                                            <div className="text-xs text-purple-700">
                                                {(warehouse.numAppointmentsReported ?? 0)} appointments tracked
                                            </div>
                                        </div>
                                    </div>

                                    {/* Add Review button */}
                                    {user && (
                                        <button
                                            type="button"
                                            onClick={() => setIsReviewOpen(true)}
                                            className="mt-6 w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Review
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Body (left, under title) */}
                            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                                {/* Details */}
                                <div className="mb-10">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Facility Details</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Phone:</span>
                                                <span>{warehouse.phoneNumber || "Not available"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reviews Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">Driver Reviews</h2>
                                        <span className="text-sm text-gray-500">
                                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                                        </span>
                                    </div>

                                    <div className="space-y-6">
                                        {(reviews ?? []).length === 0 ? (
                                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                                                <div className="text-gray-400 mb-2">No reviews yet</div>
                                                <p className="text-sm text-gray-600">Be the first to share your experience at this warehouse</p>
                                            </div>
                                        ) : (
                                            reviews.map((r, i) => (
                                                <div key={r._id || i}>
                                                    <ReviewCard data={r ?? {}} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    {/* Load More */}
                                    {reviews.length > 0 && page < Math.ceil(totalReviews / 5) && (
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
                                                {isLoading ? "Loading…" : "Load more reviews"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Add Review Modal */}
                        {isReviewOpen && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                                role="dialog"
                                aria-modal="true"
                            >
                                {/* Backdrop */}
                                <div
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                    onClick={() => setIsReviewOpen(false)}
                                />

                                {/* Panel */}
                                <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
                                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Share Your Experience
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Help fellow drivers with your insights
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIsReviewOpen(false)}
                                            className="ml-3 rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                            aria-label="Close"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitReview} className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {/* Rating */}
                                        <div>
                                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                                                Overall Rating (1–5) *
                                            </label>
                                            <input
                                                id="rating"
                                                name="rating"
                                                type="number"
                                                min="1"
                                                max="5"
                                                step="1"
                                                required
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                                            />
                                        </div>

                                        {/* Appointment Time */}
                                        <div>
                                            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline h-4 w-4 mr-1" />
                                                Appointment Time * <span className="ml-1 text-xs font-normal text-gray-500">
                                                    No appointment? Enter arrival time
                                                </span>
                                            </label>
                                            <input
                                                id="appointmentTime"
                                                name="appointmentTime"
                                                type="datetime-local"
                                                required
                                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                                            />
                                        </div>

                                        {/* Start Time */}
                                        <div>
                                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                <Clock className="inline h-4 w-4 mr-1" />
                                                Start of Docked Time *
                                            </label>
                                            <input
                                                id="startTime"
                                                name="startTime"
                                                type="datetime-local"
                                                required
                                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                                            />
                                        </div>

                                        {/* End Time */}
                                        <div>
                                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                End of Docked Time (Departure) *
                                            </label>
                                            <input
                                                id="endTime"
                                                name="endTime"
                                                type="datetime-local"
                                                required
                                                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                                            />
                                        </div>

                                        {/* Safety Rating */}
                                        <div>
                                            <label htmlFor="safety" className="block text-sm font-medium text-gray-700 mb-2">
                                                <Shield className="inline h-4 w-4 mr-1" />
                                                Safety Rating (1–5)
                                            </label>
                                            <input
                                                id="safety"
                                                name="safety"
                                                type="number"
                                                min="1"
                                                max="5"
                                                step="1"
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                                Comments
                                            </label>
                                            <textarea
                                                id="text"
                                                name="reviewText"
                                                rows={4}
                                                placeholder="Share your experience: wait time, staff, dock tips, parking, etc."
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none"
                                            />
                                        </div>

                                        {/* Photos */}
                                        <div>
                                            <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-2">
                                                <Camera className="inline h-4 w-4 mr-1" />
                                                Photos (up to 4)
                                            </label>
                                            <input
                                                id="photos"
                                                name="photos"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    if (e.target.files.length > 4) {
                                                        alert("You can only upload up to 4 photos.");
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                PNG, JPG, HEIC up to 8MB each
                                            </p>
                                        </div>

                                        {/* Checkboxes */}
                                        <div className="space-y-3 pt-2">
                                            <label className="flex items-center">
                                                <input
                                                    id="hasLumper"
                                                    name="hasLumper"
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Lumper fee required</span>
                                            </label>

                                            <label className="flex items-center">
                                                <input
                                                    id="overnightParking"
                                                    name="overnightParking"
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Overnight parking available</span>
                                            </label>
                                        </div>

                                        {submitError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                <p className="text-sm text-red-700">{submitError}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => setIsReviewOpen(false)}
                                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Submit Review"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
