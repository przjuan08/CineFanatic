"use client"

import React, { useEffect } from "react"
import { View, Text, StyleSheet, Image, Animated } from "react-native"
import { useTheme } from "../context/ThemeContext"

export default function SplashScreen() {
  const { theme } = useTheme()
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        delay: 1000,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim])

  // Estilos dinámicos basados en el tema
  const dynamicStyles = {
    container: {
      backgroundColor: theme.primary, // Usamos el color primario del tema para mantener la identidad de marca
    },
    title: {
      color: "white", // Mantenemos el texto en blanco para mejor contraste con el fondo primario
    },
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.title, dynamicStyles.title]}>CineFanatic</Text>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
  },
})
