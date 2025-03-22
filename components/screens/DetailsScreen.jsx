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
} from "react-native"
import { useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_KEY, API_BASE_URL } from "../../assets/config"

const { width } = Dimensions.get("window")

export default function DetailsScreen() {
  const route = useRoute()
  const { id } = route.params

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const estadosPeliculas = {
    "Rumored": "Rumoreada",
    "Planned": "Planificada",
    "In Production": "En producción",
    "Post Production": "Postproducción",
    "Released": "Estrenada",
    "Canceled": "Cancelada"
  }
  
  
  useEffect(() => {
    fetchMovieDetails()
  }, [])

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
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#032541" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  const renderGenres = () => {
    return movie.genres.map((genre) => (
      <View key={genre.id} style={styles.genreTag}>
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
        <Text style={styles.castName} numberOfLines={2}>
          {person.name}
        </Text>
        <Text style={styles.castCharacter} numberOfLines={1}>
          {person.character}
        </Text>
      </View>
    ))
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.backdropContainer}>
        <Image
        
          source={{
            uri: movie.backdrop_path
              ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
              : "https://via.placeholder.com/780x439?text=No+Image",
          }}
          style={styles.backdropImage}
        />
        <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color={isFavorite ? "#FF6B6B" : "white"} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
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
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.releaseDate}>
              {new Date(movie.release_date).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>
                {movie.vote_average.toFixed(1)} ({movie.vote_count} votos)
              </Text>
            </View>
            <Text style={styles.runtime}>
              {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
            </Text>
          </View>
        </View>

        <View style={styles.genresContainer}>{renderGenres()}</View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.overview}>{movie.overview || "Resumen no disponible"}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elenco</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castContainer}>
            {movie.credits.cast.length > 0 ? renderCast() : <Text>Información del elenco no disponible </Text>}
          </ScrollView>
        </View>

        

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={styles.infoValue}>
              {estadosPeliculas[movie.status] || movie.status}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Presupuesto</Text>
            <Text style={styles.infoValue}>
              {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : "No disponible"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Ingresos</Text>
            <Text style={styles.infoValue}>
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
    backgroundColor: "#fff",
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
    color: "#555",
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
    color: "#032541",
    marginBottom: 4,
  },
  releaseDate: {
    fontSize: 14,
    color: "#666",
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
    color: "#666",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: "#032541",
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
    color: "#032541",
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
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
    color: "#666",
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
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
})

