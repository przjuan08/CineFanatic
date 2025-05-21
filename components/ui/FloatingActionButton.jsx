"use client"

import { useState } from "react"
import { View, TouchableOpacity, StyleSheet, Animated, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../context/ThemeContext"

// Componente de botón flotante con menú expandible
export default function FloatingActionButton() {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const animation = useState(new Animated.Value(0))[0]

  // Función para alternar el estado del menú (abierto/cerrado)
  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1

    // Animar la apertura/cierre del menú
    Animated.spring(animation, {
      toValue,
      friction: 6,
      useNativeDriver: true,
    }).start()

    setIsOpen(!isOpen)
  }

  // Calcular las transformaciones para los botones del menú
  const createButtonStyle = (index) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60 * index],
    })

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    })

    return {
      transform: [{ translateY }],
      opacity,
    }
  }

  // Calcular la rotación del icono principal
  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  })

  // Estilos dinámicos basados en el tema
  const dynamicStyles = {
    mainButton: {
      backgroundColor: theme.buttonPrimary,
    },
    secondaryButton: {
      backgroundColor: theme.buttonSecondary,
    },
    labelContainer: {
      backgroundColor: "rgba(0,0,0,0.7)",
    },
  }

  return (
    <View style={styles.container}>
      {/* Botón para crear recuerdo */}
      <Animated.View style={[styles.buttonContainer, createButtonStyle(2)]}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, dynamicStyles.secondaryButton]}
          onPress={() => {
            toggleMenu()
            navigation.navigate("CameraMemory")
          }}
        >
          <Ionicons name="camera" size={20} color="white" />
        </TouchableOpacity>
        <View style={[styles.labelContainer, dynamicStyles.labelContainer]}>
          <Text style={styles.label}>Crear recuerdo</Text>
        </View>
      </Animated.View>

      {/* Botón para ver recuerdos */}
      <Animated.View style={[styles.buttonContainer, createButtonStyle(1)]}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, dynamicStyles.secondaryButton]}
          onPress={() => {
            toggleMenu()
            navigation.navigate("Memories")
          }}
        >
          <Ionicons name="images" size={20} color="white" />
        </TouchableOpacity>
        <View style={[styles.labelContainer, dynamicStyles.labelContainer]}>
          <Text style={styles.label}>Ver recuerdos</Text>
        </View>
      </Animated.View>

      {/* Botón principal */}
      <TouchableOpacity
        style={[styles.button, styles.mainButton, dynamicStyles.mainButton]}
        onPress={toggleMenu}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="add" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: "#032541", // Color por defecto, será reemplazado por el tema
  },
  secondaryButton: {
    backgroundColor: "#3498db", // Color por defecto, será reemplazado por el tema
  },
  labelContainer: {
    position: "absolute",
    right: 66,
    backgroundColor: "rgba(0,0,0,0.7)", // Semi-transparente para que se vea bien en ambos temas
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  label: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
})
