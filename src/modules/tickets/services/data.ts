export const MOCK_TICKETS = [
  {
    id: '1',
    orderNumber: 'T-12345',
    origin: 'Quito',
    destination: 'Guayaquil',
    departureDate: '15 de mayo, 2023',
    departureTime: '08:30',
    company: 'Transportes Express',
    seat: '24',
    status: 'active', // active o past
  },
  {
    id: '2',
    orderNumber: 'T-12346',
    origin: 'Cuenca',
    destination: 'Quito',
    departureDate: '20 de mayo, 2023',
    departureTime: '10:45',
    company: 'Viajes Rápidos',
    seat: '15',
    status: 'active',
  },
  {
    id: '3',
    orderNumber: 'T-12347',
    origin: 'Guayaquil',
    destination: 'Manta',
    departureDate: '25 de mayo, 2023',
    departureTime: '14:15',
    company: 'Transportes Nacional',
    seat: '8',
    status: 'active',
  },
  {
    id: '4',
    orderNumber: 'T-12330',
    origin: 'Quito',
    destination: 'Loja',
    departureDate: '1 de mayo, 2023',
    departureTime: '07:30',
    company: 'Rutas Ecuador',
    seat: '16',
    status: 'past',
  },
  {
    id: '5',
    orderNumber: 'T-12321',
    origin: 'Manta',
    destination: 'Guayaquil',
    departureDate: '5 de mayo, 2023',
    departureTime: '09:00',
    company: 'Transportes Express',
    seat: '22',
    status: 'past',
  },
];

// Tipo para los tickets
export type Ticket = typeof MOCK_TICKETS[0];

// Tipo de filtro de boletos
export type TicketFilter = 'active' | 'past';