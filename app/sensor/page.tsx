"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

export default function Page() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const sensorRef = ref(db, "sensors/current");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      setData(snapshot.val());
    });

    return () => unsubscribe();
  }, []);

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading sensor data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Live Sensor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Temperature */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-500">Temperature</h2>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            {data.temperature}°C
          </p>
        </div>

        {/* Humidity */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-500">Humidity</h2>
          <p className="text-3xl font-bold mt-2 text-indigo-600">
            {data.humidity}%
          </p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-500">Soil Moisture</h2>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {data.soilMoisture}%
          </p>
        </div>

        {/* Methane Level */}
        <div className="bg-white p-5 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-500">Methane Level</h2>
          <p className="text-3xl font-bold mt-2 text-red-600">
            {data.methaneLevel}%
          </p>
        </div>

        {/* Air Quality */}
        <div className="bg-white p-5 rounded-2xl shadow col-span-1 sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-500">Air Quality</h2>
          <p className="text-3xl font-bold mt-2 text-purple-600">
            {data.airQuality}
          </p>
        </div>
      </div>
    </div>
  );
}
