export const formatNumber = (num: number, precision: number = 1) => {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num;
};

export const formatCoord = (
  lat: string | number | null,
  lon: string | number | null
) => {
  return lat && lon ? `${lat},${lon}` : null;
};

// export const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

// export const fahrenheitToCelsius = (fahrenheit: number) => {
//   // ((fTemp - 32) * 5) / 9;

//   return (fahrenheit - 32) / 1.8;
// };

export const celsiusToFahrenheit = (celsius: number) =>
  Number((celsius * (9 / 5) + 32).toFixed(2));

export const fahrenheitToCelsius = (fahrenheit: number) =>
  Number(((fahrenheit - 32) * (5 / 9)).toFixed(2));
