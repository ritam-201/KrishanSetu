import React, { useEffect, useState } from "react";

interface WeatherData {
  hourly: {
    time: string[];
    precipitation_probability: number[];
  };
}

export const WeatherAlert: React.FC = () => {
  const [rainProbability, setRainProbability] = useState(0);
  const [alertTime, setAlertTime] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto"
        );

        if (!response.ok) {
          throw new Error("Weather data could not be fetched");
        }

        const data: WeatherData = await response.json();

        const now = new Date();

        // Find the next available forecast hour
        const nextHours = data.hourly.time
          .map((time, index) => ({
            time,
            probability: data.hourly.precipitation_probability[index],
          }))
          .filter((item) => new Date(item.time) >= now)
          .slice(0, 6);

        if (nextHours.length === 0) return;

        // Highest rain probability in next 6 hours
        const highestRain = nextHours.reduce((max, current) =>
          current.probability > max.probability ? current : max
        );

        setRainProbability(highestRain.probability);

        const formattedTime = new Date(
          highestRain.time
        ).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

        setAlertTime(formattedTime);
      } catch (error) {
        console.error("Weather API Error:", error);
      }
    };

    fetchWeather();
  }, []);

  // Don't show alert if rain probability is low
  if (rainProbability < 60) {
    return null;
  }

  return (
    <div className="absolute right-6 top-24 z-30 w-[300px] sm:w-[340px]">
      <div className="rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-xl backdrop-blur-md">

        <div className="flex items-start gap-3">

          {/* Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
            🌧️
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">

            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Rain Alert
              </h3>

              <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">
                {rainProbability}%
              </span>
            </div>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              High chance of rain is expected around {alertTime}.
            </p>

            <div className="mt-2 text-xs font-medium text-slate-700">
              ☔ Consider carrying an umbrella.
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
