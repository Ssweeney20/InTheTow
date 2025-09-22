import { useAuthContext } from '../hooks/useAuthContext';
import { useEffect, useState } from 'react';

import Navbar from '../components/Navbar'
import ReviewCard from '../components/ReviewCard';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyReviewPage = () => {
    const { user } = useAuthContext()
    const [reviews, setReviews] = useState([])

    const fetchReviews = async () => {

        const API_OPTIONS = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                "Authorization": `Bearer ${user.token}`
            }
        }

        try {
            const endpoint = `${API_BASE_URL}reviews/user`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch reviews")
            }

            const data = await response.json();

            setReviews(data || []);

        } catch (error) {
            console.error(`error fetching reviews: ${error}`);
        }
    }

    useEffect(() => {
      fetchReviews();
    }, [])
    

    return (
        <>
            <div className="min-h-screen bg-white">
                <div className="w-full px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
                    <div className="mt-10">
                        <h2 className="text-sm font-medium text-gray-900">My Reviews</h2>
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
        </>
    )
}

export default MyReviewPage