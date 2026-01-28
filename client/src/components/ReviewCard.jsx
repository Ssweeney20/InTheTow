import React from 'react'
import { Star, Clock, Shield, CheckCircle, ThumbsUp, ThumbsDown, User, Plus, X, AlertCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ReviewImageGallery } from './ImageGallery';
import ReviewQuestionsSection from './ReviewQuestionsSection';
import { useAuthContext } from '../hooks/useAuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    }
};

const ReviewCard = (props) => {

    const { user: currUser } = useAuthContext()

    const review = props.data;
    const questions = review.questions
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
    const [isQuestionOpen, setIsQuestionOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

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

    async function handleSubmitQuestion(e) {

        e.preventDefault();

        if (currUser) {
            setSubmitting(true);
            setSubmitError("");

            try {
                const fd = new FormData(e.currentTarget);
                const questionText = fd.get("questionText").toString();
                const reviewID = review._id
                const originalReviewAuthor = review.user


                if (!questionText) {
                    setSubmitError("Question cannot be empty.");
                    return;
                }

                const res = await fetch(`${API_BASE_URL}reviews/${review._id}/questions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currUser.token}`
                    },
                    body: JSON.stringify({
                        questionText,
                        reviewID,
                        originalReviewAuthor,
                    }),
                });

                if (!res.ok) throw new Error(`Failed to ask question (${res.status})`);

                window.location.reload();
                return

            } catch (err) {
                console.error(err);
                setSubmitError("Could not submit question. Please try again.");
            } finally {
                setSubmitting(false);
            }
        }
    }

    useEffect(() => {
        fetchUser()
    }, [userID])

    const displayName = user?.displayName ?? review.userDisplayName ?? "Unknown";

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
                    <ReviewImageGallery photos={photos} reviewId={review._id || 'review'} />
                </div>
            )}

            {/* Questions Section  */}
            {review.questions && review.questions.length > 0 && (
                <ReviewQuestionsSection
                    questions={review.questions}
                    reviewId={review._id}
                    reviewAuthorId={userID}
                    currentUserId={currUser?.userID}
                />
            )}

            {/* Ask Question Button  */}

            {currUser && currUser.userID != userID && (
                <button
                    onClick={() => setIsQuestionOpen(!isQuestionOpen)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                    <MessageCircle className="w-4 h-4" />
                    Ask Question
                </button>
            )}

            {/* Ask Question Modal */}
            {isQuestionOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsQuestionOpen(false)}
                    />

                    {/* Panel */}
                    <div className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-start justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Ask this driver a question
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Help fellow drivers with your specific questions to drivers who've already been there
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsQuestionOpen(false)}
                                className="ml-3 rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                aria-label="Close"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitQuestion} className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Text */}
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                                    Question
                                </label>
                                <textarea
                                    id="text"
                                    name="questionText"
                                    rows={4}
                                    placeholder="Ask your question here!"
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-colors resize-none"
                                />
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
                                    onClick={() => setIsQuestionOpen(false)}
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
                                        "Ask Question"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )
}

export default ReviewCard