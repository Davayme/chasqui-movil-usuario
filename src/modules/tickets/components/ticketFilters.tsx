import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { TicketFilter } from '../services/data';

interface TicketFiltersProps {
  filter: TicketFilter;
  onFilterChange: (filter: TicketFilter) => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({ filter, onFilterChange }) => {
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity 
        style={[styles.filterButton, filter === 'active' && styles.filterButtonActive]}
        onPress={() => onFilterChange('active')}
      >
        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>
          Boletos Activos
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.filterButton, filter === 'past' && styles.filterButtonActive]}
        onPress={() => onFilterChange('past')}
      >
        <Text style={[styles.filterText, filter === 'past' && styles.filterTextActive]}>
          Boletos Pasados
        </Text>
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
});

export default TicketFilters;