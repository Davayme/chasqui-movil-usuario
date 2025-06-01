export interface City {
  id: string;
  name: string;
  province: string;
}

export interface Route {
  id: string;
  routeSheetId: string;
  cooperativeId: number;
  cooperativeName: string;
  cooperativeLogo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  departureDate: string;
  price: number;
  busType: string;
  availableSeats: number;
  amenities: string[];
}

// Lista de ciudades disponibles
export const CITIES: City[] = [
  { id: '1', name: 'Quito', province: 'Pichincha' },
  { id: '2', name: 'Guayaquil', province: 'Guayas' },
  { id: '3', name: 'Cuenca', province: 'Azuay' },
  { id: '4', name: 'Ambato', province: 'Tungurahua' },
  { id: '5', name: 'Santo Domingo', province: 'Santo Domingo de los Tsáchilas' },
  { id: '6', name: 'Machala', province: 'El Oro' },
  { id: '7', name: 'Durán', province: 'Guayas' },
  { id: '8', name: 'Portoviejo', province: 'Manabí' },
  { id: '9', name: 'Loja', province: 'Loja' },
  { id: '10', name: 'Manta', province: 'Manabí' },
  { id: '11', name: 'Esmeraldas', province: 'Esmeraldas' },
  { id: '12', name: 'Riobamba', province: 'Chimborazo' },
  { id: '13', name: 'Quevedo', province: 'Los Ríos' },
  { id: '14', name: 'Ibarra', province: 'Imbabura' },
  { id: '15', name: 'Babahoyo', province: 'Los Ríos' }
];

// Función para buscar ciudades
export const searchCities = (query: string): City[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return CITIES.filter(city => 
    city.name.toLowerCase().includes(normalizedQuery) ||
    city.province.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5); // Limitar a 5 resultados para no sobrecargar la UI
};

// Rutas disponibles (mock)
export const MOCK_ROUTES: Route[] = [
  {
    id: '1',
    routeSheetId: '101',
    cooperativeId: 1,
    cooperativeName: 'Transportes Express',
    cooperativeLogo: 'https://example.com/logos/express.png',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureTime: '08:30',
    arrivalTime: '12:30',
    duration: '4h',
    departureDate: '2023-05-15',
    price: 25.00,
    busType: 'Ejecutivo',
    availableSeats: 23,
    amenities: ['Aire acondicionado', 'WiFi', 'Asientos reclinables', 'Baño']
  },
  {
    id: '2',
    routeSheetId: '102',
    cooperativeId: 2,
    cooperativeName: 'Viajes Rápidos',
    cooperativeLogo: 'https://example.com/logos/rapidos.png',
    origin: 'Quito',
    destination: 'Cuenca',
    departureTime: '09:45',
    arrivalTime: '14:00',
    duration: '4h 15m',
    departureDate: '2023-05-15',
    price: 28.50,
    busType: 'Premium',
    availableSeats: 15,
    amenities: ['Aire acondicionado', 'WiFi', 'Asientos reclinables', 'Baño', 'TV']
  }
];