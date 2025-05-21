"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  StatusBar,
} from "react-native"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Ionicons } from "@expo/vector-icons"
import * as Location from "expo-location"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library" // Importamos MediaLibrary
import { useNavigation } from "@react-navigation/native"
import { nanoid } from "nanoid/non-secure"
import MapView, { Marker } from "react-native-maps"
import { useTheme } from "../context/ThemeContext" // Importamos el contexto de tema

// Directorio donde se guardarán los recuerdos
const MEMORIES_DIRECTORY = `${FileSystem.documentDirectory}memories/`

/**
 * Pantalla para capturar un nuevo recuerdo con la cámara
 * Permite tomar fotos, añadir descripciones y guardar la ubicación
 * Adaptada para soportar modo oscuro
 */
export default function CameraMemoryScreen() {
  const navigation = useNavigation()
  const { theme, isDarkMode } = useTheme() // Obtenemos el tema actual y el estado del modo oscuro
  const [permisoCamera, requestPermisoCamera] = useCameraPermissions()
  const [locationPermission, setLocationPermission] = useState(null)
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null)
  const [camaraFrontal, setCamaraFrontal] = useState(false)
  const [flash, setFlash] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [location, setLocation] = useState(null)
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [mapError, setMapError] = useState(false)
  const cameraRef = useRef(null)

  /**
   * Solicitar permisos al cargar la pantalla
   */
  useEffect(() => {
    ;(async () => {
      // Solicitar permiso para la ubicación
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(locationStatus === "granted")

      // Solicitar permiso para la biblioteca multimedia
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync()
      setMediaLibraryPermission(mediaLibraryStatus === "granted")

      if (mediaLibraryStatus !== "granted") {
        Alert.alert(
          "Permiso necesario",
          "Necesitamos permiso para guardar fotos en tu galería. Por favor, otorga el permiso en la configuración.",
          [{ text: "OK" }],
        )
      }

      // Si tenemos permiso, intentamos obtener la ubicación actual
      if (locationStatus === "granted") {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          })
          console.log("Ubicación inicial obtenida:", location.coords)
        } catch (error) {
          console.log("Error al obtener ubicación inicial:", error)
        }
      }
    })()
  }, [navigation])
  
  /**
   * Función para tomar una foto
   * Captura la imagen y obtiene la ubicación actual si hay permiso
   */
  const takePicture = async () => {
    if (cameraRef.current) {
      setCargando(true)
      try {
        console.log("Intentando tomar foto...")
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        })
        console.log("Foto tomada:", photo.uri)
        setPhoto(photo)

        // Obtener la ubicación actual si se tiene permiso
        if (locationPermission === true) {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            })
            console.log("Ubicación capturada:", location.coords)
            setLocation(location.coords)
          } catch (error) {
            console.log("Error al obtener la ubicación:", error)
            setMapError(true)
          }
        }
      } catch (error) {
        console.error("Error al tomar la foto:", error)
        Alert.alert("Error", "No se pudo tomar la foto")
      } finally {
        setCargando(false)
      }
    } else {
      console.log("La referencia a la cámara es nula")
      Alert.alert("Error", "No se pudo acceder a la cámara")
    }
  }

  /**
   * Función para guardar el recuerdo
   * Guarda la imagen, descripción y ubicación en el almacenamiento local y en la galería
   */
  const saveMemory = async () => {
    if (!photo) return

    setSaving(true)

    try {
      console.log("Iniciando guardado de recuerdo...")

      // Primero guardamos la foto en la galería si tenemos permiso
      let galleryAsset = null
      if (mediaLibraryPermission) {
        try {
          console.log("Guardando foto en la galería...")
          const asset = await MediaLibrary.createAssetAsync(photo.uri)
          galleryAsset = asset
          console.log("Foto guardada en la galería:", asset)

          // Crear un álbum para la aplicación si no existe
          const albums = await MediaLibrary.getAlbumsAsync()
          let album = albums.find((a) => a.title === "CineFanatic Recuerdos")

          if (!album) {
            album = await MediaLibrary.createAlbumAsync("CineFanatic Recuerdos", asset, false)
            console.log("Álbum creado:", album)
          } else {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
            console.log("Foto añadida al álbum existente")
          }
        } catch (error) {
          console.error("Error al guardar en la galería:", error)
          Alert.alert("Advertencia", "No se pudo guardar la foto en la galería, pero se guardará en la aplicación.", [
            { text: "OK" },
          ])
        }
      } else {
        console.log("No hay permiso para guardar en la galería")
        Alert.alert(
          "Permiso denegado",
          "No se pudo guardar la foto en la galería porque no se otorgó permiso. La foto solo se guardará en la aplicación.",
          [{ text: "OK" }],
        )
      }

      // Crear directorio si no existe
      const dirInfo = await FileSystem.getInfoAsync(MEMORIES_DIRECTORY)
      if (!dirInfo.exists) {
        console.log("Creando directorio de recuerdos...")
        await FileSystem.makeDirectoryAsync(MEMORIES_DIRECTORY, { intermediates: true })
      }

      // Generar ID único para el recuerdo
      const memoryId = nanoid()
      const timestamp = new Date().getTime()
      const fileExtension = photo.uri.split(".").pop()
      const newFileUri = `${MEMORIES_DIRECTORY}${memoryId}.${fileExtension}`

      console.log("Copiando imagen desde:", photo.uri)
      console.log("Hacia:", newFileUri)

      // Copiar la imagen al directorio de recuerdos
      await FileSystem.copyAsync({
        from: photo.uri,
        to: newFileUri,
      })

      // Verificar que el archivo se copió correctamente
      const fileInfo = await FileSystem.getInfoAsync(newFileUri)
      if (!fileInfo.exists) {
        throw new Error("No se pudo copiar el archivo de imagen")
      }

      console.log("Imagen copiada correctamente")

      // Crear objeto con los datos del recuerdo
      const memoryData = {
        id: memoryId,
        uri: newFileUri,
        description,
        timestamp,
        location: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          : null,
      }

      // Leer el archivo de metadatos existente o crear uno nuevo
      const metadataFile = `${MEMORIES_DIRECTORY}metadata.json`
      const metadataInfo = await FileSystem.getInfoAsync(metadataFile)

      let memories = []
      if (metadataInfo.exists) {
        console.log("Leyendo archivo de metadatos existente...")
        const metadataContent = await FileSystem.readAsStringAsync(metadataFile)
        memories = JSON.parse(metadataContent)
      }

      // Añadir el nuevo recuerdo y guardar el archivo de metadatos
      memories.push(memoryData)
      console.log("Guardando metadatos con", memories.length, "recuerdos")
      await FileSystem.writeAsStringAsync(metadataFile, JSON.stringify(memories))

      console.log("Recuerdo guardado exitosamente")

      // Navegar a la pantalla de recuerdos
      navigation.navigate("Memories")
    } catch (error) {
      console.error("Error al guardar el recuerdo:", error)
      Alert.alert("Error", "No se pudo guardar el recuerdo: " + error.message)
    } finally {
      setSaving(false)
    }
  }

  /**
   * Función para abrir la ubicación en Google Maps
   */
  const openLocationInMaps = () => {
    if (location) {
      const { latitude, longitude } = location
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      Linking.openURL(url).catch((err) => console.error("Error al abrir Google Maps:", err))
    }
  }

  /**
   * Función para cambiar entre cámara frontal y trasera
   */
  const toggleCameraType = () => {
    setCamaraFrontal(!camaraFrontal)
  }

  /**
   * Función para cambiar el modo del flash
   */
  const toggleFlash = () => {
    setFlash(!flash)
  }

  // Si no se ha determinado el permiso, mostrar indicador de carga
  if (!permisoCamera) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  // Si se ha denegado el permiso, mostrar mensaje
  if (!permisoCamera.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.error }]}>No hay acceso a la cámara</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary }]} 
          onPress={requestPermisoCamera}
        >
          <Text style={styles.backButtonText}>Solicitar permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.primary }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Si ya se tomó una foto, mostrar la vista previa
  if (photo) {
    return (
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <StatusBar 
          barStyle={isDarkMode ? "light-content" : "dark-content"} 
          backgroundColor={isDarkMode ? "black" : "white"} 
        />
        
        <ScrollView style={[styles.previewContainer, { backgroundColor: theme.background }]}>
          {/* Imagen capturada */}
          <Image source={{ uri: photo.uri }} style={styles.previewImage} />

          <View style={[styles.formContainer, { backgroundColor: theme.background }]}>
            {/* Campo para descripción */}
            <Text style={[styles.formLabel, { color: theme.primary }]}>Descripción</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.inputBackground,
                borderColor: theme.inputBorder,
                color: theme.inputText
              }]}
              placeholder="Describe este momento..."
              placeholderTextColor={theme.inputPlaceholder}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Mostrar mapa con la ubicación si está disponible */}
            {location && !mapError ? (
              <View style={styles.locationContainer}>
                <Text style={[styles.formLabel, { color: theme.primary }]}>Ubicación</Text>
                <View style={[styles.mapContainer, { borderColor: theme.border }]}>
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: location.latitude,
                      longitude: location.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }}
                    customMapStyle={isDarkMode ? [
                      {
                        "elementType": "geometry",
                        "stylers": [{ "color": "#212121" }]
                      },
                      {
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#757575" }]
                      },
                      {
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#212121" }]
                      },
                      {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [{ "color": "#2c2c2c" }]
                      },
                      {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#000000" }]
                      }
                    ] : []}
                  >
                    <Marker
                      coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                      }}
                    />
                  </MapView>
                  <TouchableOpacity 
                    style={[styles.openMapsButton, { 
                      backgroundColor: `rgba(${isDarkMode ? '1, 180, 228' : '3, 37, 65'}, 0.8)` 
                    }]} 
                    onPress={openLocationInMaps}
                  >
                    <Ionicons name="open-outline" size={16} color="white" />
                    <Text style={styles.openMapsText}>Abrir en Google Maps</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : location && mapError ? (
              <View style={styles.locationContainer}>
                <Text style={[styles.formLabel, { color: theme.primary }]}>Ubicación</Text>
                <View style={[styles.locationInfo, { 
                  backgroundColor: theme.card,
                  borderColor: theme.border
                }]}>
                  <Ionicons name="location" size={20} color={theme.primary} />
                  <Text style={[styles.locationText, { color: theme.text }]}>
                    Ubicación capturada: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.mapButton, { backgroundColor: theme.primary }]} 
                  onPress={openLocationInMaps}
                >
                  <Ionicons name="map" size={18} color="white" />
                  <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // Mensaje de carga mientras se obtiene la ubicación
              <View style={[styles.loadingLocationContainer, { 
                backgroundColor: isDarkMode ? 'rgba(1, 180, 228, 0.1)' : 'rgba(3, 37, 65, 0.1)' 
              }]}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.loadingLocationText, { color: theme.primary }]}>
                  Obteniendo los datos de tu ubicación, por favor espera...
                </Text>
              </View>
            )}

            {/* Botones para guardar o descartar */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setPhoto(null)}
                disabled={saving}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={styles.actionButtonText}>Descartar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton, { backgroundColor: theme.primary }]} 
                onPress={saveMemory} 
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="save-outline" size={20} color="white" />
                    <Text style={styles.actionButtonText}>Guardar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  // Mostrar la cámara para tomar la foto
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />
      
      {/* CameraView sin hijos */}
      <CameraView
        style={styles.camera}
        ref={cameraRef}
        facing={camaraFrontal ? "front" : "back"}
        flashMode={flash ? "on" : "off"}
      />

      {/* Controles superiores */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton1} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Controles inferiores */}
      <View style={styles.bottomControls}>
        <View style={styles.bottomControlsInner}>
          {/* Espacio vacío para equilibrar el diseño */}
          <View style={styles.controlButtonPlaceholder} />
          
          {/* Botón para tomar foto */}
          <TouchableOpacity style={styles.captureButton} onPress={takePicture} disabled={cargando}>
            {cargando ? <ActivityIndicator size="large" color="white" /> : <View style={styles.captureButtonInner} />}
          </TouchableOpacity>
          
          {/* Botón para cambiar cámara */}
          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  // Nuevos estilos para los controles superiores
  topControls: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "transparent",
  },
  // Nuevos estilos para los controles inferiores
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40, // Más espacio en la parte inferior
    backgroundColor: "transparent",
  },
  bottomControlsInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  controlButtonPlaceholder: {
    width: 44, // Mismo ancho que controlButton para equilibrar
    height: 44,
  },
  controlButton1: {
    marginTop: 40,
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  controlButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  formContainer: {
    padding: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    minHeight: 100,
    textAlignVertical: "top",
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  mapContainer: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  map: {
    height: 200,
    width: "100%",
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
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
  },
  saveButton: {
    backgroundColor: "#032541",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    margin: 20,
  },
  backButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Estilos para el mensaje de carga de ubicación
  loadingLocationContainer: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingLocationText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
  },
})