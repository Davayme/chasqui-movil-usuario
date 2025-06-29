import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../../common/constants/colors";

type SeatInfoProps = {
  seatNumber: string;
  seatType: "normal" | "child" | "elderly" | "disabled";
  originalPrice: number;
  discountedPrice?: number;
};

export default function SeatInfo({
  seatNumber,
  seatType,
  originalPrice,
  discountedPrice,
}: SeatInfoProps) {
  const getIconName = () => {
    switch (seatType) {
      case "child":
        return "person-outline";
      case "elderly":
        return "body-outline";
      case "disabled":
        return "accessibility-outline";
      default:
        return "person";
    }
  };

  const getSeatTypeLabel = () => {
    switch (seatType) {
      case "child":
        return "Menor de edad";
      case "elderly":
        return "Tercera edad";
      case "disabled":
        return "Persona con discapacidad";
      default:
        return "Adulto normal";
    }
  };

  const discount = originalPrice - (discountedPrice || originalPrice);
  const hasDiscount = discount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.seatNumberContainer}>
          <Text style={styles.seatNumberLabel}>ASIENTO</Text>
          <Text style={styles.seatNumber}>{seatNumber}</Text>
        </View>
        <View style={styles.seatTypeContainer}>
          <Ionicons
            name={getIconName()}
            size={24}
            color={hasDiscount ? Colors.success : Colors.primary}
            style={styles.seatTypeIcon}
          />
          <View>
            <Text style={[
              styles.seatType, 
              hasDiscount && styles.discountedSeatType
            ]}>
              {getSeatTypeLabel()}
            </Text>
            {hasDiscount && (
              <Text style={styles.discountBadge}>
                ✅ Con descuento aplicado
              </Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.priceContainer}>
        {hasDiscount ? (
          <>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio original:</Text>
              <Text style={styles.originalPrice}>
                ${originalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Descuento aplicado:</Text>
              <Text style={styles.discount}>- ${discount.toFixed(2)}</Text>
            </View>
            <View style={[styles.priceRow, styles.finalPriceRow]}>
              <Text style={styles.finalPriceLabel}>Precio final:</Text>
              <Text style={styles.finalPrice}>
                ${(discountedPrice || originalPrice).toFixed(2)}
              </Text>
            </View>
          </>
        ) : (
          <View style={[styles.priceRow, styles.singlePriceRow]}>
            <Text style={styles.finalPriceLabel}>Precio del asiento:</Text>
            <Text style={styles.finalPrice}>
              ${originalPrice.toFixed(2)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  seatNumberContainer: {
    alignItems: "center",
  },
  seatNumberLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  seatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  seatTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seatTypeIcon: {
    marginRight: 8,
  },
  seatType: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
  },
  discountedSeatType: {
    color: Colors.success,
  },
  discountBadge: {
    backgroundColor: Colors.success,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  priceContainer: {
    backgroundColor: Colors.backgroundPrimary,
    borderRadius: 8,
    padding: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  priceLabel: {
    color: Colors.textSecondary,
  },
  originalPrice: {
    color: Colors.textSecondary,
    textDecorationLine: "line-through",
  },
  discount: {
    color: Colors.success,
  },
  finalPrice: {
    fontWeight: "bold",
    color: Colors.primary,
  },
  finalPriceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  finalPriceRow: {
    paddingTop: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  singlePriceRow: {
    paddingTop: 0,
    marginTop: 0,
    borderTopWidth: 0,
  },
});
