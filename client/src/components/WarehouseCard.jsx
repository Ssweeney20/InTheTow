import React from 'react'
import { Star, Clock, MapPin, CheckCircle } from 'lucide-react'

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
        inTheTowScore = 50,
    } = warehouse;

    const topPhoto = photoURLs?.[0]

    // color coding
    const getScoreColor = (score) => {
        if (score >= 85) return 'from-yellow-500 to-yellow-600';
        if (score >= 60) return 'from-green-500 to-green-600';
        if (score >= 45) return 'from-blue-500 to-blue-600';
        if (score >= 38) return 'from-orange-500 to-orange-600';
        return 'from-red-500 to-red-600';
    };

    // score ranking
    const getScoreRanking = (score) => {
        if (score >= 85) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 45) return 'Average';
        if (score >= 38) return 'Below Average';
        return 'Poor';
    }
    
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
            </div>

            {/* Content */}
            <div className='p-5'>
                {/* Header with Score Card */}
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                            {name}
                        </h3>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <p className="text-sm line-clamp-1">{city}, {state}</p>
                        </div>
                    </div>
                    
                    {/* InTheTow Score */}
                    <div className={`flex-shrink-0 bg-gradient-to-br ${getScoreColor(Math.round(inTheTowScore))} text-white rounded-lg px-3 py-1 shadow-md`}>
                        <div className="text-xs font-medium opacity-70 text-center">Overall Score</div>
                        <div className="text-3xl font-bold leading-none text-center">{Math.round(inTheTowScore)}</div>
                        <div className="text-xs font-medium opacity-80 text-center">{getScoreRanking(Math.round(inTheTowScore))}</div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                        <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-xs text-gray-600 mb-1">Avg Dock Time</div>
                        <div className="text-sm font-semibold text-gray-900">
                            {avgTimeAtDock ? `${Math.round(avgTimeAtDock)} min` : 'N/A'}
                        </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <div className="text-xs text-gray-600 mb-1">On-Time Rate</div>
                        <div className="text-sm font-semibold text-gray-900">
                            {appointmentsOnTimePercentage ? `${Math.round(appointmentsOnTimePercentage)}%` : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Footer */}
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