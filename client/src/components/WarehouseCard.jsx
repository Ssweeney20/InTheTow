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
    } = warehouse;

    

    return (
        
        <div className='warehouse-card'>
            <img src='placeholder-image.jpg'/>

            <div className='mt-4'>
                <h3>{name}</h3>

                <div className='content'>
                    <div className='rating'>
                        <img src='star.svg' alt="Star Icon"/>
                        <p>{avgRating ? avgRating.toFixed(1) : ' N/A'}</p>
                    </div>

                    <span>●</span>

                    <p className='detail'>{streetAddress}, {city}, {state}</p>

                    <p className='detail'>Average Time at Dock : {avgTimeAtDock} Minutes</p>

                </div>
            </div>

        </div>
    )
}

export default WarehouseCard