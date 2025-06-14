import { Colors } from '@/src/common/constants/colors';
import { formatCurrency } from '@/src/modules/search-bus/services/formattingUtils';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CostSummaryProps {
  pricing: {
    subtotal: number;
    totalDiscount: number;
    totalPrice: number;
    serviceFee: number;
    grandTotal: number;
  };
}

const CostSummary: React.FC<CostSummaryProps> = ({ pricing }) => {
  // Calcular el IVA (15% del subtotal)
  const iva = pricing.subtotal * 0.15;
  
  // Calcular el total final incluyendo IVA
  const finalTotal = pricing.grandTotal + iva;
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Resumen de Costos</Text>
      
      <View style={styles.costItem}>
        <Text style={styles.costLabel}>Subtotal</Text>
        <Text style={styles.costValue}>{formatCurrency(pricing.subtotal)}</Text>
      </View>
      
      {pricing.totalDiscount > 0 && (
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Descuentos</Text>
          <Text style={styles.costValueDiscount}>- {formatCurrency(pricing.totalDiscount)}</Text>
        </View>
      )}
      
      <View style={styles.costItem}>
        <Text style={styles.costLabel}>Tarifa de servicio</Text>
        <Text style={styles.costValue}>{formatCurrency(pricing.serviceFee)}</Text>
      </View>
      
      <View style={styles.costItem}>
        <Text style={styles.costLabel}>IVA (15%)</Text>
        <Text style={styles.costValue}>{formatCurrency(iva)}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.totalItem}>
        <Text style={styles.totalLabel}>Total a pagar</Text>
        <Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text>
      </View>
      
      <Text style={styles.paymentNote}>
        El pago se procesará de forma segura a través de Stripe.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    margin: 16,
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  costValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  costValueDiscount: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  totalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  paymentNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default CostSummary; 