"use client"

import { useState, useEffect, useRef } from "react"
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
  Modal,
  ScrollView,
  Animated,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { API_KEY, API_BASE_URL } from "../../assets/config"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import FloatingActionButton from "../ui/FloatingActionButton"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { userData, userToken, logout } = useAuth() // Acceder al contexto de autenticación
  const { theme, isDarkMode } = useTheme() // Acceder al contexto de tema

  // Estados para películas y búsqueda
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  // Estados para filtros
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [showGenreFilter, setShowGenreFilter] = useState(false)
  const [searchType, setSearchType] = useState("movie") // 'movie' o 'person'
  const [actors, setActors] = useState([])
  const [selectedActor, setSelectedActor] = useState(null)
  const [showActorResults, setShowActorResults] = useState(false)

  // Animación para el panel de filtros
  const filterPanelHeight = useRef(new Animated.Value(0)).current
  const [filtersExpanded, setFiltersExpanded] = useState(false)

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
    fetchGenres()
  }, [userToken, userData, navigation])

  // Efecto para animar el panel de filtros
  useEffect(() => {
    Animated.timing(filterPanelHeight, {
      toValue: filtersExpanded ? 60 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [filtersExpanded, filterPanelHeight])

  // Función para obtener películas populares
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

  // Función para obtener géneros disponibles
  const fetchGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
      const data = await response.json()
      setGenres(data.genres)
    } catch (error) {
      console.error("Error al obtener géneros:", error)
    }
  }

  // Función para buscar películas por título
  const searchMovies = async (query) => {
    if (query.trim() === "") {
      fetchPopularMovies()
      setSelectedGenres([])
      setSelectedActor(null)
      setShowActorResults(false)
      return
    }

    setSearching(true)

    try {
      if (searchType === "movie") {
        // Buscar películas
        const response = await fetch(
          `${API_BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}&page=1&include_adult=false`,
        )
        const data = await response.json()
        setMovies(data.results)
        setShowActorResults(false)
      } else {
        // Buscar actores
        const response = await fetch(
          `${API_BASE_URL}/search/person?api_key=${API_KEY}&language=es-ES&query=${query}&page=1&include_adult=false`,
        )
        const data = await response.json()
        setActors(data.results)
        setShowActorResults(true)
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error)
    } finally {
      setSearching(false)
    }
  }

  // Función para buscar películas por géneros seleccionados
  const searchByGenres = async () => {
    if (selectedGenres.length === 0) {
      fetchPopularMovies()
      return
    }

    setSearching(true)
    try {
      const genreIds = selectedGenres.join(",")
      const response = await fetch(
        `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&with_genres=${genreIds}&page=1&include_adult=false`,
      )
      const data = await response.json()
      setMovies(data.results)
    } catch (error) {
      console.error("Error en la búsqueda por géneros:", error)
    } finally {
      setSearching(false)
    }
  }

  // Función para buscar películas de un actor específico
  const searchMoviesByActor = async (actorId) => {
    setSearching(true)
    try {
      const response = await fetch(
        `${API_BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=popularity.desc&with_cast=${actorId}&page=1&include_adult=false`,
      )
      const data = await response.json()
      setMovies(data.results)
      setShowActorResults(false)
    } catch (error) {
      console.error("Error en la búsqueda por actor:", error)
    } finally {
      setSearching(false)
    }
  }

  // Función para seleccionar/deseleccionar un género
  const toggleGenre = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter((id) => id !== genreId))
    } else {
      setSelectedGenres([...selectedGenres, genreId])
    }
  }

  // Función para seleccionar un actor
  const selectActor = (actor) => {
    setSelectedActor(actor)
    setSearchQuery(actor.name)
    searchMoviesByActor(actor.id)
  }

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedActor(null)
    setSearchQuery("")
    fetchPopularMovies()
  }

  // Función para cambiar el tipo de búsqueda
  const toggleSearchType = () => {
    const newType = searchType === "movie" ? "person" : "movie"
    setSearchType(newType)
    setSearchQuery("")
    setShowActorResults(false)

    if (newType === "movie") {
      fetchPopularMovies()
    }
  }

  // Renderizar cada película en la lista
  const renderMovieItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.movieCard, { backgroundColor: theme.card }]}
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
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.releaseDate, { color: theme.textSecondary }]}>
            {item.release_date ? new Date(item.release_date).getFullYear() : "N/A"}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.text }]}>{item.vote_average?.toFixed(1) || "N/A"}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Renderizar cada actor en la lista de resultados
  const renderActorItem = ({ item }) => {
    return (
      <TouchableOpacity style={[styles.actorCard, { backgroundColor: theme.card }]} onPress={() => selectActor(item)}>
        <Image
          source={{
            uri: item.profile_path
              ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
              : "https://via.placeholder.com/185x278?text=No+Image",
          }}
          style={styles.actorImage}
        />
        <View style={styles.actorInfo}>
          <Text style={[styles.actorName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.actorPopularity, { color: theme.textSecondary }]}>
            Popularidad: {item.popularity.toFixed(1)}
          </Text>
          {item.known_for && item.known_for.length > 0 && (
            <Text style={[styles.knownFor, { color: theme.textSecondary }]} numberOfLines={2}>
              Conocido por: {item.known_for.map((work) => work.title || work.name).join(", ")}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header2, { backgroundColor: theme.headerBackground }]}>
        <Text style={styles.headerTitle}>CineFanatic</Text>
      </View>

      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.headerBackground} />

      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
            <Ionicons
              name={searchType === "movie" ? "film-outline" : "person-outline"}
              size={20}
              color={theme.inputPlaceholder}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: theme.inputText }]}
              placeholder={searchType === "movie" ? "Buscar películas..." : "Buscar actores..."}
              placeholderTextColor={theme.inputPlaceholder}
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
                  setShowActorResults(false)
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color={theme.inputPlaceholder} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.inputBackground }]}
            onPress={toggleSearchType}
          >
            <Ionicons name={searchType === "movie" ? "person" : "film"} size={20} color={theme.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.inputBackground }]}
            onPress={() => setFiltersExpanded(!filtersExpanded)}
          >
            <Ionicons
              name="options"
              size={20}
              color={selectedGenres.length > 0 ? theme.primary : theme.inputPlaceholder}
            />
          </TouchableOpacity>

          {/* Removed the profile button since we now have a tab navigator */}
        </View>

        {/* Panel de filtros expandible */}
        <Animated.View style={[styles.filterPanel, { height: filterPanelHeight, overflow: "hidden" }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowGenreFilter(true)}
            >
              <Ionicons name="list" size={16} color="white" />
              <Text style={styles.filterButtonText}>
                Géneros {selectedGenres.length > 0 ? `(${selectedGenres.length})` : ""}
              </Text>
            </TouchableOpacity>

            {selectedGenres.length > 0 && (
              <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.error }]} onPress={clearFilters}>
                <Ionicons name="close-circle" size={16} color="white" />
                <Text style={styles.filterButtonText}>Limpiar filtros</Text>
              </TouchableOpacity>
            )}

            {selectedActor && (
              <View style={[styles.actorChip, { backgroundColor: theme.primary }]}>
                <Image
                  source={{
                    uri: selectedActor.profile_path
                      ? `https://image.tmdb.org/t/p/w45${selectedActor.profile_path}`
                      : "https://via.placeholder.com/45x45?text=Actor",
                  }}
                  style={styles.actorChipImage}
                />
                <Text style={styles.actorChipText} numberOfLines={1}>
                  {selectedActor.name}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedActor(null)
                    fetchPopularMovies()
                  }}
                >
                  <Ionicons name="close-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>

      {/* Modal para seleccionar géneros */}
      <Modal
        visible={showGenreFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenreFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Seleccionar géneros</Text>
              <TouchableOpacity onPress={() => setShowGenreFilter(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.genreList}>
              {genres.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.genreItem,
                    selectedGenres.includes(genre.id) && { backgroundColor: `${theme.primary}20` },
                  ]}
                  onPress={() => toggleGenre(genre.id)}
                >
                  <Text style={[styles.genreName, { color: theme.text }]}>{genre.name}</Text>
                  {selectedGenres.includes(genre.id) && (
                    <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.error }]}
                onPress={() => setSelectedGenres([])}
              >
                <Text style={styles.modalButtonText}>Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={() => {
                  setShowGenreFilter(false)
                  searchByGenres()
                }}
              >
                <Text style={styles.modalButtonText}>Aplicar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {loading || searching ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <>
          {/* Título de la sección */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>
              {selectedActor
                ? `Películas con ${selectedActor.name}`
                : selectedGenres.length > 0
                  ? "Películas filtradas por género"
                  : searchQuery
                    ? "Resultados de búsqueda"
                    : "Películas Populares"}
            </Text>
            {movies.length > 0 && (
              <Text style={[styles.resultCount, { color: theme.textSecondary }]}>
                {movies.length} {movies.length === 1 ? "resultado" : "resultados"}
              </Text>
            )}
          </View>

          {/* Lista de actores (cuando se busca por actor) */}
          {showActorResults ? (
            actors.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="person-outline" size={60} color={theme.textSecondary} />
                <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                  No se ha encontrado ningún actor
                </Text>
              </View>
            ) : (
              <FlatList
                data={actors}
                renderItem={renderActorItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.actorList}
              />
            )
          ) : // Lista de películas
          movies.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Ionicons name="film-outline" size={60} color={theme.textSecondary} />
              <Text style={[styles.noResultsText, { color: theme.textSecondary }]}>
                No se ha encontrado ninguna película
              </Text>
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

      {/* Botón flotante para crear/ver recuerdos */}
      <FloatingActionButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header2: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 45,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "left",
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  filterPanel: {
    marginTop: 8,
  },
  filterScroll: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 4,
  },
  actorChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    paddingVertical: 2,
    borderRadius: 16,
    marginRight: 8,
  },
  actorChipImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 4,
  },
  actorChipText: {
    color: "white",
    fontWeight: "500",
    fontSize: 12,
    marginRight: 4,
    maxWidth: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  resultCount: {
    fontSize: 14,
  },
  movieList: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
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
  // Estilos para la lista de actores
  actorList: {
    padding: 16,
  },
  actorCard: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actorImage: {
    width: 80,
    height: 120,
  },
  actorInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  actorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  actorPopularity: {
    fontSize: 14,
    marginBottom: 4,
  },
  knownFor: {
    fontSize: 12,
  },
  // Estilos para el modal de géneros
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  genreList: {
    padding: 16,
  },
  genreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  genreName: {
    fontSize: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  modalButtonText: {
    color: "white",
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
  },
})
