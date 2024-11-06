import { createContext, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface IUser {
  name: string;
  token: string;
}

interface IProps {
  children: ReactNode;
}

interface IContext {
  user: IUser | null;
  login: (name: string, password: string) => void;
  register: (name: string, password: string) => void;
  logout: () => void;
  defaultIp: string;
}

const defaultIp = "localhost";

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<IContext>({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  defaultIp: "",
});

export const UserProvider = ({ children }: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  async function handleRegister(name: string, password: string) {
    try {
      const response = await fetch(`http://${defaultIp}:5000/register`, {
        method: "POST",
        body: JSON.stringify({
          name,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      const userToken = data?.token;
      const user = data?.user;

      if (user && userToken) {
        setUser(user);
        localStorage.setItem("user-token", userToken);
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleLogin(name: string, password: string) {
    try {
      const response = await fetch(`http://${defaultIp}:5000/login`, {
        method: "POST",
        body: JSON.stringify({
          name,
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const data = await response.json();
      const user = data?.user;

      if (user) {
        setUser(user);
        localStorage.setItem("user-token", user.token);
        navigate("/chat");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    try {
      setUser(null);
      localStorage.removeItem("user-token");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const tokenInLocalStorage = localStorage.getItem("user-token");

    async function resumeLogin() {
      try {
        if (!tokenInLocalStorage) return;

        const response = await fetch(`http://${defaultIp}:5000/login/resume`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            authorization: tokenInLocalStorage,
          },
        });

        const data = await response.json();
        const user = data?.user;
        const userToken = data?.token;

        setUser({ ...user, token: userToken });
      } catch {
        console.log("asdassa");
      }
    }

    resumeLogin();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        defaultIp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
