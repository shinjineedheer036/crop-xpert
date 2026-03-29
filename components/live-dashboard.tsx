"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

export function LiveDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log("hitting");
    
    const sensorRef = ref(db, "sensors/current");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => unsubscribe();
  }, []);

  if (!data) return <p>Loading live data...</p>;

  return (
    <div className="p-4 border rounded-lg shadow-md mt-4 bg-white">
      <h2 className="text-lg font-bold mb-2">📡 Live Sensor Dashboard</h2>

      <p>🌡 Temperature: {data.temperature} °C</p>
      <p>💧 Humidity: {data.humidity} %</p>
      <p>🌱 Soil Moisture: {data.soilMoisture} %</p>
      <p>🔥 Methane Level: {data.methaneLevel} %</p>
      <p>🌫 Air Quality: {data.airQuality}</p>
    </div>
  );
}