'use client';
import { useWeather } from "@/hooks/useWeather";
import "./clock.scss";
import { useTime } from "@/hooks/useTime";
import { useLanguage } from "@/contexts/languageContext";

export default function Clock() {
  
  const { currTime, currDate, currDay } = useTime();  
  const { weather, loadingWeather, error } = useWeather();

  const { translate } = useLanguage();

  

  return <>
    <div className="clock-container">
      <h2 className="clock-time" >{currTime}</h2>
      <p>{currDate} ({currDay})</p>
      
      {loadingWeather ? (
        <p>Loading weather...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          {translate("weather", weather?.weathercode)} {weather?.temperature}°C
        </p>
      )}
      
    </div>
  </>;
}