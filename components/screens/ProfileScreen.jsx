"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [adultContent, setAdultContent] = useState(false)

  const toggleDarkMode = () => setDarkMode((previousState) => !previousState)
  const toggleNotifications = () => setNotifications((previousState) => !previousState)
  const toggleAdultContent = () => setAdultContent((previousState) => !previousState)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <Text style={styles.profileName}>Mauricio Rico</Text>
        <Text style={styles.profileEmail}>mauricio.rico@gmail.com</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={24} color="#032541" />
            <Text style={styles.settingText}>Modo oscuro</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#032541" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={darkMode}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#032541" />
            <Text style={styles.settingText}>Notificaciones</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notifications ? "#032541" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleNotifications}
            value={notifications}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Ionicons name="eye-off-outline" size={24} color="#032541" />
            <Text style={styles.settingText}>Contenido para adultos</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={adultContent ? "#032541" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAdultContent}
            value={adultContent}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cuenta</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="heart-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Favoritos</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="time-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Ver historial</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="download-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Descargas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información sobre</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="information-circle-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Acerca del Explorador de películas</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="shield-checkmark-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Política de privacidad</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuInfo}>
            <Ionicons name="document-text-outline" size={24} color="#032541" />
            <Text style={styles.menuText}>Condiciones de uso</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Explorador de películas v1.0</Text>
        <Text style={styles.footerText}>Desarrollado por la API TMDB</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "white",
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
    color: "#666",
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
    backgroundColor: "white",
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
    color: "#032541",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    borderBottomColor: "#f0f0f0",
  },
  menuInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
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
    color: "#999",
    fontSize: 12,
    marginBottom: 4,
  },
})

