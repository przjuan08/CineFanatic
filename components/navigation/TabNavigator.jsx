"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

// Importar pantallas
import HomeScreen from "../screens/HomeScreen"
import ProfileScreen from "../screens/ProfileScreen"
import DetailsScreen from "../screens/DetailsScreen"
import FavoritesScreen from "../screens/FavoritesScreen"
import MemoriesScreen from "../screens/MemoriesScreen"
import MemoryDetailScreen from "../screens/MemoryDetailScreen"
import CameraMemoryScreen from "../screens/CameraMemoryScreen"
import DebugScreen from "../screens/DebugScreen"

// Importar nuevas pantallas de información
import AboutScreen from "../screens/AboutScreen"
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen"
import TermsOfServiceScreen from "../screens/TermsOfServiceScreen"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Stack navigator para la pestaña Home
function HomeStack() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title || "Movie Details"
        })}
      />
      <Stack.Screen name="Memories" component={MemoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} options={{ title: "Detalle del Recuerdo" }} />
      <Stack.Screen name="CameraMemory" component={CameraMemoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

// Stack navigator para la pestaña Profile
function ProfileStack() {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.headerBackground,
        },
        headerTintColor: theme.headerText,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: "Mi perfil" }} />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: "Mis Favoritos"
        }}
      />
      {/* Añadimos las pantallas de Memories también al ProfileStack para poder navegar desde aquí */}
      <Stack.Screen name="Memories" component={MemoriesScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} options={{ title: "Detalle del Recuerdo" }} />
      <Stack.Screen name="CameraMemory" component={CameraMemoryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Debug" component={DebugScreen} options={{ title: "Depuración" }} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title || "Movie Details"
        })}
      />

      {/* Añadimos las nuevas pantallas de información */}
      <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

// Navegador de pestañas principal
export default function TabNavigator() {
  const { theme, isDarkMode } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Inicio") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        headerShown: false,
      })}
    >
      {/* Cambiamos los nombres de las pestañas al español */}
      <Tab.Screen name="Inicio" component={HomeStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  )
}
