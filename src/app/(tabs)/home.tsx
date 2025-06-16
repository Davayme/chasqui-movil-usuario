import { router } from "expo-router";
import React, { useState } from "react";

import SearchScreen from "@/src/modules/search-bus/screens/SearchScreen";
import { showToast } from "../../common/components/Toast";

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

    console.log('Navigating to search results with params:', { origin, destination, date });
    router.push({
      pathname: "/(extras)/search-results",
      params: { origin, destination, date },
    });
  };

  return <SearchScreen />;
}
