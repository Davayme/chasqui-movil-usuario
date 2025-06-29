/**
 * Utilidades para normalizar y comparar texto extraído de documentos
 */

/**
 * Normaliza un texto removiendo tildes, espacios extra y convirtiendo a mayúsculas
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize('NFD') // Descompone caracteres con tildes
    .replace(/[\u0300-\u036f]/g, '') // Remueve las marcas diacríticas (tildes)
    .replace(/[^\w\s]/g, '') // Remueve caracteres especiales
    .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por uno solo
    .trim()
    .toUpperCase();
};

/**
 * Verifica si un nombre o apellido está presente exactamente en el texto extraído del documento
 * @param searchText - Texto a buscar (nombre o apellido)
 * @param extractedText - Texto completo extraído del documento
 * @returns boolean - Si el texto fue encontrado exactamente
 */
export const isTextInDocument = (searchText: string, extractedText: string): boolean => {
  if (!searchText || !extractedText) return false;
  
  const normalizedSearch = normalizeText(searchText);
  const normalizedExtracted = normalizeText(extractedText);
  
  // Dividir el texto extraído en palabras
  const extractedWords = normalizedExtracted.split(' ').filter(word => word.length > 1);
  
  // Dividir el texto de búsqueda en palabras para buscar cada una exactamente
  const searchWords = normalizedSearch.split(' ').filter(word => word.length > 1);
  
  // Verificar que todas las palabras del nombre/apellido estén presentes exactamente
  return searchWords.every(searchWord => 
    extractedWords.some(extractedWord => extractedWord === searchWord)
  );
};

/**
 * Valida que los nombres y apellidos del formulario coincidan con el documento
 * @param firstName - Nombre del formulario
 * @param lastName - Apellido del formulario
 * @param extractedText - Texto extraído del documento
 * @returns Objeto con resultado de validación
 */
export const validateNameInDocument = (
  firstName: string, 
  lastName: string, 
  extractedText: string
): {
  isValid: boolean;
  missingFields: string[];
  details: {
    firstNameFound: boolean;
    lastNameFound: boolean;
  };
} => {
  const missingFields: string[] = [];
  const firstNameFound = isTextInDocument(firstName, extractedText);
  const lastNameFound = isTextInDocument(lastName, extractedText);
  
  if (!firstNameFound) {
    missingFields.push('Nombre');
  }
  
  if (!lastNameFound) {
    missingFields.push('Apellido');
  }
  
  return {
    isValid: firstNameFound && lastNameFound,
    missingFields,
    details: {
      firstNameFound,
      lastNameFound
    }
  };
};

/**
 * Extrae el número de cédula del texto si está presente
 * @param extractedText - Texto extraído del documento
 * @returns string | null - Número de cédula encontrado o null
 */
export const extractIdNumber = (extractedText: string): string | null => {
  // Buscar patrones de cédula ecuatoriana (10 dígitos)
  const idPattern = /\b\d{10}\b/g;
  const matches = extractedText.match(idPattern);
  
  if (matches && matches.length > 0) {
    // Retornar el primer número de 10 dígitos encontrado
    return matches[0];
  }
  
  return null;
};
