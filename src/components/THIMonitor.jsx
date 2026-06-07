import { FiThermometer, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";

export default function THIMonitor({ thi, thiZone, liveHumidity }) {
  const score = parseFloat(thi) || 0;
  const zone = thiZone || "comfort";

  const getZoneStyles = (z) => {
    switch (z.toLowerCase()) {
      case "comfort":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: FiCheckCircle,
          label: "Comfort Zone",
          desc: "Optimal environmental conditions. Animal is in thermal comfort.",
          gaugeBg: "#10b981",
        };
      case "alert":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: FiAlertTriangle,
          label: "Heat Alert",
          desc: "Moderate heat stress detected. Ensure shade and ventilation.",
          gaugeBg: "#f59e0b",
        };
      case "danger":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: FiAlertTriangle,
          label: "Severe Danger",
          desc: "Severe heat stress! Immediate cooling measures required.",
          gaugeBg: "#ef4444",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: FiCheckCircle,
          label: "Unknown",
          desc: "Monitoring status...",
          gaugeBg: "#9ca3af",
        };
    }
  };

  const currentStyles = getZoneStyles(zone);
  const ZoneIcon = currentStyles.icon;

  // Gauge calculation (Max THI is typically around 100, Min is 50 for realistic ranges)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.max(0, Math.min(100, ((score - 50) / 50) * 100)); // Map 50-100 to 0-100%
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 border border-green-100 shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-green-900 mb-0.5">THI Monitor</h3>
            <p className="text-xs text-emerald-500">Temperature-Humidity Index</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentStyles.bg} ${currentStyles.color} ${currentStyles.border}`}>
            {currentStyles.label}
          </span>
        </div>

        {/* Gauge visualization */}
        <div className="flex items-center justify-around my-6">
          {/* Radial Gauge */}
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              {/* Back track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              {/* Progress track */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={currentStyles.gaugeBg}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-green-900">{score.toFixed(1)}</span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-semibold">THI Score</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                <FiThermometer className="text-xs" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-emerald-400 block font-semibold">BMP280 TEMP</span>
                <span className="text-xs font-bold text-green-900">Active</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                <WiHumidity className="text-sm" />
              </div>
              <div className="text-left">
                <span className="text-[9px] text-emerald-400 block font-semibold">HUMIDITY</span>
                <span className="text-xs font-bold text-green-900">{liveHumidity}% (Live API)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description / Actions banner */}
      <div className={`rounded-2xl p-3 border flex items-start gap-2.5 ${currentStyles.bg} ${currentStyles.border} ${currentStyles.color}`}>
        <ZoneIcon className="text-lg mt-0.5 flex-shrink-0" />
        <p className="text-xs font-medium leading-relaxed text-left">{currentStyles.desc}</p>
      </div>
    </div>
  );
}
