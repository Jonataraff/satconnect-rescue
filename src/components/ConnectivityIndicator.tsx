import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme/colors";
import { ConnectivityStatus } from "../types/types";

interface ConnectivityIndicatorProps {
  status: ConnectivityStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<
  ConnectivityStatus,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  online: { label: "Online", color: COLORS.success, icon: "wifi" },
  offline: { label: "Sem Rede", color: COLORS.danger, icon: "wifi-outline" },
  satellite: { label: "Via Satélite", color: COLORS.primary, icon: "planet" },
  degraded: { label: "Instável", color: COLORS.warning, icon: "warning" },
};

export default function ConnectivityIndicator({
  status,
  compact = false,
}: ConnectivityIndicatorProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.online;

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.compactText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { borderColor: config.color }]}>
      <Ionicons name={config.icon} size={18} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compactText: {
    fontSize: 12,
    fontWeight: "600",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
