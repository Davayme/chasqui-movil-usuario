import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Colors } from '../../common/constants/colors';
import { useAuth } from '../../common/context/AuthContext';

export default function TabsLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray400,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.gray200,
          height: Platform.OS === 'android' ? 65 : 85,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'android' ? 15 : 30,
          // This ensures tab bar doesn't cover system navigation on Android
          ...(Platform.OS === 'android' && {
            paddingHorizontal: 5,
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 5,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Buscar',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Mis Boletos',
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket" size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }}
      />
    </Tabs>
  );
}