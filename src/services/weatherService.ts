import axios from "axios";
import { WeatherData } from "../types/types";

// ATENÇÃO: Insira sua chave da API OpenWeatherMap abaixo.
// Obtenha gratuitamente em: https://openweathermap.org/api
// Deixar em branco fará o app usar automaticamente o fallback Open-Meteo (sem chave, funcional).
const OPENWEATHER_API_KEY = "";

export const getWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    // 1. Tenta usar OpenWeatherMap primeiro
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
      { timeout: 5000 } // timeout curto para falhar rápido se a chave estiver ruim
    );
    return response.data;
  } catch (error) {
    console.log("OpenWeatherMap API falhou. Usando fallback Open-Meteo (Keyless)...");

    // 2. Fallback para Open-Meteo (API pública sem chave de acesso)
    try {
      const openMeteoResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,cloud_cover,visibility&timezone=auto`
      );

      const data = openMeteoResponse.data;
      const current = data.current;

      // Mapear WMO Weather Codes para descrições legíveis
      const wmoCode = current?.weather_code || 0;
      let weatherDescription = "Limpo";
      let weatherMain = "Clear";
      let icon = "01d";

      if (wmoCode >= 1 && wmoCode <= 3) {
        weatherDescription = "Parcialmente Nublado";
        weatherMain = "Clouds";
        icon = "03d";
      } else if (wmoCode === 45 || wmoCode === 48) {
        weatherDescription = "Nevoeiro";
        weatherMain = "Fog";
        icon = "50d";
      } else if ((wmoCode >= 51 && wmoCode <= 55) || (wmoCode >= 61 && wmoCode <= 65) || (wmoCode >= 80 && wmoCode <= 82)) {
        weatherDescription = "Chuva";
        weatherMain = "Rain";
        icon = "10d";
      } else if (wmoCode >= 95) {
        weatherDescription = "Tempestade";
        weatherMain = "Thunderstorm";
        icon = "11d";
      }

      // Converter wind_speed de km/h (padrão Open-Meteo) para m/s (esperado no App)
      const windSpeedMs = (current?.wind_speed_10m || 0) / 3.6;

      // Adaptar para a interface WeatherData
      const adaptedData: WeatherData = {
        name: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
        main: {
          temp: current?.temperature_2m ?? 0,
          feels_like: current?.apparent_temperature ?? current?.temperature_2m ?? 0,
          temp_min: current?.temperature_2m ?? 0,
          temp_max: current?.temperature_2m ?? 0,
          pressure: 1013,
          humidity: current?.relative_humidity_2m ?? 60,
        },
        wind: {
          speed: windSpeedMs,
          deg: current?.wind_direction_10m ?? 0,
        },
        clouds: {
          all: current?.cloud_cover ?? 0,
        },
        rain: current?.rain ? { "1h": current.rain } : undefined,
        weather: [
          {
            id: 800 + wmoCode,
            main: weatherMain,
            description: weatherDescription,
            icon: icon,
          },
        ],
        coord: { lat, lon },
        visibility: current?.visibility ?? 10000,
        dt: Math.floor(Date.now() / 1000),
      };

      return adaptedData;
    } catch (fallbackError) {
      console.log("Fallback Open-Meteo também falhou.", fallbackError);
      throw new Error("Ambos serviços de clima falharam.");
    }
  }
};
