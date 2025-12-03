# Chasqui Go 🚌

**Chasqui Go** es una aplicación móvil multiplataforma para la compra de boletos de autobús. Permite a los usuarios buscar rutas, seleccionar asientos y realizar pagos de forma segura, ofreciendo una experiencia completa para la reserva de viajes en transporte terrestre.

## 📋 Descripción

La aplicación está diseñada para facilitar la compra de pasajes de autobús, permitiendo a los usuarios:

- **Buscar viajes**: Buscar rutas disponibles por origen, destino y fecha
- **Seleccionar asientos**: Visualizar el layout del bus y elegir asientos disponibles
- **Gestionar boletos**: Ver historial de boletos comprados con códigos QR
- **Pagos seguros**: Procesar pagos mediante Stripe (tarjetas, Apple Pay, Google Pay)
- **Perfil de usuario**: Gestionar información personal y preferencias

## 🛠️ Tecnologías

### Framework Principal
- **[Expo](https://expo.dev)** (~53.0.9) - Framework para desarrollo de aplicaciones React Native
- **[React Native](https://reactnative.dev)** (0.79.2) - Framework para aplicaciones móviles multiplataforma
- **[React](https://react.dev)** (19.0.0) - Biblioteca de JavaScript para interfaces de usuario

### Navegación
- **[Expo Router](https://docs.expo.dev/router/introduction/)** (~5.0.6) - Enrutamiento basado en archivos
- **[React Navigation](https://reactnavigation.org/)** (v7) - Navegación nativa para React Native

### Pagos
- **[Stripe React Native](https://stripe.dev/stripe-react-native)** (0.45.0) - Procesamiento de pagos con tarjetas, Apple Pay y Google Pay

### UI y Componentes
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)** (~3.17.4) - Animaciones fluidas
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)** (~2.24.0) - Gestos táctiles
- **[React Native Calendars](https://github.com/wix/react-native-calendars)** (^1.1312.1) - Selector de fechas
- **[React Native Bus Seat Layout](https://github.com/mindinventory/react-native-bus-seat-layout)** (^1.0.2) - Layout para selección de asientos
- **[Expo Vector Icons](https://icons.expo.fyi/)** - Iconografía

### Almacenamiento y Utilidades
- **[Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)** - Almacenamiento seguro de tokens
- **[Expo Media Library](https://docs.expo.dev/versions/latest/sdk/media-library/)** - Guardar códigos QR en galería
- **[React Native View Shot](https://github.com/gre/react-native-view-shot)** - Capturas de pantalla para QR

### Desarrollo
- **TypeScript** (~5.8.3) - Tipado estático
- **ESLint** (^9.25.0) - Linting de código

## 🚀 Comenzar

### Requisitos previos
- Node.js (v18 o superior)
- npm o yarn
- Expo CLI
- Expo Go app (para desarrollo en dispositivo físico)

### Instalación

1. Clonar el repositorio

   ```bash
   git clone https://github.com/Davayme/chasqui-movil-usuario.git
   cd chasqui-movil-usuario
   ```

2. Instalar dependencias

   ```bash
   npm install
   ```

3. Iniciar la aplicación

   ```bash
   npx expo start
   ```

### Opciones de ejecución

En la terminal encontrarás opciones para abrir la app en:

- [Build de desarrollo](https://docs.expo.dev/develop/development-builds/introduction/)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) - Sandbox para pruebas rápidas

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Rutas y pantallas (file-based routing)
│   ├── (auth)/            # Pantallas de autenticación
│   ├── (extras)/          # Pantallas adicionales
│   └── (tabs)/            # Navegación por pestañas
├── common/                 # Código compartido
│   ├── components/        # Componentes reutilizables
│   ├── config/            # Configuración de la app
│   ├── constants/         # Constantes y colores
│   ├── context/           # Context providers (Auth, etc.)
│   ├── hooks/             # Custom hooks
│   └── services/          # Servicios (Stripe, API)
├── modules/               # Módulos de funcionalidad
│   ├── auth/              # Autenticación
│   ├── buy-ticket/        # Compra de boletos
│   ├── search-bus/        # Búsqueda de viajes
│   └── tickets/           # Gestión de boletos
└── assets/                # Recursos estáticos
```

## 📱 Plataformas Soportadas

- ✅ iOS
- ✅ Android
- ✅ Web (parcial)

## 📄 Licencia

Este proyecto es privado y está desarrollado por [@Davayme](https://github.com/Davayme).
