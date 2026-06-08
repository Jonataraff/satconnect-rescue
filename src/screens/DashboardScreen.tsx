import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { COLORS } from "../theme/colors";
import { getStatsSummary, getAlerts } from "../services/connectivityService";
import StatusCard from "../components/StatusCard";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const stats = getStatsSummary();
  const alerts = getAlerts();

  // Calculate dynamic disaster counts
  const disasterCounts: Record<string, number> = {};
  alerts.forEach((alert) => {
    disasterCounts[alert.type] = (disasterCounts[alert.type] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(disasterCounts),
    datasets: [
      {
        data: Object.values(disasterCounts),
      },
    ],
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Estatísticas de Resgate</Text>
        <Text style={styles.subtitle}>Visão geral operacional e infraestrutura</Text>
      </View>

      {/* Grid of Key Operations Metrics */}
      <View style={styles.grid}>
        <StatusCard
          icon="people-outline"
          value={stats.totalAffectedPeople.toLocaleString("pt-BR")}
          label="Pessoas Afetadas"
          iconColor={COLORS.primary}
        />
        <StatusCard
          icon="planet-outline"
          value={`${stats.activeSatellites}/${stats.totalSatellites}`}
          label="Satélites Ativos"
          iconColor={COLORS.success}
        />
        <StatusCard
          icon="cellular-outline"
          value={`${stats.totalTowersDamaged}/${stats.totalTowers}`}
          label="Torres Danificadas"
          iconColor={COLORS.danger}
        />
        <StatusCard
          icon="warning-outline"
          value={stats.totalAlerts.toString()}
          label="Alertas Ativos"
          iconColor={COLORS.warning}
        />
      </View>

      {/* Chart Section - Disasters by Type */}
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Incidentes por Categoria</Text>
        <BarChart
          data={chartData}
          width={screenWidth > 600 ? 560 : screenWidth - 40}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
          chartConfig={{
            backgroundGradientFrom: COLORS.card,
            backgroundGradientTo: COLORS.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForBackgroundLines: {
              strokeDasharray: "", // solid background lines
              stroke: "rgba(148, 163, 184, 0.1)",
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* Distribution of Risk Levels */}
      <View style={styles.distributionSection}>
        <Text style={styles.chartTitle}>Distribuição de Gravidade</Text>
        <View style={styles.riskBarContainer}>
          <View style={styles.riskBarItem}>
            <View style={styles.riskBarRow}>
              <Text style={styles.riskBarLabel}>Alto Risco</Text>
              <Text style={styles.riskBarValue}>{stats.highRiskAlerts} alertas</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: COLORS.danger,
                    width: `${(stats.highRiskAlerts / stats.totalAlerts) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.riskBarItem}>
            <View style={styles.riskBarRow}>
              <Text style={styles.riskBarLabel}>Médio Risco</Text>
              <Text style={styles.riskBarValue}>{stats.mediumRiskAlerts} alertas</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: COLORS.warning,
                    width: `${(stats.mediumRiskAlerts / stats.totalAlerts) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.riskBarItem}>
            <View style={styles.riskBarRow}>
              <Text style={styles.riskBarLabel}>Baixo Risco</Text>
              <Text style={styles.riskBarValue}>{stats.lowRiskAlerts} alertas</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: COLORS.success,
                    width: `${(stats.lowRiskAlerts / stats.totalAlerts) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
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
    paddingBottom: 40,
  },
  header: {
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartSection: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  chartTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
  distributionSection: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 16,
  },
  riskBarContainer: {
    gap: 16,
  },
  riskBarItem: {},
  riskBarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  riskBarLabel: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  riskBarValue: {
    color: COLORS.subtitle,
    fontSize: 12,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(148, 163, 184, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
});