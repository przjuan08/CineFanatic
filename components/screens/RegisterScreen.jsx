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

// Asegurarse de que el componente se exporte correctamente
const RegisterScreen = () => {
  const navigation = useNavigation()
  const { register, error, isLoading } = useAuth()
  const { theme } = useTheme()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true)

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Resetear errores cuando cambian los inputs
  useEffect(() => {
    setNameError("")
  }, [name])

  useEffect(() => {
    setEmailError("")
  }, [email])

  useEffect(() => {
    setPasswordError("")
  }, [password])

  useEffect(() => {
    setConfirmPasswordError("")
  }, [confirmPassword])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleRegister = async () => {
    // Validar campos
    let isValid = true

    if (!name.trim()) {
      setNameError("El nombre es obligatorio")
      isValid = false
    }

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
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres")
      isValid = false
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden")
      isValid = false
    }

    if (!isValid) return

    // Intentar registrar
    const success = await register(name, email, password)

    if (success) {
      // Mostrar mensaje de éxito
      Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.", [
        {
          text: "OK",
          onPress: () => {
            // Navegar a Login después del registro exitoso
            navigation.navigate("Login")
          },
        },
      ])
    }
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
    loginText: {
      color: theme.textSecondary,
    },
    loginLink: {
      color: theme.primary,
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
          <Text style={[styles.title, dynamicStyles.title]}>Crear Cuenta</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Ionicons name="person-outline" size={20} color={theme.inputPlaceholder} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Nombre completo"
              placeholderTextColor={theme.inputPlaceholder}
              value={name}
              onChangeText={setName}
              autoCorrect={false}
            />
          </View>
          {nameError ? <Text style={[styles.fieldError, dynamicStyles.fieldError]}>{nameError}</Text> : null}

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

          <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.inputPlaceholder} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, dynamicStyles.input]}
              placeholder="Confirmar contraseña"
              placeholderTextColor={theme.inputPlaceholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirmTextEntry}
            />
            <TouchableOpacity onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)} style={styles.eyeIcon}>
              <Ionicons
                name={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={theme.inputPlaceholder}
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={[styles.fieldError, dynamicStyles.fieldError]}>{confirmPasswordError}</Text>
          ) : null}

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.registerButtonText}>Registrarse</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, dynamicStyles.loginText]}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={[styles.loginLink, dynamicStyles.loginLink]}>Iniciar sesión</Text>
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
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
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
  registerButton: {
    backgroundColor: "#032541",
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#666",
  },
  loginLink: {
    fontWeight: "bold",
  },
})

// Asegurarse de que el componente se exporte correctamente
export default RegisterScreen
