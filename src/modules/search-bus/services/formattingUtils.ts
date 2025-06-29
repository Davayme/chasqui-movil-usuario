// Utilidades para formatear datos en las pantallas de búsqueda y compra de pasajes

/**
 * Formatea una fecha a string en formato DD/MM/YYYY
 */
export const formatDate = (date: Date): string => {
  if (!date) return '';
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatea una hora (objeto Date) a string en formato HH:MM (24h)
 */
export const formatTime = (date: Date): string => {
  if (!date) return '';
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

/**
 * Formatea una hora desde string (HH:MM:SS) a formato HH:MM
 */
export const formatTimeFromString = (timeString: string): string => {
  if (!timeString) return '';
  // Tomar solo las primeras dos partes (horas y minutos)
  const timeParts = timeString.split(':');
  if (timeParts.length >= 2) {
    return `${timeParts[0]}:${timeParts[1]}`;
  }
  return timeString;
};

/**
 * Calcula y formatea la duración entre dos fechas
 */
export const formatDuration = (startDate: Date, endDate: Date): string => {
  if (!startDate || !endDate) return '';
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs > 0) {
    return `${diffHrs}h ${diffMins}m`;
  }
  
  return `${diffMins}m`;
};

/**
 * Formatea un valor numérico a moneda (USD)
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Retorna un nombre más amigable para los tipos de pasajero
 */
export const getPassengerTypeName = (type: string): string => {
  const typeMap: {[key: string]: string} = {
    'normal': 'Adulto',
    'menor': 'Niño/a',
    'discapacitado': 'Persona con discapacidad',
    'tercera_edad': 'Adulto mayor'
  };
  
  return typeMap[type] || type;
};

/**
 * Retorna un nombre más amigable para los tipos de asiento
 */
export const getSeatTypeName = (type: string): string => {
  const typeMap: {[key: string]: string} = {
    'normal': 'Estándar',
    'VIP': 'VIP',
    'discapacitado': 'Asiento para discapacidad'
  };
  
  return typeMap[type] || type;
};

/**
 * Retorna un nombre más amigable para la ubicación del asiento
 */
export const getSeatLocationName = (location: string): string => {
  const locationMap: {[key: string]: string} = {
    'ventana': 'Ventana',
    'pasillo': 'Pasillo'
  };
  
  return locationMap[location] || location;
};

/**
 * Retorna un nombre más amigable para el método de pago
 */
export const getPaymentMethodName = (method: string): string => {
  const methodMap: {[key: string]: string} = {
    'tarjeta': 'Tarjeta de crédito/débito',
    'transferencia': 'Transferencia bancaria',
    'PayPal': 'PayPal'
  };
  
  return methodMap[method] || method;
};

/**
 * Retorna el día de la semana de una fecha
 */
export const getDayOfWeek = (date: Date): string => {
  if (!date) return '';
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
};

/**
 * Capitaliza la primera letra de un string
 */
export const capitalizeFirstLetter = (string: string): string => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};