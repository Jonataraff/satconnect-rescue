import {
  AlertItem,
  ConnectivityZone,
  SatelliteUnit,
  ConnectivityStatus,
} from "../types/types";

/**
 * Serviço de conectividade — simula dados de zonas sem cobertura,
 * alertas de desastres e posicionamento de unidades de satélite.
 *
 * Em produção, esses dados viriam de APIs reais de telecomunicações
 * e agências de emergência (Defesa Civil, INPE, etc.)
 */

// ========== Alertas de Desastres ==========

export const getAlerts = (): AlertItem[] => [
  {
    id: "1",
    type: "Enchente",
    city: "São Paulo (Centro)",
    state: "SP",
    risk: "ALTO",
    latitude: -23.5505,
    longitude: -46.6333,
    timestamp: new Date().toISOString(),
    connectivity: "offline",
    description: "Alagamento severo na região do Vale do Anhangabaú. Subestações subterrâneas inundadas.",
    affectedPeople: 45000,
  },
  {
    id: "2",
    type: "Incêndio",
    city: "São Paulo (Zona Norte)",
    state: "SP",
    risk: "ALTO",
    latitude: -23.4167,
    longitude: -46.6167,
    timestamp: new Date().toISOString(),
    connectivity: "degraded",
    description: "Incêndio florestal severo na Serra da Cantareira. Ondas de calor danificaram fibras de transmissão.",
    affectedPeople: 22000,
  },
  {
    id: "3",
    type: "Deslizamento",
    city: "São Paulo (Zona Leste)",
    state: "SP",
    risk: "ALTO",
    latitude: -23.5350,
    longitude: -46.4618,
    timestamp: new Date().toISOString(),
    connectivity: "offline",
    description: "Deslizamento de terra em encostas vulneráveis de Itaquera. Queda total de torres celulares na região.",
    affectedPeople: 28000,
  },
  {
    id: "4",
    type: "Tempestade",
    city: "São Paulo (Zona Oeste)",
    state: "SP",
    risk: "MÉDIO",
    latitude: -23.5650,
    longitude: -46.7120,
    timestamp: new Date().toISOString(),
    connectivity: "online",
    description: "Ventos de 90km/h com queda de árvores na fiação elétrica do Butantã. Rede celular sobrecarregada.",
    affectedPeople: 15000,
  },
  {
    id: "5",
    type: "Enchente",
    city: "São Paulo (Zona Sul)",
    state: "SP",
    risk: "MÉDIO",
    latitude: -23.7150,
    longitude: -46.6950,
    timestamp: new Date().toISOString(),
    connectivity: "satellite",
    description: "Inundação severa no entorno da Represa Billings (Interlagos). Roteador satelital de socorro ativo.",
    affectedPeople: 19000,
  },
  {
    id: "6",
    type: "Incêndio",
    city: "Guarulhos",
    state: "SP",
    risk: "MÉDIO",
    latitude: -23.4542,
    longitude: -46.5333,
    timestamp: new Date().toISOString(),
    connectivity: "satellite",
    description: "Incêndio industrial com risco químico próximo à Rodovia Dutra. Antena LEO restabelecendo canais de rádio.",
    affectedPeople: 12000,
  },
  {
    id: "7",
    type: "Deslizamento",
    city: "São Bernardo do Campo",
    state: "SP",
    risk: "MÉDIO",
    latitude: -23.6939,
    longitude: -46.5650,
    timestamp: new Date().toISOString(),
    connectivity: "degraded",
    description: "Movimentação de encostas habitadas às margens da represa. Defesa Civil com comunicação instável.",
    affectedPeople: 18000,
  },
];

// ========== Zonas de Conectividade ==========

