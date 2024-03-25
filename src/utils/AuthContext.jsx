import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true)
    const [user,setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getUserOnLoad()
    }, [])

    const getUserOnLoad = async () => {  // basically when we reload page is no longer available so i create here a function and set inside use eefeect that get user on intial load so now user is persist
        try{
            let accountDetails = await account.get();
            setUser(accountDetails)
        }catch(error){
            console.warn(error)
        }
        setLoading(false)
    }

    const handleUserLogin = async (e, credentials) => {
        e.preventDefault()

        try {
            const response = await account.createEmailPasswordSession(credentials.email, credentials.password);
            console.log('loggedin', response)
            let accountDetails = await account.get();
            setUser(accountDetails)

            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    const handleUserLogout = async () => {
        const response = await account.deleteSession('current');
        setUser(null)
    }

    const handleUserRegister = async (e,credentials) => {
        e.preventDefault()
        if(credentials.password1 !== credentials.password2){ // here we check password are matchin or not agar match nahi hai to not execute further code yahi se bahar ho jao (return)
            alert('Passwords did not match!')
            return 
        }

        try {
            let response = await account.create(ID.unique(), credentials.email, credentials.password1,credentials.name);
            console.log('User registered!', response)
            await account.createEmailPasswordSession(credentials.email, credentials.password1);
            
            let accountDetails = await account.get();
            console.log('accountDetails:', accountDetails)
            setUser(accountDetails)
            navigate('/')
            
        } catch (error) {
            console.error(error)
        }

    }

    const contextData = {
        user,
        handleUserLogin,
        handleUserLogout,
        handleUserRegister,
    }
    return <AuthContext.Provider value={contextData}>
        {loading ? <div className="auth--container"><p>Loading...</p></div>  : children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthContext