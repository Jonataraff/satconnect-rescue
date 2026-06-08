import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../theme/colors";
import { AlertItem } from "../types/types";
import RiskBadge from "./RiskBadge";
import ConnectivityIndicator from "./ConnectivityIndicator";

interface AlertCardProps {
  alert: AlertItem;
  isFavorited: boolean;
  onToggleFavorite: (alert: AlertItem) => void;
}

export default function AlertCard({
  alert,
  isFavorited,
  onToggleFavorite,
}: AlertCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.type}>{alert.type}</Text>
          <Text style={styles.city}>
            {alert.city}, {alert.state}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onToggleFavorite(alert)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorited ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isFavorited ? COLORS.primary : COLORS.subtitle}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {alert.description}
      </Text>

      <View style={styles.footer}>
        <RiskBadge risk={alert.risk} />
        <ConnectivityIndicator status={alert.connectivity} compact />
        <View style={styles.affected}>
          <Ionicons name="people-outline" size={14} color={COLORS.subtitle} />
          <Text style={styles.affectedText}>
            {alert.affectedPeople.toLocaleString("pt-BR")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  type: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  city: {
    color: COLORS.subtitle,
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    color: COLORS.subtitle,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  affected: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  affectedText: {
    color: COLORS.subtitle,
    fontSize: 12,
  },
});
