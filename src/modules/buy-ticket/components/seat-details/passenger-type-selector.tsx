import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../../common/constants/colors';

type PassengerTypeOption = 'normal' | 'child' | 'elderly' | 'disabled';

interface PassengerTypeData {
  value: PassengerTypeOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  discount: number; // Porcentaje de descuento (0-100)
}

const passengerTypes: PassengerTypeData[] = [
  { value: 'normal', label: 'Adulto Normal', icon: 'person', discount: 0 },
  { value: 'child', label: 'Menor de edad', icon: 'happy', discount: 50 },
  { value: 'elderly', label: 'Tercera edad', icon: 'glasses', discount: 50 },
  { value: 'disabled', label: 'Persona con discapacidad', icon: 'accessibility', discount: 50 },
];

type PassengerTypeSelectorProps = {
  selectedType: PassengerTypeOption;
  onTypeChange: (type: PassengerTypeOption) => void;
};

export default function PassengerTypeSelector({ 
  selectedType, 
  onTypeChange 
}: PassengerTypeSelectorProps) {
  return (
    <View style={styles.optionsContainer}>
      {passengerTypes.map((type) => (
        <TouchableOpacity
          key={type.value}
          style={[
            styles.option,
            selectedType === type.value && styles.selectedOption
          ]}
          onPress={() => onTypeChange(type.value)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <View style={[
              styles.iconContainer,
              selectedType === type.value && styles.selectedIconContainer
            ]}>
              <Ionicons
                name={type.icon}
                size={20}
                color={selectedType === type.value ? Colors.backgroundPrimary : Colors.textSecondary}
              />
            </View>
            
            <View style={styles.optionInfo}>
              <Text style={[
                styles.optionLabel,
                selectedType === type.value && styles.selectedOptionLabel
              ]}>
                {type.label}
              </Text>
              {type.discount > 0 ? (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountText}>
                    {type.discount}% de descuento
                  </Text>
                  <Text style={styles.validationRequired}>
                    Requiere validación de documento
                  </Text>
                </View>
              ) : (
                <Text style={styles.noDiscountText}>
                  Precio normal
                </Text>
              )}
            </View>
          </View>
          
          <View style={[
            styles.radioButton,
            selectedType === type.value && styles.selectedRadioButton
          ]}>
            {selectedType === type.value && (
              <View style={styles.radioButtonInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.backgroundPrimary,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.backgroundSecondary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: Colors.primary,
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  selectedOptionLabel: {
    fontWeight: '600',
  },
  discountContainer: {
    marginTop: 2,
  },
  discountText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '500',
  },
  noDiscountText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  validationRequired: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
});
