import { useAuthContext } from '../hooks/useAuthContext';
import { useState, useEffect } from 'react';

import Navbar from "../components/Navbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AccountSettingsPage() {
    const { user } = useAuthContext()
    const [profile, setProfile] = useState(null)
    const [displayNameEntry, setDisplayNameEntry] = useState('')
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

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


    async function uploadPhotos(e) {
        e.preventDefault();

        if (user) {
            setSubmitting(true);
            setSubmitError("");

            try {

                const fd = new FormData(e.currentTarget);

                const res = await fetch(`${API_BASE_URL}user/profile-photo`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${user.token}` },
                    body: fd,
                });

                if (!res.ok) throw new Error(`Failed to upload profile picture (${res.status})`);

            } catch (err) {
                console.error(err);
                setSubmitError("Could not upload photo. Please try again.");
            } finally {
                setSubmitting(false);
                window.location.reload();
            }
        }
    }

    async function changeDisplayName() {

        if (!displayNameEntry) {
            setSubmitError("Please enter a display name");
            return
        }
        if (user) {
            setSubmitting(true);
            setSubmitError("");

            try {
                const res = await fetch(`${API_BASE_URL}user/display-name`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        displayName: displayNameEntry
                    })
                });

                if (!res.ok) throw new Error(`Failed to change display name (${res.status})`);
                
                await fetchUser()

            } catch (err) {
                console.error(err);
                setSubmitError("Could not change display name. Please try again.");
            } finally {
                setSubmitting(false);
                setDisplayNameEntry("");
            }
        }
    }

    return (
        <>
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
                                                src={profile.photoURL || "profile-placeholder.svg"}
                                                alt="Current avatar"
                                            />
                                            <form onSubmit={uploadPhotos} className="flex-1 overflow-y-auto p-5 space-y-4">
                                                <input
                                                    id="photo"
                                                    name="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="
      mt-1 block w-full cursor-pointer rounded-md border border-gray-300 p-2 text-sm text-gray-700
      file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-white
      hover:file:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500
    "
                                                />
                                                <p className="basis-full text-sm text-gray-500">
                                                    For best results, upload an image 512×512 or larger.
                                                </p>
                                                <button
                                                    type="submit"
                                                    className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none"
                                                >
                                                    Upload
                                                </button>
                                            </form>
                                        </div>
                                    </div>


                                    {/* Name fields */}
                                    <div className="mb-6 grid gap-4 md:grid-cols-2">
                                        <label className="flex flex-col gap-1">
                                            <span className="text-sm font-medium text-gray-900">Display name</span>
                                            <input
                                                value={displayNameEntry}
                                                placeholder={profile.displayName}
                                                onChange={(e) => { setDisplayNameEntry(e.target.value) }}
                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                            />
                                            <button
                                                onClick={changeDisplayName}
                                                type="submit"
                                                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none"
                                            >
                                                Change Name
                                            </button>
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

                
                            </>
                        )}
                </div>
            </main>
        </>
    );
}
