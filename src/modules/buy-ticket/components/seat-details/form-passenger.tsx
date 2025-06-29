import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors } from '../../../../common/constants/colors';

type FormPassengerProps = {
  onChangeFirstName: (text: string) => void;
  onChangeLastName: (text: string) => void;
  onChangeIdNumber: (text: string) => void;
  firstName?: string;
  lastName?: string;
  idNumber?: string;
};

export default function FormPassenger({ 
  onChangeFirstName, 
  onChangeLastName, 
  onChangeIdNumber,
  firstName = '',
  lastName = '',
  idNumber = ''
}: FormPassengerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el nombre"
          value={firstName}
          onChangeText={onChangeFirstName}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el apellido"
          value={lastName}
          onChangeText={onChangeLastName}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Cédula</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el número de cédula"
          keyboardType="numeric"
          value={idNumber}
          onChangeText={onChangeIdNumber}
          maxLength={10}
          placeholderTextColor={Colors.textLight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundPrimary,
  }
});