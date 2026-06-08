import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertItem } from "../types/types";

const FAVORITES_KEY = "@satconnect_favorites";

export const saveFavorite = async (item: AlertItem): Promise<void> => {
  const existing = await getFavorites();
  const alreadyExists = existing.some((fav) => fav.id === item.id);

  if (!alreadyExists) {
    const updated = [...existing, item];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  }
};

export const getFavorites = async (): Promise<AlertItem[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const removeFavorite = async (id: string): Promise<void> => {
  const existing = await getFavorites();
  const updated = existing.filter((item) => item.id !== id);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const isFavorite = async (id: string): Promise<boolean> => {
  const existing = await getFavorites();
  return existing.some((item) => item.id === id);
};

export const clearFavorites = async (): Promise<void> => {
  await AsyncStorage.removeItem(FAVORITES_KEY);
};