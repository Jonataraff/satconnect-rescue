// ========== Weather API ==========

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherRain {
  "1h"?: number;
  "3h"?: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  name: string;
  main: WeatherMain;
  wind: WeatherWind;
  clouds: WeatherClouds;
  rain?: WeatherRain;
  weather: WeatherCondition[];
  coord: {
    lat: number;
    lon: number;
  };
  visibility: number;
  dt: number;
}

// ========== Alerts ==========

export type RiskLevel = "ALTO" | "MÉDIO" | "BAIXO";

export type DisasterType =
  | "Enchente"
  | "Incêndio"
  | "Tempestade"
  | "Deslizamento"
  | "Seca";

export interface AlertItem {
  id: string;
  type: DisasterType;
  city: string;
  state: string;
  risk: RiskLevel;
  latitude: number;
  longitude: number;
  timestamp: string;
  connectivity: ConnectivityStatus;
  description: string;
  affectedPeople: number;
}

// ========== Connectivity ==========

export type ConnectivityStatus = "online" | "offline" | "satellite" | "degraded";

export interface ConnectivityZone {
  id: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  radius: number; // km
  status: ConnectivityStatus;
  lastUpdate: string;
  towersDamaged: number;
  towersTotal: number;
}

export interface SatelliteUnit {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: "LEO" | "GEO" | "Mobile";
  coverageRadius: number; // km
  active: boolean;
  bandwidthMbps: number;
}

// ========== Settings ==========

export interface UserSettings {
  notificationsEnabled: boolean;
  gpsTrackingEnabled: boolean;
  autoRefreshInterval: number; // minutes
  riskAlertThreshold: RiskLevel;
}

// ========== Location ==========

export interface Coordinates {
  latitude: number;
  longitude: number;
}
