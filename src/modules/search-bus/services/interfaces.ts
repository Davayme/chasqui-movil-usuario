// Interfaces para datos de búsqueda y compra de pasajes

// Datos para pantalla de selección de bus
export interface TripSearchResult {
  id: number;
  routeId: number;
  busId: number;
  date: Date;
  departureTime: Date;
  originCity: string;
  destinationCity: string;
  intermediateStops: string[];
  price: number;
  cooperativeName: string;
  cooperativeLogo: string;
  busDetails: {
    licensePlate: string;
    chassisBrand: string;
    bodyworkBrand: string;
    photos: string[];
    floorCount: number;
  };
  availableSeats: number;
  totalSeats: number;
}

// Datos para pantalla de selección de asientos
export interface BusSeat {
  id: number;
  busId: number;
  number: string;
  type: string; // 'normal' | 'VIP' | 'discapacitado'
  location: string; // 'pasillo' | 'ventana'
  isOccupied?: boolean;
  isSelected?: boolean;
  isDeleted: boolean;
}

export interface PassengerInfo {
  seatId: number;
  type: string; // 'normal' | 'menor' | 'discapacitado' | 'tercera_edad'
}

// Datos para pantalla de confirmación de compra
export interface TicketPreview {
  tripInfo: {
    routeSheetId: number;
    date: Date;
    departureTime: Date;
    originCity: string;
    destinationCity: string;
    cooperativeName: string;
    cooperativeLogo: string;
    busLicensePlate: string;
  };
  seats: {
    seatId: number;
    seatNumber: string;
    seatType: string;
    seatLocation: string;
    passengerType: string;
    price: number;
    discount: number;
    finalPrice: number;
  }[];
  pricing: {
    subtotal: number;
    totalDiscount: number;
    totalPrice: number;
    serviceFee: number;
    grandTotal: number;
  };
  paymentMethods: {
    id: string;
    name: string;
  }[];
}

// Datos para confirmación final de compra
export interface TicketPurchaseRequest {
  routeSheetId: number;
  userId: number;
  seats: {
    seatId: number;
    passengerType: string;
  }[];
  payment: {
    method: string;
    amount: number;
  };
}

export interface TicketPurchaseResponse {
  success: boolean;
  ticketIds: number[];
  qrCodes: string[];
  receiptUrl: string;
} 