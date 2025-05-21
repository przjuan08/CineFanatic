"use client"

import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import MapView, { Marker } from "react-native-maps"
import { useState } from "react"
import { useTheme } from "../context/ThemeContext" // Importar el contexto de tema

/**
 * Pantalla para mostrar el detalle de un recuerdo
 * Muestra la imagen, descripción, fecha y ubicación del recuerdo
 * @param {Object} route - Objeto de ruta con parámetros
 * @param {Object} route.params - Parámetros de la ruta
 * @param {Object} route.params.memory - Datos del recuerdo a mostrar
 */
export default function MemoryDetailScreen({ route }) {
  const { memory } = route.params
  const navigation = useNavigation()
  const { theme, isDarkMode } = useTheme() // Obtener el tema actual
  const [mapError, setMapError] = useState(false)

  // Formatear la fecha para mostrarla de forma más amigable
  const formattedDate = new Date(memory.timestamp).toLocaleString()

  /**
   * Función para abrir la ubicación en Google Maps
   * Utiliza la API de Google Maps para mostrar la ubicación en la app de mapas
   */
  const openLocationInMaps = () => {
    if (memory.location) {
      const { latitude, longitude } = memory.location
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      Linking.openURL(url).catch((err) => {
        console.error("Error al abrir Google Maps:", err)
        Alert.alert("Error", "No se pudo abrir Google Maps")
      })
    }
  }

  /**
   * Maneja errores al cargar el mapa
   */
  const handleMapError = () => {
    console.log("Error al cargar el mapa")
    setMapError(true)
  }

  // Configurar el estilo del mapa según el tema
  const mapStyle = isDarkMode ? [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#212121"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "administrative.country",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#181818"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#1b1b1b"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#2c2c2c"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#8a8a8a"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#373737"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#3c3c3c"
        }
      ]
    },
    {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#4e4e4e"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#000000"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#3d3d3d"
        }
      ]
    }
  ] : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Imagen del recuerdo a pantalla completa */}
      <Image source={{ uri: memory.uri }} style={styles.image} />

      {/* Información del recuerdo */}
      <View style={styles.infoContainer}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>{formattedDate}</Text>

        {/* Sección de descripción */}
        <View style={[styles.section, { 
          backgroundColor: theme.card,
          shadowColor: isDarkMode ? '#000000' : '#000000',
        }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="text-outline" size={20} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.primary }]}>Descripción</Text>
          </View>
          <Text style={[styles.description, { color: theme.text }]}>
            {memory.description || "Sin descripción"}
          </Text>
        </View>

        {/* Mostrar mapa con la ubicación si está disponible */}
        {memory.location && !mapError ? (
          <View style={[styles.section, { 
            backgroundColor: theme.card,
            shadowColor: isDarkMode ? '#000000' : '#000000',
          }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Ubicación</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: memory.location.latitude,
                  longitude: memory.location.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                customMapStyle={mapStyle}
                onError={handleMapError}
              >
                <Marker
                  coordinate={{
                    latitude: memory.location.latitude,
                    longitude: memory.location.longitude,
                  }}
                />
              </MapView>
              <TouchableOpacity 
                style={[styles.openMapsButton, { backgroundColor: `rgba(${isDarkMode ? '1, 180, 228' : '3, 37, 65'}, 0.8)` }]} 
                onPress={openLocationInMaps}
              >
                <Ionicons name="open-outline" size={16} color="white" />
                <Text style={styles.openMapsText}>Abrir en Google Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : memory.location ? (
          <View style={[styles.section, { 
            backgroundColor: theme.card,
            shadowColor: isDarkMode ? '#000000' : '#000000',
          }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location-outline" size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Ubicación</Text>
            </View>
            <View style={styles.locationContainer}>
              <Text style={[styles.locationText, { color: theme.text }]}>
                Latitud: {memory.location.latitude.toFixed(6)}
                {"\n"}
                Longitud: {memory.location.longitude.toFixed(6)}
              </Text>
              <TouchableOpacity 
                style={[styles.mapButton, { backgroundColor: theme.primary }]} 
                onPress={openLocationInMaps}
              >
                <Ionicons name="map" size={18} color="white" />
                <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>

      {/* Botón para volver a la lista de recuerdos */}
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: theme.primary }]} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Volver a recuerdos</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
    height: 200,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  openMapsButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  openMapsText: {
    color: "white",
    marginLeft: 4,
    fontSize: 12,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  mapButtonText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 8,
  },
  backButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
})