// Datos simulados para las pantallas de selección de bus, asientos y confirmación de compra

// Cooperativas
export const mockCooperatives = [
  {
    id: 1,
    name: 'Transportes Express',
    address: 'Av. Principal 123, Quito',
    phone: '0987654321',
    email: 'info@transportesexpress.com',
    logo: 'https://via.placeholder.com/150?text=Express',
    isDeleted: false
  },
  {
    id: 2,
    name: 'Rutas del Ecuador',
    address: 'Calle Sucre 456, Guayaquil',
    phone: '0998765432',
    email: 'contacto@rutasecuador.com',
    logo: 'https://via.placeholder.com/150?text=Rutas',
    isDeleted: false
  },
  {
    id: 3,
    name: 'Flota Imbabura',
    address: 'Av. Amazonas 789, Ibarra',
    phone: '0976543210',
    email: 'info@flotaimbabura.com',
    logo: 'https://via.placeholder.com/150?text=Imbabura',
    isDeleted: false
  }
];

// Buses
export const mockBuses = [
  {
    id: 1,
    cooperativeId: 1,
    licensePlate: 'ABC-123',
    chassisBrand: 'Mercedes-Benz',
    bodyworkBrand: 'Marcopolo',
    photos: [
      'https://via.placeholder.com/400x200?text=Bus+1+Ext',
      'https://via.placeholder.com/400x200?text=Bus+1+Int'
    ],
    capacity: 40,
    stoppageDays: 2,
    floorCount: 1,
    isDeleted: false
  },
  {
    id: 2,
    cooperativeId: 1,
    licensePlate: 'DEF-456',
    chassisBrand: 'Scania',
    bodyworkBrand: 'Busscar',
    photos: [
      'https://via.placeholder.com/400x200?text=Bus+2+Ext',
      'https://via.placeholder.com/400x200?text=Bus+2+Int'
    ],
    capacity: 48,
    stoppageDays: 1,
    floorCount: 2,
    isDeleted: false
  },
  {
    id: 3,
    cooperativeId: 2,
    licensePlate: 'GHI-789',
    chassisBrand: 'Volvo',
    bodyworkBrand: 'Comil',
    photos: [
      'https://via.placeholder.com/400x200?text=Bus+3+Ext',
      'https://via.placeholder.com/400x200?text=Bus+3+Int'
    ],
    capacity: 42,
    stoppageDays: 3,
    floorCount: 1,
    isDeleted: false
  },
  {
    id: 4,
    cooperativeId: 3,
    licensePlate: 'JKL-012',
    chassisBrand: 'Hino',
    bodyworkBrand: 'Yutong',
    photos: [
      'https://via.placeholder.com/400x200?text=Bus+4+Ext',
      'https://via.placeholder.com/400x200?text=Bus+4+Int'
    ],
    capacity: 38,
    stoppageDays: 2,
    floorCount: 1,
    isDeleted: false
  }
];

// Asientos de Bus
export const mockBusSeats = [
  // Bus 1 - Asientos
  ...[...Array(40)].map((_, index) => ({
    id: index + 1,
    busId: 1,
    number: String(index + 1).padStart(2, '0'),
    type: index < 8 ? 'VIP' : (index === 20 ? 'discapacitado' : 'normal'),
    location: index % 2 === 0 ? 'ventana' : 'pasillo',
    isDeleted: false
  })),
  
  // Bus 2 - Asientos (Piso 1: 24 asientos, Piso 2: 24 asientos)
  ...[...Array(48)].map((_, index) => ({
    id: 41 + index,
    busId: 2,
    number: String(index + 1).padStart(2, '0'),
    type: index < 12 ? 'VIP' : (index === 23 || index === 47 ? 'discapacitado' : 'normal'),
    location: index % 2 === 0 ? 'ventana' : 'pasillo',
    isDeleted: false
  })),
  
  // Bus 3 - Asientos
  ...[...Array(42)].map((_, index) => ({
    id: 89 + index,
    busId: 3,
    number: String(index + 1).padStart(2, '0'),
    type: index < 10 ? 'VIP' : (index === 21 ? 'discapacitado' : 'normal'),
    location: index % 2 === 0 ? 'ventana' : 'pasillo',
    isDeleted: false
  })),
  
  // Bus 4 - Asientos
  ...[...Array(38)].map((_, index) => ({
    id: 131 + index,
    busId: 4,
    number: String(index + 1).padStart(2, '0'),
    type: index < 6 ? 'VIP' : (index === 19 ? 'discapacitado' : 'normal'),
    location: index % 2 === 0 ? 'ventana' : 'pasillo',
    isDeleted: false
  }))
];