export const getDeadZones = (): ConnectivityZone[] => [
  {
    id: "dz-1",
    city: "São Paulo (Centro)",
    state: "SP",
    latitude: -23.5505,
    longitude: -46.6333,
    radius: 4,
    status: "offline",
    lastUpdate: new Date(Date.now() - 3600000).toISOString(),
    towersDamaged: 12,
    towersTotal: 18,
  },
  {
    id: "dz-2",
    city: "São Paulo (Zona Leste)",
    state: "SP",
    latitude: -23.5350,
    longitude: -46.4618,
    radius: 5,
    status: "offline",
    lastUpdate: new Date(Date.now() - 7200000).toISOString(),
    towersDamaged: 8,
    towersTotal: 10,
  },
  {
    id: "dz-3",
    city: "São Paulo (Zona Norte)",
    state: "SP",
    latitude: -23.4167,
    longitude: -46.6167,
    radius: 6,
    status: "degraded",
    lastUpdate: new Date(Date.now() - 1800000).toISOString(),
    towersDamaged: 6,
    towersTotal: 15,
  },
  {
    id: "dz-4",
    city: "São Paulo (Zona Sul)",
    state: "SP",
    latitude: -23.7150,
    longitude: -46.6950,
    radius: 7,
    status: "satellite",
    lastUpdate: new Date(Date.now() - 900000).toISOString(),
    towersDamaged: 4,
    towersTotal: 14,
  },
];

// ========== Unidades de Satélite Sugeridas ==========

export const getSuggestedSatellitePositions = (): SatelliteUnit[] => [
  {
    id: "sat-1",
    name: "Starlink-LEO-SP01 (Centro)",
    latitude: -23.5500,
    longitude: -46.6330,
    type: "LEO",
    coverageRadius: 5,
    active: true,
    bandwidthMbps: 150,
  },
  {
    id: "sat-2",
    name: "SatConnect-Mobile-07 (Leste)",
    latitude: -23.5360,
    longitude: -46.4620,
    type: "Mobile",
    coverageRadius: 4,
    active: true,
    bandwidthMbps: 50,
  },
  {
    id: "sat-3",
    name: "SGDC-2 (Geoestacionário)",
    latitude: -23.5505,
    longitude: -46.6333,
    type: "GEO",
    coverageRadius: 50,
    active: true,
    bandwidthMbps: 80,
  },
  {
    id: "sat-4",
    name: "SatConnect-Mobile-12 (Sul)",
    latitude: -23.7140,
    longitude: -46.6940,
    type: "Mobile",
    coverageRadius: 6,
    active: true,
    bandwidthMbps: 50,
  },
  {
    id: "sat-5",
    name: "Starlink-LEO-SP02 (Guarulhos)",
    latitude: -23.4542,
    longitude: -46.5333,
    type: "LEO",
    coverageRadius: 8,
    active: true,
    bandwidthMbps: 150,
  },
];

// ========== Funções de Status ==========

export const getConnectivityStatus = (
  lat: number,
  lon: number
): ConnectivityStatus => {
  const zones = getDeadZones();

  for (const zone of zones) {
    const distance = getDistanceKm(lat, lon, zone.latitude, zone.longitude);
    if (distance <= zone.radius) {
      return zone.status;
    }
  }

  return "online";
};

export const getStatsSummary = () => {
  const alerts = getAlerts();
  const deadZones = getDeadZones();
  const satellites = getSuggestedSatellitePositions();

  return {
    totalAlerts: alerts.length,
    highRiskAlerts: alerts.filter((a) => a.risk === "ALTO").length,
    mediumRiskAlerts: alerts.filter((a) => a.risk === "MÉDIO").length,
    lowRiskAlerts: alerts.filter((a) => a.risk === "BAIXO").length,
    offlineZones: deadZones.filter((z) => z.status === "offline").length,
    degradedZones: deadZones.filter((z) => z.status === "degraded").length,
    satelliteZones: deadZones.filter((z) => z.status === "satellite").length,
    activeSatellites: satellites.filter((s) => s.active).length,
    totalSatellites: satellites.length,
    totalAffectedPeople: alerts.reduce((sum, a) => sum + a.affectedPeople, 0),
    totalTowersDamaged: deadZones.reduce((sum, z) => sum + z.towersDamaged, 0),
    totalTowers: deadZones.reduce((sum, z) => sum + z.towersTotal, 0),
  };
};

// ========== Helper ==========

function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
