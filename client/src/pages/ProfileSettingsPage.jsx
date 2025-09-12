import { useAuthContext } from '../hooks/useAuthContext';
import { useState, useEffect } from 'react';

import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AccountSettingsPage() {
    const { user } = useAuthContext()
    const [profile, setProfile] = useState(null)

    const fetchUser = async () => {

        const API_OPTIONS = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                "Authorization": `Bearer ${user.token}`
            }
        }

        try {
            const endpoint = `${API_BASE_URL}user/`;

            const response = await fetch(endpoint, API_OPTIONS);
            if (!response.ok) {
                throw new Error("Failed to fetch user")
            }

            const data = await response.json();

            setProfile(data || {});

        } catch (error) {
            console.error(`error fetching user: ${error}`);
        }
    }

    useEffect(() => {
        fetchUser()
    }, [user?.token])


    console.log(profile)

    return (
        <>
            <Navbar />
            <main className="min-h-screen w-full bg-white">
                <div className="mx-auto max-w-3xl px-6 py-2">
                    {!profile ? (
                        <p className="text-sm text-gray-500">Loading profile…</p>) :
                        (
                            <>
                                {/* Header */}
                                <header className="mb-12">
                                    <h1 className="text-3xl font-semibold text-gray-900">My Account</h1>
                                </header>

                                {/* Profile */}
                                <section className="mb-12">
                                    <h2 className="mb-6 text-xl font-semibold text-gray-900">{profile.displayName}</h2>

                                    {/* Avatar row */}
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm font-medium text-gray-900">
                                            Avatar
                                        </label>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <img
                                                className="h-16 w-16 rounded-full object-cover"
                                                src={profile.profilePicture || "profile-placeholder.svg"}
                                                alt="Current avatar"
                                            />
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                            >
                                                {/* Upload icon */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 5v10M8.5 8.5L12 5l3.5 3.5" />
                                                    <path d="M4 20h16" />
                                                </svg>
                                                Upload
                                            </button>
                                            <p className="basis-full text-sm text-gray-500">
                                                For best results, upload an image 512×512 or larger.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Name fields */}
                                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-gray-900">Display name</span>
                                            <input
                                                placeholder="Josef"
                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                            />
                                        </label>
                                    </div>

                                </section>

                                {/* Divider */}
                                <hr className="my-12 border-gray-200" />

                                {/* Password */}
                                <section className="mb-12">
                                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Password</h2>

                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-900">
                                            Current password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter current password"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-1 block text-sm font-medium text-gray-900">
                                            New password
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Enter new password"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                        />
                                        <p className="mt-2 text-sm text-gray-500">
                                            Your password must have at least 8 characters, include one uppercase
                                            letter, and one number.
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="sr-only" htmlFor="retype">
                                            Re-type new password
                                        </label>
                                        <input
                                            id="retype"
                                            type="password"
                                            placeholder="Re-type new password"
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600/90 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                                    >
                                        Change password
                                    </button>
                                </section>

                                {/* Divider */}
                                <hr className="my-12 border-gray-200" />

                                {/* Danger Zone */}
                                <section className="mb-24">
                                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Danger zone</h2>
                                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-sm font-semibold text-red-900">Delete account</h3>
                                                <p className="mt-1 text-sm text-red-700">
                                                    Permanently remove your account. This action is not reversible.
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-lg border border-red-300 bg-transparent px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                            >
                                                Delete account
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </>
                        )}
                </div>
            </main>
        </>
    );
}
