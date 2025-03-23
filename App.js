import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import SplashScreen from "./components/screens/SplashScreen"
import HomeScreen from "./components/screens/HomeScreen"
import DetailsScreen from "./components/screens/DetailsScreen"
import ProfileScreen from "./components/screens/ProfileScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#032541",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "CineFanatic" }} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params?.title || "Movie Details" })}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Mi perfil" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}


