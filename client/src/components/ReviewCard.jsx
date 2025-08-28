import React, { useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid';

const ReviewCard = (props) => {

    const review = props.data;

    // Calculate Load Duration
    const durationMs = new Date(review.endTime) - new Date(review.startTime);
    const durationMinutes = Math.round(durationMs / 1000 / 60);

    const hasLumper = review.hasLumper ? "Yes" : "No"
    const hasOvernight = review.overnightParking ? "Yes" : "No"

    // Calculate how early or late truck was seen in hours
    // Negative indicates seen early, positive indicates seen late
    const actualSeenMs = new Date(review.startTime) - new Date(review.appointmentTime);
    const actualSeenMinutes = Math.round(actualSeenMs / 1000 / 60);

    return (
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <div class="inline-block relative">
                    <div class="relative w-16 h-16 rounded-full overflow-hidden">
                        <img class="absolute top-0 left-0 w-full h-full bg-cover object-fit object-cover" src="profile-placeholder.svg" alt="Profile picture" />
                        <div class="absolute top-0 left-0 w-full h-full rounded-full shadow-inner"></div>
                    </div>
                    <svg class="fill-current text-white bg-green-600 rounded-full p-1 absolute bottom-0 right-0 w-6 h-6 -mx-1 -my-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M19 11a7.5 7.5 0 0 1-3.5 5.94L10 20l-5.5-3.06A7.5 7.5 0 0 1 1 11V3c3.38 0 6.5-1.12 9-3 2.5 1.89 5.62 3 9 3v8zm-9 1.08l2.92 2.04-1.03-3.41 2.84-2.15-3.56-.08L10 5.12 8.83 8.48l-3.56.08L8.1 10.7l-1.03 3.4L10 12.09z" />
                    </svg>
                </div>
            </div>
            <div class="ml-6">
                <p class="flex items-baseline">
                    <span class="text-gray-600 font-bold">{review.user}</span>
                    <span class="ml-2 text-green-600 text-xs">Verified Driver</span>
                </p>
                <div class="flex items-center mt-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <svg class={review.rating > i ? "w-4 h-4 fill-current text-yellow-600" : "w-4 h-4 fill-current text-gray-400"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                    ))}
                </div>
                <div className="flex items-center mt-4 text-gray-600 divide-x divide-gray-300">
                    <div className="flex items-center px-4">
                        <span className="text-sm">Time Docked:</span>
                        <div className="flex items-center ml-2">
                            <span className="text-sm">{durationMinutes} Minutes</span>
                        </div>
                    </div>

                    <div className="flex items-center px-4">
                        <span className="text-sm">Safety Rating:</span>
                        <div className="flex items-center ml-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <svg
                                    key={i}
                                    className={
                                        review.safety > i
                                            ? "w-3 h-3 fill-current text-yellow-600"
                                            : "w-3 h-3 fill-current text-gray-400"
                                    }
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                </svg>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center px-4">
                        <span className="text-sm">Time Seen:</span>
                        <div className="flex items-center ml-2">
                            <span className={`text-sm ${actualSeenMinutes <= 0 ? "text-green-600" : "text-red-600"}`}>{actualSeenMinutes === 0 ? "On Time": actualSeenMinutes <= 0 ? (`${Math.abs(actualSeenMinutes)} Minutes Early`) : (`${actualSeenMinutes} Minutes Late`)}</span>
                        </div>
                    </div>

                </div>
                <div class="mt-3">
                    <p class="mt-1">{review.reviewText}</p>
                </div>
                <div class="flex items-center justify-between mt-4 text-sm text-gray-600 fill-current">
                    <button class="flex items-center">
                        <span className="text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </button>
                    <div class="flex items-center">
                        <span>Was this review helplful?</span>
                        <button class="flex items-center ml-6">
                            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 0h1v3l3 7v8a2 2 0 0 1-2 2H5c-1.1 0-2.31-.84-2.7-1.88L0 12v-2a2 2 0 0 1 2-2h7V2a2 2 0 0 1 2-2zm6 10h3v10h-3V10z" /></svg>
                            <span class="ml-2">56</span>
                        </button>
                        <button class="flex items-center ml-4">
                            <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M11 20a2 2 0 0 1-2-2v-6H2a2 2 0 0 1-2-2V8l2.3-6.12A3.11 3.11 0 0 1 5 0h8a2 2 0 0 1 2 2v8l-3 7v3h-1zm6-10V0h3v10h-3z" /></svg>
                            <span class="ml-2">10</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewCard