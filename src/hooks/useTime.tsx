import { useEffect, useState } from "react";

export function useTime() {
  const [currTime, setCurrTime] = useState<string>('');
  const [currDate, setCurrDate] = useState<string>('');
  const [currDay, setCurrDay] = useState<string>('');

  useEffect(() => {

    const getTimeString = () => {
      const now = new Date();
      return now.toLocaleTimeString(undefined, {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    }

    const getDateString = () => {
      const now = new Date();
      const day = now.getDate(); // 1-31
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[now.getMonth()]; // 0-11
      const year = now.getFullYear();
      return `${day < 10 ? '0'+day : day} ${month} ${year}`;
    }

    const getDayString = () => {
      const now = new Date();
      const weekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return weekNames[now.getDay()];
    }

    const updateTime = () => {
      setCurrTime(getTimeString());
      setCurrDate(getDateString());
      setCurrDay(getDayString());
    }

    updateTime();
    const interval = setInterval(updateTime, 60 * 1000);

    return () => clearInterval(interval);

  }, []);

  return { currTime, currDate, currDay };
}