import React from 'react'
import { Star, Clock, Shield, CheckCircle, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    }
};

const ReviewCard = (props) => {

    const review = props.data;
    const photos = review.photoURLs
    const userID = review.user

    // Calculate Load Duration
    const durationMs = new Date(review.endTime) - new Date(review.startTime);
    const durationMinutes = Math.round(durationMs / 1000 / 60);

    const hasLumper = review.hasLumper ? "Yes" : "No"
    const hasOvernight = review.overnightParking ? "Yes" : "No"

    // Calculate how early or late truck was seen in hours
    // Negative indicates seen early, positive indicates seen late
    const actualSeenMs = new Date(review.startTime) - new Date(review.appointmentTime);
    const actualSeenMinutes = Math.round(actualSeenMs / 1000 / 60);

    const [user, setUser] = useState(null)

    const fetchUser = async () => {

        const API_OPTIONS = {
            method: 'GET',
            headers: {
                accept: 'application/json'
            }
        }

        try {
            const endpoint = `${API_BASE_URL}user/${userID}`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch user")
            }

            const data = await response.json();

            setUser(data || {});

        } catch (error) {
            console.error(`error fetching user: ${error}`);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [userID])

    const displayName = user?.displayName ?? review.userDisplayName ?? "Test";


    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header with user info and rating */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            {user?.photoURL ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={user.photoURL}
                                    alt="Profile picture"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                            )}
                        </div>
                        {/* Verified badge */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-900">{displayName}</p>
                        <p className="text-sm text-green-600 font-medium">Verified Driver</p>
                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Overall Rating */}
                <div className="flex items-center space-x-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${review.rating > i ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Time Docked</div>
                    <div className="text-sm font-semibold text-gray-900">{durationMinutes} min</div>
                </div>

                <div className="bg-green-50 rounded-lg p-3 text-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Punctuality</div>
                    <div className={`text-sm font-semibold ${actualSeenMinutes <= 0 ? "text-green-700" : "text-red-700"}`}>
                        {actualSeenMinutes === 0 ? "On Time" : actualSeenMinutes <= 0 ? `${Math.abs(actualSeenMinutes)}m Early` : `${actualSeenMinutes}m Late`}
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                    <Shield className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600">Safety</div>
                    <div className="flex justify-center space-x-0.5 mt-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${review.safety > i ? "text-yellow-500 fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Review text */}
            <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
            </div>

            {/* Additional info tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {review.hasLumper && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Lumper Fee Required
                    </span>
                )}
                {review.overnightParking && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Overnight Parking Available
                    </span>
                )}
            </div>

            {/* Photos */}
            {photos && photos.length > 0 && (
                <div className="mb-4">
                    <div className="grid grid-cols-4 gap-2">
                        {photos.slice(0, 4).map((url, i) => (
                            <div
                                key={url + i}
                                className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                            >
                                <img
                                    loading="lazy"
                                    src={url}
                                    alt={`Review photo ${i + 1}`}
                                    className="h-full w-full object-cover hover:scale-105 transition-transform cursor-pointer"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        ))}
                    </div>
                    {photos.length > 4 && (
                        <p className="mt-2 text-xs text-gray-500">
                            +{photos.length - 4} more photos
                        </p>
                    )}
                </div>
            )}

            {/* Footer with helpful votes */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                    Was this review helpful?
                </div>
                <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-green-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">56</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm">10</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard