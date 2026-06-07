import { GiCow } from "react-icons/gi";
import { MdOutlineTimer, MdFastfood, MdSensors } from "react-icons/md";
import { FiHash, FiHeart, FiActivity } from "react-icons/fi";

export default function StatsCards({ sensorData, useFirebase, lastUpdate, isOnline, healthStatus }) {
  const isPresent = sensorData.cattle_present === 1 || sensorData.cattle_present === "1" || sensorData.cattle_present === true;

  /* feeding_duration is in seconds */
  const feedMins = Math.floor(sensorData.feeding_duration / 60);
  const feedSecs = sensorData.feeding_duration % 60;
  const feedText = `${feedMins}:${feedSecs < 10 ? "0" : ""}${feedSecs}`;

  const timeSince = () => {
    const diff = Math.floor((Date.now() - lastUpdate) / 1000);
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  const formatHealthStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const cards = [
    {
      icon: FiHash,
      iconColor: "#16a34a",
      iconBg: "bg-green-50",
      label: "Visit Counter",
      value: sensorData.visit_count,
      unit: "visits",
      description: "Total visits today",
    },
    {
      icon: MdOutlineTimer,
      iconColor: "#0d9488",
      iconBg: "bg-teal-50",
      label: "Feeding Duration",
      value: feedText,
      unit: "m:s",
      description: "Current session",
    },
    {
      icon: FiHeart,
      iconColor: "#059669",
      iconBg: "bg-emerald-50",
      label: "Health Status",
      value: formatHealthStatus(healthStatus),
      unit: "",
      description: "From Profile node",
    },
    {
      icon: MdFastfood,
      iconColor: "#ca8a04",
      iconBg: "bg-amber-50",
      label: "Food Level",
      value: sensorData.food_level,
      unit: "%",
      description: sensorData.food_level < 20 ? "Refill needed!" : "Adequate supply",
    },
    {
      icon: MdSensors,
      iconColor: "#6366f1",
      iconBg: "bg-indigo-50",
      label: "Cattle Distance",
      value: sensorData.object_distance,
      unit: "cm",
      description: "Ultrasonic sensor",
    },
    {
      icon: FiActivity,
      iconColor: !useFirebase ? "#ca8a04" : isOnline ? "#14b8a6" : "#ef4444",
      iconBg: !useFirebase ? "bg-amber-50" : isOnline ? "bg-teal-50" : "bg-red-50",
      label: "System",
      value: !useFirebase ? "Demo Mode" : isOnline ? "Sensor Live" : "Sensor Offline",
      unit: "",
      description: useFirebase ? (isOnline ? `Active: ${timeSince()}` : "No signal received") : "Simulating hardware",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 h-full">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-white/75 backdrop-blur-md rounded-2xl p-4 border border-green-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all flex flex-col gap-1"
          >
            <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center mb-1`}>
              <Icon className="text-lg" style={{ color: card.iconColor }} />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-500">
              {card.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-green-900">{card.value}</span>
              {card.unit && <span className="text-xs font-medium text-emerald-400">{card.unit}</span>}
            </div>
            <span className="text-[10px] text-emerald-400">{card.description}</span>
          </div>
        );
      })}
    </div>
  );
}
