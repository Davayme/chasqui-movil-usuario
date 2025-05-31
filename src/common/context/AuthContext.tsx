import { authService, User } from '@/src/modules/auth/services/authService';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

// Definir el tipo del contexto de autenticación
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Token key para SecureStore
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el token al iniciar la aplicación
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);
        
        if (storedToken) {
          // Validar el token antes de usarlo
          const isValid = await authService.validateToken(storedToken);
          
          if (isValid) {
            setToken(storedToken);
            setIsAuthenticated(true);
            
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Si el token no es válido, eliminarlo
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
          }
        }
      } catch (error) {
        console.error('Error al cargar token:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo cargar la sesión anterior'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Usar el servicio de autenticación para hacer login
      const response = await authService.login({ email, password });
      
      // Guardar el token en SecureStore
      await SecureStore.setItemAsync(TOKEN_KEY, response.access_token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(response.user));
      
      // Actualizar el estado
      setToken(response.access_token);
      setUser(response.user);
      setIsAuthenticated(true);
      
      Toast.show({
        type: 'success',
        text1: '¡Bienvenido!',
        text2: `Hola, ${response.user.firstName}`
      });
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      Toast.show({
        type: 'error',
        text1: 'Error de autenticación',
        text2: 'Credenciales incorrectas'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Eliminar el token y la información del usuario
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      
      // Limpiar el estado
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      
      // Mostrar mensaje
      Toast.show({
        type: 'success',
        text1: 'Sesión cerrada',
        text2: 'Has cerrado sesión correctamente'
      });
      
      // Redireccionar a la pantalla de login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo cerrar la sesión'
      });
    }
  };

  // Valor del contexto que será proporcionado
  const value: AuthContextType = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 