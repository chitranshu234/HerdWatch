import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";
import { FiThermometer, FiChevronsUp, FiRadio } from "react-icons/fi";
import { WiBarometer } from "react-icons/wi";

import TopBar from "../components/TopBar";
import CattlePresenceCard from "../components/CattlePresenceCard";
import FoodGauge from "../components/FoodGauge";
import StatsCards from "../components/StatsCards";
import Charts from "../components/Charts";
import FoodRefillAlert from "../components/FoodRefillAlert";

// Components for Cow Profile View & Visit Log
import CowProfileCard from "../components/CowProfileCard";
import THIMonitor from "../components/THIMonitor";
import DietPlan from "../components/DietPlan";
import VisitLog from "../components/VisitLog";

/* ─────────── Dummy Data ─────────── */
const DUMMY_SENSOR = {
  temperature: 33.2,
  pressure: 974,
  altitude: 324,
  food_level: 91,
  cattle_present: 0,
  visit_count: 0,
  feeding_duration: 0,
  object_distance: 0,
  food_at_arrival: 0,
  food_at_departure: 0,
  food_consumed: 0,
  timestamp: "2026-06-08 01:50:00",
};

const DUMMY_ALL_CATTLE = {
  cow1: {
    cow_id: "TAG-001",
    breed: "Gir",
    age: 4,
    weight: 420.0,
    health_status: "normal",
    owner_name: "Ramesh Kumar",
    last_updated: "01:45:00",
    thi: 71.2,
    thi_zone: "comfort",
    green_fodder_kg: 22.0,
    dry_fodder_kg: 4.0,
    concentrate_kg: 2.0,
    dmi_kg: 9.2,
    feeding_frequency: 3,
  },
  cow2: {
    cow_id: "TAG-002",
    breed: "Tharparkar",
    age: 5,
    weight: 450.0,
    health_status: "normal",
    owner_name: "Ramesh Kumar",
    last_updated: "01:47:00",
    thi: 78.4,
    thi_zone: "alert",
    green_fodder_kg: 25.0,
    dry_fodder_kg: 5.0,
    concentrate_kg: 2.5,
    dmi_kg: 10.5,
    feeding_frequency: 4,
  },
  cow3: {
    cow_id: "TAG-003",
    breed: "Sahiwal",
    age: 3,
    weight: 380.0,
    health_status: "under_observation",
    owner_name: "Ramesh Kumar",
    last_updated: "01:49:58",
    thi: 85.6,
    thi_zone: "danger",
    green_fodder_kg: 20.0,
    dry_fodder_kg: 3.0,
    concentrate_kg: 1.5,
    dmi_kg: 8.5,
    feeding_frequency: 4,
  },
};

function generateDummyHistory() {
  const now = new Date();
  const h = { food_level: [], temperature: [], visitLog: [] };
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now - i * 5 * 60000);
    const ts = t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    h.food_level.push({ time: ts, value: +(80 - i * 2 + Math.random() * 3).toFixed(0) });
    h.temperature.push({ time: ts, value: +(30 + Math.random() * 4).toFixed(1) });
    h.visitLog.push({ time: ts, value: Math.floor(Math.random() * 2) });
  }
  return h;
}

const MAX_HISTORY = 20;
const OFFLINE_TIMEOUT = 10000;

