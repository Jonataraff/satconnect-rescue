import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, ScrollView } from "react-native";
import { getUserLocation } from "../services/locationService";
import { COLORS } from "../theme/colors";
import { getAlerts, getDeadZones, getSuggestedSatellitePositions } from "../services/connectivityService";
import { AlertItem, ConnectivityZone, SatelliteUnit } from "../types/types";
import RiskBadge from "../components/RiskBadge";
import ConnectivityIndicator from "../components/ConnectivityIndicator";

type TabType = "alertas" | "zonas" | "satelites";

export default function MapScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [deadZones, setDeadZones] = useState<ConnectivityZone[]>([]);
  const [satellites, setSatellites] = useState<SatelliteUnit[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>("alertas");
  const [selectedItem, setSelectedItem] = useState<{ id: string; latitude: number; longitude: number } | null>(null);

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
        const listAlerts = getAlerts();
        const listZones = getDeadZones();
        const listSats = getSuggestedSatellitePositions();
        setAlerts(listAlerts);
        setDeadZones(listZones);
        setSatellites(listSats);

        // Select first alert by default if available
        if (listAlerts.length > 0) {
          setSelectedItem({
            id: listAlerts[0].id,
            latitude: listAlerts[0].latitude,
            longitude: listAlerts[0].longitude,
          });
        }
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

  // Focus coordinates
  const currentLat = selectedItem ? selectedItem.latitude : (location ? location.latitude : -23.5505);
  const currentLon = selectedItem ? selectedItem.longitude : (location ? location.longitude : -46.6333);

  // Generate dynamic Leaflet HTML to display multiple markers & circles
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
        <style>
          html, body, #map {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #0F172A;
          }
          /* Custom theme for Leaflet popups */
          .leaflet-popup-content-wrapper {
            background: #1E293B !important;
            color: #F8FAFC !important;
            border-radius: 8px;
            font-family: sans-serif;
            border: 1px solid rgba(148, 163, 184, 0.2);
          }
          .leaflet-popup-tip {
            background: #1E293B !important;
          }
          .leaflet-container a.leaflet-popup-close-button {
            color: #94A3B8 !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialize map centered at current coordinates
          const map = L.map('map', { zoomControl: true }).setView([${currentLat}, ${currentLon}], 10);
          
          // Dark Mode Tile Layer
          L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          // Custom Marker Icon for selected focus item
          const focusIcon = L.divIcon({
            html: '<div style="background-color: #3B82F6; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #3B82F6;"></div>',
            className: 'custom-focus-icon',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
          });

          // Add selected focus marker
          const focusMarker = L.marker([${currentLat}, ${currentLon}], { icon: focusIcon }).addTo(map)
            .bindPopup('<b style="color: #3B82F6;">Foco Selecionado</b><br>Coordenadas: ${currentLat.toFixed(4)}, ${currentLon.toFixed(4)}')
            .openPopup();

          // Load alerts data
          const alerts = ${JSON.stringify(alerts)};
          alerts.forEach(alert => {
            const color = alert.risk === 'ALTO' ? '#EF4444' : '#F59E0B';
            const alertIcon = L.divIcon({
              html: '<div style="background-color: ' + color + '; width: 12px; height: 12px; border-radius: 50%; border: 1.5px solid white;"></div>',
              className: 'alert-marker',
              iconSize: [12, 12]
            });
            L.marker([alert.latitude, alert.longitude], { icon: alertIcon }).addTo(map)
              .bindPopup('<b style="color: ' + color + ';">' + alert.type + ' (Alerta)</b><br><b>Cidade:</b> ' + alert.city + ' - ' + alert.state + '<br><b>Risco:</b> ' + alert.risk + '<br><b>Afetados:</b> ' + alert.affectedPeople.toLocaleString('pt-BR') + ' pessoas');
          });

          // Load dead zones data
          const deadZones = ${JSON.stringify(deadZones)};
          deadZones.forEach(zone => {
            // Draw circle for dead zone (offline/degraded coverage area)
            const color = zone.status === 'offline' ? '#EF4444' : '#F59E0B';
            L.circle([zone.latitude, zone.longitude], {
              color: color,
              fillColor: color,
              fillOpacity: 0.15,
              weight: 1.5,
              radius: zone.radius * 1000 // Convert km to meters
            }).addTo(map)
              .bindPopup('<b style="color: ' + color + ';">Área Sem Sinal (Dead Zone)</b><br><b>Cidade:</b> ' + zone.city + '<br><b>Torres Danificadas:</b> ' + zone.towersDamaged + '/' + zone.towersTotal + '<br><b>Status:</b> ' + zone.status.toUpperCase());
          });

          // Load satellite data
          const satellites = ${JSON.stringify(satellites)};
          satellites.forEach(sat => {
            if (sat.active) {
              const color = '#22C55E';
              const satIcon = L.divIcon({
                html: '<div style="background-color: #3B82F6; width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid #22C55E; display: flex; align-items: center; justify-content: center; color: white; font-size: 8px; font-weight: bold;">S</div>',
                className: 'sat-marker',
                iconSize: [14, 14]
              });
              
              // Draw marker and coverage circle
              L.marker([sat.latitude, sat.longitude], { icon: satIcon }).addTo(map)
                .bindPopup('<b style="color: #3B82F6;">Satélite Emergencial</b><br><b>Nome:</b> ' + sat.name + '<br><b>Tipo:</b> ' + sat.type + '<br><b>Banda:</b> ' + sat.bandwidthMbps + ' Mbps');

              L.circle([sat.latitude, sat.longitude], {
                color: '#3B82F6',
                fillColor: '#3B82F6',
                fillOpacity: 0.08,
                weight: 1,
                dashArray: '5, 5',
                radius: sat.coverageRadius * 1000 // Convert km to meters
              }).addTo(map);
            }
          });

          // Function to center map on coordinates
          window.centerMap = function(lat, lon) {
            map.setView([lat, lon], 12);
            L.popup()
              .setLatLng([lat, lon])
              .setContent('<b>Foco Alterado</b>')
              .openOn(map);
          };
        </script>
      </body>
    </html>
  `;

  // Encode HTML in data URI
  const iframeSrc = `data:text/html;charset=utf-8,${encodeURIComponent(leafletHTML)}`;

  return (
    <View style={styles.container}>
      {/* Sidebar showing active list */}
      <View style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Painel Operacional</Text>
          <Text style={styles.sidebarSubtitle}>Gestão de conectividade emergencial</Text>
        </View>

        {/* Navigation Tabs inside sidebar */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "alertas" && styles.tabActive]}
            onPress={() => setActiveTab("alertas")}
          >
            <Text style={[styles.tabText, activeTab === "alertas" && styles.tabTextActive]}>Alertas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "zonas" && styles.tabActive]}
            onPress={() => setActiveTab("zonas")}
          >
            <Text style={[styles.tabText, activeTab === "zonas" && styles.tabTextActive]}>Zonas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "satelites" && styles.tabActive]}
            onPress={() => setActiveTab("satelites")}
          >
            <Text style={[styles.tabText, activeTab === "satelites" && styles.tabTextActive]}>Satélites</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {activeTab === "alertas" &&
            alerts.map((alert) => (
              <TouchableOpacity
                key={alert.id}
                style={[
                  styles.itemCard,
                  selectedItem?.id === alert.id && styles.itemCardSelected,
                ]}
                onPress={() => {
                  setSelectedItem({
                    id: alert.id,
                    latitude: alert.latitude,
                    longitude: alert.longitude,
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.itemTitle}>{alert.type}</Text>
                  <RiskBadge risk={alert.risk} />
                </View>
                <Text style={styles.itemCity}>{alert.city}, {alert.state}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>{alert.description}</Text>
                <View style={styles.cardFooter}>
                  <ConnectivityIndicator status={alert.connectivity} compact />
                </View>
              </TouchableOpacity>
            ))}

          {activeTab === "zonas" &&
            deadZones.map((zone) => (
              <TouchableOpacity
                key={zone.id}
                style={[
                  styles.itemCard,
                  selectedItem?.id === zone.id && styles.itemCardSelected,
                ]}
                onPress={() => {
                  setSelectedItem({
                    id: zone.id,
                    latitude: zone.latitude,
                    longitude: zone.longitude,
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.itemTitle}>ZONA MORTA</Text>
                  <View style={[styles.badge, { backgroundColor: COLORS.danger }]}>
                    <Text style={styles.badgeText}>OFFLINE</Text>
                  </View>
                </View>
                <Text style={styles.itemCity}>{zone.city}, {zone.state}</Text>
                <Text style={styles.itemInfoText}>Raio afetado: {zone.radius} km</Text>
                <Text style={styles.itemInfoText}>Torres danificadas: {zone.towersDamaged}/{zone.towersTotal}</Text>
                <View style={styles.cardFooter}>
                  <ConnectivityIndicator status={zone.status} compact />
                </View>
              </TouchableOpacity>
            ))}

          {activeTab === "satelites" &&
            satellites.map((sat) => (
              <TouchableOpacity
                key={sat.id}
                style={[
                  styles.itemCard,
                  selectedItem?.id === sat.id && styles.itemCardSelected,
                ]}
                onPress={() => {
                  setSelectedItem({
                    id: sat.id,
                    latitude: sat.latitude,
                    longitude: sat.longitude,
                  });
                }}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.itemTitle}>{sat.name}</Text>
                  <View style={[styles.badge, { backgroundColor: sat.active ? COLORS.success : COLORS.subtitle }]}>
                    <Text style={styles.badgeText}>{sat.active ? "ATIVO" : "INATIVO"}</Text>
                  </View>
                </View>
                <Text style={styles.itemCity}>Tipo: Órbita {sat.type}</Text>
                <Text style={styles.itemInfoText}>Banda operacional: {sat.bandwidthMbps} Mbps</Text>
                <Text style={styles.itemInfoText}>Raio de cobertura: {sat.coverageRadius} km</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* Main Map Area using Leaflet HTML inside Iframe */}
      <View style={styles.mapContainer}>
        <iframe
          src={iframeSrc}
          style={{ width: "100%", height: "100%", border: "none" }}
          title="Map View"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.background,
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  sidebar: {
    width: 350,
    backgroundColor: COLORS.card,
    borderRightWidth: 1,
    borderRightColor: "#1e293b",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#111b2d",
  },
  sidebarTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
  },
  sidebarSubtitle: {
    color: COLORS.subtitle,
    fontSize: 12,
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#111b2d",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.subtitle,
    fontSize: 13,
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#fff",
  },
  list: {
    flex: 1,
    padding: 16,
  },
  itemCard: {
    backgroundColor: "#111b2d",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  itemCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  itemCity: {
    color: COLORS.subtitle,
    fontSize: 13,
    marginBottom: 6,
  },
  itemDescription: {
    color: COLORS.subtitle,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  itemInfoText: {
    color: COLORS.subtitle,
    fontSize: 12,
    marginBottom: 2,
  },
  cardFooter: {
    flexDirection: "row",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.05)",
    paddingTop: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    height: "100%",
  },
});
