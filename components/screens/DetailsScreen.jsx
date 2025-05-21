"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_KEY, API_BASE_URL } from "../../assets/config"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

export default function DetailsScreen() {
  const route = useRoute()
  const navigation = useNavigation()
  const { id, fromFavorites } = route.params || { id: null, fromFavorites: false }
  const { toggleFavorite, isFavorite } = useAuth()
  const { theme } = useTheme()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favoriteStatus, setFavoriteStatus] = useState(false)

  const estadosPeliculas = {
    Rumored: "Rumoreada",
    Planned: "Planificada",
    "In Production": "En producción",
    "Post Production": "Postproducción",
    Released: "Estrenada",
    Canceled: "Cancelada",
  }

  useEffect(() => {
    fetchMovieDetails()
  }, [])

  // Verificar si la película está en favoritos cuando se carga
  useEffect(() => {
    if (id) {
      const isMovieFavorite = isFavorite(id.toString())
      setFavoriteStatus(isMovieFavorite)
    }
  }, [id, isFavorite])

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`,
      )

      if (!response.ok) {
        throw new Error("Película no encontrada")
      }

      const data = await response.json()
      setMovie(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener los detalles de la película:", error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (id) {
      const success = await toggleFavorite(id.toString())
      if (success) {
        const newStatus = !favoriteStatus
        setFavoriteStatus(newStatus)

        // Mostrar mensaje según la acción realizada
        if (newStatus) {
          Alert.alert("Agregado a favoritos", "Esta película ha sido agregada a tus favoritos")
        } else {
          Alert.alert("Eliminado de favoritos", "Esta película ha sido eliminada de tus favoritos")
        }
      }
    }
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={60} color={theme.error} />
        <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
      </View>
    )
  }

  const renderGenres = () => {
    return movie.genres.map((genre) => (
      <View key={genre.id} style={[styles.genreTag, { backgroundColor: theme.primary }]}>
        <Text style={styles.genreText}>{genre.name}</Text>
      </View>
    ))
  }

  const renderCast = () => {
    const cast = movie.credits.cast.slice(0, 5)
    return cast.map((person) => (
      <View key={person.id} style={styles.castItem}>
        <Image
          source={{
            uri: person.profile_path
              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
              : "https://via.placeholder.com/185x278?text=No+Image",
          }}
          style={styles.castImage}
        />
        <Text style={[styles.castName, { color: theme.text }]} numberOfLines={2}>
          {person.name}
        </Text>
        <Text style={[styles.castCharacter, { color: theme.textSecondary }]} numberOfLines={1}>
          {person.character}
        </Text>
      </View>
    ))
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.backdropContainer}>
        <Image
          source={{
            uri: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
              : "https://via.placeholder.com/780x439?text=No+Image",
          }}
          style={styles.backdropImage}
        />
        <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
          <Ionicons
            name={favoriteStatus ? "heart" : "heart-outline"}
            size={28}
            color={favoriteStatus ? "#FF6B6B" : "white"}
          />
        </TouchableOpacity>
      </View>

      <View style={[styles.contentContainer, { backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <Image
            source={{
              uri: movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : "https://via.placeholder.com/342x513?text=No+Image",
            }}
            style={styles.posterImage}
          />

          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.text }]}>{movie.title}</Text>
            <Text style={[styles.releaseDate, { color: theme.textSecondary }]}>
              {new Date(movie.release_date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={[styles.rating, { color: theme.text }]}>
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votos)
              </Text>
            </View>
            <Text style={[styles.runtime, { color: theme.textSecondary }]}>
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </Text>
          </View>
        </View>

        <View style={styles.genresContainer}>{renderGenres()}</View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Resumen</Text>
          <Text style={[styles.overview, { color: theme.text }]}>{movie.overview || "Resumen no disponible"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Elenco</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castContainer}>
            {movie.credits.cast.length > 0 ? (
              renderCast()
            ) : (
              <Text style={{ color: theme.text }}>Información del elenco no disponible </Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.infoSection}>
          <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Estado</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {estadosPeliculas[movie.status] || movie.status}
            </Text>
          </View>
          <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Presupuesto</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "No disponible"}
            </Text>
          </View>
          <View style={[styles.infoItem, { borderBottomColor: theme.border }]}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Ingresos</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : "No disponible"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
  },
  backdropContainer: {
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: 220,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    marginTop: -60,
  },
  posterImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
  },
  runtime: {
    fontSize: 14,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 8,
  },
  genreTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "white",
    fontSize: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },
  castContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  castItem: {
    width: 100,
    marginRight: 16,
  },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginBottom: 4,
  },
  castName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  castCharacter: {
    fontSize: 12,
  },
  infoSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
})
