import { GiCow } from "react-icons/gi";
import { FiActivity } from "react-icons/fi";
import { MdOutlineTimer, MdSensors } from "react-icons/md";

export default function CattlePresenceCard({ cattlePresent, feedingDuration, visitCount, objectDistance }) {
  const isPresent = cattlePresent === 1 || cattlePresent === "1" || cattlePresent === true;

  /* feeding_duration is in seconds — format as mm:ss */
  const mins = Math.floor(feedingDuration / 60);
  const secs = feedingDuration % 60;
  const durationText = `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;

  return (
    <div className={`relative h-full min-h-[280px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between text-white transition-all duration-700 ${
      isPresent
        ? "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600"
        : "bg-gradient-to-br from-gray-400 via-gray-500 to-slate-600"
    }`}>
      {/* Decorative background */}
      <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
        <GiCow className="text-[120px]" />
      </div>
      <div className="absolute top-6 right-10 w-28 h-14 rounded-full blur-xl pointer-events-none bg-white/10" />
      <div className="absolute bottom-16 right-24 w-36 h-18 rounded-full blur-2xl pointer-events-none bg-white/5" />

      {/* Landscape wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 400 50" className="w-full h-10 opacity-15" preserveAspectRatio="none">
          <path d="M0,30 C80,10 160,40 240,20 C320,0 360,35 400,15 L400,50 L0,50 Z" fill="white" />
        </svg>
      </div>

      {/* Top — Badge */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
          <FiActivity className="text-xs" />
          Cattle Presence
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
          isPresent ? "bg-white/25" : "bg-white/15"
        }`}>
          <span className={`w-2 h-2 rounded-full ${isPresent ? "bg-green-300 animate-pulse" : "bg-gray-300"}`} />
          {isPresent ? "Detected" : "Not Detected"}
        </div>
      </div>

      {/* Center — Big status */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center gap-4">
          <GiCow className="text-5xl opacity-90" />
          <div>
            <span className="text-4xl font-extrabold leading-none tracking-tight">
              {isPresent ? "Present" : "Absent"}
            </span>
            <p className="text-sm text-white/70 mt-1">
              {isPresent ? "Cattle detected at feeding station" : "No cattle activity detected"}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom — Stats row */}
      <div className="relative z-10 flex items-center gap-4 mt-4 flex-wrap">
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
          <MdOutlineTimer className="text-lg" />
          <div>
            <p className="text-base font-bold leading-none">{durationText}</p>
            <p className="text-[9px] text-white/60 mt-0.5">Feeding Duration</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
          <FiActivity className="text-lg" />
          <div>
            <p className="text-base font-bold leading-none">{visitCount}</p>
            <p className="text-[9px] text-white/60 mt-0.5">Visits Today</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
          <MdSensors className="text-lg" />
          <div>
            <p className="text-base font-bold leading-none">{objectDistance} cm</p>
            <p className="text-[9px] text-white/60 mt-0.5">Cattle Distance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
