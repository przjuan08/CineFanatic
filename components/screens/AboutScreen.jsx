"use client"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"

/**
 * Pantalla "Acerca de CineFanatic"
 * Muestra información sobre la aplicación, su propósito y características
 */
export default function AboutScreen() {
  // Hooks para navegación y tema
  const navigation = useNavigation()
  const { theme } = useTheme()

  // Función para volver a la pantalla anterior
  const goBack = () => {
    navigation.goBack()
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Encabezado con botón de regreso */}
      <View style={[styles.header, { backgroundColor: theme.headerBackground }]}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>Acerca de CineFanatic</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Contenido principal */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Logo de la aplicación */}
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://ui-avatars.com/api/?name=CF&size=200&background=032541&color=fff&bold=true",
            }}
            style={styles.logo}
          />
          <Text style={[styles.appName, { color: theme.text }]}>CineFanatic</Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>Versión 2.0</Text>
        </View>

        {/* Sección de descripción */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Nuestra Misión</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            CineFanatic es una aplicación diseñada para los amantes del cine que desean descubrir, explorar y guardar
            sus películas favoritas. Nuestra misión es proporcionar una experiencia completa para los aficionados al
            cine, permitiéndoles mantenerse al día con los últimos lanzamientos, explorar clásicos y crear una colección
            personalizada.
          </Text>
        </View>

        {/* Sección de características */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Características Principales</Text>

          <View style={styles.featureItem}>
            <Ionicons name="film-outline" size={24} color={theme.primary} style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Exploración de Películas</Text>
              <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                Descubre películas populares, nuevos lanzamientos y clásicos del cine.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="search-outline" size={24} color={theme.primary} style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Búsqueda Avanzada</Text>
              <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                Busca películas por título, actor o género para encontrar exactamente lo que estás buscando.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="heart-outline" size={24} color={theme.primary} style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Lista de Favoritos</Text>
              <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                Guarda tus películas favoritas para acceder a ellas fácilmente en cualquier momento.
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="images-outline" size={24} color={theme.primary} style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>Recuerdos Cinematográficos</Text>
              <Text style={[styles.featureDescription, { color: theme.textSecondary }]}>
                Captura y guarda momentos especiales relacionados con tus experiencias cinematográficas.
              </Text>
            </View>
          </View>
        </View>

        {/* Sección de datos */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Datos y Fuentes</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            CineFanatic utiliza la API de The Movie Database (TMDB) para proporcionar información actualizada y precisa
            sobre películas. Agradecemos a TMDB por su increíble servicio y base de datos.
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Esta aplicación es un proyecto educativo y no tiene fines comerciales. Todas las imágenes y datos de
            películas son propiedad de sus respectivos dueños.
          </Text>
        </View>

        {/* Sección de contacto */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Contacto</Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Si tienes preguntas, sugerencias o comentarios sobre CineFanatic, no dudes en contactarnos:
          </Text>
          <Text style={[styles.contactItem, { color: theme.text }]}>
            <Ionicons name="mail-outline" size={16} color={theme.primary} /> soporte.cinefanatic@gmail.com
          </Text>
          <Text style={[styles.contactItem, { color: theme.text }]}>
            <Ionicons name="globe-outline" size={16} color={theme.primary} /> www.cinefanatic.com
          </Text>
        </View>

        {/* Pie de página */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            © 2025 CineFanatic. Todos los derechos reservados.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

// Estilos para la pantalla
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50, // Espacio para la barra de estado
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40, // Para equilibrar el encabezado
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  version: {
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  featureIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
  },
})
