import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { TicketFilter } from '../services/ticket-service';

interface TicketFiltersProps {
  filter: TicketFilter;
  onFilterChange: (filter: TicketFilter) => void;
  ticketCount?: number;
  totalTickets?: number;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({ filter, onFilterChange, ticketCount, totalTickets }) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
        onPress={() => onFilterChange('active')}
      >
        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
          Boletos Activos
        </Text>
        {filter === 'active' && ticketCount !== undefined && (
          <Text style={styles.countText}>({ticketCount})</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
        onPress={() => onFilterChange('past')}
      >
        <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
          Boletos Pasados
        </Text>
        {filter === 'past' && ticketCount !== undefined && (
          <Text style={styles.countText}>({ticketCount})</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 4,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary + '20',
  },
  filterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

export default TicketFilters;