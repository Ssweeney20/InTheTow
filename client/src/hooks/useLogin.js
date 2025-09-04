import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const API_OPTIONS = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        }

        const response = await fetch(`${API_BASE_URL}user/login`, API_OPTIONS)
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
    return {login , isLoading, error}
}