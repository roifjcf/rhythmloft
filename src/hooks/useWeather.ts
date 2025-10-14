import { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  weathercode: number;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!res.ok) throw new Error("Failed to fetch weather");
        const data = await res.json();
        const current = data.current_weather;
        setWeather({
          temperature: current.temperature,
          weathercode: current.weathercode,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoadingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError(err.message);
        setLoadingWeather(false);
      }
    );
  }, []);

  return { weather, loadingWeather, error };
}
