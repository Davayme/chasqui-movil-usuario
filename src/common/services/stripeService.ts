import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { API_ENDPOINTS, API_URL, STRIPE_PUBLISHABLE_KEY } from '../config/config';
import { useAuth } from '../context/AuthContext';

export const initializeStripe = async (publishableKey?: string) => {
  try {
    // Use the provided key or fall back to the one from config or hardcoded value
    const key = publishableKey || STRIPE_PUBLISHABLE_KEY || 'pk_test_51OVR6tILXmRhmPFR0a3rWTTW4SUX1YFLkjaD6XWmeglplW5kcR49Vr6SutZLVF7tUgwtkqv3cup9pGJeDmABtFKW00iNQTABD6';
    
    await initStripe({
      publishableKey: key,
      merchantIdentifier: 'merchant.com.chasquigo',
      urlScheme: 'chasquigo',
    });
    console.log('Stripe inicializado correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar Stripe:', error);
    return false;
  }
};

/**
 * Hook personalizado para procesar pagos con Stripe PaymentSheet
 */
export const useStripePayment = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { user } = useAuth();

  /**
   * Crea un payment intent en el backend
   * @param amount Monto a cobrar en dólares (ej: 25.99)
   * @returns Datos necesarios para inicializar PaymentSheet
   */
  const createPaymentIntent = async (amount: number) => {
    try {
      const response = await fetch(`${API_URL}${API_ENDPOINTS.PAYMENTS.CREATE_PAYMENT_INTENT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          userEmail: user?.email || 'usuario@ejemplo.com',
          userId: user?.id || 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el intent de pago');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error creando payment intent:', error);
      throw error;
    }
  };

  /**
   * Procesa un pago usando PaymentSheet de Stripe
   * @param amount Monto a cobrar en dólares (ej: 25.99)
   * @returns Promise que resuelve a true si el pago es exitoso
   */
  const processPayment = async (amount: number): Promise<boolean> => {
    try {
      // Crear el payment intent en el backend
      const {
        paymentIntentClientSecret,
        customerEphemeralKeySecret,
        customerId,
        publishableKey
      } = await createPaymentIntent(amount);

      // Inicializar Stripe con la clave pública recibida del backend
      if (publishableKey) {
        await initializeStripe(publishableKey);
      }

      // Inicializar PaymentSheet con datos del backend
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Chasqui-Go',
        paymentIntentClientSecret,
        customerEphemeralKeySecret,
        customerId,
        defaultBillingDetails: {
          name: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Cliente',
        },
        allowsDelayedPaymentMethods: true,
        applePay: {
          merchantCountryCode: 'EC',
        },
        googlePay: {
          merchantCountryCode: 'EC',
          testEnv: true,
        }
      });

      if (initError) {
        console.error('Error al inicializar PaymentSheet:', initError);
        Alert.alert('Error', `No se pudo inicializar el procesador de pagos: ${initError.message}`);
        return false;
      }

      // Presentar el formulario de pago
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.log('Error o cancelación de pago:', presentError);

        if (presentError.code === 'Canceled') {
          Alert.alert('Información', 'Pago cancelado');
        } else {
          Alert.alert('Error en el pago', presentError.message || 'Hubo un problema al procesar el pago');
        }
        return false;
      }

      // Si no hay errores, el pago fue exitoso
      Alert.alert('Pago exitoso', 'Tu pago ha sido procesado correctamente');
      return true;
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      Alert.alert('Error', error.message || 'Ocurrió un error al procesar el pago');
      return false;
    }
  };

  return {
    processPayment,
  };
}; 