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
    user: User | null | false, 
    // loading: boolean,
    login: (userData: UserLogin) => void;
    logout: () => void; 
}

const AuthContext = createContext<AuthContextType| undefined>(undefined); 

interface AuthProviderProps{
    children: ReactNode
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null | false>(null) 
    // const [loading, setLoading] = useState(true)
    const url = "http://localhost:3000/users/sign_in"

    useEffect(() => {
        checkStatus(); 
    }, [])

    const checkStatus = async () => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                credentials: 'include'
            })
            const result = await response.json()
            if (response.status === 200){
                setUser(result.user)
            } else {
                setUser(false)
            }
     
        } catch(err) {
            console.log(err)
        }
    }
    const login = async (userData: UserLogin) => {
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(userData),
                credentials: 'include'
            }); 
        
            const result = await response.json()
            setUser(result);
            console.log(result)
            //   sessionStorage.setItem("user", result)
            } catch (error){
            console.log(error);
        }
    }
    const logout = () => {
        setUser(null); 
    }

    return(
        <AuthContext.Provider value={{ user, login, logout}}>
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
