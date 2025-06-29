import { API_ENDPOINTS, API_URL } from '../../../common/config/config';

// Interfaces para los asientos del backend
export interface Seat {
  id: number;
  number: string;
  type: 'VIP' | 'NORMAL';
  location: 'WINDOW_LEFT' | 'WINDOW_RIGHT' | 'AISLE_LEFT' | 'AISLE_RIGHT' | 'MIDDLE';
  isOccupied: boolean;
  occupiedBy?: {
    ticketId: number;
    ticketPassengerId: number;
    passengerType: string;
    passengerName: string;
    ticketStatus: string;
  };
}

export interface FloorLayout {
  floor: number;
  seats: Seat[];
}

export interface BusInfo {
  id: number;
  licensePlate: string;
  chassisBrand: string;
  bodyworkBrand: string;
  photo: string;
  busType: {
    id: number;
    name: string;
    floorCount: number;
    capacity: number;
  };
}

export interface RouteInfo {
  routeSheetDetailId: number;
  date: string;
  frequency: {
    id: number;
    departureTime: string;
    originCity: string;
    destinationCity: string;
  };
}

export interface SeatAvailability {
  normal: {
    total: number;
    available: number;
    occupied: number;
  };
  vip: {
    total: number;
    available: number;
    occupied: number;
  };
}

export interface SeatPricing {
  normalSeat: {
    basePrice: number;
    discounts: {
      CHILD: number;
      SENIOR: number;
      HANDICAPPED: number;
    };
  };
  vipSeat: {
    basePrice: number;
    discounts: {
      CHILD: number;
      SENIOR: number;
      HANDICAPPED: number;
    };
  };
}

export interface BusSeatsResponse {
  busInfo: BusInfo;
  routeInfo: RouteInfo;
  seatsLayout: FloorLayout[];
  availability: SeatAvailability;
  pricing?: SeatPricing; // Opcional por ahora, hasta que se actualice el backend
}

// Función para obtener los asientos del bus
export const fetchBusSeats = async (routeSheetDetailId: number): Promise<BusSeatsResponse | null> => {
  try {
    const url = `${API_URL}${API_ENDPOINTS.FRECUENCIES.GET_FREQUENCY_BY_ID}${routeSheetDetailId}`;
    console.log('Obteniendo asientos del bus:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener asientos:', response.status, response.statusText);
      return null;
    }

    const data: BusSeatsResponse = await response.json();
    console.log('Asientos obtenidos del backend:', data);
    return data;

  } catch (error) {
    console.error('Error al obtener asientos del backend:', error);
    return null;
  }
};

// Función para organizar asientos por fila
export const organizeSeatsByRow = (seats: Seat[]): Seat[][] => {
  // Agrupar asientos por número de fila (extraer el número de la letra)
  const seatsByRow: { [rowNumber: number]: Seat[] } = {};
  
  seats.forEach(seat => {
    // Extraer el número de fila del número de asiento (ej: "1A" -> 1, "12B" -> 12)
    const rowNumber = parseInt(seat.number.replace(/[A-Z]/g, ''));
    
    if (!seatsByRow[rowNumber]) {
      seatsByRow[rowNumber] = [];
    }
    
    seatsByRow[rowNumber].push(seat);
  });
  
  // Convertir a array y ordenar por número de fila
  const rows = Object.keys(seatsByRow)
    .map(Number)
    .sort((a, b) => a - b)
    .map(rowNumber => {
      // Ordenar asientos dentro de cada fila (A antes que B)
      return seatsByRow[rowNumber].sort((a, b) => a.number.localeCompare(b.number));
    });
  
  return rows;
};
