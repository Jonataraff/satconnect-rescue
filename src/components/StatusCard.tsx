import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme/colors";

interface StatusCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  iconColor?: string;
}

export default function StatusCard({ icon, value, label, iconColor }: StatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconRow}>
        <Ionicons name={icon} size={20} color={iconColor || COLORS.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  iconRow: {
    marginBottom: 8,
  },
  value: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    color: COLORS.subtitle,
    fontSize: 13,
    marginTop: 4,
  },
});
