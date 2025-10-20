import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Users, Target, Shield, Mail, Heart, TrendingUp, MessageCircle } from 'lucide-react';
import { useAuthContext } from '../hooks/useAuthContext';

export default function AboutPage() {
    const { user } = useAuthContext()

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                            Built for truckers. We're on a mission to make every warehouse visit more predictable and less stressful.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>

                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p className="mb-6">
                            Founded after years of firsthand experience at a warehouse distribution center, where I often heard truck drivers’ stories of long waits, miscommunication, and poor conditions at loading docks. Those conversations highlighted a clear need for greater transparency in the trucking industry.
                        </p>

                        <p className="mb-6">
                            InTheTow was created to meet that need, a community driven platform where drivers share reviews and insights about warehouses nationwide. By helping drivers plan ahead, avoid delays, and know what to expect before they arrive, InTheTow brings more efficiency and accountability to every stop on the road.
                        </p>

                        <p>
                            Today, InTheTow continues to evolve as a trusted resource for drivers seeking greater efficiency, accountability, and transparency throughout the industry.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Mission & Values</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission</h3>
                            <p className="text-gray-600">
                                Empower drivers with accurate information to make every delivery smoother and more predictable.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Community First</h3>
                            <p className="text-gray-600">
                                We believe in the power of truckers helping truckers. Every review makes the community stronger.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Trust & Transparency</h3>
                            <p className="text-gray-600">
                                Honest reviews from verified drivers. No corporate influence, just real experiences.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Always Improving</h3>
                            <p className="text-gray-600">
                                We continuously evolve based on driver feedback to serve you better every day.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How InTheTow Works</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Search Warehouses</h3>
                            <p className="text-gray-600">
                                Find warehouses by name, location, or company. See real reviews and metrics before you arrive.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Visit & Experience</h3>
                            <p className="text-gray-600">
                                Make your delivery with insights from fellow drivers about dock times, parking, and facilities.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Share Your Review</h3>
                            <p className="text-gray-600">
                                Help the next driver by posting your experience. Every review makes the community stronger.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact/CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <MessageCircle className="h-12 w-12 text-blue-200 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Have questions, feedback, or want to partner with us? We'd love to hear from you.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:inthetow@gmail.com"
                            className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <Mail className="h-5 w-5 mr-2" />
                            Contact Us
                        </a>
                        {!user &&
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Join the Community
                            </Link>}
                    </div>

                    <div className="mt-8 text-blue-100">
                        <p>Email: inthetow@gmail.com</p>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-8 bg-gray-900 text-gray-400 text-center text-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <p>© 2025 InTheTow. </p>
                </div>
            </section>
        </div>
    );
}