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
  errors?: {
    firstName?: string;
    lastName?: string;
    idNumber?: string;
  };
};

export default function FormPassenger({ 
  onChangeFirstName, 
  onChangeLastName, 
  onChangeIdNumber,
  firstName = '',
  lastName = '',
  idNumber = '',
  errors = {}
}: FormPassengerProps) {
  
  // Validación para solo permitir letras y espacios
  const handleFirstNameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    onChangeFirstName(filteredText);
  };

  const handleLastNameChange = (text: string) => {
    const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    onChangeLastName(filteredText);
  };

  // Validación para cédula: solo números, máximo 10 caracteres
  const handleIdNumberChange = (text: string) => {
    const filteredText = text.replace(/[^0-9]/g, '').slice(0, 10);
    onChangeIdNumber(filteredText);
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[
            styles.input,
            errors.firstName && styles.inputError
          ]}
          placeholder="Ingrese el nombre"
          value={firstName}
          onChangeText={handleFirstNameChange}
          placeholderTextColor={Colors.textLight}
          autoCapitalize="words"
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apellido</Text>
        <TextInput
          style={[
            styles.input,
            errors.lastName && styles.inputError
          ]}
          placeholder="Ingrese el apellido"
          value={lastName}
          onChangeText={handleLastNameChange}
          placeholderTextColor={Colors.textLight}
          autoCapitalize="words"
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Número de Cédula</Text>
        <TextInput
          style={[
            styles.input,
            errors.idNumber && styles.inputError
          ]}
          placeholder="Ingrese el número de cédula"
          keyboardType="numeric"
          value={idNumber}
          onChangeText={handleIdNumberChange}
          maxLength={10}
          placeholderTextColor={Colors.textLight}
        />
        {errors.idNumber && (
          <Text style={styles.errorText}>{errors.idNumber}</Text>
        )}
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
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: '#ffebee',
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  }
});