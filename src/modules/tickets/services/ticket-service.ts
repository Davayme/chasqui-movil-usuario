import { API_ENDPOINTS, API_URL } from '@/src/common/config/config';

// Tipos e interfaces para los tickets del backend
export type TicketStatus = 'PENDING' | 'PAID' | 'CONFIRMED' | 'BOARDED' | 'USED' | 'CANCELLED' | 'EXPIRED';
export type TicketFilter = 'active' | 'past';

export interface BackendTicket {
  id: number;
  purchaseDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  ticket: {
    id: number;
    qrCode: string;
    qrBase64?: string; // Campo adicional que retorna el backend
    status: TicketStatus;
    passengerCount: number;
    routeInfo?: {
      originCity: string;
      destinationCity: string;
      departureTime: string;
      date: string;
    };
  };
  passengers?: {
    id: number;
    passengerName: string;
    seatNumber: string;
    seatType: 'NORMAL' | 'VIP';
    passengerType: 'NORMAL' | 'CHILD' | 'SENIOR' | 'HANDICAPPED';
    finalPrice: number;
  }[];
}

export interface TicketResponse {
  totalTickets: number;
  tickets: BackendTicket[];
}

// Mapear los estados del backend a nuestros filtros
const ACTIVE_STATUSES: TicketStatus[] = ['CONFIRMED'];
const PAST_STATUSES: TicketStatus[] = ['BOARDED', 'USED', 'CANCELLED', 'EXPIRED'];

/**
 * Obtiene el historial de tickets del usuario
 * @param userId ID del usuario
 * @param includeQR Si incluir el QR en la respuesta
 * @returns Promesa con el historial de tickets
 */
export const getTicketsHistory = async (userId: number, includeQR: boolean = false): Promise<TicketResponse> => {
  try {
    const url = `${API_URL}${API_ENDPOINTS.TICKETS.GET_TICKETS_HISTORY}${userId}?includeQR=${includeQR}`;
    console.log('Obteniendo tickets desde:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Tickets obtenidos del backend:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener historial de tickets:', error);
    // Re-lanzar el error para que sea manejado por el componente
    throw new Error('No se pudieron cargar los tickets. Verifique su conexión a internet.');
  }
};

/**
 * Obtiene el QR de un ticket específico
 * @param ticketId ID del ticket (del campo ticket.id)
 * @returns Promesa con los datos del QR
 */
export const getTicketQR = async (ticketId: number): Promise<string> => {
  try {
    const url = `${API_URL}${API_ENDPOINTS.TICKETS.GENERATE_QR}${ticketId}`;
    console.log('Obteniendo QR desde:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('QR obtenido del backend:', data);
    
    // El backend retorna la estructura completa del ticket
    // El QR está en data.ticket.qrBase64
    if (data.ticket && data.ticket.qrBase64) {
      return data.ticket.qrBase64;
    } else if (data.ticket && data.ticket.qrCode) {
      // Fallback al campo qrCode si qrBase64 no está disponible
      return data.ticket.qrCode;
    } else if (data.qrBase64) {
      // Por si el formato cambia y viene directamente
      return data.qrBase64;
    } else if (data.qrCode) {
      return data.qrCode;
    } else {
      throw new Error('QR no encontrado en la respuesta');
    }
  } catch (error) {
    console.error('Error al obtener QR del ticket:', error);
    // En caso de error, usar QR de fallback
    console.log('Usando QR de fallback para ticket:', ticketId);
    return getMockTicketQR(ticketId.toString());
  }
};

/**
 * Filtra tickets según el estado (activos o pasados)
 * @param tickets Array de tickets del backend
 * @param filter Filtro a aplicar ('active' o 'past')
 * @returns Array de tickets filtrados
 */
export const filterTicketsByStatus = (tickets: BackendTicket[], filter: TicketFilter): BackendTicket[] => {
  const statusesToFilter = filter === 'active' ? ACTIVE_STATUSES : PAST_STATUSES;
  
  return tickets.filter(ticket => 
    statusesToFilter.includes(ticket.ticket.status)
  );
};

/**
 * Convierte un ticket del backend al formato esperado por la UI
 * @param backendTicket Ticket del backend
 * @returns Ticket en formato de la UI
 */
export const mapBackendTicketToUI = (backendTicket: BackendTicket) => {
  const { ticket, passengers } = backendTicket;
  
  // Valores por defecto para campos faltantes
  const defaultRouteInfo = {
    originCity: 'Origen no disponible',
    destinationCity: 'Destino no disponible',
    departureTime: '00:00:00',
    date: new Date().toISOString().split('T')[0]
  };
  
  const routeInfo = ticket.routeInfo || defaultRouteInfo;
  const passengerList = passengers || [];
  
  // Formatear la fecha de salida
  const departureDate = new Date(routeInfo.date).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Formatear la hora de salida (remover timezone info si existe)
  const departureTime = routeInfo.departureTime.split(' ')[0];
  
  // Determinar la empresa (por ahora usaremos un valor por defecto)
  const company = 'Cooperativa de Transportes';
  
  // Crear string de asientos
  let seatInfo = 'Asientos no asignados';
  if (passengerList.length > 0) {
    const seatNumbers = passengerList.map(p => p.seatNumber).sort((a, b) => parseInt(a) - parseInt(b)).join(', ');
    seatInfo = passengerList.length === 1 ? 
      `Asiento ${seatNumbers}` : 
      `Asientos ${seatNumbers}`;
  }

  // Determinar el estado en español
  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado';
      case 'BOARDED':
        return 'Abordado';
      case 'USED':
        return 'Completado';
      case 'CANCELLED':
        return 'Cancelado';
      case 'EXPIRED':
        return 'Expirado';
      case 'PENDING':
        return 'Pendiente';
      case 'PAID':
        return 'Pagado';
      default:
        return status;
    }
  };

  return {
    id: ticket.id.toString(),
    orderNumber: `#${backendTicket.id}`,
    origin: routeInfo.originCity,
    destination: routeInfo.destinationCity,
    departureDate,
    departureTime,
    company,
    seats: seatInfo,
    price: backendTicket.totalAmount,
    status: ticket.status,
    statusText: getStatusText(ticket.status),
    passengerCount: ticket.passengerCount,
    qrCode: ticket.qrCode,
    qrBase64: ticket.qrBase64, // Agregar el campo qrBase64 del backend
    ticketId: ticket.id, // ID para obtener el QR
    passengers: passengerList.map(p => ({
      name: p.passengerName,
      seat: p.seatNumber,
      type: p.seatType,
      price: p.finalPrice
    }))
  };
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
