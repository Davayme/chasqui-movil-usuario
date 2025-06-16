import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../common/components/Header';
import { Colors } from '../../common/constants/colors';
import { useAuth } from '../../common/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  // Get full name or first initial for avatar
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Usuario';
  const firstInitial = user?.firstName.charAt(0) || 'U';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar style="light" />
      
      <Header title="Mi Perfil" />
      
      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{firstInitial}</Text>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'usuario@ejemplo.com'}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Viajes</Text>
          
          <View style={styles.optionItem}>
            <Ionicons name="ticket-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Boletos Activos</Text>
              <Text style={styles.optionDescription}>Visualiza tus boletos para viajes próximos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
          
          <View style={styles.optionItem}>
            <Ionicons name="time-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Historial de Viajes</Text>
              <Text style={styles.optionDescription}>Revisa tus viajes anteriores</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favoritos</Text>
          
          <View style={styles.optionItem}>
            <Ionicons name="heart-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Rutas Favoritas</Text>
              <Text style={styles.optionDescription}>Accede rápidamente a tus rutas más frecuentes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
          
          <View style={styles.optionItem}>
            <Ionicons name="star-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Cooperativas Preferidas</Text>
              <Text style={styles.optionDescription}>Visualiza las cooperativas que más utilizas</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soporte</Text>
          
          <View style={styles.optionItem}>
            <Ionicons name="help-circle-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Centro de Ayuda</Text>
              <Text style={styles.optionDescription}>Preguntas frecuentes y soporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
          
          <View style={styles.optionItem}>
            <Ionicons name="document-text-outline" size={24} color={Colors.primary} style={styles.optionIcon} />
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Términos y Condiciones</Text>
              <Text style={styles.optionDescription}>Política de privacidad y términos de uso</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
          </View>
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: Colors.danger,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
}); 