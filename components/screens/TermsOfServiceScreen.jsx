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
 * Pantalla de Condiciones de Uso
 * Muestra los términos y condiciones para el uso de la aplicación
 */
export default function TermsOfServiceScreen() {
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
          Condiciones de Uso
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
            Términos y Condiciones
          </Text>
          <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
            Última actualización: 21 de mayo de 2025
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Bienvenido a CineFanatic. Estos Términos y Condiciones rigen tu uso
            de la aplicación CineFanatic y todos los servicios relacionados. Al
            acceder o utilizar nuestra aplicación, aceptas estar legalmente
            obligado por estos términos. Si no estás de acuerdo con alguna parte
            de estos términos, no podrás utilizar nuestros servicios.
          </Text>
        </View>

        {/* Uso de la aplicación */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            1. Uso de la Aplicación
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            1.1 Elegibilidad
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Para utilizar CineFanatic, debes tener al menos 13 años de edad. Si
            eres menor de 18 años, debes tener el consentimiento de tus padres o
            tutores legales para utilizar la aplicación.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            1.2 Registro de cuenta
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Al registrarte en CineFanatic, aceptas proporcionar información
            precisa y completa. Eres responsable de mantener la confidencialidad
            de tu contraseña y de todas las actividades que ocurran bajo tu
            cuenta.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            1.3 Uso aceptable
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Te comprometes a utilizar CineFanatic solo para fines legales y de
            acuerdo con estos términos. No puedes utilizar nuestra aplicación de
            manera que pueda dañar, deshabilitar, sobrecargar o deteriorar el
            servicio.
          </Text>
        </View>

        {/* Contenido del usuario */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            2. Contenido del Usuario
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            2.1 Propiedad
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            Cualquier contenido que subas a CineFanatic, como recuerdos,
            comentarios o reseñas, sigue siendo de tu propiedad. Sin embargo, al
            publicar contenido, nos otorgas una licencia mundial, no exclusiva y
            libre de regalías para usar, reproducir y mostrar dicho contenido en
            relación con el servicio.
          </Text>

          <Text style={[styles.subTitle, { color: theme.text }]}>
            2.2 Contenido prohibido
          </Text>
          <Text style={[styles.paragraph, { color: theme.text }]}>
            No puedes publicar contenido que sea ilegal, ofensivo, difamatorio,
            obsceno, invasivo de la privacidad de otros, o que infrinja derechos
            de propiedad intelectual. Nos reservamos el derecho de eliminar
            cualquier contenido que consideremos inapropiado.
          </Text>
        </View>

        {/* Propiedad intelectual */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            3. Propiedad Intelectual
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            CineFanatic y todo su contenido, características y funcionalidad son
            propiedad de nuestra empresa y están protegidos por leyes de
            propiedad intelectual. No puedes reproducir, distribuir, modificar,
            crear trabajos derivados, mostrar públicamente o utilizar de
            cualquier otra manera el contenido de la aplicación sin nuestro
            permiso expreso.
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            La información sobre películas, imágenes y otros datos relacionados
            con el cine se obtienen a través de The Movie Database (TMDB) y
            están sujetos a sus propios términos y condiciones.
          </Text>
        </View>

        {/* Limitación de responsabilidad */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            4. Limitación de Responsabilidad
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            CineFanatic se proporciona "tal cual" y "según disponibilidad", sin
            garantías de ningún tipo. No garantizamos que la aplicación sea
            ininterrumpida, oportuna, segura o libre de errores.
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            En ningún caso seremos responsables por daños directos, indirectos,
            incidentales, especiales o consecuentes que resulten del uso o la
            imposibilidad de usar nuestra aplicación.
          </Text>
        </View>

        {/* Modificaciones */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            5. Modificaciones
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Nos reservamos el derecho de modificar o reemplazar estos términos
            en cualquier momento. Si realizamos cambios materiales, te
            notificaremos a través de la aplicación o por correo electrónico. Tu
            uso continuado de CineFanatic después de dichos cambios constituye
            tu aceptación de los nuevos términos.
          </Text>
        </View>

        {/* Terminación */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            6. Terminación
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Podemos terminar o suspender tu acceso a CineFanatic inmediatamente,
            sin previo aviso ni responsabilidad, por cualquier razón,
            incluyendo, sin limitación, si incumples estos Términos y
            Condiciones.
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Tras la terminación, tu derecho a utilizar la aplicación cesará
            inmediatamente. Todas las disposiciones de estos términos que por su
            naturaleza deberían sobrevivir a la terminación sobrevivirán.
          </Text>
        </View>

        {/* Ley aplicable */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            7. Ley Aplicable
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Estos términos se regirán e interpretarán de acuerdo con las leyes
            del país en el que operamos, sin tener en cuenta sus disposiciones
            sobre conflictos de leyes.
          </Text>
        </View>

        {/* Contacto */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            8. Contacto
          </Text>

          <Text style={[styles.paragraph, { color: theme.text }]}>
            Si tienes preguntas sobre estos Términos y Condiciones, contáctanos
            en:
          </Text>

          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Correo electrónico:
          </Text>
          <Text style={[styles.contactInfo, { color: theme.text }]}>
            legal.cinefanatic@gmail.com
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
