import { createContext, ReactNode, FC, useState, useContext, useEffect } from "react";

interface User {
    // id: number; 
    name: string; 
    email: string; 
    role: string;
}

interface UserLogin{
    email: string, 
    password: string
}

interface AuthContextType{
    user: User | null, 
    loading: boolean,
    login: (userData: UserLogin) => void;
    logout: () => void; 
    checkStatus: boolean;
}

const AuthContext = createContext<AuthContextType| undefined>(undefined); 

interface AuthProviderProps{
    children: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null) 
    const [loading, setLoading] = useState(false)
    const [checkStatus, setCheckStatus] = useState(false)

    useEffect(() => {
        checkSessionStorage(); 
    }, [])

    const checkSessionStorage = async () => {
        const userData = sessionStorage.getItem("user");
        if(userData){
            setUser(JSON.parse(userData))
        } else {
            const newUserData = await getSession()
            if(newUserData){
                sessionStorage.setItem("user", JSON.stringify(newUserData))
                setUser(newUserData); 
            }
        }

        setCheckStatus(true);
    }

    const getSession = async () => {
        try {
            const response = await fetch("http://localhost:3000/users/sign_in", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                credentials: 'include'
            })
            const result = await response.json()
            if (response.status === 200){
                setLoading(false)
                return result.user
            }

            
        } catch(err) {
            console.log(err)
            setLoading(false)
        } 
    }

    const login = async (userData: UserLogin) => {
        setLoading(true)
        try{
            const response = await fetch("http://localhost:3000/users/sign_in", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(userData),
                credentials: 'include'
            }); 
        
            const result = await response.json()
            if (response.status === 201){
                setLoading(false)
                sessionStorage.setItem("user", JSON.stringify(result.user))
                setUser(result.user)
            } 
          
        } catch (error){
            console.log(error);
            setLoading(false)
        }
    }
    const logout = async () => {
        setLoading(true)
        try{
            const response = await fetch("http://localhost:3000/users/sign_out", {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                }, 
                credentials: 'include'
            }); 
            await response.json()
            if (response.status === 200){
                setLoading(false)
                sessionStorage.removeItem("user")
                setUser(null)
            }
        } catch (error){
            console.log(error);
            setLoading(false)
        }
    }

    return(
        <AuthContext.Provider value={{ user, login, logout, loading, checkStatus}}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context; 
}

export { useAuthContext, AuthProvider }
