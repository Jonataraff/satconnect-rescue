import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../theme/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserSettings, RiskLevel } from "../types/types";
import { getSettings, updateSetting, resetSettings } from "../storage/settingsStorage";

export default function SettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await getSettings();
      setSettings(stored);
    } catch (error) {
      console.log("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = async (val: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, notificationsEnabled: val });
    await updateSetting("notificationsEnabled", val);
  };

  const handleToggleGps = async (val: boolean) => {
    if (!settings) return;
    setSettings({ ...settings, gpsTrackingEnabled: val });
    await updateSetting("gpsTrackingEnabled", val);
  };

  const handleChangeInterval = async (interval: number) => {
    if (!settings) return;
    setSettings({ ...settings, autoRefreshInterval: interval });
    await updateSetting("autoRefreshInterval", interval);
  };

  const handleChangeThreshold = async (threshold: RiskLevel) => {
    if (!settings) return;
    setSettings({ ...settings, riskAlertThreshold: threshold });
    await updateSetting("riskAlertThreshold", threshold);
  };

  const handleReset = async () => {
    Alert.alert(
      "Confirmar Reset",
      "Deseja restaurar todas as configurações de rede e alertas para os padrões?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            await resetSettings();
            await loadSettings();
          },
        },
      ]
    );
  };

  if (loading || !settings) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Configurações</Text>

      {/* Alertas & Notificações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas & Notificações</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} style={styles.icon} />
            <View>
              <Text style={styles.rowText}>Alertas em Tempo Real</Text>
              <Text style={styles.rowSubtext}>Notificar desastres próximos</Text>
            </View>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={handleToggleNotification}
            trackColor={{ false: "#475569", true: COLORS.primary }}
            thumbColor="#f4f3f4"
          />
        </View>

        <View style={styles.cardSelectSection}>
          <Text style={styles.selectLabel}>Sensibilidade de Alerta Mínima</Text>
          <View style={styles.selectorContainer}>
            {(["BAIXO", "MÉDIO", "ALTO"] as RiskLevel[]).map((level) => {
              const active = settings.riskAlertThreshold === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.selectorButton,
                    active && styles.selectorButtonActive,
                  ]}
                  onPress={() => handleChangeThreshold(level)}
                >
                  <Text style={[styles.selectorText, active && styles.selectorTextActive]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Localização & Sincronização */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Localização & Sincronização</Text>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="location-outline" size={22} color={COLORS.text} style={styles.icon} />
            <View>
              <Text style={styles.rowText}>Rastreamento Ativo GPS</Text>
              <Text style={styles.rowSubtext}>Calcular riscos climatológicos locais</Text>
            </View>
          </View>
          <Switch
            value={settings.gpsTrackingEnabled}
            onValueChange={handleToggleGps}
            trackColor={{ false: "#475569", true: COLORS.primary }}
            thumbColor="#f4f3f4"
          />
        </View>

        <View style={styles.cardSelectSection}>
          <Text style={styles.selectLabel}>Intervalo de Atualização (minutos)</Text>
          <View style={styles.selectorContainer}>
            {([2, 5, 15, 30] as number[]).map((interval) => {
              const active = settings.autoRefreshInterval === interval;
              return (
                <TouchableOpacity
                  key={interval}
                  style={[
                    styles.selectorButton,
                    active && styles.selectorButtonActive,
                  ]}
                  onPress={() => handleChangeInterval(interval)}
                >
                  <Text style={[styles.selectorText, active && styles.selectorTextActive]}>
                    {interval} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Operações & Reset */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operações</Text>
        <TouchableOpacity style={styles.row} onPress={handleReset}>
          <View style={styles.rowLeft}>
            <Ionicons name="reload-outline" size={22} color={COLORS.danger} style={styles.icon} />
            <Text style={[styles.rowText, { color: COLORS.danger }]}>Restaurar Padrões</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.subtitle} />
        </TouchableOpacity>
      </View>

      {/* Sobre o aplicativo */}
      <View style={styles.aboutContainer}>
        <Ionicons name="planet" size={36} color={COLORS.primary} style={styles.aboutIcon} />
        <Text style={styles.aboutTitle}>SatConnect Rescue</Text>
        <Text style={styles.aboutVersion}>Versão 1.2.0 • Satélite Emergencial</Text>
        <Text style={styles.aboutFooter}>© 2026 Operação de Salvamento e Defesa Civil</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.subtitle,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 14,
  },
  rowText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
  },
  rowSubtext: {
    color: COLORS.subtitle,
    fontSize: 11,
    marginTop: 2,
  },
  cardSelectSection: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  selectLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "bold",
  },
  selectorContainer: {
    flexDirection: "row",
    gap: 8,
  },
  selectorButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  selectorButtonActive: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderColor: COLORS.primary,
  },
  selectorText: {
    color: COLORS.subtitle,
    fontSize: 12,
    fontWeight: "bold",
  },
  selectorTextActive: {
    color: COLORS.primary,
  },
  aboutContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 20,
  },
  aboutIcon: {
    marginBottom: 10,
  },
  aboutTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  aboutVersion: {
    color: COLORS.subtitle,
    fontSize: 12,
    marginTop: 4,
  },
  aboutFooter: {
    color: COLORS.subtitle,
    fontSize: 10,
    marginTop: 8,
  },
});
