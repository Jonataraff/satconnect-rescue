import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettings } from "../types/types";

const SETTINGS_KEY = "@satconnect_settings";

const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  gpsTrackingEnabled: true,
  autoRefreshInterval: 5,
  riskAlertThreshold: "MÉDIO",
};

export const getSettings = async (): Promise<UserSettings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    if (data) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
    return DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const updateSetting = async <K extends keyof UserSettings>(
  key: K,
  value: UserSettings[K]
): Promise<void> => {
  const current = await getSettings();
  const updated = { ...current, [key]: value };
  await saveSettings(updated);
};

export const resetSettings = async (): Promise<void> => {
  await saveSettings(DEFAULT_SETTINGS);
};