// Rutas
export const mockRoutes = [
  {
    id: 1,
    cooperativeId: 1,
    originCity: 'Quito',
    destinationCity: 'Guayaquil',
    departureTime: new Date(0, 0, 0, 8, 30), // 08:30 AM
    status: 'activo',
    antResolution: 'ANT-2023-0123',
    isDeleted: false
  },
  {
    id: 2,
    cooperativeId: 1,
    originCity: 'Quito',
    destinationCity: 'Cuenca',
    departureTime: new Date(0, 0, 0, 9, 0), // 09:00 AM
    status: 'activo',
    antResolution: 'ANT-2023-0124',
    isDeleted: false
  },
  {
    id: 3,
    cooperativeId: 2,
    originCity: 'Guayaquil',
    destinationCity: 'Cuenca',
    departureTime: new Date(0, 0, 0, 10, 30), // 10:30 AM
    status: 'activo',
    antResolution: 'ANT-2023-0125',
    isDeleted: false
  },
  {
    id: 4,
    cooperativeId: 3,
    originCity: 'Quito',
    destinationCity: 'Ibarra',
    departureTime: new Date(0, 0, 0, 7, 15), // 07:15 AM
    status: 'activo',
    antResolution: 'ANT-2023-0126',
    isDeleted: false
  },
  {
    id: 5,
    cooperativeId: 2,
    originCity: 'Quito',
    destinationCity: 'Guayaquil',
    departureTime: new Date(0, 0, 0, 14, 0), // 14:00 PM
    status: 'activo',
    antResolution: 'ANT-2023-0127',
    isDeleted: false
  }
];

// Paradas intermedias
export const mockIntermediateStops = [
  {
    id: 1,
    routeId: 1,
    city: 'Santo Domingo',
    order: 1,
    isDeleted: false
  },
  {
    id: 2,
    routeId: 1,
    city: 'Quevedo',
    order: 2,
    isDeleted: false
  },
  {
    id: 3,
    routeId: 2,
    city: 'Ambato',
    order: 1,
    isDeleted: false
  },
  {
    id: 4,
    routeId: 2,
    city: 'Riobamba',
    order: 2,
    isDeleted: false
  },
  {
    id: 5,
    routeId: 2,
    city: 'Azogues',
    order: 3,
    isDeleted: false
  },
  {
    id: 6,
    routeId: 3,
    city: 'La Troncal',
    order: 1,
    isDeleted: false
  }
];

// Hojas de ruta (viajes específicos en días específicos)
export const mockRouteSheets = [
  // Viajes para el día actual + 1
  {
    id: 1,
    routeId: 1,
    busId: 1,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'programado',
    isDeleted: false
  },
  {
    id: 2,
    routeId: 2,
    busId: 2,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'programado',
    isDeleted: false
  },
  {
    id: 3,
    routeId: 5,
    busId: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: 'programado',
    isDeleted: false
  },
  
  // Viajes para el día actual + 2
  {
    id: 4,
    routeId: 1,
    busId: 1,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'programado',
    isDeleted: false
  },
  {
    id: 5,
    routeId: 3,
    busId: 3,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'programado',
    isDeleted: false
  },
  {
    id: 6,
    routeId: 4,
    busId: 4,
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'programado',
    isDeleted: false
  }
];

