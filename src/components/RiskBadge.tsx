import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";
import { RiskLevel } from "../types/types";

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: "small" | "large";
}

const RISK_COLORS: Record<RiskLevel, string> = {
  ALTO: COLORS.danger,
  "MÉDIO": COLORS.warning,
  BAIXO: COLORS.success,
};

export default function RiskBadge({ risk, size = "small" }: RiskBadgeProps) {
  const isLarge = size === "large";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: RISK_COLORS[risk] },
        isLarge && styles.badgeLarge,
      ]}
    >
      <Text style={[styles.text, isLarge && styles.textLarge]}>{risk}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  text: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  textLarge: {
    fontSize: 28,
  },
});
