import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';

interface ResultCountProps {
  count: number;
}

export default function ResultCount({ count }: ResultCountProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.resultCountText}>
        {count} {count === 1 ? 'viaje encontrado' : 'viajes encontrados'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  resultCountText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
}); 