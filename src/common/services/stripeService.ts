import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { STRIPE_PUBLISHABLE_KEY } from '../config/config';

export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY || 'pk_test_51OVR6tILXmRhmPFRNFcVDCJAh3GoiYknLIYAJnrXRsQ0SVw9sVxgXFXlO6MfYkHpHs9yB1e4J20TLO9eJYEiYAoH00bYKsW1M8',
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

  /**
   * Procesa un pago usando PaymentSheet de Stripe
   * @param amount Monto a cobrar en centavos (ej: 2000 para $20.00)
   * @returns Promise que resuelve a true si el pago es exitoso
   */
  const processPayment = async (amount: number): Promise<boolean> => {
    try {
      // Inicializar PaymentSheet con datos de prueba
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Chasqui-Go',
        paymentIntentClientSecret: 'pi_3OvNp9ILXmRhmPFR1NeUurNl_secret_HwgzOshSHCYDIUEtGH6Z4mItB',
        customerEphemeralKeySecret: 'ek_test_YWNjdF8xT1ZSNnRJTFhtUmhtUEZSLG5rV1Nib2hNWVNFTkNQanJtYk43bTEwVWw0ZzBa_0054bcBzzv',
        customerId: 'cus_PdQEMOyr9QXGnJ',
        defaultBillingDetails: {
          name: 'Test User',
        },
        allowsDelayedPaymentMethods: true,
        applePay: {
          merchantCountryCode: 'US',
        },
        googlePay: {
          merchantCountryCode: 'US',
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