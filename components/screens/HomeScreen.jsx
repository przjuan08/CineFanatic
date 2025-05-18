"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_KEY, API_BASE_URL } from "../../assets/config"
import { useAuth } from "../context/AuthContext"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { userData, userToken, logout } = useAuth() // Acceder al contexto de autenticación

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    console.log("HomeScreen - Estado de autenticación:", userToken ? "Autenticado" : "No autenticado")
    console.log("HomeScreen - Datos de usuario:", userData?.name || "No hay datos")

    // Si no hay token, redirigir al login
    if (!userToken) {
      console.log("No hay token, redirigiendo a Login")
      navigation.navigate("Login")
      return
    }

    fetchPopularMovies()
  }, [userToken, userData, navigation])

  const fetchPopularMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`)
      const data = await response.json()
      setMovies(data.results)
      setLoading(false)
    } catch (error) {
      console.error("Error en la búsqueda de películas:", error)
      setLoading(false)
    }
  }

  const searchMovies = async (query) => {
    if (query.trim() === "") {
      fetchPopularMovies()
      return
    }

    setSearching(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}&page=1&include_adult=false`,
      )
      const data = await response.json()
      setMovies(data.results)
      setSearching(false)
    } catch (error) {
      console.error("Error en la búsqueda de películas:", error)
      setSearching(false)
    }
  }

  const renderMovieItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() =>
          navigation.navigate("Details", {
            id: item.id,
            title: item.title,
          })
        }
      >
        <Image
          source={{
            uri: item.poster_path
              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
              : "https://via.placeholder.com/150x225?text=No+Image",
          }}
          style={styles.poster}
        />
        <View style={styles.movieInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.releaseDate}>{new Date(item.release_date).getFullYear() || "N/A"}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.vote_average.toFixed(1)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Función para manejar la navegación al perfil
  const handleProfileNavigation = () => {
    // Verificar que el usuario esté autenticado antes de navegar
    if (userToken && userData) {
      console.log("Navegando a Profile")
      navigation.navigate("Profile")
    } else {
      console.warn("Usuario no autenticado, no se puede navegar al perfil")
      Alert.alert("Error", "No se puede acceder al perfil. Por favor, inicia sesión nuevamente.")

      // El logout se encargará de la navegación
      logout()
    }
  }

  // Función para cerrar sesión
  const handleLogout = () => {
    logout()
    // Navegar al login - esto funcionará porque el cambio en el estado de autenticación
    // hará que el navegador principal cambie a las rutas de autenticación
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#032541" />

      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Búsqueda de películas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => searchMovies(searchQuery)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("")
                fetchPopularMovies()
              }}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.profileButton} onPress={handleProfileNavigation}>
          <Ionicons name="person-circle-outline" size={28} color="#032541" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.debugButton} onPress={() => navigation.navigate("Debug")}>
          <Ionicons name="bug-outline" size={28} color="#032541" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {loading || searching ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#032541" />
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>{searchQuery ? "Resultados de búsqueda" : "Películas Populares"}</Text>

          {movies.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="film-outline" size={60} color="#ccc" />
              <Text style={styles.noResultsText}>No se ha encontrado ninguna película</Text>
            </View>
          ) : (
            <FlatList
              data={movies}
              renderItem={renderMovieItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              contentContainerStyle={styles.movieList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  profileButton: {
    marginLeft: 12,
  },
  debugButton: {
    marginLeft: 8,
  },
  logoutButton: {
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
    marginBottom: 8,
    color: "#032541",
  },
  movieList: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    maxWidth: "47%",
  },
  poster: {
    width: "100%",
    height: 200,
  },
  movieInfo: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    color: "#666",
  },
})
