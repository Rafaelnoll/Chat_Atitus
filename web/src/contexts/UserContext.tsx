import { createContext, ReactNode, useState } from "react";
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
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<IContext>({
  user: null,
  login: () => {},
  register: () => {},
});

export const UserProvider = ({ children }: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  async function handleRegister(name: string, password: string) {
    try {
      const response = await fetch("http://localhost:5000/register", {
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
      const response = await fetch("http://localhost:5000/login", {
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

  return (
    <UserContext.Provider
      value={{ user, login: handleLogin, register: handleRegister }}
    >
      {children}
    </UserContext.Provider>
  );
};