// Tickets (algunos asientos ya ocupados)
export const mockTickets = [
  // Algunos asientos ocupados para el primer viaje (id: 1)
  {
    id: 1,
    userId: 101,
    routeSheetId: 1,
    seatId: 3, // Asiento 3 del bus 1
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 2)),
    passengerType: 'normal',
    price: 25.0,
    discount: 0.0,
    status: 'confirmado',
    qrCode: 'qr-code-1',
    originStop: 'Quito',
    destinationStop: 'Guayaquil',
    isDeleted: false
  },
  {
    id: 2,
    userId: 102,
    routeSheetId: 1,
    seatId: 4, // Asiento 4 del bus 1
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    passengerType: 'normal',
    price: 25.0,
    discount: 0.0,
    status: 'confirmado',
    qrCode: 'qr-code-2',
    originStop: 'Quito',
    destinationStop: 'Guayaquil',
    isDeleted: false
  },
  {
    id: 3,
    userId: 103,
    routeSheetId: 1,
    seatId: 7, // Asiento 7 del bus 1
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    passengerType: 'discapacitado',
    price: 25.0,
    discount: 12.5,
    status: 'confirmado',
    qrCode: 'qr-code-3',
    originStop: 'Quito',
    destinationStop: 'Santo Domingo',
    isDeleted: false
  },
  
  // Algunos asientos ocupados para el segundo viaje (id: 2)
  {
    id: 4,
    userId: 104,
    routeSheetId: 2,
    seatId: 41, // Asiento 1 del bus 2
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    passengerType: 'normal',
    price: 30.0,
    discount: 0.0,
    status: 'confirmado',
    qrCode: 'qr-code-4',
    originStop: 'Quito',
    destinationStop: 'Cuenca',
    isDeleted: false
  },
  {
    id: 5,
    userId: 105,
    routeSheetId: 2,
    seatId: 42, // Asiento 2 del bus 2
    purchaseDate: new Date(new Date().setDate(new Date().getDate() - 3)),
    passengerType: 'normal',
    price: 30.0,
    discount: 0.0,
    status: 'confirmado',
    qrCode: 'qr-code-5',
    originStop: 'Quito',
    destinationStop: 'Cuenca',
    isDeleted: false
  }
];

// Pagos de tickets
export const mockPayments = [
  {
    id: 1,
    ticketId: 1,
    method: 'tarjeta',
    amount: 25.0,
    status: 'completado',
    receipt: 'recibo-1',
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
    isDeleted: false
  },
  {
    id: 2,
    ticketId: 2,
    method: 'transferencia',
    amount: 25.0,
    status: 'completado',
    receipt: 'recibo-2',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    isDeleted: false
  },
  {
    id: 3,
    ticketId: 3,
    method: 'PayPal',
    amount: 12.5, // Con descuento
    status: 'completado',
    receipt: 'recibo-3',
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
    isDeleted: false
  },
  {
    id: 4,
    ticketId: 4,
    method: 'tarjeta',
    amount: 30.0,
    status: 'completado',
    receipt: 'recibo-4',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    isDeleted: false
  },
  {
    id: 5,
    ticketId: 5,
    method: 'transferencia',
    amount: 30.0,
    status: 'completado',
    receipt: 'recibo-5',
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
    isDeleted: false
  }
];

// Función para verificar si un asiento está ocupado para un viaje específico
export const isSeatOccupied = (routeSheetId: number, seatId: number): boolean => {
  return mockTickets.some(
    ticket => 
      ticket.routeSheetId === routeSheetId && 
      ticket.seatId === seatId && 
      ticket.status !== 'cancelado' &&
      !ticket.isDeleted
  );
};

