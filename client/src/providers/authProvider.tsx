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
}

const AuthContext = createContext<AuthContextType| undefined>(undefined); 

interface AuthProviderProps{
    children: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null) 
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkStatus(); 
    }, [])

    const checkStatus = async () => {
        setLoading(true)
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
                setUser(result.user)
            }
     
        } catch(err) {
            console.log(err)
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
                setUser(result.user)
            } 
          
        } catch (error){
            console.log(error);
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
                setUser(null)
            }
        } catch (error){
            console.log(error);
        }
    }

    return(
        <AuthContext.Provider value={{ user, login, logout, loading}}>
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
