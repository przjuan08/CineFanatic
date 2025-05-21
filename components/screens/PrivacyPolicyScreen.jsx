"use client";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

/**
 * Pantalla de Política de Privacidad
 * Muestra información detallada sobre cómo la aplicación maneja los datos del usuario
 */
export default function PrivacyPolicyScreen() {
  // Hooks para navegación y tema
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Función para volver a la pantalla anterior
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Encabezado con botón de regreso */}
      <View
        style={[styles.header, { backgroundColor: theme.headerBackground }]}
      >
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={theme.headerText} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>
          Política de Privacidad
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Contenido principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Introducción */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Introducción
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
            Última actualización: 21 de mayo de 2025
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            En CineFanatic, respetamos tu privacidad y nos comprometemos a
            proteger tus datos personales. Esta Política de Privacidad explica
            cómo recopilamos, utilizamos y protegemos la información que nos
            proporcionas al utilizar nuestra aplicación.
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Al utilizar CineFanatic, aceptas las prácticas descritas en esta
            política. Te recomendamos leer detenidamente este documento para
            entender nuestro enfoque respecto a tus datos.
          </Text>
        </View>

        {/* Información que recopilamos */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Información que Recopilamos
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Para proporcionar y mejorar nuestros servicios, recopilamos los
            siguientes tipos de información:
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            Información de la cuenta
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Cuando creas una cuenta, recopilamos tu nombre, dirección de correo
            electrónico y contraseña. Esta información es necesaria para
            identificarte y permitirte acceder a tu cuenta personal.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            Preferencias y actividad
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Almacenamos tus preferencias de películas, listas de favoritos y
            recuerdos que creas dentro de la aplicación. Esta información nos
            permite personalizar tu experiencia y guardar tus datos para futuras
            sesiones.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            Información del dispositivo
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Recopilamos información sobre el dispositivo que utilizas, como el
            modelo, sistema operativo, identificadores únicos y datos de
            conexión. Estos datos nos ayudan a optimizar la aplicación y
            solucionar problemas técnicos.
          </Text>
        </View>

        {/* Cómo utilizamos la información */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Cómo Utilizamos la Información
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Utilizamos la información recopilada para los siguientes propósitos:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Proporcionar, mantener y mejorar nuestros servicios
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Personalizar tu experiencia dentro de la aplicación
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Comunicarnos contigo sobre actualizaciones, nuevas funciones o
              cambios en nuestros servicios
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Detectar, prevenir y solucionar problemas técnicos o de seguridad
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Cumplir con obligaciones legales y proteger nuestros derechos
            </Text>
          </View>
        </View>

        {/* Compartir información */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Compartir Información
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            No vendemos ni alquilamos tus datos personales a terceros. Sin
            embargo, podemos compartir información en las siguientes
            circunstancias:
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            Proveedores de servicios
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Trabajamos con empresas que nos ayudan a operar, mejorar y mantener
            nuestra aplicación. Estos proveedores tienen acceso limitado a tu
            información y están obligados contractualmente a protegerla.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            Requisitos legales
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Podemos divulgar información si creemos de buena fe que es necesario
            para cumplir con la ley, proteger nuestros derechos o la seguridad
            de nuestros usuarios.
          </Text>
        </View>

        {/* Seguridad de datos */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Seguridad de Datos
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Implementamos medidas de seguridad técnicas y organizativas para
            proteger tus datos personales contra accesos no autorizados, pérdida
            o alteración. Sin embargo, ningún sistema es completamente seguro,
            por lo que no podemos garantizar la seguridad absoluta de tu
            información.
          </Text>
        </View>

        {/* Tus derechos */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Tus Derechos
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Dependiendo de tu ubicación, puedes tener ciertos derechos
            relacionados con tus datos personales, como:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Acceder a los datos personales que tenemos sobre ti
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Corregir datos inexactos o incompletos
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Solicitar la eliminación de tus datos personales
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={[styles.bullet, { color: theme.primary }]}>•</Text>
            <Text style={[styles.bulletText, { color: theme.text }]}>
              Oponerte al procesamiento de tus datos
            </Text>
          </View>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Para ejercer estos derechos, contáctanos a través de la información
            proporcionada al final de esta política.
          </Text>
        </View>

        {/* Cambios en la política */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Cambios en esta Política
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Podemos actualizar esta Política de Privacidad periódicamente. Te
            notificaremos sobre cambios significativos mediante un aviso en la
            aplicación o por correo electrónico. Te recomendamos revisar esta
            política regularmente para estar informado sobre cómo protegemos tu
            información.
          </Text>
        </View>

        {/* Contacto */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Contacto
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Si tienes preguntas o inquietudes sobre esta Política de Privacidad
            o sobre cómo manejamos tus datos personales, contáctanos en:
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Correo electrónico:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.text }]}>
            privacidad.cinefanatic@gmail.com
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Dirección:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.text }]}>
            Calle a Plan del Pino Km 1 1/2. Ciudadela Don Bosco, Soyapango, El
            Salvador, CA. Código Postal 1874
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
  );
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
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 6,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 16,
    flex: 1,
  },
  contactInfo: {
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
});
