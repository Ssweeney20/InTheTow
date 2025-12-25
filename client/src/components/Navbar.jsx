import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Truck, User } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout.js'
import { useAuthContext } from '../hooks/useAuthContext.js'
import { useState, useEffect } from 'react'

const navigation = [
    { name: 'Home', href: '/', current: false },
    { name: 'Facilities', href: '/warehouses', current: false },
    { name: 'My Reviews', href: '/reviews', current: false },
    { name: 'About', href: '/about', current: false },
]

const authNavigation = [
    { name: 'Login', href: '/login', current: false },
    { name: 'Sign Up', href: '/signup', current: false },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar(props) {
    const currentPage = props.data

    // set current page

    const { logout } = useLogout()
    const { user } = useAuthContext()
    const [profile, setProfile] = useState(null)

    const handleLogout = () => {
        logout()
    }

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
        if (user){
            fetchUser()
        }
    }, [user?.token])

    return (
        <Disclosure
            as="nav"
            className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center sm:hidden">
                        {/* Mobile menu button*/}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="flex items-center">

                        <Link to="/" className="flex items-center space-x-2">
                            <Truck className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">InTheTow</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:block">
                        <div className="flex items-center space-x-1">
                            {navigation.map((item) => (
                                (item.name !== 'My Reviews' || user) && (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.name === currentPage 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                                            'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>


                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <div className="flex items-center space-x-2">
                                {authNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.name === 'Sign Up'
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'text-gray-700 hover:text-gray-900',
                                            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                            item.name === currentPage && 'ring-2 ring-blue-500'
                                        )}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <span className="hidden md:block text-sm text-gray-700 font-medium">
                                    {user.email}
                                </span>

                                {/* Profile dropdown */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <span className="sr-only">Open user menu</span>
                                        {profile?.photoURL ? (
                                            <img
                                                className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                                                src={profile.photoURL}
                                                alt="Profile picture"
                                            />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-blue-100 border-2 border-gray-200 flex items-center justify-center">
                                                <User className="h-4 w-4 text-blue-600" />
                                            </div>
                                        )}
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                    >
                                        <MenuItem>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                            >
                                                Your Profile
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                                            >
                                                Sign Out
                                            </button>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <DisclosurePanel className="sm:hidden border-t border-gray-200">
                <div className="space-y-1 px-4 pt-2 pb-3">
                    {navigation.map((item) => (
                        (item.name !== 'My Reviews' || user) && (
                            <DisclosureButton
                                key={item.name}
                                as={Link}
                                to={item.href}
                                className={classNames(
                                    item.name === currentPage
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                                    'block rounded-md px-3 py-2 text-base font-medium'
                                )}
                            >
                                {item.name}
                            </DisclosureButton>
                        )
                    ))}

                    {!user && (
                        <div className="pt-4 border-t border-gray-200 space-y-1">
                            {authNavigation.map((item) => (
                                <DisclosureButton
                                    key={item.name}
                                    as={Link}
                                    to={item.href}
                                    className={classNames(
                                        item.name === 'Sign Up'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                                        'block rounded-md px-3 py-2 text-base font-medium'
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            ))}
                        </div>
                    )}
                </div>
            </DisclosurePanel>
        </Disclosure >
    )
}