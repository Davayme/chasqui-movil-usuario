import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { TicketFilter } from '../services/ticket-service';
import EmptyListTicket from './emptyListTicket';
import TicketCard from './ticketCard';

interface UITicket {
  id: string;
  orderNumber: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  company: string;
  seats: string;
  price: number;
  status: string;
  statusText: string;
  passengerCount: number;
  qrCode?: string;
  qrBase64?: string;
  ticketId: number;
  passengers: {
    name: string;
    seat: string;
    type: string;
    price: number;
  }[];
}

interface TicketListProps {
  tickets: UITicket[];
  filter: TicketFilter;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, filter, onRefresh, isRefreshing }) => {
  if (tickets.length === 0) {
    return <EmptyListTicket filter={filter} />;
  }

  return (
    <FlatList
      data={tickets}
      renderItem={({ item }) => <TicketCard ticket={item} filter={filter} />}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing || false}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});

export default TicketList;