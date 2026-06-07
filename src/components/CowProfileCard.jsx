import { GiCow, GiWeight } from "react-icons/gi";
import { FiUser, FiCalendar, FiClock, FiActivity } from "react-icons/fi";

export default function CowProfileCard({ cowData }) {
  const { cow_id, breed, age, weight, health_status, owner_name, last_updated } = cowData;

  const getHealthBadgeStyles = (status) => {
    switch (status.toLowerCase()) {
      case "normal":
      case "healthy":
      case "good":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "under_observation":
      case "warning":
      case "caution":
        return "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
      case "critical":
      case "danger":
        return "bg-red-50 text-red-700 border-red-200 animate-bounce";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-6 border border-green-100 shadow-sm h-full flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-green-700">
              <GiCow className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-green-900 leading-none">{cow_id}</h3>
              <p className="text-xs text-emerald-500 font-medium mt-0.5">Cattle Profile</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${getHealthBadgeStyles(health_status)}`}>
            {formatStatus(health_status)}
          </span>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-2.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
            <FiActivity className="text-emerald-600 text-lg" />
            <div>
              <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Breed</p>
              <p className="text-sm font-bold text-green-900">{breed}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
            <FiCalendar className="text-emerald-600 text-lg" />
            <div>
              <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Age</p>
              <p className="text-sm font-bold text-green-900">{age} Years</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
            <GiWeight className="text-emerald-600 text-lg" />
            <div>
              <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Weight</p>
              <p className="text-sm font-bold text-green-900">{weight} kg</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-green-50/30 rounded-2xl p-3 border border-green-50/50">
            <FiUser className="text-emerald-600 text-lg" />
            <div>
              <p className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wider">Owner</p>
              <p className="text-sm font-bold text-green-900">{owner_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Update Time */}
      {last_updated && (
        <div className="mt-6 pt-4 border-t border-green-50 flex items-center justify-between text-[11px] text-emerald-400 font-mono">
          <div className="flex items-center gap-1.5">
            <FiClock className="text-emerald-500" />
            <span>Last Updated (IST)</span>
          </div>
          <span className="font-bold text-green-700">{last_updated}</span>
        </div>
      )}
    </div>
  );
}
