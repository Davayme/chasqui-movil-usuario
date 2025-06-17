import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
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
      <Text style={styles.sectionTitle}>Información del Pasajero</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el nombre"
          value={firstName}
          onChangeText={onChangeFirstName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingrese el apellido"
          value={lastName}
          onChangeText={onChangeLastName}
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
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.backgroundTertiary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundSecondary,
  }
});