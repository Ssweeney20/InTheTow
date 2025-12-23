import React from 'react'
import { Star, Clock, MapPin, CheckCircle, Shield } from 'lucide-react'

const WarehouseCard = ({ warehouse }) => {
    const {
        _id,
        name,
        streetAddress,
        city,
        state,
        zipCode,
        phoneNumber,
        reviews,
        avgRating,
        safetyScore,
        avgTimeAtDock,
        appointmentsOnTimePercentage,
        numRatings,
        googlePlaceId,
        photoURLs,
    } = warehouse;

    const topPhoto = photoURLs?.[0]

    return (
        <div className='group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1'>
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100">
                <img
                    src={topPhoto ? topPhoto : "placeholder-image.jpg"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    alt={`${name} warehouse`}
                    onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                />

                {/* Rating Badge */}
                {reviews.length > 0 && numRatings > 0 && avgRating && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold text-gray-900">
                            {avgRating.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* Safety Score Badge */}
                {reviews.length > 0 && numRatings > 0 && safetyScore && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-gray-900">
                            {safetyScore.toFixed(1)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className='p-5'>
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {name}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <p className="text-sm">{streetAddress}, {city}, {state}</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-gray-600 mb-1">Avg Dock Time</div>
                        <div className="text-sm font-semibold text-gray-900">
                            {avgTimeAtDock ? `${Math.round(avgTimeAtDock)} min` : 'N/A'}
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs text-gray-600 mb-1">On-Time Rate</div>
                        <div className="text-sm font-semibold text-gray-900">
                            {reviews.length  ? `${Math.round(appointmentsOnTimePercentage)}%` : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Reviews Count */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{numRatings ? `${numRatings} reviews` : 'No reviews yet'}</span>
                    <span className="text-blue-600 font-medium group-hover:text-blue-700">
                        View Details →
                    </span>
                </div>
            </div>
        </div>
    )
}

export default WarehouseCard