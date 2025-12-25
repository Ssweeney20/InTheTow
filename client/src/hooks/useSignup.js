import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const signup = async (email, password, confirmPassword, displayName) => {
        setIsLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        const API_OPTIONS = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, displayName})
        }

        const response = await fetch(`${API_BASE_URL}user/signup`, API_OPTIONS)
        const json = await response.json()

        if (!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok){
            localStorage.setItem('user', JSON.stringify(json))

            dispatch({type: 'LOGIN', payload: json})

            setIsLoading(false)
        }

    }
    return {signup , isLoading, error}
}