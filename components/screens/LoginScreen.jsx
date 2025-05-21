"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { clearAuthData, checkStorage } from "../../ClearStorage"

// Asegurarse de que el componente se exporte correctamente
const LoginScreen = () => {
  const navigation = useNavigation()
  const { login, error, isLoading } = useAuth()
  const { theme } = useTheme()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Verificar el estado de AsyncStorage al cargar (para depuración)
  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        await checkStorage()
      } catch (e) {
        console.error("Error al verificar AsyncStorage:", e)
      }
    }

    checkAsyncStorage()
  }, [])

  // Resetear errores cuando cambian los inputs
  useEffect(() => {
    setEmailError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
  }, [password])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async () => {
    // Validar campos
    let isValid = true

    if (!email.trim()) {
      setEmailError("El correo electrónico es obligatorio")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido")
      isValid = false
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es obligatoria")
      isValid = false
    }

    if (!isValid) return

    // Intentar iniciar sesión
    const success = await login(email, password)

    if (success) {
      console.log("Login exitoso, navegando a Home")
      // No necesitamos navegar manualmente, el cambio en el estado de autenticación
      // hará que el navegador principal cambie a las rutas de la aplicación
    }
  }

  // Función para crear un usuario de prueba
  const createTestUser = async () => {
    try {
      // Crear un usuario de prueba
      const testUser = {
        id: "test123",
        name: "Usuario de Prueba",
        email: "test@example.com",
        password: "password123",
        favorites: [],
        createdAt: new Date().toISOString(),
      }

      // Guardar en la "base de datos" local
      const usersString = await AsyncStorage.getItem("users")
      const users = usersString ? JSON.parse(usersString) : []

      // Verificar si ya existe
      const existingUser = users.find((u) => u.email === testUser.email)
      if (!existingUser) {
        users.push(testUser)
        await AsyncStorage.setItem("users", JSON.stringify(users))

        Alert.alert("Usuario de prueba creado", "Email: test@example.com\nContraseña: password123", [{ text: "OK" }])
      } else {
        Alert.alert(
          "Usuario de prueba",
          "Ya existe un usuario de prueba.\nEmail: test@example.com\nContraseña: password123",
          [{ text: "OK" }],
        )
      }
    } catch (e) {
      console.error("Error al crear usuario de prueba:", e)
      Alert.alert("Error", "No se pudo crear el usuario de prueba")
    }
  }

  // Función para limpiar datos de autenticación (para depuración)
  const handleClearAuth = async () => {
    await clearAuthData()
    Alert.alert("Datos limpiados", "Los datos de autenticación han sido eliminados")
  }

  // Estilos dinámicos basados en el tema
  const dynamicStyles = {
    container: {
      backgroundColor: theme.background,
    },
    appName: {
      color: theme.primary,
    },
    formContainer: {
      backgroundColor: theme.card,
      shadowColor: theme.text,
    },
    title: {
      color: theme.primary,
    },
    inputContainer: {
      borderColor: theme.inputBorder,
      backgroundColor: theme.inputBackground,
    },
    input: {
      color: theme.inputText,
    },
    fieldError: {
      color: theme.error,
    },
    registerText: {
      color: theme.textSecondary,
    },
    registerLink: {
      color: theme.primary,
    },
    debugButtonText: {
      color: theme.textSecondary,
    },
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[styles.container, dynamicStyles.container]}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, dynamicStyles.appName]}>CineFanatic</Text>
        </View>

        <View style={[styles.formContainer, dynamicStyles.formContainer]}>
          <Text style={[styles.title, dynamicStyles.title]}>Iniciar Sesión</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Ionicons name="mail-outline" size={20} color={theme.inputPlaceholder} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Correo electrónico"
              placeholderTextColor={theme.inputPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
          {emailError ? <Text style={[styles.fieldError, dynamicStyles.fieldError]}>{emailError}</Text> : null}

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.inputPlaceholder} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Contraseña"
              placeholderTextColor={theme.inputPlaceholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)} style={styles.eyeIcon}>
              <Ionicons
                name={secureTextEntry ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={theme.inputPlaceholder}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={[styles.fieldError, dynamicStyles.fieldError]}>{passwordError}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, dynamicStyles.registerText]}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={[styles.registerLink, dynamicStyles.registerLink]}>Regístrate</Text>
            </TouchableOpacity>
          </View>

          {/* Botones de depuración */}
          <View style={styles.debugContainer}>
            <TouchableOpacity style={styles.debugButton} onPress={createTestUser}>
              <Text style={[styles.debugButtonText, dynamicStyles.debugButtonText]}>Crear usuario de prueba</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.debugButton} onPress={handleClearAuth}>
              <Text style={[styles.debugButtonText, dynamicStyles.debugButtonText]}>
                Limpiar datos de autenticación
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  formContainer: {
    borderRadius: 10,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  errorText: {
    color: "#FF6B6B",
    marginLeft: 5,
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    height: 50,
  },
  inputIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  fieldError: {
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: "#032541",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    fontWeight: "bold",
  },
  debugContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  debugButton: {
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  debugButtonText: {
    textDecorationLine: "underline",
  },
})

// Asegurarse de que el componente se exporte correctamente
export default LoginScreen
