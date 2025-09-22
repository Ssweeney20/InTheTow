import React from 'react'

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
        
        <div className='warehouse-card'>
            <img src={topPhoto ? topPhoto : "placeholder-image.jpg"} className="w-64 h-64 object-cover rounded-md"/>

            <div className='mt-4'>
                <h3>{name}</h3>

                <div className='content'>
                    <div className='rating'>
                        <img src='star.svg' alt="Star Icon"/>
                        <p>{avgRating ? avgRating.toFixed(1) : ' N/A'}</p>
                    </div>

                    <span>●</span>

                    <p className='detail'>{streetAddress}, {city}, {state}</p>

                    <p className='detail'>Average Time at Dock : {Math.round(avgTimeAtDock)} Minutes</p>

                </div>
            </div>

        </div>
    )
}

export default WarehouseCard