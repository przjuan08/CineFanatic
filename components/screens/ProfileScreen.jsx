"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { useNavigation } from "@react-navigation/native"

export default function ProfileScreen() {
  const navigation = useNavigation()
  const { userData, userToken, logout } = useAuth()
  const { isDarkMode, toggleDarkMode, theme, followSystem, toggleFollowSystem } = useTheme()

  const [notifications, setNotifications] = useState(true)
  const [adultContent, setAdultContent] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    console.log("ProfileScreen - Estado de autenticación:", userToken ? "Autenticado" : "No autenticado")
    console.log("ProfileScreen - Datos de usuario:", userData?.name || "No hay datos")

    // Si no hay token o datos de usuario, redirigir al login
    if (!userToken || !userData) {
      console.log("No hay token o datos de usuario, redirigiendo a Login")
      navigation.navigate("Login")
      return
    }
  }, [userToken, userData, navigation])

  const toggleNotifications = () => setNotifications((previousState) => !previousState)
  const toggleAdultContent = () => setAdultContent((previousState) => !previousState)

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          // Primero cerrar sesión, lo que actualizará el estado de autenticación
          await logout()
          // No intentamos navegar aquí, el sistema de navegación responderá al cambio de estado
        },
        style: "destructive",
      },
    ])
  }

  // Navegar a la pantalla de favoritos
  const navigateToFavorites = () => {
    navigation.navigate("Favorites")
  }

  // Navegar a la pantalla de recuerdos
  const navigateToMemories = () => {
    navigation.navigate("Memories")
  }

  // Navegar a la pantalla "Acerca de CineFanatic"
  const navigateToAbout = () => {
    navigation.navigate("About")
  }

  // Navegar a la pantalla "Política de privacidad"
  const navigateToPrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicy")
  }

  // Navegar a la pantalla "Condiciones de uso"
  const navigateToTermsOfService = () => {
    navigation.navigate("TermsOfService")
  }

  // Si no hay datos de usuario, no renderizar el contenido del perfil
  if (!userData) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Cargando perfil...</Text>
      </View>
    )
  }

  // Estilos dinámicos basados en el tema
  const dynamicStyles = {
    container: {
      backgroundColor: theme.background,
    },
    profileHeader: {
      backgroundColor: theme.card,
    },
    profileName: {
      color: theme.text,
    },
    profileEmail: {
      color: theme.textSecondary,
    },
    section: {
      backgroundColor: theme.card,
    },
    sectionTitle: {
      color: theme.primary,
    },
    settingItem: {
      borderBottomColor: theme.border,
    },
    settingText: {
      color: theme.text,
    },
    menuItem: {
      borderBottomColor: theme.border,
    },
    menuText: {
      color: theme.text,
    },
    footerText: {
      color: theme.textSecondary,
    },
  }

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.profileHeader, dynamicStyles.profileHeader]}>
        <Image
          source={{
            uri:
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(userData?.name || "Usuario") +
              "&background=032541&color=fff",
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.profileName, dynamicStyles.profileName]}>{userData?.name || "Usuario"}</Text>
        <Text style={[styles.profileEmail, dynamicStyles.profileEmail]}>
          {userData?.email || "usuario@ejemplo.com"}
        </Text>
        {/* 
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
         */}
      </View>

      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Preferencias</Text>

        <View style={[styles.settingItem, dynamicStyles.settingItem]}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={24} color={theme.primary} />
            <Text style={[styles.settingText, dynamicStyles.settingText]}>Modo oscuro</Text>
          </View>
          <Switch
            trackColor={{ false: theme.switchTrackInactive, true: theme.switchTrackActive }}
            thumbColor={isDarkMode ? theme.switchThumbActive : theme.switchThumbInactive}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>

        <View style={[styles.settingItem, dynamicStyles.settingItem]}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color={theme.primary} />
            <Text style={[styles.settingText, dynamicStyles.settingText]}>Notificaciones</Text>
          </View>
          <Switch
            trackColor={{ false: theme.switchTrackInactive, true: theme.switchTrackActive }}
            thumbColor={notifications ? theme.switchThumbActive : theme.switchThumbInactive}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notifications}
          />
        </View>
      </View>

      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Cuenta</Text>

        {/* Modificado: Ahora navega a la pantalla de Favoritos */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={navigateToFavorites}>
          <View style={styles.menuInfo}>
            <Ionicons name="heart-outline" size={24} color={theme.primary} />
            <Text style={[styles.menuText, dynamicStyles.menuText]}>Favoritos</Text>
            {userData.favorites && userData.favorites.length > 0 && (
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>{userData.favorites.length}</Text>
              </View>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Modificado: Ahora el historial navega a la pantalla de recuerdos */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={navigateToMemories}>
          <View style={styles.menuInfo}>
            <Ionicons name="time-outline" size={24} color={theme.primary} />
            <Text style={[styles.menuText, dynamicStyles.menuText]}>Recuerdos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, dynamicStyles.section]}>
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Información sobre</Text>

        {/* Actualizado: Ahora navega a la pantalla "Acerca de CineFanatic" */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={navigateToAbout}>
          <View style={styles.menuInfo}>
            <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
            <Text style={[styles.menuText, dynamicStyles.menuText]}>Acerca de CineFanatic</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Actualizado: Ahora navega a la pantalla "Política de privacidad" */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={navigateToPrivacyPolicy}>
          <View style={styles.menuInfo}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.primary} />
            <Text style={[styles.menuText, dynamicStyles.menuText]}>Política de privacidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Actualizado: Ahora navega a la pantalla "Condiciones de uso" */}
        <TouchableOpacity style={[styles.menuItem, dynamicStyles.menuItem]} onPress={navigateToTermsOfService}>
          <View style={styles.menuInfo}>
            <Ionicons name="document-text-outline" size={24} color={theme.primary} />
            <Text style={[styles.menuText, dynamicStyles.menuText]}>Condiciones de uso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, dynamicStyles.footerText]}>CineFanatic v2.0</Text>
        <Text style={[styles.footerText, dynamicStyles.footerText]}>Desarrollado por la API TMDB</Text>
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
  profileHeader: {
    alignItems: "center",
    padding: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "#032541",
    borderRadius: 20,
  },
  editButtonText: {
    color: "white",
    fontWeight: "500",
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
  badgeContainer: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B6B",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
})
