import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { COLORS } from "../theme/colors";
import { getUserLocation } from "../services/locationService";
import { getWeather } from "../services/weatherService";
import { calculateRisk } from "../utils/riskCalculator";
import { getConnectivityStatus, getSuggestedSatellitePositions } from "../services/connectivityService";
import { WeatherData, RiskLevel, ConnectivityStatus, SatelliteUnit } from "../types/types";

import StatusCard from "../components/StatusCard";
import RiskBadge from "../components/RiskBadge";
import ConnectivityIndicator from "../components/ConnectivityIndicator";

export default function HomeScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<RiskLevel>("BAIXO");
  const [connectivity, setConnectivity] = useState<ConnectivityStatus>("online");
  const [activeSatellites, setActiveSatellites] = useState<SatelliteUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const coords = await getUserLocation();

      // Buscar Clima
      const weatherData = await getWeather(coords.latitude, coords.longitude);
      setWeather(weatherData);

      // Calcular Risco
      const rain = weatherData?.rain?.["1h"] || weatherData?.rain?.["3h"] || 0;
      const wind = (weatherData?.wind?.speed || 0) * 3.6; // convert m/s to km/h
      const riskLevel = calculateRisk(rain, wind);
      setRisk(riskLevel);

      // Status Conectividade
      const connStatus = getConnectivityStatus(coords.latitude, coords.longitude);
      setConnectivity(connStatus);

      // Satélites sugeridos/ativos
      const sats = getSuggestedSatellitePositions().filter(s => s.active);
      setActiveSatellites(sats);
    } catch (error: any) {
      console.log("Error loading Home screen data:", error);
      setErrorMsg("Não foi possível carregar os dados de telemetria. Verifique seu GPS e conexão.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loaderText}>Sincronizando com a rede de satélites...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SatConnect</Text>
          <Text style={styles.subtitle}>Portal de Resgate Emergencial</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
          <Ionicons name="refresh" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {errorMsg ? (
        <View style={styles.errorCard}>
          <Ionicons name="warning-outline" size={24} color={COLORS.danger} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Status Geral de Rede */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sinal e Conectividade Local</Text>
            <View style={styles.connectionCard}>
              <View style={styles.connectionMain}>
                <ConnectivityIndicator status={connectivity} />
                <Text style={styles.locationName}>
                  {weather?.name || "Coordenadas Ativas"}
                </Text>
              </View>
              <Text style={styles.connectionDesc}>
                {connectivity === "online" && "Sinal de operadora normal. Redes móveis operando sem restrições."}
                {connectivity === "degraded" && "Rede celular instável devido a sobrecarga ou tempestades locais."}
                {connectivity === "satellite" && "Rede celular caída. Roteamento de emergência via satélite ativo."}
                {connectivity === "offline" && "Aviso: Sem sinal local nem satélite ativo nessa exata coordenada."}
              </Text>
            </View>
          </View>

          {/* Risco Climatológico e Alerta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risco de Desastre na Região</Text>
            <View style={styles.riskCard}>
              <View style={styles.riskHeader}>
                <Text style={styles.riskLabel}>Ameaça Climática</Text>
                <RiskBadge risk={risk} size="small" />
              </View>
              <Text style={styles.riskDescription}>
                {risk === "ALTO" && "Risco crítico detectado! Evacue áreas inundáveis ou encostas instáveis. Siga as orientações da Defesa Civil."}
                {risk === "MÉDIO" && "Atenção moderada. Possibilidade de chuvas intensas e ventos moderados a fortes nas próximas horas."}
                {risk === "BAIXO" && "Condições meteorológicas seguras na sua região de coordenadas atuais."}
              </Text>
            </View>
          </View>

          {/* Telemetria Climática */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Telemetria de Clima</Text>
            <View style={styles.grid}>
              <StatusCard
                icon="thermometer-outline"
                value={weather?.main?.temp !== undefined ? `${weather.main.temp.toFixed(1)}°C` : "--"}
                label="Temperatura"
                iconColor="#F97316"
              />
              <StatusCard
                icon="speedometer-outline"
                value={weather?.wind?.speed !== undefined ? `${(weather.wind.speed * 3.6).toFixed(1)} km/h` : "--"}
                label="Vento"
                iconColor="#38BDF8"
              />
              <StatusCard
                icon="water-outline"
                value={weather?.main?.humidity !== undefined ? `${weather.main.humidity}%` : "--"}
                label="Umidade"
                iconColor="#60A5FA"
              />
              <StatusCard
                icon="cloud-outline"
                value={weather?.clouds?.all !== undefined ? `${weather.clouds.all}%` : "--"}
                label="Nebulosidade"
                iconColor="#94A3B8"
              />
            </View>
          </View>

          {/* Satélites de Cobertura */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frota de Satélites Emergenciais</Text>
            <View style={styles.satellitesContainer}>
              <Text style={styles.satellitesSummary}>
                {activeSatellites.length} unidades móveis de satélite ativas prestando suporte na região nacional.
              </Text>
              {activeSatellites.slice(0, 3).map((sat) => (
                <View key={sat.id} style={styles.satRow}>
                  <Ionicons name="planet" size={20} color={COLORS.primary} />
                  <View style={styles.satInfo}>
                    <Text style={styles.satName}>{sat.name}</Text>
                    <Text style={styles.satDetails}>
                      Órbita {sat.type} • Banda Larga ({sat.bandwidthMbps} Mbps)
                    </Text>
                  </View>
                  <View style={styles.satBadge}>
                    <Text style={styles.satBadgeText}>ATIVO</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 20,
  },
  loaderText: {
    color: COLORS.subtitle,
    marginTop: 15,
    fontSize: 15,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: COLORS.subtitle,
    fontSize: 14,
    marginTop: 2,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    justifyContent: "center",
    alignItems: "center",
  },
  errorCard: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  errorText: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  connectionCard: {
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 16,
  },
  connectionMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  connectionDesc: {
    color: COLORS.subtitle,
    fontSize: 13,
    lineHeight: 18,
  },
  riskCard: {
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 16,
  },
  riskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  riskLabel: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  riskDescription: {
    color: COLORS.subtitle,
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  satellitesContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  satellitesSummary: {
    color: COLORS.subtitle,
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  satRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.1)",
  },
  satInfo: {
    flex: 1,
    marginLeft: 12,
  },
  satName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  satDetails: {
    color: COLORS.subtitle,
    fontSize: 12,
    marginTop: 2,
  },
  satBadge: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  satBadgeText: {
    color: COLORS.success,
    fontSize: 11,
    fontWeight: "bold",
  },
});