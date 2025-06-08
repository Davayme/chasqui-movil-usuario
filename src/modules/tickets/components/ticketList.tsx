import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Ticket, TicketFilter } from '../services/data';
import EmptyListTicket from './emptyListTicket';
import TicketCard from './ticketCard';

interface TicketListProps {
  tickets: Ticket[];
  filter: TicketFilter;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, filter }) => {
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
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
});

export default TicketList;