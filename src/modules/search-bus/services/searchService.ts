import { API_ENDPOINTS, API_URL } from '../../../common/config/config';
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
  routeSheetDetailId: number | null;
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

// Interface para el autocompletado de ciudades
export interface CityAutocomplete {
  id: number;
  name: string;
  province: string;
  isDeleted?: boolean;
}

// Cache para las ciudades
let citiesCache: CityAutocomplete[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para obtener todas las ciudades del backend
export const fetchCitiesFromBackend = async (): Promise<CityAutocomplete[]> => {
  try {
    // Verificar si el cache es válido
    const now = Date.now();
    if (citiesCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      return citiesCache;
    }

    const url = `${API_URL}${API_ENDPOINTS.CITIES.GET_CITIES}`;
    console.log('Obteniendo ciudades del backend:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Error al obtener ciudades:', response.status, response.statusText);
      return [];
    }

    const data: CityAutocomplete[] = await response.json();
    
    // Filtrar ciudades no eliminadas
    const activeCities = data.filter(city => !city.isDeleted);
    
    // Actualizar cache
    citiesCache = activeCities;
    cacheTimestamp = now;
    
    console.log('Ciudades obtenidas del backend:', activeCities.length);
    return activeCities;

  } catch (error) {
    console.error('Error al obtener ciudades del backend:', error);
    return [];
  }
};

// Función para buscar ciudades
export const searchCities = async (query: string): Promise<CityAutocomplete[]> => {
  if (!query || query.length < 2) return [];
  
  const allCities = await fetchCitiesFromBackend();
  const normalizedQuery = query.toLowerCase().trim();
  
  return allCities.filter(city => 
    city.name.toLowerCase().includes(normalizedQuery) ||
    city.province.toLowerCase().includes(normalizedQuery)
  ).slice(0, 5); // Limitar a 5 resultados para no sobrecargar la UI
};

// Función para obtener el ID de una ciudad por su nombre (usando datos del backend)
export const getCityIdByName = async (cityName: string): Promise<number | null> => {
  const allCities = await fetchCitiesFromBackend();
  const normalizedName = cityName.toLowerCase().trim();
  
  const city = allCities.find(city => 
    city.name.toLowerCase() === normalizedName
  );
  
  return city ? city.id : null;
};

// Función para buscar viajes disponibles usando el endpoint real
export const searchAvailableTrips = async (
  originCity: string,
  destinationCity: string,
  date: string
): Promise<TripSearchResult[]> => {
  try {
    // Obtener IDs de las ciudades
    const originCityId = await getCityIdByName(originCity);
    const destinationCityId = await getCityIdByName(destinationCity);

    if (!originCityId || !destinationCityId) {
      console.error('Ciudad no encontrada:', { originCity, destinationCity });
      return [];
    }

    // Construir la URL del endpoint
    const url = `${API_URL}${API_ENDPOINTS.FRECUENCIES.GET_FRECUENCIES}?originCityId=${originCityId}&destinationCityId=${destinationCityId}&date=${date}`;
    
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
    
    // Verificar si hay viajes con routeSheetDetailId null
    const tripsWithNullId = data.filter(trip => trip.routeSheetDetailId === null);
    if (tripsWithNullId.length > 0) {
      console.warn(`⚠️ Se encontraron ${tripsWithNullId.length} viajes con routeSheetDetailId null. Estos no se podrán seleccionar.`);
    }
    
    return data;

  } catch (error) {
    console.error('Error al buscar viajes:', error);
    return [];
  }
};