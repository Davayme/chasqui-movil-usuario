import { API_ENDPOINTS, API_URL } from '@/src/common/config/config';
import * as FileSystem from 'expo-file-system';

export interface QRResponse {
  qrCode: string; // Base64 string del QR
}

/**
 * Obtiene el código QR de un boleto en formato base64
 * @param ticketId ID del boleto
 * @returns Promesa con el string base64 del QR
 */
export const getTicketQR = async (ticketId: string): Promise<string> => {
  try {
    // Construir la URL completa
    const fullUrl = `${API_URL}${API_ENDPOINTS.QR.GET_QR}/${ticketId}?format=base64`;
    console.log('Intentando obtener QR desde:', fullUrl);
    
    try {
      // Método 1: Usando fetch
      const response = await fetch(fullUrl);
      
      console.log('Estado de la respuesta:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error al obtener QR: ${response.status}`);
      }
      
      const data: QRResponse = await response.json();
      console.log('Datos recibidos:', data ? 'OK' : 'Null');
      return data.qrCode;
    } catch (fetchError) {
      console.log('Error con fetch, intentando método alternativo:', fetchError);
      
      // Método 2: Intentar obtener directamente la imagen PNG
      const pngUrl = `${API_URL}${API_ENDPOINTS.QR.GET_QR}/${ticketId}?format=png`;
      console.log('Intentando descargar PNG desde:', pngUrl);
      
      // Usar FileSystem para descargar la imagen
      const fileName = `temp_qr_${ticketId}.png`;
      const fileUri = FileSystem.cacheDirectory + fileName;
      
      try {
        const downloadResult = await FileSystem.downloadAsync(pngUrl, fileUri);
        
        if (downloadResult.status !== 200) {
          throw new Error(`Error al descargar QR: ${downloadResult.status}`);
        }
        
        console.log('QR descargado correctamente:', fileUri);
        
        // Leer el archivo y convertirlo a base64
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        return `data:image/png;base64,${base64}`;
      } catch (downloadError) {
        console.log('Error al descargar QR:', downloadError);
        throw downloadError;
      }
    }
  } catch (error) {
    console.error('Error al obtener QR (todos los métodos fallaron):', error);
    return getMockTicketQR(ticketId);
  }
};

/**
 * Función para simular la obtención de QR cuando la API no está disponible
 * @param ticketId ID del boleto
 * @returns String base64 de un QR de prueba
 */
export const getMockTicketQR = (ticketId: string): string => {
  // QR de prueba (imagen base64 genérica)
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLR//8yV0c/BZCoailm4Gb2B2utyw/WWpcfrLUuP1hrXX6w1rr8YK11+cFa6/KDtdblB2uty4O/fCDxt5SYJCaJSWKSmCSmJCaJNxKTxCTxRmKSmCR+k8QbEn9L4i8fSPxlrXX5wVrr8oO11uXBhyQmiTcSk8QkMUlMEm8kJok3JCaJSeKNxBsSk8QkMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUm8IfFJa63LD9Zalx+stS4PviTxNyUmiUlikvhEYpKYJCaJNyQmiUliSmKSmCQmiUlikvhE4m9KfNNa6/KDtdblB2uty4P/MxKTxCQxSUwSk8QkMUlMEpPEJDFJTBKTxCTxf2ytdfnBWuvyg7XW5cH/uMQkMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUlMEv+X1lqXH6y1Lj9Ya10efEniE4lJYpKYJCaJSWKSmCTeSDwgMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUlMEpPEJPGJxDettS4/WGtdfrDWujz4kMQk8YnEJDFJTBJvJCaJSWKSmCQmiUliSmKSmCQmiUlikpgkJolJYpKYJCaJSWKSmCQmiUnikMQnrbUuP1hrXX6w1ro8+MsHEpPEJDFJTBJvJCaJSWKSmCQmiUlikvhE4o3EJDFJTBKTxCTxhsQbEpPEJPGbtda6/GCtdfnBWuvy4EMSk8QkMUlMEpPEJDFJTBKTxCTxhsQkMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUlMEpPEJDFJTBJvSEwSk8QkMUlMEt+01rr8YK11+cFa6/LgQxKTxCQxSUwSk8QkMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUlMEpPEJDFJTBJvSEwSk8QkMUlMEpPEJDFJTBKTxCTxTWuty4O/fCAxSUwSk8QbiUlikvhE4g2JSeKNxCQxSUwSk8QkMUlMEpPEJDFJTBKTxBuJSWKS+Ka11uUHa63LD9Zalwcfkpgk3pCYJCaJSeKNxCQxSUwSk8QkMUlMEpPEJDFJTBJvSEwSk8QkMUlMEpPEJDFJTBKTxCQxSUwSk8QkMUlMEt+01rr8YK11+cFa6/LgSxK/SeINiUlikvhNEpPEJDFJTBKTxCQxSUwSk8QkMUlMEpPEJDFJTBKTxCQxSUwSk8QnrbUuP1hrXX6w1rr8YK11+cFa6/KDtdblB2uty3/8P9VaGzC0UAAAAABJRU5ErkJggg==';
};

/**
 * Verifica la conectividad con el servidor
 * @returns Promesa con el resultado de la verificación
 */
export const checkServerConnectivity = async (): Promise<boolean> => {
  try {
    console.log('Verificando conectividad con el servidor:', API_URL);
    
    // Intentar hacer una petición simple al servidor
    const response = await fetch(`${API_URL}/health`, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Respuesta del servidor (health):', response.status);
    return response.ok;
  } catch (error) {
    console.error('Error al verificar conectividad:', error);
    return false;
  }
}; 