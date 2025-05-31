import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { Colors } from "../constants/colors";
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
  toastContainer: {
    height: "auto",
    width: "90%",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContentContainer: {
    paddingHorizontal: 8,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  toastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  successToast: {
    backgroundColor: "#1DB954", // Fondo verde de Spotify
    borderLeftColor: "#1ed760",
  },
  successToastText1: {
    color: "#FFFFFF", // Texto blanco para el título
    fontWeight: "700", // Más negrita para mejor contraste
    fontSize: 16,
  },
  successToastText2: {
    color: "#FFFFFF", // Texto blanco para el mensaje
    opacity: 0.9, // Ligeramente transparente para indicar jerarquía
    fontSize: 14,
  },
  errorToast: {
    backgroundColor: Colors.danger,
    borderLeftColor: "#ff4b7b",
  },
  infoToast: {
    backgroundColor: Colors.primary,
    borderLeftColor: "#33d9ff",
  },
});
const baseConfig = {
  style: styles!.toastContainer,
  contentContainerStyle: styles.toastContentContainer,
  text1Style: styles.toastTitle,
  text2Style: styles.toastMessage,
};

// Configuración personalizada para diferentes tipos de toast
export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      {...baseConfig}
      style={[styles.toastContainer, styles.successToast]}
      text1Style={styles.successToastText1}
      text2Style={styles.successToastText2}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      {...baseConfig}
      style={[styles.toastContainer, styles.errorToast]}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      {...baseConfig}
      style={[styles.toastContainer, styles.infoToast]}
      text1NumberOfLines={1}
      text2NumberOfLines={2}
    />
  ),
};

// Función helper para mostrar toasts
type ToastType = "success" | "error" | "info";

interface ShowToastParams {
  type: ToastType;
  title?: string;
  message: string;
  position?: "top" | "bottom";
  duration?: number;
}

export const showToast = ({
  type,
  title,
  message,
  position = "top",
  duration = 3000,
}: ShowToastParams) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position,
    visibilityTime: duration,
  });
};
