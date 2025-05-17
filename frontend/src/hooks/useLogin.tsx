import { useState } from "react";
import { useAuthcontext } from "./useAuthContext";

export const  useLogin = () =>{
    const [ error, setError ] = useState(null)
    const [ isLoading, setIsLoading ] = useState<boolean | null>(null);
    const { dispatch } = useAuthcontext();
    const [firstName, setFirstName] = useState(" ");

    const login = async( email:string, password:string) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password})
        })
        const json = await response.json()

        if(!response.ok){
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok){
            // save the user login data to local storage
            localStorage.setItem('user', JSON.stringify(json))

            // update the auth context
            dispatch({type: 'LOGIN', payload: json})
            // const json = await response.json()

            setIsLoading(false)
        }
    }
    return { login, isLoading, error}
}

