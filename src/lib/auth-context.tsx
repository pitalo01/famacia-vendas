/**
 * auth-context.tsx
 *
 * Contexto para gerenciamento de autenticação com persistência local.
 * Permite login, registro e logout de usuários,
 * armazenando os dados no localStorage.
 */

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useLocalStorage } from "@/hooks/use-storage";
import { toast } from "sonner";

/**
 * Interface de endereço do usuário
 */
export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

/**
 * Interface de usuário
 *
 * @property {string} id - ID único do usuário
 * @property {string} name - Nome completo do usuário
 * @property {string} email - Email do usuário
 * @property {string} password - Senha do usuário (apenas para verificação local)
 * @property {string} phone - Telefone do usuário
 * @property {string} birthDate - Data de nascimento do usuário
 * @property {string} cpf - CPF do usuário
 * @property {Address[]} addresses - Endereços do usuário
 * @property {boolean} isAdmin - Indica se o usuário é administrador
 */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthDate?: string;
  cpf?: string;
  addresses?: Address[];
  isAdmin?: boolean;
}

/**
 * Interface do contexto de autenticação
 *
 * Define todas as propriedades e métodos disponíveis através do contexto
 */
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  addAddress: (address: Omit<Address, "id">) => Promise<boolean>;
  updateAddress: (address: Address) => Promise<boolean>;
  removeAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
}

