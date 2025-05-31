import { API_ENDPOINTS, API_URL } from "@/src/common/config/config";

// Interfaces
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: number;
    name: string;
  };
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Servicio para manejar la autenticación con el backend
 */
export const authService = {
  /**
   * Realiza la petición de login al backend
   * @param credentials Credenciales del usuario (email y password)
   * @returns Respuesta con token y datos del usuario
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la autenticación');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en servicio de login:', error);
      throw error;
    }
  },
  
  /**
   * Valida un token JWT (para verificar si sigue siendo válido)
   * @param token Token JWT a validar
   * @returns true si el token es válido, false en caso contrario
   */
  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error al validar token:', error);
      return false;
    }
  }
}; 