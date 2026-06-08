import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getUserLocation } from "../services/locationService";
import { COLORS } from "../theme/colors";
import { getAlerts, getDeadZones, getSuggestedSatellitePositions } from "../services/connectivityService";
import { AlertItem, ConnectivityZone, SatelliteUnit } from "../types/types";

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [deadZones, setDeadZones] = useState<ConnectivityZone[]>([]);
  const [satellites, setSatellites] = useState<SatelliteUnit[]>([]);
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

  useEffect(() => {
    async function fetchData() {
      try {
        const coords = await getUserLocation();
        setLocation(coords);
      } catch (error) {
        console.log("Error fetching location for map:", error);
        // Fallback to São Paulo
        setLocation({
          latitude: -23.5505,
          longitude: -46.6333,
        });
      } finally {
        setAlerts(getAlerts());
        setDeadZones(getDeadZones());
        setSatellites(getSuggestedSatellitePositions());
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const initialLat = location ? location.latitude : -23.5505;
  const initialLon = location ? location.longitude : -46.6333;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        mapType={mapType}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLon,
          latitudeDelta: 1.5,
          longitudeDelta: 1.5,
        }}
        showsUserLocation
      >
        {/* Disaster Alerts Markers */}
        {alerts.map((alert) => (
          <Marker
            key={`alert-${alert.id}`}
            coordinate={{
              latitude: alert.latitude,
              longitude: alert.longitude,
            }}
            title={alert.type}
            description={`${alert.city} - Risco: ${alert.risk}`}
          >
            <View style={[styles.markerContainer, { backgroundColor: alert.risk === "ALTO" ? COLORS.danger : COLORS.warning }]}>
              <Ionicons name="warning" size={16} color="#fff" />
            </View>
          </Marker>
        ))}

        {/* Dead Zones Markers & Coverage Areas (Red Circles) */}
        {deadZones.map((zone) => (
          <React.Fragment key={`zone-${zone.id}`}>
            <Marker
              coordinate={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              title={`Sem Sinal: ${zone.city}`}
              description={`Torres Danificadas: ${zone.towersDamaged}/${zone.towersTotal}`}
            >
              <View style={[styles.markerContainer, { backgroundColor: COLORS.danger, borderRadius: 4 }]}>
                <Ionicons name="cellular-outline" size={16} color="#fff" />
              </View>
            </Marker>
            <Circle
              center={{
                latitude: zone.latitude,
                longitude: zone.longitude,
              }}
              radius={zone.radius * 1000} // radius in meters
              fillColor="rgba(239, 68, 68, 0.15)"
              strokeColor={COLORS.danger}
              strokeWidth={1}
            />
          </React.Fragment>
        ))}

        {/* Satellite Position Markers & Coverage Areas (Blue Circles) */}
        {satellites.map((sat) => (
          <React.Fragment key={`sat-${sat.id}`}>
            <Marker
              coordinate={{
                latitude: sat.latitude,
                longitude: sat.longitude,
              }}
              title={sat.name}
              description={`Tipo: ${sat.type} - Banda: ${sat.bandwidthMbps} Mbps`}
            >
              <View style={[styles.markerContainer, { backgroundColor: COLORS.primary, borderRadius: 12 }]}>
                <Ionicons name="planet" size={16} color="#fff" />
              </View>
            </Marker>
            {sat.active && (
              <Circle
                center={{
                  latitude: sat.latitude,
                  longitude: sat.longitude,
                }}
                radius={sat.coverageRadius * 1000} // radius in meters
                fillColor="rgba(59, 130, 246, 0.12)"
                strokeColor={COLORS.primary}
                strokeWidth={1}
              />
            )}
          </React.Fragment>
        ))}
      </MapView>

      {/* Floating Map Controls & Legend */}
      <View style={styles.floatingControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setMapType(mapType === "standard" ? "satellite" : "standard")}
        >
          <Ionicons name={mapType === "standard" ? "earth" : "map-outline"} size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Legend Container */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Legenda Operacional</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: COLORS.danger }]} />
            <Text style={styles.legendText}>Sem Sinal / Perigo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Satélite / Resgate</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendIndicator, { backgroundColor: COLORS.warning }]} />
            <Text style={styles.legendText}>Risco Médio</Text>
          </View>
        </View>
      </View>
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
    backgroundColor: COLORS.background,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  markerContainer: {
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingControls: {
    position: "absolute",
    top: 50,
    right: 20,
    gap: 10,
  },
  controlButton: {
    backgroundColor: COLORS.card,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  legendContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.1)",
  },
  legendTitle: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: COLORS.subtitle,
    fontSize: 11,
    fontWeight: "500",
  },
});
