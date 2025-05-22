# CineFanatic
Proyecto de cátedra - Diseño y Programación de Software Multiplataforma

## 📌 Integrantes del equipo:
 - Elías Daniel Rodríguez Franco | RF230727
 - Marlon Osmin Ortiz Cárcamo | OC232936
 - Gustavo Enrique Martínez Hernández | MH180755
 - Jesus Ernesto Sanabria Sibrian | SS233210
 - Juan José Pérez Muñoz | PM230897
 - Mauricio Enrique Herrera Rico | HR230334

   
## 📌 Descripción de la aplicación:
**CineFanatic** es una aplicación móvil diseñada para los apasionados del cine y las series. A través de su integración con **The Movie Database API (TMDB)**, la aplicación ofrece a los usuarios acceso a información detallada y actualizada sobre películas y series populares. De igual manera, busca ser una aplicación que destaque al capturar y guardar momentos especiales relacionados con las experiencias cinematográficas de los usuarios.

**CineFanatic** proporciona una experiencia completa e intuitiva, ideal para quienes desean mantenerse informados sobre lo último en cine de forma rápida y accesible.

## 📌 Características iniciales de la aplicación:
- Buscar películas populares en TMDB.
- Buscar películas específicas.
- Ver información detallada sobre las películas.
- Perfil de usuario y pantalla de configuración.
- Interfaz de usuario atractiva con animaciones fluidas.

## 📌 Implementaciones finales de la aplicación:
- Implementación de registro e inicio de sesión para poder ingresar a la app.
- Recibir notificaciones desde un servidor externo, en nuestro caso Firebase.
- Uso de filtros de búsqueda para actores y películas según las preferencias del usuario.
- Añadir y quitar de favoritos a películas o series según desee el usuario.
- Implementación del uso de cámara para tomar fotografías.
- Almacenmaiento local en la app e intero en el dispositivo para guardar las forografías tomadas.
- Uso de la ubicación del usuario en tiempo real.
- Uso de BottomTabNavigator para navegar entre las pantallas.
- Implementación entre modo claro y oscuro en toda la aplicación.

## 📌 Tecnologías y Librerías utilizadas para desarrollar la aplicación:

Para el desarrollo de la aplicación **CineFanatic**, se han utilizado las siguientes tecnologías y librerías:  

### 🚀 Tecnologías principales  
| Tecnología       | Versión  | Descripción                                              |
| ---------------- | -------- | -------------------------------------------------------- |
| **React Native** | `0.79.2` | Framework para construir apps móviles nativas.           |
| **Expo**         | `53.0.9` | Plataforma que simplifica el desarrollo en React Native. |
| **React**        | `19.0.0` | Biblioteca base para construir interfaces de usuario.    |
  

### 📲 Librerías utilizadas  
#### 🧭 Navegación
| Librería                           | Versión  | Descripción                              |
| ---------------------------------- | -------- | ---------------------------------------- |
| **@react-navigation/native**       | `7.0.17` | Navegación principal basada en contexto. |
| **@react-navigation/native-stack** | `7.3.1`  | Navegación tipo stack optimizada.        |
| **@react-navigation/bottom-tabs**  | `7.3.13` | Navegación mediante pestañas inferiores. |
 

#### 📸 Multimedia y sensores
| Librería               | Versión   | Descripción                                    |
| ---------------------- | --------- | ---------------------------------------------- |
| **expo-camera**        | `16.1.6`  | Acceso a la cámara del dispositivo.            |
| **expo-image-picker**  | `~16.1.4` | Selección de imágenes desde galería o cámara.  |
| **expo-media-library** | `~17.1.6` | Acceso y manipulación de la galería de medios. |
| **expo-file-system**   | `18.1.10` | Manejo de archivos locales.                    |
| **expo-location**      | `18.1.5`  | Servicios de geolocalización.                  |
| **expo-device**        | `~7.1.4`  | Información del dispositivo.                   |
| **expo-constants**     | `~17.1.6` | Acceso a variables globales del sistema.       |
| **expo-notifications** | `~0.31.2` | Notificaciones locales y push.                 |

#### 💾 Almacenamiento local
| Librería                                      | Versión | Descripción                             |
| --------------------------------------------- | ------- | --------------------------------------- |
| **@react-native-async-storage/async-storage** | `2.1.2` | Almacenamiento persistente asincrónico. |

#### 🗺️ Mapas
| Librería              | Versión  | Descripción                                       |
| --------------------- | -------- | ------------------------------------------------- |
| **react-native-maps** | `1.20.1` | Mapas interactivos integrados con el dispositivo. |

#### 🎨 UI y utilidades
| Librería                           | Versión   | Descripción                                        |
| ---------------------------------- | --------- | -------------------------------------------------- |
| **@expo/vector-icons**             | `14.1.0`  | Conjunto amplio de íconos personalizables.         |
| **react-native-safe-area-context** | `5.4.0`   | Manejo de áreas seguras en distintos dispositivos. |
| **react-native-screens**           | `~4.10.0` | Optimización del rendimiento en la navegación.     |
| **expo-status-bar**                | `~2.2.3`  | Personalización de la barra de estado.             |
| **nanoid**                         | `5.1.5`   | Generador de IDs únicos y seguros.                 |

### 🛠️ Herramientas de desarrollo
| Herramienta      | Versión    | Descripción                                          |
| ---------------- | ---------- | ---------------------------------------------------- |
| **@babel/core**  | `^7.20.0`  | Compilador moderno para JavaScript.                  |
| **typescript**   | `~5.8.3`   | Tipado estático para mejorar la robustez del código. |
| **@types/react** | `~19.0.10` | Tipos para trabajar con React + TypeScript.          |


