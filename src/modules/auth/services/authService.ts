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
   * NOTA: Actualmente retorna true siempre ya que el endpoint no está implementado
   * @param token Token JWT a validar
   * @returns true si el token es válido, false en caso contrario
   */
  validateToken: async (token: string): Promise<boolean> => {
    // Temporalmente retornamos true siempre ya que el endpoint no está implementado
    console.log('Endpoint de validación de token no implementado aún, asumiendo token válido');
    return true;
    
    /* IMPLEMENTACIÓN FUTURA
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.AUTH.VALIDATE_TOKEN}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Si la respuesta es exitosa, el token es válido
      if (response.ok) {
        return true;
      }
      
      // Si el status es 401 o 403, el token definitivamente no es válido
      if (response.status === 401 || response.status === 403) {
        return false;
      }
      
      // Para otros errores HTTP (como 500, 503, etc.), asumimos que es un problema
      // del servidor y consideramos el token como válido para no cerrar la sesión
      // del usuario por problemas del servidor
      console.warn('Error al validar token. Código:', response.status);
      return true;
      
    } catch (error) {
      // En caso de error de red (servidor caído, sin conexión, etc.)
      // también asumimos que el token es válido para no cerrar la sesión
      console.error('Error al validar token:', error);
      return true;
    }
    */
  }
}; 