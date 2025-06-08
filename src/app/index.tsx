import { Redirect } from 'expo-router';
import { useAuth } from '../common/context/AuthContext';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return isAuthenticated ? 
    <Redirect href="/(tabs)/home" /> : 
    <Redirect href="/(auth)/login" />;
}