import { useState, useEffect } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function TopBar({ isFeederOnline, isCattleOnline }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = time.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-8 py-4 gap-4">
      {/* Left — Brand */}
      <div className="text-center md:text-left">
        <h2 className="text-xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2.5">
          <img
            src="/herdwatch-logo.png"
            alt="HerdWatch logo"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            HerdWatch
          </span>
        </h2>
        <p className="text-xs text-emerald-600/60 font-medium md:ml-[42px]">
          Today is {dayName}, {dateStr} &nbsp;|&nbsp; {timeStr}
        </p>
      </div>

      {/* Right — Controls */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {/* Feeder Connection */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
            isFeederOnline
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {isFeederOnline ? <FiWifi className="text-xs" /> : <FiWifiOff className="text-xs animate-pulse" />}
          <span>Feeder: {isFeederOnline ? "Online" : "Offline"}</span>
        </div>

        {/* Cattle Profile Connection */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${
            isCattleOnline
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {isCattleOnline ? <FiWifi className="text-xs" /> : <FiWifiOff className="text-xs animate-pulse" />}
          <span>Cattle Node: {isCattleOnline ? "Online" : "Offline"}</span>
        </div>
      </div>
    </div>
  );
}
