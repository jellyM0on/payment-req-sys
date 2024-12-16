import {
  createContext,
  ReactNode,
  FC,
  useState,
  useContext,
  useEffect,
} from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  position: string;
  department: string;
  created_at: string;
  updated_at: string;
}

interface UserLogin {
  email: string | null;
  password: string | null;
}

interface LoginResponse {
  user: User | null;
  signed_in: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  login: (userData: UserLogin) => Promise<LoginResponse>;
  logout: () => void;
  processDone: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [processDone, setProcessDone] = useState(false);

  useEffect(() => {
    checkSessionStorage();
  }, []);

  const checkSessionStorage = async () => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      const newUserData = await getSession();
      if (newUserData) {
        setUser(newUserData);
        sessionStorage.setItem("user", JSON.stringify(newUserData));
      } else {
        setUser(null);
      }
    }

    setProcessDone(true);
  };

  const getSession = async () => {
    console.log("get");
    try {
      const response = await fetch("http://localhost:3000/users/sign_in", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const result = await response.json();
      if (response.status === 200) {
        setLoading(false);
        return result.user;
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const login = async (userData: UserLogin): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/users/sign_in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      const result: LoginResponse = await response.json();

      if (response.status === 201) {
        setLoading(false);
        sessionStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
      } else {
        setUser(null);
      }

      return result;
    } catch (error) {
      console.log(error);
      setLoading(false);
      return { error: "Error occured", user: null, signed_in: false };
    }
  };
  const logout = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/users/sign_out", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      await response.json();
      if (response.status === 200) {
        setLoading(false);
        sessionStorage.clear()
        setUser(null);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, processDone }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { useAuthContext, AuthProvider };
