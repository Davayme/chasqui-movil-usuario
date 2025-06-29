import { API_URL } from '../../../common/config/config';

// Interfaces para la respuesta del backend
export interface City {
  id: number;
  name: string;
  province: string;
}

export interface IntermediateStop {
  id: number;
  order: number;
  city: City;
}

export interface Frequency {
  id: number;
  departureTime: string;
  status: string;
  antResolution: string;
  originCity: City;
  destinationCity: City;
  intermediateStops: IntermediateStop[];
}

export interface BusType {
  id: number;
  name: string;
  floorCount: number;
  capacity: number;
}

export interface Bus {
  id: number;
  licensePlate: string;
  chassisBrand: string;
  bodyworkBrand: string;
  photo: string | null;
  stoppageDays: number;
  busType: BusType;
}

export interface Cooperative {
  id: number;
  name: string;
  logo: string;
  phone: string;
  email: string;
}

export interface SeatsAvailability {
  normal: {
    available: number;
    total: number;
    sold: number;
  };
  vip: {
    available: number;
    total: number;
    sold: number;
  };
}

export interface SeatPricing {
  basePrice: number;
  discounts: {
    CHILD: number;
    SENIOR: number;
    HANDICAPPED: number;
  };
}

export interface Pricing {
  normalSeat: SeatPricing;
  vipSeat: SeatPricing;
}

export interface TripSearchResult {
  routeSheetDetailId: number;
  date: string;
  frequency: Frequency;
  bus: Bus;
  cooperative: Cooperative;
  seatsAvailability: SeatsAvailability;
  pricing: Pricing;
  status: string;
  duration: string;
  estimatedArrival: string;
}

// Interface para el autocompletado de ciudades (mantenemos la estructura anterior)
export interface CityAutocomplete {
  id: string;
  name: string;
  province: string;
}

// Lista de ciudades disponibles para autocompletado
export const CITIES: CityAutocomplete[] = [
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
export const searchCities = (query: string): CityAutocomplete[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return CITIES.filter(city => 
    city.name.toLowerCase().includes(normalizedQuery) ||
    city.province.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5); // Limitar a 5 resultados para no sobrecargar la UI
};

// Mapeo de nombres de ciudades a IDs (para el backend)
const CITY_NAME_TO_ID: { [key: string]: number } = {
  'quito': 1,
  'guayaquil': 2,
  'cuenca': 3,
  'ambato': 4,
  'santo domingo': 5,
  'machala': 6,
  'durán': 7,
  'portoviejo': 8,
  'loja': 9,
  'manta': 10,
  'esmeraldas': 11,
  'riobamba': 12,
  'quevedo': 13,
  'ibarra': 14,
  'babahoyo': 15
};

// Función para obtener el ID de una ciudad por su nombre
export const getCityIdByName = (cityName: string): number | null => {
  const normalizedName = cityName.toLowerCase().trim();
  return CITY_NAME_TO_ID[normalizedName] || null;
};

// Función para buscar viajes disponibles usando el endpoint real
export const searchAvailableTrips = async (
  originCity: string,
  destinationCity: string,
  date: string
): Promise<TripSearchResult[]> => {
  try {
    // Obtener IDs de las ciudades
    const originCityId = getCityIdByName(originCity);
    const destinationCityId = getCityIdByName(destinationCity);

    if (!originCityId || !destinationCityId) {
      console.error('Ciudad no encontrada:', { originCity, destinationCity });
      return [];
    }

    // Construir la URL del endpoint
    const url = `${API_URL}/frequencies/search-mock?originCityId=${originCityId}&destinationCityId=${destinationCityId}&date=${date}`;
    
    console.log('Realizando petición a:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error en la respuesta:', response.status, response.statusText);
      return [];
    }

    const data: TripSearchResult[] = await response.json();
    
    console.log('Datos recibidos del backend:', data);
    return data;

  } catch (error) {
    console.error('Error al buscar viajes:', error);
    return [];
  }
};