import { useEffect, useState } from "react";
import {
  CloudSun,
  CloudRain,
  Sun,
  Cloud,
  Droplets,
  Wind,
  MapPin,
  RefreshCw,
  Sprout,
  Umbrella,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  Sunrise,
  Sunset,
  ArrowUpRight,
} from "lucide-react";

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=22.5726&longitude=88.3639&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto"
      );

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error("Weather Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  /* ---------------- WEATHER ICON ---------------- */

  const getWeatherIcon = (code: number, size = 30) => {
    if (code === 0) {
      return <Sun size={size} className="text-amber-500" />;
    }

    if (code >= 1 && code <= 3) {
      return <CloudSun size={size} className="text-sky-500" />;
    }

    if (code >= 51 && code <= 67) {
      return <CloudRain size={size} className="text-blue-500" />;
    }

    if (code >= 80 && code <= 82) {
      return <CloudRain size={size} className="text-blue-600" />;
    }

    if (code >= 95) {
      return <CloudRain size={size} className="text-indigo-600" />;
    }

    return <Cloud size={size} className="text-slate-500" />;
  };

  /* ---------------- WEATHER TEXT ---------------- */

  const getWeatherText = (code: number) => {
    if (code === 0) return "Clear Sky";

    if (code >= 1 && code <= 3) {
      return "Partly Cloudy";
    }

    if (code >= 51 && code <= 67) {
      return "Rainy Conditions";
    }

    if (code >= 80 && code <= 82) {
      return "Rain Showers";
    }

    if (code >= 95) {
      return "Thunderstorm";
    }

    return "Cloudy";
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-slate-600 font-semibold">
            Loading weather intelligence...
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Preparing your farming forecast
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (!weather) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 text-center max-w-md">
          <CloudRain className="w-14 h-14 text-slate-400 mx-auto" />

          <h2 className="text-2xl font-bold text-slate-900 mt-5">
            Weather unavailable
          </h2>

          <p className="text-slate-500 mt-2">
            We couldn't load the latest weather information.
          </p>

          <button
            onClick={fetchWeather}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const current = weather.current;
  const hourly = weather.hourly;
  const daily = weather.daily;

  const currentRain =
    daily.precipitation_probability_max[0] ?? 0;

  const tomorrowRain =
    daily.precipitation_probability_max[1] ?? 0;

  const maxTemperature =
    Math.round(daily.temperature_2m_max[0]);

  const minTemperature =
    Math.round(daily.temperature_2m_min[0]);

  /* Next 8 hours */

  const currentHourIndex = Math.max(
    0,
    hourly.time.findIndex(
      (time) => new Date(time) >= new Date()
    )
  );

  const nextHours = hourly.time
    .slice(currentHourIndex, currentHourIndex + 8)
    .map((time, index) => ({
      time,
      temperature:
        hourly.temperature_2m[currentHourIndex + index],
      rain:
        hourly.precipitation_probability[
          currentHourIndex + index
        ],
    }));

  /* ---------------- PAGE ---------------- */

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-green-900 to-emerald-700 text-white">

        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-300/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-green-300/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-12 md:py-16">

          {/* Top Row */}

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2 text-green-100 text-sm">
              <Sprout size={18} />
              Kisan Setu Weather Intelligence
            </div>

            <button
              onClick={fetchWeather}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition text-sm"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>


          {/* Hero Content */}

          <div className="grid lg:grid-cols-2 gap-10 items-center mt-10">

            <div>

              <div className="flex items-center gap-2 text-green-100 mb-4">
                <MapPin size={17} />
                <span>Kolkata, West Bengal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Weather that
                <span className="block text-emerald-200">
                  helps you farm smarter.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-green-100 text-base md:text-lg leading-relaxed">
                Monitor weather conditions and make better decisions
                for irrigation, spraying and harvesting.
              </p>

            </div>


            {/* Main Temperature */}

            <div className="lg:justify-self-end">

              <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 md:p-8 min-w-75">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-sm text-green-100">
                      Current Weather
                    </p>

                    <div className="flex items-start mt-2">

                      <span className="text-7xl font-bold">
                        {Math.round(current.temperature_2m)}
                      </span>

                      <span className="text-2xl font-semibold mt-2">
                        °C
                      </span>

                    </div>
                  </div>

                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center">
                    {getWeatherIcon(
                      current.weather_code,
                      48
                    )}
                  </div>

                </div>

                <p className="text-lg font-semibold mt-4">
                  {getWeatherText(current.weather_code)}
                </p>

                <p className="text-sm text-green-100 mt-1">
                  High {maxTemperature}° · Low {minTemperature}°
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 -mt-8 relative z-10 pb-16">


        {/* ================================================= */}
        {/* WEATHER STATS */}
        {/* ================================================= */}

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">

          {/* Humidity */}

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <Droplets className="text-blue-600" size={22} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                HUMIDITY
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {current.relative_humidity_2m}%
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Relative humidity
            </p>

          </div>


          {/* Wind */}

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Wind className="text-cyan-600" size={22} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                WIND
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {Math.round(current.wind_speed_10m)}
              <span className="text-base ml-1">
                km/h
              </span>
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Current wind speed
            </p>

          </div>


          {/* Rain */}

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Umbrella className="text-indigo-600" size={22} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                RAIN
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {currentRain}%
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Rain probability today
            </p>

          </div>


          {/* Temperature */}

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg">

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                <Thermometer className="text-orange-600" size={22} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                RANGE
              </span>

            </div>

            <p className="text-3xl font-bold text-slate-900 mt-4">
              {maxTemperature}°
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Today's maximum
            </p>

          </div>

        </section>


        {/* ================================================= */}
        {/* ALERT + FARMING ADVISORY */}
        {/* ================================================= */}

        <section className="grid lg:grid-cols-2 gap-5 mt-7">

          {/* Rain Alert */}

          <div className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 text-white p-6 md:p-7 shadow-lg">

            <div className="flex items-start justify-between">

              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>

              <span className="text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full">
                WEATHER ALERT
              </span>

            </div>

            <h2 className="text-2xl font-bold mt-6">
              {tomorrowRain >= 60
                ? "Rain expected tomorrow"
                : "No major rain alert"}
            </h2>

            <p className="text-blue-100 mt-2 leading-relaxed">
              {tomorrowRain >= 60
                ? `Rain probability may reach ${tomorrowRain}% tomorrow. Plan irrigation and field activities accordingly.`
                : "Weather conditions look relatively stable. Continue monitoring rainfall before major farm activities."}
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
              <ArrowUpRight size={17} />
              Plan ahead
            </div>

          </div>


          {/* Farming Advisory */}

          <div className="rounded-3xl bg-linear-to-br from-emerald-50 to-green-100 border border-green-200 p-6 md:p-7">

            <div className="flex items-start justify-between">

              <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center">
                <Sprout className="text-white" size={24} />
              </div>

              <span className="text-xs font-bold text-green-700 bg-green-200/60 px-3 py-1.5 rounded-full">
                FARM ADVISORY
              </span>

            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-6">
              Smart farming recommendation
            </h2>

            <p className="text-slate-600 mt-2 leading-relaxed">
              Current humidity is {current.relative_humidity_2m}%.
              Monitor crop moisture and avoid unnecessary irrigation
              when rainfall is expected.
            </p>

            <div className="flex items-center gap-2 mt-5 text-green-700 font-semibold text-sm">
              <CheckCircle2 size={18} />
              Weather-aware farming
            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* HOURLY FORECAST */}
        {/* ================================================= */}

        <section className="mt-10">

          <div className="flex items-end justify-between mb-5">

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-green-600">
                Next hours
              </p>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
                Hourly Forecast
              </h2>
            </div>

            <CloudSun className="text-green-600" size={28} />

          </div>


          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">

            <div className="flex min-w-max">

              {nextHours.map((hour, index) => {

                const hourLabel = new Date(hour.time).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "numeric",
                  }
                );

                return (
                  <div
                    key={hour.time}
                    className={`w-28 md:w-32 p-5 text-center border-r border-slate-100 last:border-r-0 ${
                      index === 0
                        ? "bg-green-50"
                        : "bg-white"
                    }`}
                  >

                    <p className="text-sm font-semibold text-slate-500">
                      {index === 0 ? "Now" : hourLabel}
                    </p>

                    <div className="flex justify-center my-4">
                      {hour.rain >= 50 ? (
                        <CloudRain
                          className="text-blue-500"
                          size={27}
                        />
                      ) : hour.rain >= 25 ? (
                        <CloudSun
                          className="text-amber-500"
                          size={27}
                        />
                      ) : (
                        <Sun
                          className="text-orange-500"
                          size={27}
                        />
                      )}
                    </div>

                    <p className="text-xl font-bold text-slate-900">
                      {Math.round(hour.temperature)}°
                    </p>

                    <div className="flex items-center justify-center gap-1 mt-3 text-blue-600">
                      <Droplets size={13} />
                      <span className="text-xs font-semibold">
                        {hour.rain}%
                      </span>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* WEATHER TREND */}
        {/* ================================================= */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-bold uppercase tracking-wider text-green-600">
              Weekly trend
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              Temperature Overview
            </h2>

          </div>


          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">

            <div className="space-y-5">

              {daily.time.slice(0, 7).map((date, index) => {

                const max =
                  Math.round(
                    daily.temperature_2m_max[index]
                  );

                const min =
                  Math.round(
                    daily.temperature_2m_min[index]
                  );

                const width = Math.min(
                  100,
                  Math.max(20, (max / 45) * 100)
                );

                const day =
                  index === 0
                    ? "Today"
                    : new Date(date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                        }
                      );

                return (
                  <div
                    key={date}
                    className="grid grid-cols-[55px_1fr_70px] md:grid-cols-[80px_1fr_90px] gap-4 items-center"
                  >

                    <span className="font-semibold text-slate-700 text-sm">
                      {day}
                    </span>

                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-400 to-green-600 transition-all"
                        style={{
                          width: `${width}%`,
                        }}
                      />

                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {max}°
                      </span>

                      <span className="text-sm text-slate-400 ml-1">
                        {min}°
                      </span>
                    </div>

                  </div>
                );
              })}

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* CROP SUITABILITY */}
        {/* ================================================= */}

        <section className="mt-10">

          <div className="mb-5">

            <p className="text-sm font-bold uppercase tracking-wider text-green-600">
              Agriculture
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">
              Crop Weather Suitability
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-5">

            {/* Rice */}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-2xl">
                  🌾
                </div>

                <span className="text-green-600 font-bold">
                  82%
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Rice
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Current weather suitability
              </p>

              <div className="h-2 bg-slate-100 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "82%" }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-green-700 font-medium">
                <CheckCircle2 size={16} />
                Favorable conditions
              </div>

            </div>


            {/* Vegetables */}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                  🥬
                </div>

                <span className="text-emerald-600 font-bold">
                  76%
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Vegetables
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Current weather suitability
              </p>

              <div className="h-2 bg-slate-100 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: "76%" }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-emerald-700 font-medium">
                <CheckCircle2 size={16} />
                Good conditions
              </div>

            </div>


            {/* Wheat */}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:-translate-y-1 hover:shadow-lg transition">

              <div className="flex items-center justify-between">

                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
                  🌿
                </div>

                <span className="text-amber-600 font-bold">
                  68%
                </span>

              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-5">
                Wheat
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Current weather suitability
              </p>

              <div className="h-2 bg-slate-100 rounded-full mt-5 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: "68%" }}
                />
              </div>

              <div className="flex items-center gap-2 mt-4 text-sm text-amber-700 font-medium">
                <CheckCircle2 size={16} />
                Monitor conditions
              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* SUNRISE / SUNSET */}
        {/* ================================================= */}

        <section className="grid md:grid-cols-2 gap-5 mt-10">

          <div className="bg-linear-to-br from-orange-50 to-amber-100 rounded-3xl p-6 border border-orange-100">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
                <Sunrise className="text-white" size={25} />
              </div>

              <div>

                <p className="text-sm text-slate-500 font-medium">
                  Sunrise
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {new Date(daily.sunrise[0]).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </p>

              </div>

            </div>

          </div>


          <div className="bg-linear-to-br from-indigo-50 to-purple-100 rounded-3xl p-6 border border-indigo-100">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
                <Sunset className="text-white" size={25} />
              </div>

              <div>

                <p className="text-sm text-slate-500 font-medium">
                  Sunset
                </p>

                <p className="text-xl font-bold text-slate-900">
                  {new Date(daily.sunset[0]).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* FOOTER NOTE */}
        {/* ================================================= */}

        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-slate-400">

          <p>
            Weather data updates automatically.
          </p>

          <div className="flex items-center gap-2">
            <MapPin size={15} />
            Kolkata, West Bengal
          </div>

        </div>

      </main>
    </div>
  );
}