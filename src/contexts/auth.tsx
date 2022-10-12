import { useState, useEffect, createContext, ReactNode } from "react";
import { AxiosResponse, HeadersDefaults } from "axios";
import { useRouter } from "next/router";
import api from "../services/api";
import { User } from "../types/User";
import { useToast } from "@chakra-ui/react";
import { setCookie, destroyCookie, parseCookies } from "nookies";

type IAuthContextData = {
  signed: boolean;
  isLoading: boolean;
  user: User | null;
  Login(email: string, password: string): Promise<void>;
  updateUser(
    data: Pick<
      User,
      "name" | "username" | "email" | "phone" | "role" | "password"
    >
  ): Promise<void>;
  handleRemoveUserAvatar(): Promise<void>;
  handleChangeUserAvatar(avatar: File): Promise<void>;
  Logout(): void;
};

interface CommonHeaderProperties extends HeadersDefaults {
  Authorization: string;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadStoragedData = async () => {
      const cookies = parseCookies();

      const { "@Dashboard-Template:authUser": storagedUser } = cookies;
      const { "@Dashboard-Template:authToken": storagedToken } = cookies;

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (storagedUser && storagedToken) {
        api.defaults.headers = {
          Authorization: `Bearer ${storagedToken}`,
        } as CommonHeaderProperties;
        setUser(JSON.parse(storagedUser));
      }

      setIsLoading(false);
    };

    loadStoragedData();
  }, []);

  const Login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const response: AxiosResponse = await api.post("/auth/login", {
        email,
        password,
      });

      if (response.data.user === null)
        throw new Error("Usuário não encontrado.");

      if (response.status === 200 && response.data.user !== null) {
        setIsLoading(false);
        setUser(response.data.user);

        api.defaults.headers = {
          Authorization: `Bearer ${response.data.token}`,
        } as CommonHeaderProperties;

        setCookie(
          undefined,
          "@Dashboard-Template:authUser",
          JSON.stringify(response?.data?.user),
          {
            path: "/",
          }
        );

        setCookie(
          undefined,
          "@Dashboard-Template:authToken",
          response?.data?.token,
          {
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
          }
        );

        toast({
          title: "Sucesso.",
          description: response.data.message,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });

        router.push("/users");
      }
    } catch (e: any) {
      console.log(e);

      setIsLoading(false);
      router.push("/");

      toast({
        title: "Erro.",
        description: e?.response?.data?.message || e?.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleRemoveUserAvatar = async () => {
    try {
      const response = await api.patch(`/users/${user?.id}/remove-avatar`);

      if (response?.status === 200) {
        setUser(response.data.user);

        setCookie(
          undefined,
          "@Dashboard-Template:authUser",
          JSON.stringify(response.data.user),
          {
            path: "/",
          }
        );

        toast({
          title: "Sucesso.",
          description: response.data.message,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      }
    } catch (e: any) {
      console.log(e);

      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleChangeUserAvatar = async (avatar: any) => {
    const formData = new FormData();

    formData.append("avatar", avatar);

    try {
      const response = await api.patch(`/users/${user?.id}/avatar`, formData);

      if (response?.status === 200) {
        setUser(response.data.user);

        setCookie(
          undefined,
          "@Dashboard-Template:authUser",
          JSON.stringify(response.data.user),
          {
            path: "/",
          }
        );

        toast({
          title: "Sucesso.",
          description: response.data.message,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }
  };

  const updateUser = async (
    data: Pick<
      User,
      "name" | "username" | "email" | "phone" | "role" | "password"
    >
  ) => {
    try {
      let updateData;

      if (data.password === null)
        updateData = {
          name: data.name === "" ? user?.name : data.name,
          username: data.username === "" ? user?.username : data.username,
          email: data.email === "" ? user?.email : data.email,
          phone: data.phone === "" ? user?.phone : data.phone,
          role: data.role,
        };
      else
        updateData = {
          name: data.name === "" ? user?.name : data.name,
          username: data.username === "" ? user?.username : data.username,
          email: data.email === "" ? user?.email : data.email,
          phone: data.phone === "" ? user?.phone : data.phone,
          role: data.role,
          password: data.password,
        };

      const response = await api.put(`users/${user?.id}`, updateData);

      if (response?.status === 200) {
        setUser(response.data.user);

        setCookie(
          undefined,
          "@Dashboard-Template:authUser",
          JSON.stringify(response?.data?.user),
          {
            path: "/",
          }
        );

        toast({
          title: "Sucesso.",
          description: response.data.message,
          status: "success",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Erro.",
        description: e.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }
  };

  const Logout = () => {
    setUser(null);

    destroyCookie(undefined, "@Dashboard-Template:authUser");
    destroyCookie(undefined, "@Dashboard-Template:authToken");

    router.push("/");

    toast({
      title: "Sucesso.",
      description: "Usuário desconectado.",
      status: "success",
      duration: 2500,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        isLoading,
        user,
        Login,
        updateUser,
        handleRemoveUserAvatar,
        handleChangeUserAvatar,
        Logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