// Criação do contexto com valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props do provedor de contexto de autenticação
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provedor do contexto de autenticação
 *
 * Gerencia o estado de autenticação e fornece métodos para manipulá-lo.
 * Utiliza localStorage para persistência dos dados.
 *
 * @param {AuthProviderProps} props - Props do componente
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado para armazenar o usuário atual
  const [user, setUser] = useState<User | null>(null);

  // Armazena os usuários cadastrados no localStorage
  const [users, setUsers] = useLocalStorage<User[]>("auth-users", []);

  // Armazena o ID do usuário logado no localStorage
  const [currentUserId, setCurrentUserId, clearCurrentUserId] = useLocalStorage<
    string | null
  >("auth-current-user", null);

  // Inicializa o administrador padrão se não existir
  useEffect(() => {
    const adminUser = users.find((u) => u.isAdmin);
    console.log("Verificando administrador padrão", { adminUser, users });

    if (!adminUser) {
      const newAdminUser: User = {
        id: `admin-${Date.now()}`,
        name: "Administrador",
        email: "admin@farmacia.com",
        password: "admin123",
        isAdmin: true,
      };

      setUsers((prevUsers) => [...prevUsers, newAdminUser]);
      console.log("Usuário administrador criado com sucesso!", newAdminUser);
      alert(
        "Administrador padrão criado! Email: admin@farmacia.com, Senha: admin123"
      );
    }
  }, [users, setUsers]);

  // Verifica se existe um usuário logado ao iniciar
  useEffect(() => {
    if (currentUserId) {
      const foundUser = users.find((u) => u.id === currentUserId);
      console.log("Autenticação: Verificando usuário logado", {
        currentUserId,
        foundUser,
      });

      if (foundUser) {
        // Remove a senha antes de armazenar no estado
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword as User);
        console.log("Usuário autenticado:", userWithoutPassword);
      } else {
        console.log(
          "ID de usuário encontrado, mas usuário não existe na lista"
        );
      }
    }
  }, [currentUserId, users]);

  /**
   * Realiza o login do usuário
   *
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<boolean>} - Indica se o login foi bem-sucedido
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove a senha antes de armazenar no estado
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      setCurrentUserId(foundUser.id);

      toast.success("Login realizado com sucesso!", {
        description: `Bem-vindo(a), ${foundUser.name}!`,
      });

      return true;
    }

    toast.error("Falha no login", {
      description: "Email ou senha incorretos.",
    });

    return false;
  };

  /**
   * Registra um novo usuário
   *
   * @param {string} name - Nome completo do usuário
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<boolean>} - Indica se o registro foi bem-sucedido
   */
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Verifica se o email já está em uso
    if (users.some((u) => u.email === email)) {
      toast.error("Falha no registro", {
        description: "Este email já está em uso.",
      });
      return false;
    }

    // Cria um novo usuário com ID único
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      email,
      password,
      addresses: [],
    };

    // Adiciona o novo usuário à lista de usuários
    setUsers([...users, newUser]);

    // Faz login com o novo usuário
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword as User);
    setCurrentUserId(newUser.id);

    toast.success("Registro realizado com sucesso!", {
      description: `Bem-vindo(a), ${name}!`,
    });

    return true;
  };

  /**
   * Atualiza os dados do perfil do usuário
   *
   * @param {Partial<User>} userData - Dados atualizados do usuário
   * @returns {Promise<boolean>} - Indica se a atualização foi bem-sucedida
   */
  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user || !currentUserId) {
      toast.error("Erro ao atualizar perfil", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      // Atualiza o usuário na lista de usuários
      const updatedUsers = users.map((u) => {
        if (u.id === currentUserId) {
          // Preserva a senha original
          return { ...u, ...userData, password: u.password };
        }
        return u;
      });

      setUsers(updatedUsers);

      // Atualiza o usuário atual
      setUser({ ...user, ...userData });

      toast.success("Perfil atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  /**
   * Adiciona um novo endereço para o usuário
   *
   * @param {Omit<Address, "id">} address - Dados do endereço
   * @returns {Promise<boolean>} - Indica se a adição foi bem-sucedida
   */
  const addAddress = async (address: Omit<Address, "id">): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user || !currentUserId) {
      toast.error("Erro ao adicionar endereço", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      // Cria o novo endereço com ID único
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      };

      // Se for o primeiro endereço ou marcado como padrão, desmarcar outros como padrão
      if (address.isDefault || !user.addresses || user.addresses.length === 0) {
        const updatedAddresses = (user.addresses || []).map((addr) => ({
          ...addr,
          isDefault: false,
        }));

        updatedAddresses.push(newAddress);

        // Atualiza o usuário na lista de usuários
        const updatedUsers = users.map((u) => {
          if (u.id === currentUserId) {
            return { ...u, addresses: updatedAddresses };
          }
          return u;
        });

        setUsers(updatedUsers);

        // Atualiza o usuário atual
        setUser({ ...user, addresses: updatedAddresses });
      } else {
        // Adiciona o novo endereço à lista de endereços do usuário
        const updatedAddresses = [...(user.addresses || []), newAddress];

        // Atualiza o usuário na lista de usuários
        const updatedUsers = users.map((u) => {
          if (u.id === currentUserId) {
            return { ...u, addresses: updatedAddresses };
          }
          return u;
        });

        setUsers(updatedUsers);

        // Atualiza o usuário atual
        setUser({ ...user, addresses: updatedAddresses });
      }

      toast.success("Endereço adicionado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      toast.error("Erro ao adicionar endereço", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  /**
   * Atualiza um endereço existente
   *
   * @param {Address} address - Dados atualizados do endereço
   * @returns {Promise<boolean>} - Indica se a atualização foi bem-sucedida
   */
  const updateAddress = async (address: Address): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user || !currentUserId) {
      toast.error("Erro ao atualizar endereço", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      // Se marcado como padrão, desmarcar outros como padrão
      let updatedAddresses = (user.addresses || []).map((addr) => {
        if (addr.id === address.id) {
          return address;
        }
        return address.isDefault ? { ...addr, isDefault: false } : addr;
      });

      // Atualiza o usuário na lista de usuários
      const updatedUsers = users.map((u) => {
        if (u.id === currentUserId) {
          return { ...u, addresses: updatedAddresses };
        }
        return u;
      });

      setUsers(updatedUsers);

      // Atualiza o usuário atual
      setUser({ ...user, addresses: updatedAddresses });

      toast.success("Endereço atualizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      toast.error("Erro ao atualizar endereço", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  /**
   * Remove um endereço do usuário
   *
   * @param {string} addressId - ID do endereço a ser removido
   * @returns {Promise<boolean>} - Indica se a remoção foi bem-sucedida
   */
  const removeAddress = async (addressId: string): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user || !currentUserId) {
      toast.error("Erro ao remover endereço", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      // Remove o endereço da lista de endereços do usuário
      const updatedAddresses = (user.addresses || []).filter(
        (addr) => addr.id !== addressId
      );

      // Atualiza o usuário na lista de usuários
      const updatedUsers = users.map((u) => {
        if (u.id === currentUserId) {
          return { ...u, addresses: updatedAddresses };
        }
        return u;
      });

      setUsers(updatedUsers);

      // Atualiza o usuário atual
      setUser({ ...user, addresses: updatedAddresses });

      toast.success("Endereço removido com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      toast.error("Erro ao remover endereço", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  /**
   * Define um endereço como padrão
   *
   * @param {string} addressId - ID do endereço a ser definido como padrão
   * @returns {Promise<boolean>} - Indica se a operação foi bem-sucedida
   */
  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    // Simulando atraso de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user || !currentUserId) {
      toast.error("Erro ao definir endereço padrão", {
        description: "Usuário não está autenticado.",
      });
      return false;
    }

    try {
      // Atualiza os endereços, definindo o endereço selecionado como padrão
      const updatedAddresses = (user.addresses || []).map((addr) => ({
        ...addr,
        isDefault: addr.id === addressId,
      }));

      // Atualiza o usuário na lista de usuários
      const updatedUsers = users.map((u) => {
        if (u.id === currentUserId) {
          return { ...u, addresses: updatedAddresses };
        }
        return u;
      });

      setUsers(updatedUsers);

      // Atualiza o usuário atual
      setUser({ ...user, addresses: updatedAddresses });

      toast.success("Endereço padrão definido com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro ao definir endereço padrão:", error);
      toast.error("Erro ao definir endereço padrão", {
        description: "Ocorreu um erro inesperado.",
      });
      return false;
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const logout = () => {
    setUser(null);
    clearCurrentUserId();

    toast.info("Logout realizado com sucesso!");
  };

  // Valores e métodos fornecidos pelo contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personalizado para acessar o contexto de autenticação
 *
 * @returns {AuthContextType} Contexto de autenticação
 * @throws {Error} Se usado fora de um AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
