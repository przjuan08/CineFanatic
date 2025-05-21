"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { API_KEY, API_BASE_URL } from "../../assets/config"

export default function FavoritesScreen() {
  const navigation = useNavigation()
  const { userData } = useAuth()
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [favoriteMovies, setFavoriteMovies] = useState([])

  // Cargar datos de películas favoritas
  useEffect(() => {
    const loadFavoriteMovies = async () => {
      if (!userData?.favorites || userData.favorites.length === 0) {
        setFavoriteMovies([])
        setLoading(false)
        return
      }

      try {
        // Obtener detalles de cada película favorita
        const moviePromises = userData.favorites.map(async (movieId) => {
          const response = await fetch(`${API_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`)

          if (!response.ok) {
            throw new Error(`Error al obtener película ${movieId}`)
          }

          return await response.json()
        })

        const movies = await Promise.all(moviePromises)
        setFavoriteMovies(movies)
      } catch (error) {
        console.error("Error al cargar películas favoritas:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteMovies()
  }, [userData?.favorites])

  // Función para navegar a la pantalla de detalles
  const navigateToDetails = (id, title) => {
    navigation.navigate("Details", {
      id,
      title,
      fromFavorites: true,
    })
  }

  // Función para volver a la pantalla de perfil
  const goBackToProfile = () => {
    navigation.navigate("Profile")
  }

  // Renderizar cada elemento de la lista de favoritos
  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.favoriteItem, { backgroundColor: theme.card }]}
      onPress={() => navigateToDetails(item.id, item.title)}
    >
      <Image
        source={{
          uri: item.poster_path
            ? `https://image.tmdb.org/t/p/w185${item.poster_path}`
            : "https://via.placeholder.com/185x278?text=No+Image",
        }}
        style={styles.posterImage}
      />
      <View style={styles.itemInfo}>
        <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.itemDate, { color: theme.textSecondary }]}>
          {new Date(item.release_date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={[styles.rating, { color: theme.text }]}>{item.vote_average?.toFixed(1) || "N/A"}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} style={styles.chevron} />
    </TouchableOpacity>
  )

  // Renderizar mensaje cuando no hay favoritos
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={theme.textSecondary} />
      <Text style={[styles.emptyText, { color: theme.text }]}>No tienes películas favoritas</Text>
      <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
        Agrega películas a tus favoritos para verlas aquí
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={favoriteMovies}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40, // Para mantener el título centrado
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  favoriteItem: {
    flexDirection: "row",
    borderRadius: 8,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  posterImage: {
    width: 70,
    height: 105,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  chevron: {
    alignSelf: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
})
