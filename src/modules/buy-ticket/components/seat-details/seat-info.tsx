import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../../../common/constants/colors";
import { Ionicons } from "@expo/vector-icons";

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
        return "Discapacidad";
      default:
        return "Normal";
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
            color={Colors.primary}
            style={styles.seatTypeIcon}
          />
          <Text style={styles.seatType}>{getSeatTypeLabel()}</Text>
        </View>
      </View>

      <View style={styles.priceContainer}>
        {hasDiscount && (
          <>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Precio original:</Text>
              <Text style={styles.originalPrice}>
                ${originalPrice.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Descuento:</Text>
              <Text style={styles.discount}>- ${discount.toFixed(2)}</Text>
            </View>
          </>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Precio final:</Text>
          <Text style={styles.finalPrice}>
            ${(discountedPrice || originalPrice).toFixed(2)}
          </Text>
        </View>
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
});