// Función para buscar viajes disponibles según origen, destino y fecha
export const searchAvailableTrips = (origin: string, destination: string, date: string) => {
  const searchDate = new Date(date);
  console.log('Búsqueda:', { origin, destination, date, searchDate });
  
  // Verificar si es la fecha específica 2025-06-03
  const isSpecificDate = date === '2025-06-03' || 
                        (searchDate.getFullYear() === 2025 && 
                         searchDate.getMonth() === 5 && // Junio es 5 en JavaScript (0-indexed)
                         searchDate.getDate() === 3);
  
  // Si es la fecha específica y la ruta es Ambato-Quito, usar datos estáticos de searchService
  if (isSpecificDate && 
      origin.toLowerCase() === 'ambato' && 
      destination.toLowerCase() === 'quito') {
    
    // Importar los datos estáticos
    const { MOCK_ROUTES } = require('./searchService');
    
    // Buscar la ruta específica
    const specificRoute = MOCK_ROUTES.find(
      (route: { 
        origin: string; 
        destination: string; 
        departureDate: string;
        id: string;
        cooperativeId: number;
        cooperativeName: string;
        cooperativeLogo: string;
        price: number;
        availableSeats: number;
        departureTime: string;
      }) => 
        route.origin.toLowerCase() === origin.toLowerCase() && 
        route.destination.toLowerCase() === destination.toLowerCase() &&
        route.departureDate === '2025-06-03'
    );
    
    if (specificRoute) {
      // Transformar el formato de la ruta al formato esperado por la interfaz TripSearchResult
      return [{
        id: parseInt(specificRoute.id),
        routeId: parseInt(specificRoute.id),
        busId: specificRoute.cooperativeId,
        date: new Date(specificRoute.departureDate),
        departureTime: new Date(`${specificRoute.departureDate}T${specificRoute.departureTime}`),
        originCity: specificRoute.origin,
        destinationCity: specificRoute.destination,
        intermediateStops: [],
        price: specificRoute.price,
        cooperativeName: specificRoute.cooperativeName,
        cooperativeLogo: specificRoute.cooperativeLogo || 'https://via.placeholder.com/150?text=Logo',
        busDetails: {
          licensePlate: 'DEF-456',
          chassisBrand: 'Scania',
          bodyworkBrand: 'Busscar',
          photos: ['https://via.placeholder.com/400x200?text=Bus+2+Ext'],
          floorCount: 2,
        },
        availableSeats: specificRoute.availableSeats,
        totalSeats: 48,
      }];
    }
  }
  
  // Encontrar rutas que coincidan con origen y destino
  const matchingRoutes = mockRoutes.filter(
    route => 
      route.originCity.toLowerCase() === origin.toLowerCase() && 
      route.destinationCity.toLowerCase() === destination.toLowerCase() &&
      route.status === 'activo' &&
      !route.isDeleted
  );
  
  // Encontrar hojas de ruta para esas rutas y fecha
  const matchingRouteSheets = mockRouteSheets.filter(
    sheet => {
      const sheetDate = new Date(sheet.date);
      return (
        matchingRoutes.some(route => route.id === sheet.routeId) &&
        sheetDate.getDate() === searchDate.getDate() &&
        sheetDate.getMonth() === searchDate.getMonth() &&
        sheetDate.getFullYear() === searchDate.getFullYear() &&
        sheet.status === 'programado' &&
        !sheet.isDeleted
      );
    }
  );
  
  // Obtener detalles completos de cada viaje
  return matchingRouteSheets.map(sheet => {
    const route = mockRoutes.find(r => r.id === sheet.routeId)!;
    const bus = mockBuses.find(b => b.id === sheet.busId)!;
    const cooperative = mockCooperatives.find(c => c.id === bus.cooperativeId)!;
    
    // Contar asientos disponibles
    const busSeats = mockBusSeats.filter(seat => seat.busId === bus.id && !seat.isDeleted);
    const occupiedSeatsCount = mockTickets.filter(
      ticket => 
        ticket.routeSheetId === sheet.id && 
        ticket.status !== 'cancelado' &&
        !ticket.isDeleted
    ).length;
    
    // Obtener paradas intermedias
    const intermediateStops = mockIntermediateStops
      .filter(stop => stop.routeId === route.id && !stop.isDeleted)
      .sort((a, b) => a.order - b.order);
    
    return {
      id: sheet.id,
      routeId: route.id,
      busId: bus.id,
      date: sheet.date,
      departureTime: route.departureTime,
      originCity: route.originCity,
      destinationCity: route.destinationCity,
      intermediateStops: intermediateStops.map(stop => stop.city),
      price: 25.0, // Precio base para esta ruta
      cooperativeName: cooperative.name,
      cooperativeLogo: cooperative.logo,
      busDetails: {
        licensePlate: bus.licensePlate,
        chassisBrand: bus.chassisBrand,
        bodyworkBrand: bus.bodyworkBrand,
        photos: bus.photos,
        floorCount: bus.floorCount,
      },
      availableSeats: busSeats.length - occupiedSeatsCount,
      totalSeats: busSeats.length,
    };
  });
};

