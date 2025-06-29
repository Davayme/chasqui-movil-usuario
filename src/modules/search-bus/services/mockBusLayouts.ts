// Diseños de buses para la visualización en la pantalla de selección de asientos

// Representación gráfica de la distribución de asientos en un bus estándar (1 piso)
export const singleDeckBusLayout = {
  // 10 filas de 4 asientos, con pasillo en el medio
  rows: 10,
  seatsPerRow: 4,
  aisleAfterSeat: 2, // El pasillo está después del asiento 2 (de izquierda a derecha)
  
  // Posiciones especiales (0-indexed)
  specialPositions: {
    driver: { row: 0, col: 0 }, // Posición del conductor
    entrance: { row: 0, col: 3 }, // Entrada principal
    bathroom: { row: 9, col: 3 }, // Baño
    disabledSeats: [{ row: 4, col: 3 }], // Asientos para discapacitados
    exitDoor: { row: 5, col: 0 }, // Puerta de salida de emergencia
  },
  
  // VIP seats (primeras 2 filas)
  vipRows: [0, 1],
  
  // Asientos eliminados (que no existen en el diseño)
  removedSeats: [
    { row: 0, col: 0 }, // Conductor
    { row: 0, col: 1 }, // Escalones
  ],
};

// Representación gráfica de la distribución de asientos en un bus de dos pisos
export const doubleDeckBusLayout = {
  // Piso inferior
  lowerDeck: {
    rows: 6,
    seatsPerRow: 4,
    aisleAfterSeat: 2,
    specialPositions: {
      driver: { row: 0, col: 0 },
      entrance: { row: 0, col: 3 },
      stairs: { row: 5, col: 3 }, // Escaleras al segundo piso
      exitDoor: { row: 3, col: 0 },
    },
    vipRows: [1, 2], // Asientos VIP en piso inferior
    removedSeats: [
      { row: 0, col: 0 }, // Conductor
      { row: 0, col: 1 }, // Escalones
      { row: 5, col: 3 }, // Escaleras
    ],
  },
  
  // Piso superior
  upperDeck: {
    rows: 12,
    seatsPerRow: 4,
    aisleAfterSeat: 2,
    specialPositions: {
      stairs: { row: 0, col: 3 }, // Escaleras desde el primer piso
      bathroom: { row: 11, col: 3 }, // Baño
      disabledSeats: [{ row: 6, col: 3 }], // Asientos para discapacitados
    },
    vipRows: [0, 1, 2], // Asientos VIP en piso superior
    removedSeats: [
      { row: 0, col: 3 }, // Escaleras
    ],
  }
};

// Mapeo de los tipos de buses a sus layouts
export const busLayoutMapping = {
  1: singleDeckBusLayout, // Bus ID 1 (single deck)
  2: doubleDeckBusLayout, // Bus ID 2 (double deck)
  3: singleDeckBusLayout, // Bus ID 3 (single deck, misma configuración que ID 1)
  4: singleDeckBusLayout, // Bus ID 4 (single deck, misma configuración que ID 1)
};

// Función para traducir el ID de un asiento a su posición visual en el layout
export const seatIdToPosition = (busId: number, seatNumber: string): { deck: 'lower' | 'upper', row: number, col: number } | null => {
  const layout = busLayoutMapping[busId as keyof typeof busLayoutMapping];
  if (!layout) return null;
  
  const seatNum = parseInt(seatNumber);
  
  // Para buses de un solo piso
  if (!('lowerDeck' in layout)) {
    const totalSeatsPerRow = layout.seatsPerRow;
    const row = Math.floor((seatNum - 1) / totalSeatsPerRow);
    const col = (seatNum - 1) % totalSeatsPerRow;
    
    return { deck: 'lower', row, col };
  }
  
  // Para buses de dos pisos
  const lowerDeckLayout = (layout as typeof doubleDeckBusLayout).lowerDeck;
  const upperDeckLayout = (layout as typeof doubleDeckBusLayout).upperDeck;
  
  const lowerDeckSeats = lowerDeckLayout.rows * lowerDeckLayout.seatsPerRow - lowerDeckLayout.removedSeats.length;
  
  if (seatNum <= lowerDeckSeats) {
    // Asiento en el piso inferior
    const totalSeatsPerRow = lowerDeckLayout.seatsPerRow;
    const row = Math.floor((seatNum - 1) / totalSeatsPerRow);
    const col = (seatNum - 1) % totalSeatsPerRow;
    
    return { deck: 'lower', row, col };
  } else {
    // Asiento en el piso superior
    const upperSeatNum = seatNum - lowerDeckSeats;
    const totalSeatsPerRow = upperDeckLayout.seatsPerRow;
    const row = Math.floor((upperSeatNum - 1) / totalSeatsPerRow);
    const col = (upperSeatNum - 1) % totalSeatsPerRow;
    
    return { deck: 'upper', row, col };
  }
}; 