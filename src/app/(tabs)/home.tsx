import { router } from "expo-router";
import React, { useState } from "react";

import { showToast } from "../../common/components/Toast";
import SearchScreen from "@/src/modules/search-bus/screens/SearchScreen";

export default function HomeScreen() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  // Función para buscar viajes
  const handleSearch = () => {
    if (!origin || !destination || !date) {
      // Mostrar alerta de campos incompletos
      showToast({
        type: "error",
        title: "Error",
        message: "Por favor completa todos los campos",
      });
      return;
    }

    router.navigate({
      pathname: "/(extras)/search-results" as any,
      params: { origin, destination, date },
    });
  };

  return <SearchScreen />;
}