// Función para obtener todos los asientos de un bus para un viaje específico
export const getBusSeatsForTrip = (routeSheetId: number) => {
  const routeSheet = mockRouteSheets.find(sheet => sheet.id === routeSheetId);
  if (!routeSheet) return [];
  
  const busId = routeSheet.busId;
  const seats = mockBusSeats.filter(seat => seat.busId === busId && !seat.isDeleted);
  
  return seats.map(seat => ({
    ...seat,
    isOccupied: isSeatOccupied(routeSheetId, seat.id)
  }));
};

// Información para pantalla de confirmación de compra
export const generateTicketPreview = (
  routeSheetId: number, 
  seatIds: number[],
  userId: number,
  passengerTypes: {seatId: number, type: string}[]
) => {
  const routeSheet = mockRouteSheets.find(sheet => sheet.id === routeSheetId);
  if (!routeSheet) return null;
  
  const route = mockRoutes.find(r => r.id === routeSheet.routeId);
  if (!route) return null;
  
  const bus = mockBuses.find(b => b.id === routeSheet.busId);
  if (!bus) return null;
  
  const cooperative = mockCooperatives.find(c => c.id === bus.cooperativeId);
  if (!cooperative) return null;
  
  const selectedSeats = seatIds.map(seatId => {
    const seat = mockBusSeats.find(s => s.id === seatId);
    const passengerType = passengerTypes.find(p => p.seatId === seatId)?.type || 'normal';
    
    // Calcular precio y descuento según tipo de pasajero
    let price = 25.0; // Precio base
    let discount = 0.0;
    
    if (passengerType === 'menor') {
      discount = price * 0.25; // 25% de descuento para menores
    } else if (passengerType === 'discapacitado' || passengerType === 'tercera_edad') {
      discount = price * 0.5; // 50% de descuento para discapacitados y tercera edad
    }
    
    return {
      seatId,
      seatNumber: seat?.number || '',
      seatType: seat?.type || '',
      seatLocation: seat?.location || '',
      passengerType,
      price,
      discount,
      finalPrice: price - discount
    };
  });
  
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.finalPrice, 0);
  
  return {
    tripInfo: {
      routeSheetId,
      date: routeSheet.date,
      departureTime: route.departureTime,
      originCity: route.originCity,
      destinationCity: route.destinationCity,
      cooperativeName: cooperative.name,
      cooperativeLogo: cooperative.logo,
      busLicensePlate: bus.licensePlate
    },
    seats: selectedSeats,
    pricing: {
      subtotal: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
      totalDiscount: selectedSeats.reduce((sum, seat) => sum + seat.discount, 0),
      totalPrice,
      serviceFee: 2.0 * selectedSeats.length, // Tarifa de servicio por boleto
      grandTotal: totalPrice + (2.0 * selectedSeats.length)
    },
    paymentMethods: [
      { id: 'tarjeta', name: 'Tarjeta de crédito/débito' },
      { id: 'transferencia', name: 'Transferencia bancaria' },
      { id: 'PayPal', name: 'PayPal' }
    ]
  };
}; 