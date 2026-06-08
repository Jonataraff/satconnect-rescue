import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { COLORS } from "../theme/colors";
import { AlertItem, RiskLevel } from "../types/types";
import { getAlerts } from "../services/connectivityService";
import { getFavorites, saveFavorite, removeFavorite } from "../storage/favoritesStorage";
import AlertCard from "../components/AlertCard";
import Ionicons from "@expo/vector-icons/Ionicons";

type ViewTab = "todos" | "favoritos";

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [favorites, setFavorites] = useState<AlertItem[]>([]);
  const [activeTab, setActiveTab] = useState<ViewTab>("todos");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "TODOS">("TODOS");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data initially
  const loadData = async () => {
    try {
      const allAlerts = getAlerts();
      const allFavorites = await getFavorites();
      setAlerts(allAlerts);
      setFavorites(allFavorites);
    } catch (error) {
      console.log("Error loading alerts/favorites:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Reload favorites whenever screen focuses to keep it in sync
  useFocusEffect(
    React.useCallback(() => {
      const syncFavorites = async () => {
        const allFavorites = await getFavorites();
        setFavorites(allFavorites);
      };
      syncFavorites();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleToggleFavorite = async (alert: AlertItem) => {
    const isFav = favorites.some((fav) => fav.id === alert.id);
    if (isFav) {
      await removeFavorite(alert.id);
    } else {
      await saveFavorite(alert);
    }
    // Update local state
    const updatedFavorites = await getFavorites();
    setFavorites(updatedFavorites);
  };

  // Filter alerts based on activeTab and riskFilter
  const getFilteredData = () => {
    const baseList = activeTab === "todos" ? alerts : favorites;
    if (riskFilter === "TODOS") {
      return baseList;
    }
    return baseList.filter((alert) => alert.risk === riskFilter);
  };

  const filteredData = getFilteredData();

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Alertas e Incidentes</Text>
        <Text style={styles.subtitle}>Acompanhe áreas afetadas em tempo real</Text>
      </View>

      {/* Tabs Todos / Favoritos */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "todos" && styles.tabActive]}
          onPress={() => setActiveTab("todos")}
        >
          <Ionicons
            name="list-outline"
            size={18}
            color={activeTab === "todos" ? "#fff" : COLORS.subtitle}
          />
          <Text style={[styles.tabText, activeTab === "todos" && styles.tabTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favoritos" && styles.tabActive]}
          onPress={() => setActiveTab("favoritos")}
        >
          <Ionicons
            name="bookmark"
            size={18}
            color={activeTab === "favoritos" ? "#fff" : COLORS.subtitle}
          />
          <Text style={[styles.tabText, activeTab === "favoritos" && styles.tabTextActive]}>
            Salvos ({favorites.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter by Risk Level */}
      <View style={styles.filtersContainer}>
        {(["TODOS", "ALTO", "MÉDIO", "BAIXO"] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterBadge,
              riskFilter === filter && styles.filterBadgeActive,
            ]}
            onPress={() => setRiskFilter(filter)}
          >
            <Text
              style={[
                styles.filterBadgeText,
                riskFilter === filter && styles.filterBadgeTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Alerts list */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => {
          const isFav = favorites.some((fav) => fav.id === item.id);
          return (
            <AlertCard
              alert={item}
              isFavorited={isFav}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name={activeTab === "favoritos" ? "bookmark-outline" : "notifications-off-outline"}
              size={64}
              color={COLORS.subtitle}
            />
            <Text style={styles.emptyTitle}>
              {activeTab === "favoritos"
                ? "Nenhum alerta salvo"
                : "Nenhum incidente ativo"}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === "favoritos"
                ? "Save alertas importantes clicando no ícone de marcador para acesso offline rápido."
                : "Não há registro de alertas para os filtros selecionados."}
            </Text>
          </View>
        }
      />
    </View>
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
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 16,
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
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.subtitle,
    fontSize: 14,
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#fff",
  },
  filtersContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  filterBadgeActive: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderColor: COLORS.primary,
  },
  filterBadgeText: {
    color: COLORS.subtitle,
    fontSize: 12,
    fontWeight: "600",
  },
  filterBadgeTextActive: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.subtitle,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});