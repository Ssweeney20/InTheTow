import { StarIcon } from '@heroicons/react/20/solid'
import Navbar from '../components/Navbar'
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import ReviewCard from '../components/ReviewCard';

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

    const { warehouseID } = useParams();
    const [isLoading, setisLoading] = useState(false);
    const [warehouse, setWarehouse] = useState(null);
    const [reviews, setReviews] = useState([])
    const [errorMessage, seterrorMessage] = useState('');

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

            await fetchReviews(warehouseID)

        } catch (error) {
            console.error(`error fetching warehouse: ${error}`);
            seterrorMessage("Error fetching warehouse, please try again later.");
        } finally {
            setisLoading(false);
        }
    }

    const fetchReviews = async (searchQuery = '') => {
        try {
            const endpoint = `${API_BASE_URL}reviews/warehouse/${encodeURIComponent(searchQuery)}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch reviews")
            }

            const data = await response.json();

            setReviews(data || []);

        } catch (error) {
            console.error(`error fetching reviews: ${error}`);
            seterrorMessage("Error fetching reviews, please try again later.");
        }
    }


    async function handleSubmitReview(e) {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError("");

        try {
            const form = new FormData(e.currentTarget);
            const payload = {
                warehouse: warehouse._id || warehouseID,
                rating: Number(form.get("rating")),
                safety: Number(form.get("safetyRating")),
                reviewText: String(form.get("text")).trim(),
                appointmentTime: form.get("appointmentTime")
                    ? new Date(form.get("appointmentTime"))
                    : null,
                startTime: form.get("startTime")
                    ? new Date(form.get("startTime"))
                    : null,
                endTime: form.get("endTime")
                    ? new Date(form.get("endTime"))
                    : null,
                hasLumper: form.has("hasLumper"),
                overnightParking: form.has("overnightParking"),
            };

            const res = await fetch(`${API_BASE_URL}reviews/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", accept: "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error(`Failed to add review (${res.status})`);

            // Optionally refresh the warehouse detail after posting:
            await fetchWarehouse(warehouseID);

            setIsReviewOpen(false);
            e.currentTarget.reset();
        } catch (err) {
            console.error(err);
            setSubmitError("Could not submit review. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    useEffect(() => {
        fetchWarehouse(warehouseID);
    }, [warehouseID]);

    return (
        <>
            <Navbar />

            {isLoading ? (
                <Spinner />
            ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : !warehouse ? (
                <p className="p-4 text-gray-700">No warehouse found.</p>
            ) : (
                <div className="bg-white">
                    <div className="pt-6">
                        {/* Image gallery (uses proxy or a placeholder) */}
                        <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
                            {/* Tall left */}
                            <img
                                alt={`${warehouse.name} photo`}
                                src={`/api/place-photo/${warehouse.googlePlaceId}`}
                                onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                                className="row-span-2 aspect-3/4 size-full rounded-lg object-cover max-lg:hidden"
                            />
                            {/* Two stacked on right */}
                            <img
                                alt={`${warehouse.name} photo`}
                                src={`/api/place-photo/${warehouse.googlePlaceId}?v=2`}
                                onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                                className="col-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
                            />
                            <img
                                alt={`${warehouse.name} photo`}
                                src={`/api/place-photo/${warehouse.googlePlaceId}?v=3`}
                                onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                                className="col-start-2 row-start-2 aspect-3/2 size-full rounded-lg object-cover max-lg:hidden"
                            />
                            {/* Mobile/primary */}
                            <img
                                alt={`${warehouse.name} photo`}
                                src={`/api/place-photo/${warehouse.googlePlaceId}?v=4`}
                                onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                                className="row-span-2 aspect-4/5 size-full object-cover sm:rounded-lg lg:aspect-3/4"
                            />
                        </div>

                        {/* Info grid */}
                        <div className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:px-8 lg:pt-16 lg:pb-24">
                            {/* Title + address (left) */}
                            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    {warehouse.name}
                                </h1>
                                <p className="mt-2 text-gray-700">
                                    {[warehouse.streetAddress, warehouse.city, warehouse.state, warehouse.zipCode]
                                        .filter(Boolean)
                                        .join(", ")}
                                </p>
                                {warehouse.phoneNumber && (
                                    <a
                                        href={`tel:${warehouse.phoneNumber.replace(/\D/g, "")}`}
                                        className="mt-1 inline-block text-sm text-indigo-600 hover:text-indigo-500"
                                    >
                                        {warehouse.phoneNumber}
                                    </a>
                                )}
                                {warehouse.googlePlaceId && (
                                    <div className="mt-1">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${warehouse.googlePlaceId}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-indigo-600 hover:text-indigo-500"
                                        >
                                            Open in Google Maps →
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Right column */}
                            <div className="mt-4 lg:row-span-3 lg:mt-0">
                                <h2 className="sr-only">Warehouse information</h2>

                                {/* Rating */}
                                <div className="mt-2">
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <StarIcon
                                                    key={i}
                                                    aria-hidden="true"
                                                    className={(Number(warehouse.avgRating) || 0) > i ? "size-5 text-indigo-600" : "size-5 text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-3 text-sm text-gray-700">
                                            {(warehouse.avgRating ?? "—")} avg · {(warehouse.numRatings ?? 0)} ratings
                                        </span>
                                    </div>
                                </div>

                                {/* Stat cards */}
                                <div className="mt-6 grid grid-cols-2 gap-3">

                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <div className="text-sm text-gray-600">Average Time at Dock</div>
                                        <div className="mt-1 text-lg font-semibold text-gray-900">
                                            {warehouse.avgTimeAtDock != null ? `${Math.round(warehouse.avgTimeAtDock)} minutes` : "—"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(warehouse.numTimeReports ?? 0)} time reports
                                        </div>
                                    </div>

                                    <div className="rounded-lg border border-gray-200 p-3">
                                        <div className="text-sm text-gray-600">Safety Score</div>
                                        <div className="mt-1 mb-2 flex text-lg font-semibold text-gray-900">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <StarIcon
                                                    key={i}
                                                    aria-hidden="true"
                                                    className={(warehouse.safetyScore || 0) > i ? "size-5 text-indigo-600" : "size-5 text-gray-200"}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(warehouse.numSafetyReports ?? 0)} reports
                                        </div>
                                    </div>

                                    <div className="col-span-2 rounded-lg border border-gray-200 p-3">
                                        <div className="text-sm text-gray-600">On-Time Appointments</div>
                                        <div className="mt-1 text-lg font-semibold text-gray-900">
                                            {warehouse.appointmentsOnTimePercentage != null
                                                ? `${Math.round(warehouse.appointmentsOnTimePercentage)}%`
                                                : "—"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {(warehouse.numAppointmentsReported ?? 0)} appointments
                                        </div>
                                    </div>

                                    {/* Add Review button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsReviewOpen(true)}
                                        className="mt-4 inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Add Review
                                    </button>

                                </div>
                            </div>

                            {/* Body (left, under title) */}
                            <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pt-6 lg:pr-8 lg:pb-16">
                                {/* Overview */}
                                <div>
                                    <h3 className="sr-only">Description</h3>
                                    <div className="space-y-6">
                                        <p className="text-base text-gray-900">
                                            Add more here
                                        </p>
                                    </div>
                                </div>

                                {/* Details (replace with fields you actually store) */}
                                <div className="mt-10">
                                    <h2 className="text-sm font-medium text-gray-900">Details</h2>
                                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                                        <p><span className="font-medium">Phone:</span> {warehouse.phoneNumber || "—"}</p>
                                    </div>
                                </div>

                                {/* Reviews*/}
                                <div className="mt-10">
                                    <h2 className="text-sm font-medium text-gray-900">Reviews</h2>
                                    <div className="mt-4 space-y-4">
                                        {(reviews ?? []).length === 0 ? (
                                            <p className="text-sm text-gray-600">No reviews yet.</p>
                                        ) : (
                                            <ul className="space-y-3">
                                                {(reviews ?? []).map((r, i) => (
                                                    <li key={r._id || i} className="rounded-md border border-gray-200 p-3">
                                                        <ReviewCard data={r ?? {}} />
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
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
                                    className="absolute inset-0 bg-black/50"
                                    onClick={() => setIsReviewOpen(false)}
                                />

                                {/* Panel */}
                                <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl
                    max-h-[85vh] flex flex-col">
                                    <div className="flex items-start justify-between p-5 border-b">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Share your experience
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => setIsReviewOpen(false)}
                                            className="ml-3 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                                            aria-label="Close"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmitReview} className="flex-1 overflow-y-auto p-5 space-y-4">
                                        {/* Rating */}
                                        <div>
                                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                                Rating (1–5)
                                            </label>
                                            <input
                                                id="rating"
                                                name="rating"
                                                type="number"
                                                min="1"
                                                max="5"
                                                step="1"
                                                required
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Appointment Time */}
                                        <div>
                                            <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700">
                                                Appointment Time
                                            </label>
                                            <input
                                                id="appointmentTime"
                                                name="appointmentTime"
                                                type="datetime-local"
                                                required
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                                            />
                                        </div>

                                        {/* Start Time */}
                                        <div>
                                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                                                Start of Docked Time
                                            </label>
                                            <input
                                                id="startTime"
                                                name="startTime"
                                                type="datetime-local"
                                                required
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                                            />
                                        </div>

                                        {/* End Time */}
                                        <div>
                                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                                                End of Docked Time (Departure)
                                            </label>
                                            <input
                                                id="endTime"
                                                name="endTime"
                                                type="datetime-local"
                                                required
                                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                                            />
                                        </div>

                                        {/* Safety Rating */}
                                        <div>
                                            <label htmlFor="safetyRating" className="block text-sm font-medium text-gray-700">
                                                Safety Rating (1–5)
                                            </label>
                                            <input
                                                id="safetyRating"
                                                name="safetyRating"
                                                type="number"
                                                min="1"
                                                max="5"
                                                step="1"
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* Text */}
                                        <div>
                                            <label htmlFor="text" className="block text-sm font-medium text-gray-700">
                                                Comments
                                            </label>
                                            <textarea
                                                id="text"
                                                name="text"
                                                rows={4}
                                                placeholder="Share your experience: wait time, staff, dock tips, etc."
                                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        {/* hasLumper */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <input
                                                    id="hasLumper"
                                                    name="hasLumper"
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                Lumper Fee Required?
                                            </label>
                                        </div>

                                        {/* overnightParking */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                                <input
                                                    id="overnightParking"
                                                    name="overnightParking"
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                Overnight Parking Available ?
                                            </label>
                                        </div>

                                        {submitError && (
                                            <p className="text-sm text-red-600">{submitError}</p>
                                        )}

                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsReviewOpen(false)}
                                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {submitting ? "Submitting…" : "Submit Review"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>



                    {/* Spacer */}
                    <div className="h-6" />
                </div >
            )
            }
        </>
    );
}
