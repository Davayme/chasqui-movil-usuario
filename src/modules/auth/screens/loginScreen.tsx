import { Colors } from '@/src/common/constants/colors';
import { useAuth } from '@/src/common/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{email?: string, password?: string, general?: string}>({});
    const [touched, setTouched] = useState<{email: boolean, password: boolean}>({email: false, password: false});

    // Validate email
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        if (!isValid && touched.email) {
            setErrors(prev => ({...prev, email: 'Ingresa un correo electrónico válido'}));
        } else {
            setErrors(prev => ({...prev, email: undefined}));
        }
        
        return isValid;
    };

    // Validate password
    const validatePassword = (password: string): boolean => {
        const isValid = password.length >= 6;
        
        if (!isValid && touched.password) {
            setErrors(prev => ({...prev, password: 'La contraseña debe tener al menos 6 caracteres'}));
        } else {
            setErrors(prev => ({...prev, password: undefined}));
        }
        
        return isValid;
    };

    // Handle field blur
    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({...prev, [field]: true}));
        
        if (field === 'email') {
            validateEmail(email);
        } else {
            validatePassword(password);
        }
    };

    const handleLogin = async () => {
        // Mark all fields as touched
        setTouched({email: true, password: true});
        
        // Validate all fields
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Clear general error
        setErrors(prev => ({...prev, general: undefined}));
        
        // Attempt login
        const success = await login(email, password);
        
        if (success) {
            router.replace('/(tabs)/home');
        } else {
            setErrors(prev => ({...prev, general: 'Credenciales incorrectas. Intenta nuevamente.'}));
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="dark" />
            
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../../../assets/images/logo.png')}
                    style={styles.logo}
                    contentFit="contain"
                />
                <Text style={styles.appName}>Chasqui-Go</Text>
                
            </View>
            
            <View style={styles.formContainer}>
                <Text style={styles.title}>Iniciar Sesión</Text>
                
                {errors.general ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={20} color={Colors.danger} />
                        <Text style={styles.errorText}>{errors.general}</Text>
                    </View>
                ) : null}
                
                <View style={[
                    styles.inputContainer, 
                    errors.email ? styles.inputError : null
                ]}>
                    <Ionicons 
                        name="mail-outline" 
                        size={22} 
                        color={errors.email ? Colors.danger : Colors.textSecondary} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor={Colors.textSecondary}
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (touched.email) validateEmail(text);
                        }}
                        onBlur={() => handleBlur('email')}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>
                {errors.email ? (
                    <Text style={styles.fieldErrorText}>{errors.email}</Text>
                ) : null}
                
                <View style={[
                    styles.inputContainer, 
                    errors.password ? styles.inputError : null
                ]}>
                    <Ionicons 
                        name="lock-closed-outline" 
                        size={22} 
                        color={errors.password ? Colors.danger : Colors.textSecondary} 
                        style={styles.inputIcon} 
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor={Colors.textSecondary}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (touched.password) validatePassword(text);
                        }}
                        onBlur={() => handleBlur('password')}
                        secureTextEntry
                    />
                </View>
                {errors.password ? (
                    <Text style={styles.fieldErrorText}>{errors.password}</Text>
                ) : null}
                
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[
                        styles.loginButton,
                        (!email || !password) ? styles.loginButtonDisabled : null
                    ]}
                    onPress={handleLogin}
                    disabled={isLoading || !email || !password}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.loginButtonText}>Ingresar</Text>
                    )}
                </TouchableOpacity>
                
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={styles.registerLink}>Regístrate</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        marginTop: 10,
    },
    tagline: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 5,
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.textPrimary,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: Colors.danger,
        marginLeft: 5,
        fontSize: 14,
    },
    fieldErrorText: {
        color: Colors.danger,
        fontSize: 12,
        marginLeft: 5,
        marginTop: -10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    inputError: {
        borderColor: Colors.danger,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: Colors.textPrimary,
        fontSize: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,
    },
    forgotPasswordText: {
        color: Colors.primary,
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonDisabled: {
        backgroundColor: Colors.gray400,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: Colors.textSecondary,
    },
    registerLink: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
