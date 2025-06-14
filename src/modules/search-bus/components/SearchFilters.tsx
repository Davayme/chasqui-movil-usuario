import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../common/constants/colors';

interface SearchFiltersProps {
  onApplyFilters: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  sortBy: 'price' | 'time' | 'duration';
  timeRange: 'all' | 'morning' | 'afternoon' | 'evening';
  minPrice: number;
  maxPrice: number;
}

export default function SearchFilters({ onApplyFilters }: SearchFiltersProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'time',
    timeRange: 'all',
    minPrice: 0,
    maxPrice: 100,
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsModalVisible(false);
  };

  const handleSortByChange = (sortBy: FilterOptions['sortBy']) => {
    setFilters({ ...filters, sortBy });
  };

  const handleTimeRangeChange = (timeRange: FilterOptions['timeRange']) => {
    setFilters({ ...filters, timeRange });
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="options-outline" size={20} color={Colors.primary} />
        <Text style={styles.filterText}>Filtrar</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar resultados</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Ordenar por</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.sortBy === 'price' && styles.optionButtonActive
                  ]}
                  onPress={() => handleSortByChange('price')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.sortBy === 'price' && styles.optionTextActive
                    ]}
                  >
                    Precio
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.sortBy === 'time' && styles.optionButtonActive
                  ]}
                  onPress={() => handleSortByChange('time')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.sortBy === 'time' && styles.optionTextActive
                    ]}
                  >
                    Hora
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.sortBy === 'duration' && styles.optionButtonActive
                  ]}
                  onPress={() => handleSortByChange('duration')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.sortBy === 'duration' && styles.optionTextActive
                    ]}
                  >
                    Duración
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Horario</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.timeRange === 'all' && styles.optionButtonActive
                  ]}
                  onPress={() => handleTimeRangeChange('all')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.timeRange === 'all' && styles.optionTextActive
                    ]}
                  >
                    Todos
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.timeRange === 'morning' && styles.optionButtonActive
                  ]}
                  onPress={() => handleTimeRangeChange('morning')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.timeRange === 'morning' && styles.optionTextActive
                    ]}
                  >
                    Mañana
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.timeRange === 'afternoon' && styles.optionButtonActive
                  ]}
                  onPress={() => handleTimeRangeChange('afternoon')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.timeRange === 'afternoon' && styles.optionTextActive
                    ]}
                  >
                    Tarde
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.optionButton,
                    filters.timeRange === 'evening' && styles.optionButtonActive
                  ]}
                  onPress={() => handleTimeRangeChange('evening')}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      filters.timeRange === 'evening' && styles.optionTextActive
                    ]}
                  >
                    Noche
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApplyFilters}
            >
              <Text style={styles.applyButtonText}>Aplicar filtros</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
  },
  filterText: {
    marginLeft: 6,
    color: Colors.primary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray400,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 