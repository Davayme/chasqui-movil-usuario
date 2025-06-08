import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';
import { TicketFilter } from '../services/data';

interface EmptyListTicketProps {
  filter: TicketFilter;
}

const EmptyListTicket: React.FC<EmptyListTicketProps> = ({ filter }) => {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={80} color={Colors.textSecondary} style={styles.emptyIcon} />
      <Text style={styles.emptyText}>
        {filter === 'active' 
          ? 'No tienes boletos activos por el momento' 
          : 'No se encontraron boletos pasados'
        }
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default EmptyListTicket;