Estas herramientas permiten que **CineFanatic** ofrezca una experiencia fluida y eficiente en dispositivos móviles.

## 📌 Requisitos previos para poder utilizar la aplicación:
- VSCode de preferencia para visualizar el código.
- [Node.js](https://nodejs.org/) (v12 or later)
- npm o yarn
- Un smartphone con la aplicación Expo Go instalada o un emulador.

## 📌 Instrucciones de instalación y ejecución de la aplicación:
#### 1. Clonar el proyecto de manera local
```bash
git clone https://github.com/przjuan08/CineFanatic.git
```

#### 2. Ingresar a la carpeta clonada e instalar las depencencias y módulos a través de un solo comando:
```bash
cd CineFanatic/
npm install
```

#### 3. Iniciar la app:
```bash
npx expo start
```

Escanear el código QR con:

- **Android**: Aplicación "Expo Go"
- **iOS**: Aplicación "Cámara"

La aplicación se cargará en su dispositivo en la aplicación Expo Go.

## Estructura de la aplicación:

```
CineFanatic/
├── Components/
│   ├── context/
│   │   └── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── navigation/
│   │   ├── AuthNavigator.jsx
│   │   └── TabNavigator.jsx
│   ├── screens/
│   │   └── AboutScreen.jsx 
│   │   └── CameraMemoryScreen.jsx 
│   │   ├── DebugScreen.jsx
│   │   ├── DetailsScreen.jsx
│   │   ├── FavoritesScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── LoginScreen.jsx
│   │   ├── MemoriesScreen.jsx
│   │   ├── MemoryDetailScreen.jsx
│   │   ├── PrivacyPolicyScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   ├── RegisterScreen.jsx
│   │   ├── SplashScreen.jsx
│   │   ├── TemrsOfServiceScreen.jsx
│   └── ui/
│       └── FloatingActionButton.jsx
├── App.js
├── app.json
├── ClearStorage.js
├── eas.json
├── index.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 📌 ¿Cómo usar nuestra aplicación?
#### El usuario debe registrarse para luego iniciar sesión en nuestra app.
<img src="https://github.com/user-attachments/assets/1ec596e7-4a77-41f4-abf1-dc7ce7c7d64a" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/7d40e474-4e0e-49a0-9f6f-2280a51c3fea" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/9f41d9b3-5556-40f0-b057-7a861800a6e9" alt="Imagen vertical" width="250"/>

#### El usuario ya dentro de la app, puede navegar entre las películas, ver su detalle y agregarlas a favoritos, si así lo desea.
<img src="https://github.com/user-attachments/assets/077633de-41b6-4097-ae15-1f10d0a64e8e" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/bf09f54d-e51a-446a-a4fc-be81532aeb10" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/426fe39f-3f39-40d6-9a22-f8e75016538a" alt="Imagen vertical" width="250"/>

#### El usuario puede buscar diferentes actores y películas a través de filtros, los cuales son, por actor/actríz, por nombre de película y por género/s de la película.
<img src="https://github.com/user-attachments/assets/c6a121b6-7c9e-4b58-bdb0-1cb815bae906" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/da2a33f7-a1ff-4774-bbe2-949b2b4fbd7d" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/95d22fcd-e32e-4afd-981e-9390e8096523" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/ecd7b965-38ee-4542-b1c0-908c29b7f241" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/56044888-e177-438d-89f4-514d27b7b1bc" alt="Imagen vertical" width="250"/>

#### El usuario puede crear y guardar recuerdos, a través de capturar momentos con fotografías, guardarlas en el almacenamiento interno del dispositivo, añadir descripciones y almanecar la ubicación real de la fotografía tomada.
<img src="https://github.com/user-attachments/assets/044290a6-6591-4920-b7ce-e52fe77315a9" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/78eea735-007f-4a1f-8103-5640fd78a071" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/f1a5ee64-90bd-47b3-ae1b-c1e4acb6e9a0" alt="Imagen horizontal" width="400"/>
<img src="https://github.com/user-attachments/assets/9d41d746-05f7-4e4f-90cc-e3814195ae96" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/25716895-ebd5-483c-81a6-1b92b3e08f4e" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/d1f1939b-cef6-4c14-b881-b27d968d63e2" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/ef7e6e02-7cb6-442a-abcb-e879beb74d37" alt="Imagen vertical" width="250"/>

#### El usuario en la parte el perfil, puede observar diferentes funcionalidades, entre las cuales, ver sus películas favoritas y los recuerdos almacenados.
<img src="https://github.com/user-attachments/assets/8225cb5b-df15-40d7-b1c4-93a78b2181b9" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/d55737b6-564f-485a-ab5d-ff36711d4d1f" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/3d27c299-6d1f-4230-bf1a-746d92b4a0a7" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/a3bb9caa-eecd-42c9-8044-8f3b7e8c3957" alt="Imagen vertical" width="250"/>

#### Finalmente, el usuario puede cambiar a modo oscuro la aplicación, teniendo las mismas funcionalidades a su disposición.
<img src="https://github.com/user-attachments/assets/f30e91e4-6515-4433-9e07-800b12e5b670" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/a1b4a695-842a-4ba5-ae5f-aafc8c710492" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/545d3992-6404-42ff-a1b8-4cc02fa43e7c" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/99c49bbf-f4ef-4d85-9568-5d66cccfffb8" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/b21c7c9f-2407-44fb-b49c-de5b06c2c47e" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/08028ace-7ef3-4eb6-b040-67b4bae69219" alt="Imagen vertical" width="250"/>
<img src="https://github.com/user-attachments/assets/45f425b2-372b-4700-89eb-ecadc3026ca7" alt="Imagen vertical" width="250"/>


