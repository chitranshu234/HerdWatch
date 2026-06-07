import { FiClock, FiCornerDownRight, FiInbox, FiTrendingDown, FiActivity } from "react-icons/fi";

export default function VisitLog({ visitCount, feedingDuration, foodAtArrival, foodAtDeparture, foodConsumed }) {
  // Format feeding duration from seconds to MMm SSs
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0 && secs === 0) return "0s";
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  };

  // Mock historical log sessions so it looks like a premium log list
  const historyLogs = [
    { id: 3, count: visitCount > 0 ? visitCount : 3, duration: feedingDuration > 0 ? feedingDuration : 240, arrival: foodAtArrival > 0 ? foodAtArrival : 85, departure: foodAtDeparture > 0 ? foodAtDeparture : 80, consumed: foodConsumed > 0 ? foodConsumed : 5 },
    { id: 2, count: 2, duration: 412, arrival: 92, departure: 86, consumed: 6 },
    { id: 1, count: 1, duration: 320, arrival: 98, departure: 93, consumed: 5 },
  ];

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-green-100 shadow-sm h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-sm font-bold text-green-900 mb-0.5">Feeding Visit Logs</h3>
        <p className="text-xs text-emerald-500 mb-4">Latest session highlights</p>

        {/* Latest Session Card */}
        <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 rounded-2xl p-4 border border-green-100/60 mb-4">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded-full">
              Session #{visitCount || "Latest"}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <FiClock className="text-xs" /> {formatDuration(feedingDuration)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-1.5 bg-white/60 rounded-xl border border-green-50">
              <span className="text-[9px] text-emerald-500 block font-semibold">At Arrival</span>
              <span className="text-sm font-bold text-green-900">{foodAtArrival}%</span>
            </div>
            <div className="p-1.5 bg-white/60 rounded-xl border border-green-50">
              <span className="text-[9px] text-emerald-500 block font-semibold">At Departure</span>
              <span className="text-sm font-bold text-green-900">{foodAtDeparture}%</span>
            </div>
            <div className="p-1.5 bg-green-100/70 rounded-xl border border-green-200 shadow-sm">
              <span className="text-[9px] text-green-700 block font-bold">Consumed</span>
              <span className="text-sm font-extrabold text-green-900 flex items-center justify-center gap-0.5">
                <FiTrendingDown className="text-xs" /> {foodConsumed}%
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Log History */}
        <div className="space-y-2.5">
          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider text-left pl-1">Session History</p>
          {historyLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-white/50 border border-green-50/50 hover:bg-white/80 transition-all duration-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center text-green-700">
                  <FiActivity className="text-xs" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-green-900">Visit #{log.count}</p>
                  <p className="text-[9px] text-emerald-400 font-medium">{formatDuration(log.duration)} duration</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-green-800">-{log.consumed}%</span>
                <span className="text-[9px] text-emerald-400 block font-medium">({log.arrival}% → {log.departure}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