/* ─────────── Dashboard ─────────── */
export default function Dashboard() {
  const [sensorData, setSensorData] = useState(DUMMY_SENSOR);
  const [allCattleData, setAllCattleData] = useState(DUMMY_ALL_CATTLE);
  const [selectedCowKey, setSelectedCowKey] = useState("cow3"); // Default to cow3 (TAG-003)
  const [history, setHistory] = useState(generateDummyHistory);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOnline, setIsOnline] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);
  const [activeTab, setActiveTab] = useState("feeder"); // "feeder" | "cow"

  /* ── Push history ── */
  const pushHistory = useCallback((data) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => ({
      food_level: [...prev.food_level, { time: ts, value: data.food_level }].slice(-MAX_HISTORY),
      temperature: [...prev.temperature, { time: ts, value: data.temperature }].slice(-MAX_HISTORY),
      visitLog: [...prev.visitLog, { time: ts, value: data.cattle_present ? 1 : 0 }].slice(-MAX_HISTORY),
    }));
  }, []);

  /* ── Firebase listeners ── */
  useEffect(() => {
    let unsubscribeLatest;
    let unsubscribeCow;

    try {
      // Path 1 — Live sensor data
      const latestRef = ref(database, "readings/latest");
      unsubscribeLatest = onValue(
        latestRef,
        (snapshot) => {
          const raw = snapshot.val();
          if (raw) {
            const data = {
              temperature:      raw.temperature !== undefined ? parseFloat(raw.temperature) : 0,
              pressure:         raw.pressure !== undefined ? Math.round(parseFloat(raw.pressure)) : 0,
              altitude:         raw.altitude !== undefined ? Math.round(parseFloat(raw.altitude)) : 0,
              food_level:       raw.food !== undefined ? parseInt(raw.food) : 0,
              cattle_present:   raw.cattle_present !== undefined ? parseInt(raw.cattle_present) : 0,
              visit_count:      raw.visit_count !== undefined ? parseInt(raw.visit_count) : 0,
              feeding_duration: raw.feeding_duration !== undefined ? parseInt(raw.feeding_duration) : 0,
              object_distance:  raw.object_distance !== undefined ? parseFloat(raw.object_distance) : 0,
              food_at_arrival:  raw.food_at_arrival !== undefined ? parseInt(raw.food_at_arrival) : 0,
              food_at_departure:raw.food_at_departure !== undefined ? parseInt(raw.food_at_departure) : 0,
              food_consumed:    raw.food_consumed !== undefined ? parseInt(raw.food_consumed) : 0,
              timestamp:        raw.timestamp || new Date().toLocaleTimeString(),
            };
            setUseFirebase(true);
            setSensorData(data);
            setLastUpdate(Date.now());
            setIsOnline(true);
            pushHistory(data);
          }
        },
        (error) => console.warn("Firebase readings read failed:", error)
      );

      // Path 2 — Cow profile + THI + diet plan for all cows
      const cattleRef = ref(database, "cattle");
      unsubscribeCow = onValue(
        cattleRef,
        (snapshot) => {
          const raw = snapshot.val();
          if (raw) {
            const loadedCattle = {};
            Object.keys(raw).forEach((key) => {
              const item = raw[key];
              loadedCattle[key] = {
                cow_id: item.cow_id || key.toUpperCase(),
                breed: item.breed || "Sahiwal",
                age: item.age !== undefined ? parseInt(item.age) : 3,
                weight: item.weight !== undefined ? parseFloat(item.weight) : 380.0,
                health_status: item.health_status || "under_observation",
                owner_name: item.owner_name || "Ramesh Kumar",
                last_updated: item.last_updated || "",
                thi: item.thi !== undefined ? parseFloat(item.thi) : 0,
                thi_zone: item.thi_zone || "comfort",
                green_fodder_kg: item.green_fodder_kg !== undefined ? parseFloat(item.green_fodder_kg) : 0,
                dry_fodder_kg: item.dry_fodder_kg !== undefined ? parseFloat(item.dry_fodder_kg) : 0,
                concentrate_kg: item.concentrate_kg !== undefined ? parseFloat(item.concentrate_kg) : 0,
                dmi_kg: item.dmi_kg !== undefined ? parseFloat(item.dmi_kg) : 0,
                feeding_frequency: item.feeding_frequency !== undefined ? parseInt(item.feeding_frequency) : 0,
              };
            });
            setAllCattleData(loadedCattle);
          }
        },
        (error) => console.warn("Firebase cow read failed:", error)
      );
    } catch (err) {
      console.warn("Firebase init failed:", err);
    }

    return () => {
      if (unsubscribeLatest) unsubscribeLatest();
      if (unsubscribeCow) unsubscribeCow();
    };
  }, [pushHistory]);

  /* ── Offline detection ── */
  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastUpdate > OFFLINE_TIMEOUT && useFirebase) {
        setIsOnline(false);
      }
    }, 2000);
    return () => clearInterval(iv);
  }, [lastUpdate, useFirebase]);

  /* ── Computed Selected Cow ── */
  const cowData = allCattleData[selectedCowKey] || DUMMY_ALL_CATTLE.cow3;
  const needsRefill = sensorData.food_level < 20;

  return (
    <div className="min-h-screen pb-12">
      <div className="w-full">
        <TopBar isOnline={isOnline && useFirebase} useFirebase={useFirebase} />

        {/* Navigation & Cow Selector Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 px-6">
          {/* Tab Switcher */}
          <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-green-100 flex gap-2 shadow-sm">
            <button
              onClick={() => setActiveTab("feeder")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "feeder"
                  ? "bg-green-600 text-white shadow-md shadow-green-200"
                  : "text-emerald-700 hover:bg-green-50"
              }`}
            >
              Feeder Station (Live)
            </button>
            <button
              onClick={() => setActiveTab("cow")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "cow"
                  ? "bg-green-600 text-white shadow-md shadow-green-200"
                  : "text-emerald-700 hover:bg-green-50"
              }`}
            >
              Cattle Profile & Diet
            </button>
          </div>

          {/* Cow Selector Dropdown */}
          <div className="flex items-center gap-2.5 bg-white/50 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-green-100 shadow-sm">
            <span className="text-xs font-bold text-emerald-800">Cow:</span>
            <select
              value={selectedCowKey}
              onChange={(e) => setSelectedCowKey(e.target.value)}
              className="bg-white/75 border border-green-200 text-green-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all cursor-pointer"
            >
              {Object.keys(allCattleData).map((key) => (
                <option key={key} value={key}>
                  {allCattleData[key].cow_id} ({allCattleData[key].breed})
                </option>
              ))}
            </select>
          </div>
        </div>

        <main className="px-6 space-y-5">
          {activeTab === "feeder" ? (
            <>
              {/* ── Food Refill Alert Banner ── */}
              {needsRefill && <FoodRefillAlert foodLevel={sensorData.food_level} />}

              {/* ── Row 1: Cattle Presence + Stats Cards ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5">
                  <CattlePresenceCard
                    cattlePresent={sensorData.cattle_present}
                    feedingDuration={sensorData.feeding_duration}
                    visitCount={sensorData.visit_count}
                    objectDistance={sensorData.object_distance}
                  />
                </div>
                <div className="lg:col-span-7">
                  <StatsCards
                    sensorData={sensorData}
                    useFirebase={useFirebase}
                    lastUpdate={lastUpdate}
                    isOnline={isOnline && useFirebase}
                    healthStatus={cowData.health_status}
                  />
                </div>
              </div>

              {/* ── Row 2: Food Gauge + Visit Log + Environmental ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-4">
                  <FoodGauge level={sensorData.food_level} />
                </div>
                <div className="lg:col-span-4">
                  <VisitLog
                    visitCount={sensorData.visit_count}
                    feedingDuration={sensorData.feeding_duration}
                    foodAtArrival={sensorData.food_at_arrival}
                    foodAtDeparture={sensorData.food_at_departure}
                    foodConsumed={sensorData.food_consumed}
                  />
                </div>
                <div className="lg:col-span-4">
                  <EnvironmentPanel
                    temperature={sensorData.temperature}
                    pressure={sensorData.pressure}
                    altitude={sensorData.altitude}
                    objectDistance={sensorData.object_distance}
                    timestamp={sensorData.timestamp}
                  />
                </div>
              </div>

              {/* ── Row 3: Charts ── */}
              <Charts history={history} />
            </>
          ) : (
            <div className="space-y-5">
              {/* Row 1: Cow Profile + THI Monitor */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-6">
                  <CowProfileCard cowData={cowData} />
                </div>
                <div className="lg:col-span-6">
                  <THIMonitor thi={cowData.thi} thiZone={cowData.thi_zone} />
                </div>
              </div>

              {/* Row 2: Diet Plan */}
              <DietPlan cowData={cowData} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─── Environmental Monitoring Panel with Collapsible Secondary/Collapsible ─── */
function EnvironmentPanel({ temperature, pressure, altitude, objectDistance, timestamp }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-green-100 shadow-sm h-full flex flex-col p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-green-900">Environmental Monitoring</h3>
        <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">BMP280</span>
      </div>
      <p className="text-xs text-emerald-400 mb-4">Station conditions</p>
      
      <div className="flex-1 flex flex-col justify-center gap-3">
        {/* Temperature Reading */}
        <div className="flex items-center justify-between py-2 border-b border-green-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <FiThermometer className="text-base text-red-500" />
            </div>
            <span className="text-xs text-emerald-600 font-medium">Temperature</span>
          </div>
          <span className="text-sm font-extrabold text-green-900">{temperature}°C</span>
        </div>

        {/* Collapsible toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-center text-xs font-semibold py-1 bg-green-50 hover:bg-green-100/70 text-green-700 rounded-xl transition-all duration-300"
        >
          {isOpen ? "Hide Secondary Readings" : "Show Secondary Readings"}
        </button>

        {/* Collapsible items */}
        <div className={`space-y-3 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[160px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <WiBarometer className="text-base text-blue-500" />
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Barometric Pressure</span>
            </div>
            <span className="text-xs font-bold text-green-800">{pressure} hPa</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <FiChevronsUp className="text-base text-green-600" />
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Altitude</span>
            </div>
            <span className="text-xs font-bold text-green-800">{altitude} m</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                <FiRadio className="text-base text-indigo-500" />
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Object Distance</span>
            </div>
            <span className="text-xs font-bold text-green-800">{objectDistance} cm</span>
          </div>
        </div>
      </div>

      {/* Timestamp footer */}
      {timestamp && (
        <div className="mt-3 pt-3 border-t border-green-100 text-center">
          <span className="text-[10px] text-emerald-400 font-mono">Last update: {timestamp}</span>
        </div>
      )}
    </div>
  );
}
