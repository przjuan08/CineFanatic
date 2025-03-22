# CineFanatic
Proyecto de cátedra - Diseño y Programación de Software Multiplataforma

## 📌 Descripción de la aplicación:
**CineFanatic** es una aplicación móvil diseñada para los apasionados del cine y las series. A través de su integración con **The Movie Database API (TMDB)**, la aplicación ofrece a los usuarios acceso a información detallada y actualizada sobre películas y series populares.

La aplicación comienza con una pantalla de inicio donde se muestra el nombre de la app en un Splash Screen atractivo. En la pantalla principal, **CineFanatic** ofrece una selección de películas y series populares, permitiendo a los usuarios explorar el contenido más destacado del momento. Al seleccionar una película o serie, la aplicación muestra una vista detallada con información clave, como la sinopsis, los géneros, la duración, el elenco y otros datos relevantes.

**CineFanatic** proporciona una experiencia sencilla e intuitiva, ideal para quienes desean mantenerse informados sobre lo último en cine de forma rápida y accesible.

## 📌 Características de la aplicación:
- Buscar películas populares en TMDB.
- Buscar películas específicas.
- Ver información detallada sobre las películas.
- Perfil de usuario y pantalla de configuración.
- Interfaz de usuario atractiva con animaciones fluidas.

## 📌 Tecnologías y Librerías utilizadas para desarrollar la aplicación:

Para el desarrollo de la aplicación **CineFanatic**, se han utilizado las siguientes tecnologías y librerías:  

### 🚀 Tecnologías principales  
- **React Native (0.76.7)** – Framework para el desarrollo de aplicaciones móviles.  
- **Expo (~52.0.39)** – Plataforma que facilita el desarrollo con React Native.  
- **React (18.3.1)** – Biblioteca base de React Native.  

### 📲 Librerías utilizadas  
- **React Navigation** – Manejo de navegación en la aplicación:  
  - `@react-navigation/native` (7.0.17) – Navegación principal.  
  - `@react-navigation/native-stack` (7.3.1) – Implementación de navegación en pila (stack).  
- **Expo Vector Icons (`@expo/vector-icons` 14.0.4)** – Conjunto de íconos personalizables.  
- **React Native Safe Area Context (4.12.0)** – Manejo de áreas seguras en distintos dispositivos.  
- **React Native Screens (~4.4.0)** – Optimización del rendimiento en la navegación.  
- **Expo Status Bar (~2.0.1)** – Personalización de la barra de estado del dispositivo.  

### 🛠️ Herramientas de desarrollo  
- **Babel (`@babel/core` ^7.20.0)** – Compilador de JavaScript.  
- **TypeScript (`typescript` ^5.8.2) [Opcional]** – Tipado estático para mejorar la calidad del código.  
- **@types/react (`^18.3.19`)** – Definiciones de tipos para React en TypeScript.  

Estas herramientas permiten que **CineFanatic** ofrezca una experiencia fluida y eficiente en dispositivos móviles.

## 📌 Requisitos previos para poder utilizar la aplicación:
- [Node.js](https://nodejs.org/) (v12 or later)
- npm o yarn
- Un smartphone con la aplicación Expo Go instalada o un emulador.

## 📌 Instrucciones de instalación de la aplicación:
### 1. Instalar Expo CLI globalmente

```bash
npm install -g expo-cli
```

### 2. Instalar dependencias a utilizar

```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @expo/vector-icons
npx expo install react-native-safe-area-context@4.12.0 react-native-screens@~4.4.0
```

## 📌 Instrucciones de ejecución de la aplicación
### 1. Iniciar el proyecto Expo
```bash
npx expo start --tunnel
```

Escanear el código QR con:

- **Android**: Aplicación "Expo Go"
- **iOS**: Aplicación "Cámara"

La aplicación se cargará en su dispositivo en la aplicación Expo Go.

Si tiene algún problema, intente ejecutar lo siguiente:

```bash
npx expo install --fix
```

## Estructura de la aplicación:

```
CineFanatic/
├── App.js                Punto de entrada principal de la aplicación
├── config.ts             # Contiene la clave API de TMDB y las configuraciones
├── screens/              # Todos los componentes de la pantalla
│   ├── SplashScreen.jsx  # Componente de la pantalla de inicio
│   ├── HomeScreen.jsx    # Pantalla de inicio para navegar por las películas
│   ├── DetailsScreen.jsx # Pantalla con información detallada de las películas
│   └── ProfileScreen.jsx # Perfil de usuario y pantalla de configuración
├── package.json          # Dependencias del proyecto y scripts
└── ...
```
## Integrantes del equipo:
 - Elías Daniel Rodríguez Franco | RF230727
 - Marlon Osmin Ortiz Cárcamo | OC232936
 - Gustavo Enrique Martínez Hernández | MH180755
 - Jesus Ernesto Sanabria Sibrian | SS233210
 - Juan José Pérez Muñoz | PM230897
 - Mauricio Enrique Herrera Rico | HR230334


