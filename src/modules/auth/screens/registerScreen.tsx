import { showToast } from '@/src/common/components/Toast';
import { API_ENDPOINTS, API_URL } from '@/src/common/config/config';
import { Colors } from '@/src/common/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Document type dropdown options
const DOCUMENT_TYPES = [
  { label: 'Cédula', value: 'cedula' },
  { label: 'RUC', value: 'ruc' },
];

export default function RegisterScreen() {
  // Form state
  const [formData, setFormData] = useState({
    idNumber: '',
    documentType: 'cedula',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showDocumentTypeDropdown, setShowDocumentTypeDropdown] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input change
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Validate the field if it's been touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched({
      ...touched,
      [field]: true,
    });
    
    validateField(field, formData[field as keyof typeof formData]);
  };

  // Validate individual field
  const validateField = (field: string, value: string) => {
    let newErrors = { ...errors };
    
    switch (field) {
      case 'idNumber':
        if (!value) {
          newErrors.idNumber = 'El número de documento es requerido';
        } else if (formData.documentType === 'cedula' && !/^\d{10}$/.test(value)) {
          newErrors.idNumber = 'La cédula debe tener 10 dígitos';
        } else if (formData.documentType === 'ruc' && !/^\d{13}$/.test(value)) {
          newErrors.idNumber = 'El RUC debe tener 13 dígitos';
        } else {
          delete newErrors.idNumber;
        }
        break;
      
      case 'firstName':
        if (!value) {
          newErrors.firstName = 'El nombre es requerido';
        } else {
          delete newErrors.firstName;
        }
        break;
      
      case 'lastName':
        if (!value) {
          newErrors.lastName = 'El apellido es requerido';
        } else {
          delete newErrors.lastName;
        }
        break;
      
      case 'email':
        if (!value) {
          newErrors.email = 'El correo electrónico es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Ingrese un correo electrónico válido';
        } else {
          delete newErrors.email;
        }
        break;
      
      case 'phone':
        if (!value) {
          newErrors.phone = 'El teléfono es requerido';
        } else if (!/^\+593\d{9}$/.test(value)) {
          newErrors.phone = 'Ingrese un número válido con formato +593XXXXXXXXX';
        } else {
          delete newErrors.phone;
        }
        break;
      
      case 'password':
        if (!value) {
          newErrors.password = 'La contraseña es requerida';
        } else if (value.length < 8) {
          newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password = 'La contraseña debe tener al menos una mayúscula';
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password = 'La contraseña debe tener al menos un número';
        } else {
          delete newErrors.password;
        }
        
        // Also validate confirmPassword if it has been touched
        if (touched.confirmPassword) {
          if (formData.confirmPassword !== value) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
          } else {
            delete newErrors.confirmPassword;
          }
        }
        break;
      
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Confirme su contraseña';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate all fields
  const validateForm = () => {
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    // Validate each field
    let isValid = true;
    let newErrors: Record<string, string> = {};
    
    Object.entries(formData).forEach(([field, value]) => {
      if (!validateField(field, value as string)) {
        isValid = false;
      }
    });
    
    // Additional validation for password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }
    
    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Por favor corrija los errores en el formulario',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch(`${API_URL}${API_ENDPOINTS.USER.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }
      
      showToast({
        type: 'success',
        title: 'Registro exitoso',
        message: 'Su cuenta ha sido creada correctamente',
      });
      
      // Navigate to login screen
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('Error en registro:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Ocurrió un error durante el registro',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select document type
  const selectDocumentType = (type: string) => {
    setFormData({
      ...formData,
      documentType: type,
    });
    setShowDocumentTypeDropdown(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            
            <Image 
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
          </View>
          
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Ingrese sus datos para registrarse</Text>
          
          <View style={styles.form}>
            {/* Document Type Selector */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de documento</Text>
              <TouchableOpacity 
                style={styles.dropdownSelector}
                onPress={() => setShowDocumentTypeDropdown(!showDocumentTypeDropdown)}
              >
                <Text style={styles.dropdownText}>
                  {DOCUMENT_TYPES.find(type => type.value === formData.documentType)?.label}
                </Text>
                <Ionicons 
                  name={showDocumentTypeDropdown ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={Colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {showDocumentTypeDropdown && (
                <View style={styles.dropdownMenu}>
                  {DOCUMENT_TYPES.map((type) => (
                    <TouchableOpacity 
                      key={type.value}
                      style={styles.dropdownItem}
                      onPress={() => selectDocumentType(type.value)}
                    >
                      <Text style={styles.dropdownItemText}>{type.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* ID Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número de {formData.documentType === 'cedula' ? 'cédula' : 'RUC'}</Text>
              <TextInput
                style={[styles.input, errors.idNumber ? styles.inputError : null]}
                placeholder={`Ingrese su número de ${formData.documentType === 'cedula' ? 'cédula' : 'RUC'}`}
                value={formData.idNumber}
                onChangeText={(text) => handleChange('idNumber', text)}
                onBlur={() => handleBlur('idNumber')}
                keyboardType="numeric"
              />
              {errors.idNumber && <Text style={styles.errorText}>{errors.idNumber}</Text>}
            </View>
            
            {/* First Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombres</Text>
              <TextInput
                style={[styles.input, errors.firstName ? styles.inputError : null]}
                placeholder="Ingrese sus nombres"
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                onBlur={() => handleBlur('firstName')}
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
            </View>
            
            {/* Last Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Apellidos</Text>
              <TextInput
                style={[styles.input, errors.lastName ? styles.inputError : null]}
                placeholder="Ingrese sus apellidos"
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                onBlur={() => handleBlur('lastName')}
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
            </View>
            
            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="Ingrese su correo electrónico"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                onBlur={() => handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            
            {/* Phone */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={[styles.input, errors.phone ? styles.inputError : null]}
                placeholder="Ingrese su teléfono (+593XXXXXXXXX)"
                value={formData.phone}
                onChangeText={(text) => handleChange('phone', text)}
                onBlur={() => handleBlur('phone')}
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>
            
            {/* Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={[styles.input, errors.password ? styles.inputError : null]}
                placeholder="Ingrese su contraseña"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                onBlur={() => handleBlur('password')}
                secureTextEntry
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            
            {/* Confirm Password */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword ? styles.inputError : null]}
                placeholder="Confirme su contraseña"
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                onBlur={() => handleBlur('confirmPassword')}
                secureTextEntry
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            
            {/* Register Button */}
            <TouchableOpacity 
              style={[
                styles.registerButton,
                isLoading ? styles.registerButtonDisabled : null
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  dropdownSelector: {
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 5,
    overflow: 'hidden',
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.gray400,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: Colors.textSecondary,
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
