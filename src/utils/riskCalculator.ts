export const calculateRisk = (
  rain: number,
  wind: number
) => {
  if (rain > 80 && wind > 40) {
    return "ALTO";
  }

  if (rain > 50) {
    return "MÉDIO";
  }

  return "BAIXO";
};