import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

// Main Image Gallery Component for Warehouse Detail
export const WarehouseImageGallery = ({ photos, warehouseName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const placeholder = "/placeholder-image.jpg";
    const displayPhotos = photos.length > 0 ? photos : [placeholder];

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % displayPhotos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
    };

    // console.log(displayPhotos)

    return (
        <>
            {/* Gallery Grid */}
            <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-4 lg:gap-4 lg:px-8">
                {/* Main large image */}
                <div className="lg:col-span-1 lg:row-span-1">
                    <button
                        onClick={() => openModal(0)}
                        className="group relative w-full h-80  overflow-hidden rounded-xl bg-gray-100 hover:opacity-90 transition-opacity"
                    >
                        <img
                            src={displayPhotos[0]}
                            alt={`${warehouseName} - Main view`}
                            onError={(e) => (e.currentTarget.src = placeholder)}
                            className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {displayPhotos.length > 1 && (
                            <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                                +{displayPhotos.length - 1} more
                            </div>
                        )}
                    </button>
                </div>

                {/* Thumbnail grid */}
                <div className="hidden lg:grid lg:col-span-3 lg:grid-cols-2 lg:gap-4 justify-items-center">
                    {displayPhotos.slice(1, 3).map((photo, index) => (
                        <button
                            key={index + 1}
                            onClick={() => openModal(index + 1)}
                            className="group relative h-80 w-full overflow-hidden rounded-xl bg-gray-100 hover:opacity-90 transition-opacity"
                        >
                            <img
                                src={photo}
                                alt={`${warehouseName} - View ${index + 2}`}
                                onError={(e) => (e.currentTarget.src = placeholder)}
                                className="h-full w-full object-cover"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {index === 3 && displayPhotos.length > 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold">
                                    +{displayPhotos.length - 5}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile thumbnail strip */}
            <div className="mt-4 px-4 sm:px-6 lg:hidden">
                <div className="flex space-x-3 overflow-x-auto pb-2">
                    {displayPhotos.slice(1).map((photo, index) => (
                        <button
                            key={index + 1}
                            onClick={() => openModal(index + 1)}
                            className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                        >
                            <img
                                src={photo}
                                alt={`${warehouseName} thumbnail ${index + 2}`}
                                onError={(e) => (e.currentTarget.src = placeholder)}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ImageModal
                    photos={displayPhotos}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsModalOpen(false)}
                    onNext={nextImage}
                    onPrev={prevImage}
                    altPrefix={`${warehouseName} - View`}
                />
            )}
        </>
    );
};

// Compact Image Gallery for Reviews
export const ReviewImageGallery = ({ photos, reviewId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!photos || photos.length === 0) return null;

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    return (
        <>
            <div className="grid grid-cols-4 gap-2">
                {photos.slice(0, 4).map((url, i) => (
                    <button
                        key={i}
                        onClick={() => openModal(i)}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
                    >
                        <img
                            src={url}
                            alt={`Review photo ${i + 1}`}
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            className="h-full w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                            <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {i === 3 && photos.length > 4 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                                +{photos.length - 4}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {photos.length > 4 && (
                <p className="mt-2 text-xs text-gray-500">
                    {photos.length} photos total
                </p>
            )}

            {isModalOpen && (
                <ImageModal
                    photos={photos}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsModalOpen(false)}
                    onNext={nextImage}
                    onPrev={prevImage}
                    altPrefix="Review photo"
                />
            )}
        </>
    );
};

// Reusable Image Modal Component
const ImageModal = ({ photos, currentIndex, onClose, onNext, onPrev, altPrefix }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') onPrev();
        if (e.key === 'ArrowRight') onNext();
    };

    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                aria-label="Close gallery"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Navigation arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={onPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={onNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-colors"
                        aria-label="Next image"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Image container */}
            <div className="relative max-w-7xl max-h-full mx-4 flex items-center justify-center">
                <img
                    src={photos[currentIndex]}
                    alt={`${altPrefix} ${currentIndex + 1}`}
                    className="max-w-full max-h-[90vh] object-contain"
                    onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                />
            </div>

            {/* Image counter */}
            {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
                    {currentIndex + 1} / {photos.length}
                </div>
            )}

            {/* Thumbnail strip for quick navigation */}
            {photos.length > 1 && photos.length <= 10 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 p-2 rounded-lg">
                    {photos.map((photo, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === currentIndex
                                    ? 'border-white scale-110'
                                    : 'border-transparent opacity-70 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={photo}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};